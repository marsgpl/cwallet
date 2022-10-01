import { Icon } from 'components/Icon'
import { routeWallet, ROUTE_WALLET } from 'defs/routes'
import { useWallets } from 'hooks/useWallets'
import { Wallet } from 'model/Wallet'
import { Link } from 'react-router-dom'
import { equalWallets, getWalletId, getWalletTitle } from 'service/wallets'
import { cn } from 'lib/cn'
import s from './index.module.css'

export interface WalletsProps {
    wallet?: Wallet
    onWalletClick?: () => void
}

export function Wallets({
    wallet,
    onWalletClick,
}: WalletsProps) {
    const wallets = useWallets()

    const empty = !wallets?.length

    return (
        <div className={cn(s.Root, empty && s.Empty)}>
            {empty && 'Empty'}

            {wallets?.map(w => {
                const id = getWalletId(w)
                const address = w.address
                const isOwn = Boolean(w.privateKey)

                return (
                    <Link
                        key={id}
                        className={cn(s.Row, equalWallets(w, wallet) && s.RowSelected)}
                        to={address ? routeWallet(id) : ''}
                        onClick={onWalletClick}
                    >
                        <Icon
                            className={s.Icon}
                            id={w.ticker.toLowerCase() as any}
                        />

                        {!isOwn && <div className={s.Label}>RO</div>}

                        <div className={s.Title}>
                            {getWalletTitle(w)}
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
