import { HeliaContextType, Product, ProductInfo, UserExtendInfo } from "../types";
import { CID } from 'multiformats/cid'
import { getAsset } from "./nuls";
import config from '../data/config';
import drain from 'it-drain'
import { TimeoutController } from 'timeout-abort-controller'

const DefaultTimeout = 30000

export const defaultProductInfo: ProductInfo = {
    id: "",
    name: "",
    images: [],
    description: "",
    shipping: config.default_item_details.shipping,
    condition: config.default_item_details.condition,
    price: ""
}
/**
 * 从IPFS获取商品信息
 * @param product {Product} 
 * @returns 
 */
export async function getProductInfo(ctx: HeliaContextType | null, product: Product, timeout?: number): Promise<ProductInfo> {
    // console.log("product:", product);
    const price = await getAsset(ctx, product.price);
    if (!ctx || !ctx.fs) {
        return Object.assign(defaultProductInfo, { id: product.pid, price: price });
    }
    try {
        const { signal } = new TimeoutController(timeout || DefaultTimeout)
        const cid = CID.parse(product.description);
        const chunks: Uint8Array[] = [];
        for await (const chunk of ctx.fs.cat(cid, { signal })) {
            chunks.push(chunk);
        }
        const isPin = await ctx.helia?.pins.isPinned(cid);
        if (!isPin) {
            const pinResult = ctx.helia?.pins.add(cid)
            if (pinResult) {
                await drain(pinResult)
            }
        }
        await ctx.helia!.libp2p.services.pubsub.publish(config.topic_file, new TextEncoder().encode(cid.toString()))
        const jsonString = new TextDecoder().decode(chunks.reduce((a, b) => Uint8Array.from([...a, ...b])))
        let obj = JSON.parse(jsonString);
        if (("shipping" in obj) === false) {
            obj = Object.assign(obj, { shipping: defaultProductInfo.shipping });
        }
        if (("condition" in obj) === false) {
            obj = Object.assign(obj, { condition: defaultProductInfo.condition });
        }
        return Object.assign(obj, { id: product.pid, price: price });
    } catch (err) {
        console.error('Failed to fetch product info:', err);
    }
    return Object.assign(defaultProductInfo, { id: product.pid, price: price }); 
}

/**
 * 从ipfs获取图片
 * @param images 
 * @returns 
 */
export async function getImages(ctx: HeliaContextType | null, images: string[], timeout?: number): Promise<string[]> {
    const localImages: string[] = []
    if (!ctx || !ctx.fs || !images) {
        return localImages;
    }
    try {
        for (const cid of images) {
            if (cid.startsWith("data:image")) {
                localImages.push(cid)
                continue
            } else if (cid.startsWith("http")) {
                localImages.push(cid)
                continue
            } else {
                const { signal } = new TimeoutController(timeout || DefaultTimeout)
                const chunks = []
                for await (const chunk of ctx.fs.cat(CID.parse(cid), { signal })) {
                    chunks.push(chunk)
                }
                const blob = new Blob(chunks)
                let url = URL.createObjectURL(blob)
                if (!url || url.startsWith(`blob:${window.location.origin}`)) {
                    url = new TextDecoder().decode(Buffer.concat(chunks));
                }
                localImages.push(url)
                const isPin = await ctx.helia?.pins.isPinned(CID.parse(cid))
                if (!isPin) {
                    const pinResult = ctx.helia?.pins.add(CID.parse(cid))
                    if (pinResult) {
                        await drain(pinResult)
                    }
                }
                await ctx.helia!.libp2p.services.pubsub.publish(config.topic_file, new TextEncoder().encode(cid.toString()))
            }
        }
    } catch (err) {
        console.error('Failed to fetch image:', err);
    }
    return localImages
}

export async function getImage(ctx: HeliaContextType | null, cid: string, timeout?: number) {
    if (!ctx || !ctx.fs || !cid) {
        return cid;
    }
    if (cid.startsWith("data:image")) {
        return cid
    } else if (cid.startsWith("http")) {
        return cid
    } else {
        try {
            const { signal } = new TimeoutController(timeout || DefaultTimeout)
            const _c = CID.parse(cid);
            const chunks: Uint8Array[] = []
            for await (const chunk of ctx.fs.cat(_c, { signal })) {
                chunks.push(chunk)
            }
            const blob = new Blob(chunks)
            let url = URL.createObjectURL(blob)
            if (!url || url.startsWith(`blob:${window.location.origin}`)) {
                url = new TextDecoder().decode(Buffer.concat(chunks));
            }
            const isPin = await ctx.helia?.pins.isPinned(_c);
            if (!isPin) {
                const pinResult = ctx.helia?.pins.add(_c)
                if (pinResult) {
                    await drain(pinResult)
                }
            }
            await ctx.helia!.libp2p.services.pubsub.publish(config.topic_file, new TextEncoder().encode(cid.toString()))
            return url;
        }
        catch (err) {
            // console.error('Failed to fetch image:', err);
            return "/logo.png"
        }
    }
}

