import CryptoJS from 'crypto-js'
import { CoreData } from 'model/CoreData'
import { LOCAL_STORAGE_CORE_DATA_IV, LOCAL_STORAGE_CORE_DATA } from 'defs/localStorage'
import { AES_IV_BYTES } from 'defs/crypto'

export type CoreDataIV = CryptoJS.lib.WordArray

export function loadCoreData(key: string, iv: CoreDataIV): CoreData {
    const encrypted = localStorage.getItem(LOCAL_STORAGE_CORE_DATA)

    if (encrypted === null) {
        return []
    }

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv })
    const decoded = decrypted.toString(CryptoJS.enc.Utf8)
    const parsed = JSON.parse(decoded)

    if (!Array.isArray(parsed)) {
        throw Error
    }

    return parsed as CoreData
}

export function getCoreDataIv(): CoreDataIV {
    const hex = localStorage.getItem(LOCAL_STORAGE_CORE_DATA_IV)

    if (hex) {
        return CryptoJS.enc.Hex.parse(hex)
    } else {
        const iv = CryptoJS.lib.WordArray.random(AES_IV_BYTES)
        const hex = CryptoJS.enc.Hex.stringify(iv)
        localStorage.setItem(LOCAL_STORAGE_CORE_DATA_IV, hex)
        return iv
    }
}
