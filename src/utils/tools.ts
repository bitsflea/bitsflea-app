import config from "../data/config";

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