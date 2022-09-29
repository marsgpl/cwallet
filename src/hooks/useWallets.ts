import React from 'react'
import { Wallet } from 'model/Wallet'

export const WalletsContext = React.createContext<Wallet[] | undefined>([])

export function useWallets() {
    return React.useContext(WalletsContext)
}
