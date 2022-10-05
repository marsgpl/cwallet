import CryptoJS from 'crypto-js'
import { Wallet } from './Wallet'

export interface CoreDataProviders {
    web3?: string
    tron?: {
        apiKey: string
        fullNode: string
        solidityNode: string
        eventServer: string
    }
}

export interface CoreData {
    wallets: Wallet[]
    providers: CoreDataProviders
}

export type CoreDataIV = CryptoJS.lib.WordArray
