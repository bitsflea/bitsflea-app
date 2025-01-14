import { Product, ProductInfo } from "../types";
import { CID } from 'multiformats/cid'
import { getAsset } from "./nuls";
import config from '../data/config';

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
export async function getProductInfo(ctx: any, product: Product): Promise<ProductInfo> {
    // console.log("ctx:", ctx);
    const price = await getAsset(ctx, product.price);
    if (!ctx || !ctx.fs) {
        return Object.assign(defaultProductInfo, { id: product.pid, price: price });
    }
    try {
        const chunks: Uint8Array[] = [];
        for await (const chunk of ctx.fs.cat(CID.parse(product.description))) {
            chunks.push(chunk);
        }
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
    return defaultProductInfo
}

/**
 * 从ipfs获取图片
 * @param images 
 * @returns 
 */
export async function getImages(ctx: any, images: string[]): Promise<string[]> {
    const localImages: string[] = []
    if (!ctx || !ctx.fs || !images) {
        return localImages;
    }
    try {
        for (const cid of images) {
            if (cid.startsWith("data:image")) {
                localImages.push(cid)
                continue
            } else {
                const chunks = []
                for await (const chunk of ctx.fs.cat(CID.parse(cid))) {
                    chunks.push(chunk)
                }
                const blob = new Blob(chunks)
                localImages.push(URL.createObjectURL(blob))
            }
        }
    } catch (err) {
        console.error('Failed to fetch image:', err);
    }
    return localImages
}

/**
 * 添加图片到ipfs
 * @param images {File[]}
 * @returns 
 */
export async function addImages(ctx: any, images: File[]): Promise<string[]> {
    const cids: string[] = []
    if (!ctx || !ctx.fs || !images) {
        return cids;
    }
    try {
        for (const image of images) {
            const buffer = await image.arrayBuffer();
            const cid = await ctx.fs.addBytes(new Uint8Array(buffer))
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
export async function addProductInfo(ctx: any, info: {
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
        return cid.toString()
    } catch (err) {
        console.error('Failed to add product info:', err);
    }
    return ""
}

/**
 * 添加用户扩展信息到ipfs
 * @param ctx {HeliaContextType}
 * @param info {x: string, tg: string, e: string} x:twitter, tg:telegram, e:email,d:自述
 * @returns 
 */
export async function addUserExtendInfo(ctx: any, info: { x: string, tg: string, e: string, d: string }): Promise<string> {
    if (!ctx || !ctx.fs) {
        return "";
    }
    try {
        const jsonString = JSON.stringify(info)
        const cid = await ctx.fs.addBytes(new TextEncoder().encode(jsonString))
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
export async function getUserExtendInfo(ctx: any, cid: string) {
    const defaultInfo = { x: "", tg: "", e: "", d: "" }
    if (!ctx || !ctx.fs) {
        return defaultInfo;
    }
    try {
        const chunks: Uint8Array[] = [];
        for await (const chunk of ctx.fs.cat(CID.parse(cid))) {
            chunks.push(chunk);
        }
        const jsonString = new TextDecoder().decode(chunks.reduce((a, b) => Uint8Array.from([...a, ...b])))
        return JSON.parse(jsonString);
    } catch (err) {
        console.error('Failed to fetch product info:', err);
    }
    return defaultInfo;
}