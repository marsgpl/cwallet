import { Loader } from 'components/Loader'
import { useWallets } from 'hooks/useWallets'
import { cn } from 'lib/cn'
import s from './index.module.css'

export interface SummaryPageProps {
}

export function SummaryPage({}: SummaryPageProps) {
    const wallets = useWallets()

    const ready = wallets !== undefined

    if (!ready) {
        return (
            <div className={cn(s.Root, s.RootLoader)}>
                <Loader />
            </div>
        )
    }

    return (
        <div className={s.Root}>
            <div className={s.Row}>
                <div className={s.Key}>Wallets:</div>
                <div className={s.Value}>
                    {wallets?.length || 0}
                </div>
            </div>
        </div>
    )
}
