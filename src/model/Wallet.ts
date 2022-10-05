import {
    ChainTicker,
} from './Chain'
import { CHAIN_TICKER_ETH } from './Chain/Eth'
import { CHAIN_TICKER_TRX } from './Chain/Trx'

export type WalletId = string

export interface BaseWallet {
    title?: string
    ticker: ChainTicker
    address: string
}

export interface WalletETH extends BaseWallet {
    ticker: typeof CHAIN_TICKER_ETH
    privateKey?: string
}

export interface WalletTRX extends BaseWallet {
    ticker: typeof CHAIN_TICKER_TRX
    privateKey?: string
}

export type Wallet =
    | WalletETH
    | WalletTRX
