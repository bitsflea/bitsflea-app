import { parseNULS, fromNULS } from 'nuls-api-v2';

export async function getAsset(ctx: any, info: string) {
    if (!ctx || !ctx.fs) return "";
    if (!info) return "";
    const infos = info.split(",");
    if (infos.length != 3) return "";

    if (infos[1] == "0" && infos[2] == "0") {
        return `${fromNULS(infos[0])} BFT`;
    }
    const assetInfo = await ctx.nuls.getCrossAssetInfo(infos[1], infos[2]);
    if (!assetInfo) return `${infos[0]}`;
    return `${parseNULS(infos[0], assetInfo.decimalPlaces)} ${assetInfo.symbol}`;
}