import { CHAIN_TICKER_ETH } from './Eth'
import { CHAIN_TICKER_TRX } from './Trx'

export type ChainTicker =
    | typeof CHAIN_TICKER_ETH
    | typeof CHAIN_TICKER_TRX

export interface Chain {
    ticker: ChainTicker
    title: string
}

export type ChainsMap = Record<ChainTicker, Chain>
