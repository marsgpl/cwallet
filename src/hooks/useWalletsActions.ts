import React from 'react'
import { Wallet } from 'model/Wallet'

const f = () => {}

export const WalletsActionsContext = React.createContext<{
    addWallet: (wallet: Wallet) => void
    deleteWallets: (walletsToDelete: Wallet[]) => void
}>({
    addWallet: f,
    deleteWallets: f,
})

export function useWalletsActions() {
    return React.useContext(WalletsActionsContext)
}
