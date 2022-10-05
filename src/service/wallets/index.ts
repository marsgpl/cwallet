import { ChainTicker } from 'model/Chain'
import { Wallet, WalletId } from 'model/Wallet'
import { createEthWallet, getEthAddressFromPrivateKey, isEthTicker, isEthWallet, isInvalidEthWallet } from './eth'
import { createTrxWallet, getTrxAddressFromPrivateKey, isInvalidTrxWallet, isTrxTicker, isTrxWallet } from './trx'

export interface ImportWalletProps {
    ticker?: ChainTicker
    title?: string
    privateKey?: string
    address?: string
}

export function getWalletTitle({ title, address }: Wallet): string {
    return title || address
}

export function getWalletId({ ticker, address }: Wallet): WalletId {
    return `${ticker}:${address}`
}

export function parseWalletId(id: string): { ticker: string, address: string } | undefined {
    if (!id) { return }

    const [ticker, address] = id.split(':')

    if (!ticker) { return }
    if (!address) { return }

    return {
        ticker,
        address,
    }
}

export function getWalletById(wallets?: Wallet[], id?: string): Wallet | undefined {
    if (!wallets?.length) { return }
    if (!id) { return }

    const { ticker, address } = parseWalletId(id) || {}

    if (!ticker) { return }
    if (!address) { return }

    return wallets.find(wallet =>
        wallet.ticker.toUpperCase() === ticker.toUpperCase()
        && wallet.address.toLowerCase() === address.toLowerCase())
}

export function equalWallets(w1?: Wallet, w2?: Wallet): boolean {
    if (!w1 && !w2) { return true }

    if (!w1) { return false }
    if (!w2) { return false }

    return w1.ticker.toUpperCase() === w2.ticker.toUpperCase()
        && w1.address.toLowerCase() === w2.address.toLowerCase()
}

export function isInvalidWallet(wallet: Wallet): boolean {
    if (isEthWallet(wallet) && isInvalidEthWallet(wallet)) {
        return true
    }

    if (isTrxWallet(wallet) && isInvalidTrxWallet(wallet)) {
        return true
    }

    return !wallet.address
}

export function getInvalidWallets(wallets: Wallet[]): Wallet[] {
    return wallets.filter(isInvalidWallet)
}

export function importWallet({
    ticker,
    title,
    privateKey,
    address,
}: ImportWalletProps): Wallet {
    if (!address && !privateKey) { throw Error('Not enough data') }

    if (isEthTicker(ticker)) {
        return createEthWallet({
            title,
            privateKey,
            address: address || privateKey && getEthAddressFromPrivateKey(privateKey),
        })
    }

    if (isTrxTicker(ticker)) {
        return createTrxWallet({
            title,
            privateKey,
            address: address || privateKey && getTrxAddressFromPrivateKey(privateKey),
        })
    }

    throw Error('Unknown ticker')
}
