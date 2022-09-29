import React from 'react'
import { useParams } from 'react-router-dom'
import { useWallets } from 'hooks/useWallets'
import { getWalletById } from 'service/wallets'
import s from './index.module.css'

export interface WalletProps {
}

export function Wallet({}: WalletProps) {
    const wallets = useWallets()
    const { walletId } = useParams()

    const wallet = React.useMemo(() => getWalletById(wallets, walletId), [wallets, walletId])

    if (!wallet) {
        throw Error('Wallet not found')
    }

    return (
        <div className={s.Root}>
            title: {wallet.title}
            <br />
            ticker: {wallet.ticker}
            <br />
            address: <a
                href={`https://etherscan.io/address/${wallet.address}`}
                target="_blank"
            >
                {wallet.address}
            </a>
        </div>
    )
}
