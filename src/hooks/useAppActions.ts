import React from 'react'
import { Wallet } from 'model/Wallet'
import { CoreDataProviders } from 'model/CoreData'

const f = () => {}

export interface AppActionsData {
    addWallet: (wallet: Wallet) => void
    updateWallet: (wallet: Wallet) => void
    deleteWallets: (walletsToDelete: Wallet[]) => void
    updateProvider: (key: keyof CoreDataProviders, value: string) => void
}

export const AppActionsContext = React.createContext<AppActionsData>({
    addWallet: f,
    deleteWallets: f,
    updateWallet: f,
    updateProvider: f,
})

export function useAppActions() {
    return React.useContext(AppActionsContext)
}
