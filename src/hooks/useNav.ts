import React from 'react'
import { NavigateOptions, To } from 'react-router-dom'

const f = () => {}

export interface NavContextData {
    mobMenuShown: boolean
    setMobMenuShown: React.Dispatch<React.SetStateAction<boolean>>
    goTo: (to: To, options?: NavigateOptions) => void
}

export const NavContext = React.createContext<NavContextData>({
    mobMenuShown: false,
    setMobMenuShown: f,
    goTo: f,
})

export function useNav() {
    return React.useContext(NavContext)
}
