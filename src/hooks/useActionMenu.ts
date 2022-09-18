import React from 'react'
import { ActionMenu } from 'model/ActionMenu'

export const SetActionMenuContext =
    React.createContext<React.Dispatch<React.SetStateAction<ActionMenu | undefined>>>(() => {})

export function useActionMenu() {
    return React.useContext(SetActionMenuContext)
}
