import { CoreDataProviders } from 'model/CoreData'
import React from 'react'

export const ProvidersContext = React.createContext<CoreDataProviders>({})

export function useProviders() {
    return React.useContext(ProvidersContext)
}
