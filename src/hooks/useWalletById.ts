import React from 'react'
import { Wallet } from 'model/Wallet'
import { getWalletById } from 'service/wallets'

export function useWallet(walletId?: string, wallets?: Wallet[]): Wallet | undefined {
    return React.useMemo(() => getWalletById(wallets, walletId), [wallets, walletId])
}
