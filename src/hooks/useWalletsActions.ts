import React from 'react'
import { Wallet } from 'model/Wallet'

const f = () => {}

export const WalletsActionsContext = React.createContext<{
    addWallet: (wallet: Wallet) => void
    deleteWallets: (walletsToDelete: Wallet[]) => void
    updateWallet: (wallet: Wallet) => void
}>({
    addWallet: f,
    deleteWallets: f,
    updateWallet: f,
})

export function useWalletsActions() {
    return React.useContext(WalletsActionsContext)
}
