import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { BlockNumber } from 'web3-core'
import { Wallet, WalletETH } from 'model/Wallet'
import { CHAIN_TICKER_ETH, EthTokenTicker } from 'model/Chain/Eth'
import { ETH_USDT_ABI, ETH_USDT_CONTRACT_ADDRESS } from 'defs/eth'
import { ChainTicker } from 'model/Chain'

export const ERROR_NO_WEB3 = 'web3 is not provided'

export interface EthTokenBalance {
    value: string
    decimals: string
}

export interface CreateEthWalletProps {
    title?: string
    privateKey?: string
    address?: string
}

export function createEthWallet({
    title,
    privateKey,
    address,
}: CreateEthWalletProps): WalletETH {
    return {
        ticker: CHAIN_TICKER_ETH,
        title,
        privateKey: privateKey || '',
        address: address || '',
    }
}

export type GenerateEthWalletProps = Pick<CreateEthWalletProps, 'title'>

export function generateEthWallet({ title }: GenerateEthWalletProps): WalletETH {
    const account = (new Web3).eth.accounts.create()

    return createEthWallet({
        title,
        privateKey: account.privateKey,
        address: account.address,
    })
}

export function getEthAddressFromPrivateKey(privateKey: string): string {
    const account = (new Web3).eth.accounts.privateKeyToAccount(privateKey)
    return account.address
}

export function isInvalidEthWallet(wallet: WalletETH) {
    return !Web3.utils.isAddress(wallet.address)
}

export function isEthWallet(wallet: Wallet): wallet is WalletETH {
    return wallet.ticker === CHAIN_TICKER_ETH
}

export async function fetchEthBalance(
    web3: Web3 | null,
    wallet: WalletETH,
    block?: BlockNumber,
): Promise<string> {
    if (!web3) { throw Error(ERROR_NO_WEB3) }

    const balanceWei = block
        ? await web3.eth.getBalance(wallet.address, block)
        : await web3.eth.getBalance(wallet.address)

    const balanceEth = Web3.utils.fromWei(balanceWei, 'ether')

    return balanceEth
}

export async function fetchEthTokenBalance(
    web3: Web3 | null,
    wallet: WalletETH,
    tokenTicker: EthTokenTicker,
): Promise<EthTokenBalance> {
    if (!web3) { throw Error(ERROR_NO_WEB3) }

    const [
        abi,
        addr,
    ] = await Promise.all([
        getEthTokenAbi(tokenTicker),
        getEthTokenContractAddress(tokenTicker),
    ])

    const contract = new web3.eth.Contract(abi, addr)

    const [
        value,
        decimals,
    ] = await Promise.all([
        contract.methods.balanceOf(wallet.address).call(),
        contract.methods.decimals().call(),
    ])

    return {
        value,
        decimals,
    }
}

export function ethTokenBalanceToString({ value, decimals }: EthTokenBalance): string {
    const d = parseInt(decimals)
    return (parseInt(value) / (10 ** d))
        .toFixed(d)
        .replace(/[\.,]*0+$/, '')
}

export async function getEthTokenAbi(tokenTicker: EthTokenTicker): Promise<AbiItem[] | AbiItem> {
    switch (tokenTicker) {
        case 'USDT': return ETH_USDT_ABI
        default: throw Error(`no abi for ETH ${tokenTicker}`)
    }
}

export async function getEthTokenContractAddress(tokenTicker: EthTokenTicker): Promise<string> {
    switch (tokenTicker) {
        case 'USDT': return ETH_USDT_CONTRACT_ADDRESS
        default: throw Error(`no contract address for ETH ${tokenTicker}`)
    }
}

export function isEthTicker(ticker?: ChainTicker): ticker is typeof CHAIN_TICKER_ETH {
    return ticker === CHAIN_TICKER_ETH
}
