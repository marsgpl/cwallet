import {
    ChainsMap,
    CHAIN_TICKER_ETH,
    // CHAIN_TICKER_BTC,
} from 'model/Chain'

export const CHAINS: ChainsMap = {
    [CHAIN_TICKER_ETH]: {
        ticker: CHAIN_TICKER_ETH,
        title: 'Ethereum',
    },
    // [CHAIN_TICKER_BTC]: {
    //     ticker: CHAIN_TICKER_BTC,
    //     title: 'Bitcoin',
    // },
}
