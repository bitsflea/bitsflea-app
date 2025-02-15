import config from "../data/config";

const b64uLookup = {
    "/": "_",
    _: "/",
    "+": "-",
    "-": "+",
    "=": ".",
    ".": "=",
    "N": 'p',
    "p": 'N'
  };

export function getCurrency(label: string) {
    const item = config.currencies.find((v) => v.label === label);
    if (item) return item;
    return config.currencies[0];
}

export function getCurrencyByValue(value: string) {
    const item = config.currencies.find((v) => v.value === value);
    if (item) return item;
    return config.currencies[0];
}

export const b64uDec = (str:string) =>
    Buffer.from(
        // @ts-ignore
      str.replace(/(-|_|\.)/g, (m:string) => b64uLookup[m]),
      "base64"
    ).toString();