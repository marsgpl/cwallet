import { Wallets } from 'components/Wallets'
import { Icon } from 'components/Icon'
import { ROUTE_CREATE_WALLET, ROUTE_IMPORT_WALLET, ROUTE_SUMMARY } from 'defs/routes'
import { useActionMenu } from 'hooks/useActionMenu'
import { useNavigate, useParams } from 'react-router-dom'
import { cn } from 'lib/cn'
import { getWalletById, getWalletTitle } from 'service/wallets'
import { useWallets } from 'hooks/useWallets'
import s from './index.module.css'

export interface LayoutBreadcrumb {
    label: string
    route?: string
}

export type LayoutBreadcrumbs = LayoutBreadcrumb[]

export interface LayoutProps {
    title: string
    children: JSX.Element
}

export function Layout({
    title,
    children,
}: LayoutProps) {
    const setActionMenu = useActionMenu()
    const navigate = useNavigate()
    const wallets = useWallets()
    const { walletId } = useParams()

    const showTools = () => {
        setActionMenu({
            buttons: [
                {
                    text: 'Summary',
                    onClick: () => navigate(ROUTE_SUMMARY),
                },
                {
                    text: 'Create new wallet',
                    onClick: () => navigate(ROUTE_CREATE_WALLET),
                },
                // {
                //     text: 'Import wallet',
                //     onClick: () => navigate(ROUTE_IMPORT_WALLET),
                // },
            ],
        })
    }

    const wallet = getWalletById(wallets, walletId)

    return (
        <div className={s.Root}>
            <div className={s.LeftCol}>
                <div className={s.Header}>
                    <div
                        className={cn(
                            s.HeaderTitle,
                            s.HeaderTitleWithRightIcon,
                            s.HeaderClickable,
                        )}
                        onClick={() => navigate(ROUTE_SUMMARY)}
                    >
                        Wallets
                    </div>

                    <div className={s.HeaderIcon} onClick={showTools}>
                        <Icon id="more" />
                    </div>
                </div>

                <Wallets wallet={wallet} />
            </div>

            <div className={s.RightCol}>
                <div className={s.Header}>
                    <div className={s.HeaderTitle}>
                        {wallet && getWalletTitle(wallet) || title}
                    </div>
                </div>

                {children}
            </div>
        </div>
    )
}
