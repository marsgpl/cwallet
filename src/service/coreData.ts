import CryptoJS from 'crypto-js'
import { CoreData, CoreDataIV } from 'model/CoreData'
import { LOCAL_STORAGE_CORE_DATA_IV, LOCAL_STORAGE_CORE_DATA } from 'defs/localStorage'
import { AES_IV_BYTES } from 'defs/crypto'
import { CHAIN_TICKER_ETH } from 'model/Chain'
import { getEthAddressFromPrivateKey } from './wallets'

export const CORE_DATA_STORAGE_KEYS = [
    LOCAL_STORAGE_CORE_DATA,
    LOCAL_STORAGE_CORE_DATA_IV,
]

export function loadCoreData(key: string, iv: CoreDataIV): CoreData {
    const encrypted = localStorage.getItem(LOCAL_STORAGE_CORE_DATA)

    if (encrypted === null) {
        return {
            wallets: [],
            providers: {},
        }
    }

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv })
    const decoded = decrypted.toString(CryptoJS.enc.Utf8)
    const parsed = JSON.parse(decoded)

    if (!parsed || typeof parsed !== 'object') {
        throw Error('Core data must be Object')
    }

    const coreData = parsed as CoreData

    if (!coreData.wallets) {
        coreData.wallets = []
    }

    if (!coreData.providers) {
        coreData.providers = {}
    }

    fixCoreData(coreData)

    return coreData
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

export function saveCoreData(coreData: CoreData, key: string, iv: CoreDataIV) {
    const encoded = JSON.stringify(coreData)
    const encrypted = CryptoJS.AES.encrypt(encoded, key, { iv }).toString()

    localStorage.setItem(LOCAL_STORAGE_CORE_DATA, encrypted)
}

function fixCoreData(coreData: CoreData) {
    coreData.wallets.forEach(wallet => {
        if (!wallet.address && wallet.privateKey) {
            if (wallet.ticker === CHAIN_TICKER_ETH) {
                try {
                    wallet.address = getEthAddressFromPrivateKey(wallet.privateKey)
                } catch (error) {
                    console.error('🔺 fixCoreData wallet:', wallet, 'error:', error)
                }
            }
        }
    })
}

export function eraseCoreData() {
    localStorage.removeItem(LOCAL_STORAGE_CORE_DATA)
}

export function eraseCoreDataIv() {
    localStorage.removeItem(LOCAL_STORAGE_CORE_DATA_IV)
}
