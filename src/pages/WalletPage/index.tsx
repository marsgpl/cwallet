import React from 'react'
import Web3 from 'web3'
import { useParams } from 'react-router-dom'
import { useWallets } from 'hooks/useWallets'
import { useCopyValue } from 'hooks/useCopyValue'
import { Button } from 'components/Button'
import { routeTransfer } from 'defs/routes'
import { useWallet } from 'hooks/useWalletById'
import { useNav } from 'hooks/useNav'
import { useWeb3 } from 'hooks/useWeb3'
import s from './index.module.css'
import { ETH_USDT_ABI, ETH_USDT_CONTRACT_ADDR, ETH_USDT_MULTIPLIER } from 'defs/eth'

export interface WalletPageProps {
}

export function WalletPage({}: WalletPageProps) {
    const { goTo } = useNav()
    const copyValue = useCopyValue()
    const wallets = useWallets()
    const { walletId } = useParams()
    const wallet = useWallet(walletId, wallets)
    const [balance, setBalance] = React.useState<Record<string, Record<string, number>>>({})
    const web3 = useWeb3()
    const walletBalance = walletId ? balance[walletId] : undefined

    if (!walletId || !wallet) {
        throw Error('Wallet not found')
    }

    const fetchBalance = async () => {
        if (!web3) { return window.alert('Web3 is missing') }

        const defaultBlock = 'latest' // "earliest", "latest" , "pending", "safe", "finalized"
        const balanceWei = await web3.eth.getBalance(wallet.address, defaultBlock)
        const balanceEth = Web3.utils.fromWei(balanceWei, 'ether')

        const contract = new web3.eth.Contract(ETH_USDT_ABI as any, ETH_USDT_CONTRACT_ADDR)
        const usdtBalance = await contract.methods.balanceOf(wallet.address).call()

        setBalance({
            ...balance,
            [walletId]: {
                ...balance[walletId],
                ETH: parseFloat(balanceEth),
                USDT: parseFloat(usdtBalance) / ETH_USDT_MULTIPLIER,
            }
        })
    }

    return (
        <div className={s.Root}>
            ticker:
            &nbsp;
            <b>{wallet.ticker}</b>

            <br />
            <br />

            address:
            &nbsp;
            <Button
                text="Copy"
                size="s"
                onClick={() => copyValue(wallet.address, 'Address copied')}
            />

            <br />

            <a href={`https://etherscan.io/address/${wallet.address}`} target="_blank">
                view on etherscan
            </a>

            {wallet.privateKey && <>
                <br />
                <br />

                private key:
                &nbsp;
                <Button
                    text="Copy"
                    size="s"
                    onClick={() => copyValue(wallet.privateKey, 'Private key copied')}
                />
            </>}

            <br />
            <br />

            balance:
            &nbsp;
            {walletBalance === undefined ? '' : <div>
                {Object.entries(walletBalance).reduce<JSX.Element[]>((acc, [k, v]) => {
                    acc.push(<div>{v} <b>{k}</b></div>)
                    return acc
                }, [])}
            </div>}
            <Button text="Fetch" onClick={fetchBalance} size="s" />

            {wallet.privateKey && <>
                <br />
                <br />

                <Button text="Transfer" onClick={() => goTo(routeTransfer(walletId))} />
            </>}
        </div>
    )
}
