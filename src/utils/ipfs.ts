import { HeliaContextType, Product, ProductInfo, UserExtendInfo } from "../types";
import { CID } from 'multiformats/cid'
import { getAsset } from "./nuls";
import config from '../data/config';
import drain from 'it-drain'
import { TimeoutController } from 'timeout-abort-controller'

const DefaultTimeout = 50000

export const defaultProductInfo: ProductInfo = {
    id: "",
    name: "",
    images: [],
    description: "",
    shipping: config.default_item_details.shipping,
    condition: config.default_item_details.condition,
    price: ""
}
async function doPin(ctx: HeliaContextType, cid: CID) {
    const isPin = await ctx.helia!.pins.isPinned(cid);
    if (!isPin) {
        const pinResult = ctx.helia!.pins.add(cid)
        if (pinResult) {
            await drain(pinResult)
            console.debug("doPin OK:",cid.toString())
        }
    }
    await ctx.helia!.libp2p.services.pubsub.publish(config.topic_file, new TextEncoder().encode(cid.toString()))
}
/**
 * 从IPFS获取商品信息
 * @param product {Product} 
 * @returns 
 */
export async function getProductInfo(ctx: HeliaContextType | null, product: Product, timeout?: number): Promise<ProductInfo> {
    // console.debug("product:", product);
    const price = getAsset(product.price)
    if (!ctx || !ctx.json || !ctx.helia) {
        return Object.assign(defaultProductInfo, { id: product.pid, price: price })
    }
    try {
        const { signal } = new TimeoutController(timeout || DefaultTimeout)
        const cid = CID.parse(product.description);
        let obj: any = await ctx.json!.get(cid, { signal })

        doPin(ctx, cid)

        if (("shipping" in obj) === false) {
            obj = Object.assign(obj, { shipping: defaultProductInfo.shipping })
        }
        if (("condition" in obj) === false) {
            obj = Object.assign(obj, { condition: defaultProductInfo.condition })
        }
        return Object.assign(obj, { id: product.pid, price: price })
    } catch (err) {
        console.error('Failed to fetch product info:', product.description, err)
    }
    return Object.assign(defaultProductInfo, { id: product.pid, price: price })
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
                    url = new TextDecoder().decode(Buffer.concat(chunks))
                }
                localImages.push(url)

                doPin(ctx, CID.parse(cid))
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
            doPin(ctx, _c)
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
        return cids
    }
    try {
        for (const image of images) {
            const buffer = typeof image === "string" ? new TextEncoder().encode(image) : await image.arrayBuffer()
            const cid = await ctx.fs.addBytes(new Uint8Array(buffer))
            doPin(ctx, cid)
            cids.push(cid.toString())
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
    name: string
    images: string[]
    description: string
    condition: string[]
    shipping: string[]
}): Promise<string> {
    if (!ctx || !ctx.json || !ctx.helia) {
        return "";
    }
    try {
        const cid = await ctx.json!.add(info)
        doPin(ctx, cid)
        return cid.toString()
    } catch (err) {
        console.error('Failed to add product info:', err)
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
    if (!ctx || !ctx.json || !ctx.helia) {
        return ""
    }
    try {
        const cid = await ctx.json!.add(info)
        doPin(ctx, cid)
        return cid.toString()
    } catch (err) {
        console.error('Failed to add product info:', err)
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
    if (!ctx || !ctx.json || !ctx.helia) {
        return defaultInfo
    }
    try {
        const { signal } = new TimeoutController(timeout || DefaultTimeout)
        const _c = CID.parse(cid)
        const _j: UserExtendInfo = await ctx.json!.get(_c, { signal })
        doPin(ctx, _c)
        return _j
    } catch (err) {
        console.error('Failed to fetch product info:', err)
    }
    return defaultInfo
}

export async function addJson<T>(ctx: HeliaContextType | null, info: T): Promise<string> {
    if (!ctx || !ctx.json || !ctx.helia) {
        return ""
    }
    try {
        const cid = await ctx.json!.add(info)
        doPin(ctx, cid)
        return cid.toString()
    } catch (err) {
        console.error('Failed to add json:', err)
    }
    return ""
}

export async function getJson<T>(ctx: HeliaContextType | null, cid: string, timeout?: number): Promise<T> {
    const defaultInfo = {} as T
    if (!ctx || !ctx.json || !ctx.helia) {
        return defaultInfo;
    }
    try {
        const { signal } = new TimeoutController(timeout || DefaultTimeout)
        const _c = CID.parse(cid);
        const _j: T = await ctx.json!.get(_c, { signal })
        doPin(ctx, _c)
        return _j
    } catch (err) {
        console.error('Failed to fetch json:', err);
    }
    return defaultInfo;
}

export function isCid(str: string) {
    try {
        CID.parse(str)
    } catch {
        return false
    }
    return true
}