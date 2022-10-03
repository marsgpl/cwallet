import { ChainTicker, CHAIN_TICKER_ETH } from './Chain'

interface BaseWallet {
    title?: string
    ticker: ChainTicker
}

export interface WalletETH extends BaseWallet {
    ticker: typeof CHAIN_TICKER_ETH
    privateKey: string
    address: string
}

export type Wallet =
    | WalletETH

export type WalletId = string

export interface WalletBalance {
    ts: number
    value: string
}

// ticker:chainId:addr => { ts, value }
export type WalletBalances = Map<string, WalletBalance>
