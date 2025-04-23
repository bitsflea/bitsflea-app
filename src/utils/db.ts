import { encryptMsg } from "nuls-api-v2"
import { Address } from "../types"

export const KEY_FAVORITE = "favorite"
export const KEY_FOLLOWING = "following"

export async function getAddresses(db: any, user: string) {
    let data: Address[] = []
    let _d = localStorage.getItem(user)
    if (!_d || _d === '[]') {
        let info = await db.get(user)
        if (info && info.value) {
            let str = await window?.NaboxWallet?.nai.decryptData([info.value.data, user])
            if (str) {
                data = JSON.parse(str)
                localStorage.setItem(user, JSON.stringify(data))
            }
        }
    } else {
        data = JSON.parse(_d)
    }
    return data
}

export async function setAddresses(db: any, user: string, data: Address[] | undefined) {
    localStorage.setItem(user, JSON.stringify(data))
    if (db) {
        if (data && data.length > 0) {
            let pub = await window?.NaboxWallet?.nai.getPub({ address: user })
            let info = { _id: user, data: await encryptMsg(JSON.stringify(data), pub) }
            await db.put(info)
        } else {
            await db.del(user)
        }
    }
}

export async function setUserData(db: any, user: string, data: string[] | undefined, prefix: string = KEY_FAVORITE) {
    const key = `${prefix}_${user}`
    localStorage.setItem(key, JSON.stringify(data))
    if (db) {
        if (data && data.length > 0) {
            let info = { _id: key, data: JSON.stringify(data) }
            await db.put(info)
        } else {
            await db.del(key)
        }
    }
}

export async function getUserData(db: any, user: string, prefix: string = KEY_FAVORITE) {
    const key = `${prefix}_${user}`
    let data: string[] = []
    let _d = localStorage.getItem(key)
    if (!_d || _d === '[]') {
        let info = await db.get(key)
        if (info && info.value && info.value.data) {
            data = JSON.parse(info.value.data)
            localStorage.setItem(key, info.value.data)
        }
    } else {
        data = JSON.parse(_d)
    }
    return data
}

export async function addFollowing(db: any, user: string, uid: string) {
    const ids = await getUserData(db, user, KEY_FOLLOWING)
    if (ids.includes(uid) === false) {
        ids.push(uid)
        await setUserData(db, user, ids, KEY_FOLLOWING)
    }
}

export async function delFollowing(db: any, user: string, uid: string) {
    const ids = await getUserData(db, user, KEY_FOLLOWING)
    const index = ids.findIndex((v) => v === uid)
    if (index > -1) {
        ids.splice(index, 1)
        await setUserData(db, user, ids, KEY_FOLLOWING)
    }
}

export async function hasFollowing(db: any, user: string, uid: string) {
    const ids = await getUserData(db, user, KEY_FOLLOWING)
    const index = ids.findIndex((v) => v === uid)
    if (index > -1) {
        return true
    }
    return false
}

export async function addFavorite(db: any, user: string, productId: string) {
    const ids = await getUserData(db, user)
    if (ids.includes(productId) === false) {
        ids.push(productId)
        await setUserData(db, user, ids)
    }
}

export async function delFavorite(db: any, user: string, productId: string) {
    const ids = await getUserData(db, user)
    const index = ids.findIndex((v) => v === productId)
    if (index > -1) {
        ids.splice(index, 1)
        await setUserData(db, user, ids)
    }
}

export async function hasFavorite(db: any, user: string, productId: string) {
    const ids = await getUserData(db, user)
    const index = ids.findIndex((v) => v === productId)
    if (index > -1) {
        return true
    }
    return false
}