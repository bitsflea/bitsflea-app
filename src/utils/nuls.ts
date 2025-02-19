import { parseNULS, fromNULS } from 'nuls-api-v2';
import CryptoJS from "crypto-js";
import { getCurrencyByValue } from '../utils/tools'
import { Price } from '../types';

export function getAsset(info: any) {
    if (!info) return "";
    if (typeof info === "string") {
        const infos = info.split(",");
        if (infos.length != 3) return "";
        const c = getCurrencyByValue(`${infos[1]},${infos[2]}`)
        return `${fromNULS(infos[0], c.decimals)} ${c.label}`;
    } else {
        const c = getCurrencyByValue(`${info.assetChainId},${info.assetId}`)
        return `${fromNULS(info.value, c.decimals)} ${c.label}`;
    }
}

export function getHash(data: string) {
    return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
}



export function getPrice(priceStr: string): Price {
    const infos = priceStr.split(",");
    if (infos.length != 3) return { value: 0, assetId: '', symbol: '', decimals: 8 };

    const c = getCurrencyByValue(`${infos[1]},${infos[2]}`)
    return {
        value: fromNULS(infos[0], c.decimals),
        assetId: `${infos[1]},${infos[2]}`,
        symbol: c.label,
        decimals: c.decimals
    }
}

export function showOrderId(oid: string) {
    return `${oid.substring(0, 8)}...${oid.slice(-8)}`
}

export function showAddress(address: string, len: number = 8) {
    return `${address.substring(0, len)}...${address.slice(-len)}`
}