import React from 'react'
import { Toast } from 'model/Toast'

export const SetToastContext =
    React.createContext<React.Dispatch<React.SetStateAction<Toast | undefined>>>(() => {})

export function useToast() {
    return React.useContext(SetToastContext)
}
