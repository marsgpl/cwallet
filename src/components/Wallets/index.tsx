import { Icon } from 'components/Icon'
import { routeWallet, ROUTE_CREATE_WALLET, ROUTE_IMPORT_WALLET } from 'defs/routes'
import { useWallets } from 'hooks/useWallets'
import { Wallet } from 'model/Wallet'
import { equalWallets, getWalletId, getWalletTitle } from 'service/wallets'
import { Button } from 'components/Button'
import { useNav } from 'hooks/useNav'
import { cn } from 'lib/cn'
import s from './index.module.css'

export interface WalletsProps {
    wallet?: Wallet
}

export function Wallets({
    wallet,
}: WalletsProps) {
    const wallets = useWallets()
    const { goTo } = useNav()

    const empty = !wallets?.length

    return (
        <div className={cn(s.Root, empty && s.Empty)}>
            {empty && <>
                <Button
                    size="m"
                    text="Create"
                    onClick={() => goTo(ROUTE_CREATE_WALLET)}
                />

                <div className={s.EmptyOr}>or</div>

                <Button
                    size="m"
                    text="Import"
                    onClick={() => goTo(ROUTE_IMPORT_WALLET)}
                />
            </>}

            {wallets?.map(w => {
                const id = getWalletId(w)
                const address = w.address
                const isOwn = Boolean(w.privateKey)

                return (
                    <div
                        key={id}
                        className={cn(s.Row, equalWallets(w, wallet) && s.RowSelected)}
                        onClick={address ? () => goTo(routeWallet(id)) : undefined}
                    >
                        <Icon
                            className={s.Icon}
                            id={w.ticker.toLowerCase() as any}
                        />

                        {!isOwn && <div className={s.Label}>RO</div>}

                        <div className={s.Title}>
                            {getWalletTitle(w)}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
