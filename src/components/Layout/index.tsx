import React from 'react'
import { Wallets } from 'components/Wallets'
import { Icon } from 'components/Icon'
import { ROUTE_CREATE_WALLET, ROUTE_IMPORT_WALLET, ROUTE_SUMMARY } from 'defs/routes'
import { useActionMenu } from 'hooks/useActionMenu'
import { useNavigate, useParams } from 'react-router-dom'
import { getInvalidWallets, getWalletTitle } from 'service/wallets'
import { useWallets } from 'hooks/useWallets'
import { ActionMenuButtons } from 'model/ActionMenu'
import { useWalletsActions } from 'hooks/useWalletsActions'
import { useWallet } from 'hooks/useWalletById'
import { cn } from 'lib/cn'
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
    const { walletId } = useParams()
    const wallets = useWallets()
    const wallet = useWallet(walletId, wallets)
    const { deleteWallets } = useWalletsActions()
    const [menuShown, setMenuShown] = React.useState(false)
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
                    text: 'Summary',
                    onClick: () => {
                        navigate(ROUTE_SUMMARY)
                        setMenuShown(false)
                    }
                },
                {
                    text: 'Create new wallet',
                    onClick: () => {
                        navigate(ROUTE_CREATE_WALLET)
                        setMenuShown(false)
                    }
                },
                {
                    text: 'Import wallet',
                    onClick: () => {
                        navigate(ROUTE_IMPORT_WALLET)
                        setMenuShown(false)
                    }
                },
                hasInvalidWallets && {
                    text: 'Delete invalid wallets',
                    textColor: 'red',
                    onClick: () => {
                        deleteWallets(invalidWallets)
                        setMenuShown(false)
                    }
                },
            ].filter(Boolean) as ActionMenuButtons
        })
    }

    return (
        <div className={cn(s.Root, menuShown ? s.MenuShown : s.MenuHidden)}>
            <div className={s.LeftColShadow} onClick={() => setMenuShown(false)} />

            <div className={s.LeftCol}>
                <div className={s.Header}>
                    <div className={s.HideMenu} onClick={() => setMenuShown(false)}>
                        <Icon id="close" />
                    </div>

                    <div
                        className={cn(
                            s.HeaderTitle,
                            s.HeaderTitleWithRightIcon,
                        )}
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

                <Wallets wallet={wallet} onWalletClick={() => {
                    setMenuShown(false)
                }} />
            </div>

            <div className={s.RightCol}>
                <div className={s.Header}>
                    <div className={s.ShowMenu} onClick={() => setMenuShown(true)}>
                        <Icon id="menu" />
                    </div>

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

                <div className={s.Content}>
                    {children}
                </div>
            </div>
        </div>
    )
}
