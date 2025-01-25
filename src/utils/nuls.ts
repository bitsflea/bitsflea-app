import { parseNULS, fromNULS } from 'nuls-api-v2';
import CryptoJS from "crypto-js";
import { getCurrencyByValue } from '../utils/tools'

export async function getAsset(ctx: any, info: string) {
    if (!ctx || !ctx.fs) return "";
    if (!info) return "";
    const infos = info.split(",");
    if (infos.length != 3) return "";

    const c = getCurrencyByValue(`${infos[1]},${infos[2]}`)
    // if (infos[1] == "0" && infos[2] == "0") {
    //     const c = getCurrencyByValue("0,0")
    //     return `${fromNULS(infos[0])} ${c.label}`;
    // }
    // const assetInfo = await ctx.nuls.getCrossAssetInfo(infos[1], infos[2]);
    // if (!assetInfo) return `${infos[0]}`;
    return `${fromNULS(infos[0], c.decimals)} ${c.label}`;
}

export function getHash(data: string) {
    return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
}