import { Currency } from 'defs/currency'
import s from './index.module.css'

export interface MoneyProps {
    value: number
    valueCurrency?: Currency
    outCurrency?: Currency
}

export function Money({
    value,
}: MoneyProps) {
    return (
        <div className={s.Root}>
            ${value}
        </div>
    )
}
