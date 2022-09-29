import CryptoJS from 'crypto-js'
import { Wallet } from './Wallet'

export interface CoreData {
    wallets: Wallet[]
}

export type CoreDataIV = CryptoJS.lib.WordArray