/**
 * 添加图片到ipfs
 * @param images {File[]}
 * @returns 
 */
export async function addImages(ctx: HeliaContextType | null, images: File[] | string[]): Promise<string[]> {
    const cids: string[] = []
    if (!ctx || !ctx.fs || !images) {
        return cids;
    }
    try {
        for (const image of images) {
            const buffer = typeof image === "string" ? new TextEncoder().encode(image) : await image.arrayBuffer();
            const cid = await ctx.fs.addBytes(new Uint8Array(buffer))
            const isPin = await ctx.helia?.pins.isPinned(cid)
            if (!isPin) {
                const pinResult = ctx.helia?.pins.add(cid);
                if (pinResult) {
                    await drain(pinResult);
                }
            }
            cids.push(cid.toString())
            await ctx.helia!.libp2p.services.pubsub.publish(config.topic_file, new TextEncoder().encode(cid.toString()))
        }
    } catch (err) {
        console.error('Failed to add image:', err);
    }
    return cids
}

/**
 * 添加商品描述到ipfs
 * @param info {ProductInfo}
 * @returns 
 */
export async function addProductInfo(ctx: HeliaContextType | null, info: {
    name: string;
    images: string[];
    description: string;
    condition: string[];
    shipping: string[];
}): Promise<string> {
    if (!ctx || !ctx.fs) {
        return "";
    }
    try {
        const jsonString = JSON.stringify(info)
        const cid = await ctx.fs.addBytes(new TextEncoder().encode(jsonString))
        const isPin = await ctx.helia?.pins.isPinned(cid)
        if (!isPin) {
            const pinResult = ctx.helia?.pins.add(cid);
            if (pinResult) {
                await drain(pinResult);
            }
        }
        await ctx.helia!.libp2p.services.pubsub.publish(config.topic_file, new TextEncoder().encode(cid.toString()))
        return cid.toString()
    } catch (err) {
        console.error('Failed to add product info:', err);
    }
    return ""
}

/**
 * 添加用户扩展信息到ipfs
 * @param ctx {HeliaContextType}
 * @param info {UserExtendInfo} x:twitter, tg:telegram, e:email,d:自述
 * @returns 
 */
export async function addUserExtendInfo(ctx: HeliaContextType | null, info: UserExtendInfo): Promise<string> {
    if (!ctx || !ctx.fs) {
        return "";
    }
    try {
        const jsonString = JSON.stringify(info)
        const cid = await ctx.fs.addBytes(new TextEncoder().encode(jsonString))
        const isPin = await ctx.helia?.pins.isPinned(cid);
        if (!isPin) {
            const pinResult = ctx.helia?.pins.add(cid);
            if (pinResult) {
                await drain(pinResult);
            }
        }
        await ctx.helia!.libp2p.services.pubsub.publish(config.topic_file, new TextEncoder().encode(cid.toString()))
        return cid.toString()
    } catch (err) {
        console.error('Failed to add product info:', err);
    }
    return ""

}

/**
 * 根据cid获取用户扩展信息
 * @param ctx {HeliaContextType}
 * @param cid 
 */
export async function getUserExtendInfo(ctx: HeliaContextType | null, cid: string, timeout?: number): Promise<UserExtendInfo> {
    const defaultInfo = { x: "", tg: "", e: "", d: "" }
    if (!ctx || !ctx.fs) {
        return defaultInfo;
    }
    try {
        const { signal } = new TimeoutController(timeout || DefaultTimeout)
        const _c = CID.parse(cid);
        const chunks: Uint8Array[] = [];
        for await (const chunk of ctx.fs.cat(_c, { signal })) {
            chunks.push(chunk);
        }
        const isPin = await ctx.helia?.pins.isPinned(_c);
        if (!isPin) {
            const pinResult = ctx.helia?.pins.add(CID.parse(cid));
            if (pinResult) {
                await drain(pinResult);
            }
        }
        await ctx.helia!.libp2p.services.pubsub.publish(config.topic_file, new TextEncoder().encode(cid.toString()))
        const jsonString = new TextDecoder().decode(chunks.reduce((a, b) => Uint8Array.from([...a, ...b])))
        return JSON.parse(jsonString);
    } catch (err) {
        console.error('Failed to fetch product info:', err);
    }
    return defaultInfo;
}