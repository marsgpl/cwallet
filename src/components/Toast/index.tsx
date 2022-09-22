import React from 'react'
import { Toast as ToastModel } from 'model/Toast'
import { TOAST_TTL_MS } from 'defs/toast'
import { useToast } from 'hooks/useToast'
import s from './index.module.css'

export interface ToastProps {
    data: ToastModel
}

let tmt: number

const clearTmt = () => window.clearTimeout(tmt)

export function Toast({ data }: ToastProps) {
    const setToast = useToast()
    const close = React.useCallback(() => setToast(undefined), [setToast])
    const setTmt = React.useCallback(() => tmt = window.setTimeout(close, TOAST_TTL_MS), [close])

    React.useEffect(() => {
        clearTmt()
        setTmt()
        return clearTmt
    }, [data, setTmt])

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
