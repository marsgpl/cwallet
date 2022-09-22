import { Wallets } from 'components/Wallets'
import s from './index.module.css'

export interface SummaryPageProps {
}

export function SummaryPage({}: SummaryPageProps) {
    return (
        <div className={s.Root}>
            <Wallets />
        </div>
    )
}
