import { ChainsMap } from 'model/Chain'
import { CHAIN_TICKER_ETH } from 'model/Chain/Eth'
import { CHAIN_TICKER_TRX } from 'model/Chain/Trx'

export const CHAINS: ChainsMap = {
    [CHAIN_TICKER_ETH]: {
        ticker: CHAIN_TICKER_ETH,
        title: 'Ethereum',
    },
    [CHAIN_TICKER_TRX]: {
        ticker: CHAIN_TICKER_TRX,
        title: 'Tron',
    },
}
