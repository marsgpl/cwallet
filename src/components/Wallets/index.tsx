import { ROUTE_WALLET_BY_ID } from 'defs/routes'
import { useWallets } from 'hooks/useWallets'
import { cn } from 'lib/cn'
import { Wallet } from 'model/Wallet'
import { Link } from 'react-router-dom'
import { equalWallets, getWalletId, getWalletTitle } from 'service/wallets'
import s from './index.module.css'

export interface WalletsProps {
    wallet?: Wallet
}

export function Wallets({
    wallet,
}: WalletsProps) {
    const wallets = useWallets()

    const empty = !wallets?.length

    return (
        <div className={cn(s.Root, empty && s.Empty)}>
            {empty && 'Empty'}

            {wallets?.map(w => {
                const id = getWalletId(w)
                const address = w.address

                return (
                    <Link
                        key={id}
                        className={cn(s.Row, equalWallets(w, wallet) && s.RowSelected)}
                        to={address ? ROUTE_WALLET_BY_ID.replace(/:walletId/, id) : ''}
                    >
                        {getWalletTitle(w)}
                    </Link>
                )
            })}
        </div>
    )
}
