import { ChainTicker, CHAIN_TICKER_ETH } from 'model/Chain'
import { Wallet, WalletETH } from 'model/Wallet'
import Web3 from 'web3'

export function generateEthWallet(): WalletETH {
    const account = (new Web3).eth.accounts.create()
    const wallet = createWalletTemplate(CHAIN_TICKER_ETH)

    wallet.privateKey = account.privateKey
    wallet.address = account.address

    return wallet
}

export function getEthAddressFromPrivateKey(privateKey: string): string {
    const account = (new Web3).eth.accounts.privateKeyToAccount(privateKey)
    return account.address
}

export function createWalletTemplate(ticker: ChainTicker): Wallet {
    return {
        title: undefined,
        ticker,
        privateKey: '',
        address: '',
    }
}

export function getWalletTitle({ title, address }: Wallet): string {
    return title || address
}

export function getWalletId({ ticker, address }: Wallet): string {
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
    return !wallet.address
}

export function getInvalidWallets(wallets: Wallet[]): Wallet[] {
    return wallets.filter(isInvalidWallet)
}
