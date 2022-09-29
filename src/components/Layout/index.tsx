import React from 'react'
import { Wallets } from 'components/Wallets'
import { Icon } from 'components/Icon'
import { ROUTE_CREATE_WALLET, ROUTE_IMPORT_WALLET, ROUTE_SUMMARY } from 'defs/routes'
import { useActionMenu } from 'hooks/useActionMenu'
import { useNavigate, useParams } from 'react-router-dom'
import { cn } from 'lib/cn'
import { getInvalidWallets, getWalletById, getWalletTitle } from 'service/wallets'
import { useWallets } from 'hooks/useWallets'
import { ActionMenuButtons } from 'model/ActionMenu'
import s from './index.module.css'
import { useWalletsActions } from 'hooks/useWalletsActions'

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
    const { deleteWallets } = useWalletsActions()

    const wallet = React.useMemo(() => getWalletById(wallets, walletId), [wallets, walletId])
    const invalidWallets = React.useMemo(() => wallets && getInvalidWallets(wallets) || [], [wallets])
    const hasInvalidWallets = Boolean(invalidWallets.length)
    const needPin = hasInvalidWallets

    const showWalletActions = () => {
        if (!wallet) { return }

        setActionMenu({
            buttons: [
                {
                    text: 'Delete',
                    textColor: 'red',
                    onClick: () => deleteWallets([wallet]),
                },
            ]
        })
    }

    const showTools = () => {
        setActionMenu({
            buttons: [
                {
                    text: 'Create new wallet',
                    onClick: () => navigate(ROUTE_CREATE_WALLET),
                },
                {
                    text: 'Import wallet',
                    onClick: () => navigate(ROUTE_IMPORT_WALLET),
                },
                hasInvalidWallets && {
                    text: 'Delete invalid wallets',
                    textColor: 'red',
                    onClick: () => deleteWallets(invalidWallets),
                },
            ].filter(Boolean) as ActionMenuButtons
        })
    }

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

                        {needPin && (
                            <div className={s.HeaderIconPin} />
                        )}
                    </div>
                </div>

                <Wallets wallet={wallet} />
            </div>

            <div className={s.RightCol}>
                <div className={s.Header}>
                    <div className={cn(
                        s.HeaderTitle,
                        wallet && s.HeaderTitleWithRightIcon,
                    )}>
                        {wallet && getWalletTitle(wallet) || title}
                    </div>

                    {wallet && (
                        <div className={s.HeaderIcon} onClick={showWalletActions}>
                            <Icon id="more" />
                        </div>
                    )}
                </div>

                {children}
            </div>
        </div>
    )
}
