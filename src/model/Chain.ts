export const CHAIN_TICKER_ETH = 'ETH'
// export const CHAIN_TICKER_BTC = 'BTC'

export type ChainTicker =
    | typeof CHAIN_TICKER_ETH
    // | typeof CHAIN_TICKER_BTC

export interface Chain {
    ticker: ChainTicker
    title: string
}

export type ChainsMap = Record<ChainTicker, Chain>
