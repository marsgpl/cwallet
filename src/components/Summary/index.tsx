import { Loader } from 'components/Loader'
import { Money } from 'components/Money'
import { useWallets } from 'hooks/useWallets'
import { cn } from 'lib/cn'
import s from './index.module.css'

export interface SummaryProps {
}

export function Summary({}: SummaryProps) {
    const wallets = useWallets()

    const ready = wallets !== undefined
    const noWallets = !wallets?.length

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
                <div className={s.Key}>Total value:</div>
                <div className={s.Value}>
                    {noWallets ? (
                        <Money value={0} />
                    ) : (
                        <Loader mini />
                    )}
                </div>
            </div>

            <div className={s.Row}>
                <div className={s.Key}>Wallets:</div>
                <div className={s.Value}>
                    {wallets?.length || 0}
                </div>
            </div>
        </div>
    )
}
