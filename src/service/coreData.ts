import { CoreData, CoreDataIV } from 'model/CoreData'
import { LOCAL_STORAGE_CORE_DATA_IV, LOCAL_STORAGE_CORE_DATA } from 'defs/localStorage'
import { AES_CIPHER, AES_IV_BYTES } from 'defs/crypto'
import { decrypt } from 'ethereum-cryptography/aes'
import { utf8ToBytes, hexToBytes } from 'ethereum-cryptography/utils'
import { getRandomBytes } from 'ethereum-cryptography/random'
import { CHARSET_UTF8 } from 'defs/charset'

export async function loadCoreData(key: string, iv: CoreDataIV): Promise<CoreData> {
    const encrypted = localStorage.getItem(LOCAL_STORAGE_CORE_DATA)

    if (encrypted === null) {
        return []
    }

    const decrypted = await decrypt(utf8ToBytes(encrypted), utf8ToBytes(key), iv, AES_CIPHER)
    const decoded = Buffer.from(decrypted).toString(CHARSET_UTF8)
    const parsed = JSON.parse(decoded)

    if (!Array.isArray(parsed)) {
        throw Error
    }

    return parsed as CoreData
}

export async function getCoreDataIv(): Promise<CoreDataIV> {
    const hex = localStorage.getItem(LOCAL_STORAGE_CORE_DATA_IV)

    if (hex) {
        return hexToBytes(hex)
    } else {
        const iv = await getRandomBytes(AES_IV_BYTES)
        const hex = Buffer.from(iv).toString(CHARSET_UTF8)
        localStorage.setItem(LOCAL_STORAGE_CORE_DATA_IV, hex)
        return iv
    }
}
