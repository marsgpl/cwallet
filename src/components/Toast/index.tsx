import React from 'react'
import { Toast as ToastModel } from 'model/Toast'
import { TOAST_TTL_MS } from 'defs/toast'
import { useToast } from 'hooks/useToast'
import s from './index.module.css'

export interface ToastProps {
    data: ToastModel
}

let tmt: number

export function Toast({ data }: ToastProps) {
    const setToast = useToast()

    const close = () => setToast(undefined)
    const clearTmt = () => clearTimeout(tmt)
    const setTmt = () => tmt = window.setTimeout(close, TOAST_TTL_MS)

    React.useEffect(() => {
        clearTmt()
        setTmt()
        return clearTmt
    }, [data])

    return (
        <div
            className={s.Root}
            onClick={close}
            onMouseOver={clearTmt}
            onMouseOut={setTmt}
        >
            {data.message}
        </div>
    )
}
