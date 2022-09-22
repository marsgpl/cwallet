import { CHAIN_TICKER_ETH } from './Chain'

interface BaseWallet {
    id: string
    title?: string
}

export interface WalletDataETH {
    address: string
    publicKey: string
    privateKey: string
}

export interface WalletETH extends BaseWallet {
    ticker: typeof CHAIN_TICKER_ETH
    data: WalletDataETH
}

export type Wallet =
    | WalletETH
