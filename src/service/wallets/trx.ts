import TronWeb from 'tronweb'
import { Wallet, WalletTRX } from 'model/Wallet'
import { CHAIN_TICKER_TRX } from 'model/Chain/Trx'
import { ChainTicker } from 'model/Chain'

export interface CreateTrxWalletProps {
    title?: string
    privateKey?: string
    address?: string
}

export function createTrxWallet({
    title,
    privateKey,
    address,
}: CreateTrxWalletProps): WalletTRX {
    return {
        ticker: CHAIN_TICKER_TRX,
        title,
        privateKey,
        address: address || '',
    }
}

export type GenerateTrxWalletProps = Pick<CreateTrxWalletProps, 'title'>

export async function generateTrxWallet({ title }: GenerateTrxWalletProps): Promise<WalletTRX> {
    const account = await TronWeb.createAccount()

    return createTrxWallet({
        title,
        privateKey: account.privateKey,
        address: account.address.base58,
    })
}

export function isTrxWallet(wallet: Wallet): wallet is WalletTRX {
    return wallet.ticker === CHAIN_TICKER_TRX
}

export function getTrxAddressFromPrivateKey(privateKey: string): string {
    return TronWeb.address.fromPrivateKey(privateKey)
}

export function isInvalidTrxWallet(wallet: WalletTRX) {
    return !TronWeb.isAddress(wallet.address)
}

export function isTrxTicker(ticker?: ChainTicker): ticker is typeof CHAIN_TICKER_TRX {
    return ticker === CHAIN_TICKER_TRX
}
