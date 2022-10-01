import React from 'react'
import { Wallets } from 'components/Wallets'
import { Icon } from 'components/Icon'
import { ROUTE_CREATE_WALLET, ROUTE_IMPORT_WALLET, ROUTE_SUMMARY } from 'defs/routes'
import { useActionMenu } from 'hooks/useActionMenu'
import { useParams } from 'react-router-dom'
import { getInvalidWallets, getWalletTitle } from 'service/wallets'
import { useWallets } from 'hooks/useWallets'
import { ActionMenuButtons } from 'model/ActionMenu'
import { useWalletsActions } from 'hooks/useWalletsActions'
import { useWallet } from 'hooks/useWalletById'
import { cn } from 'lib/cn'
import { useNav } from 'hooks/useNav'
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
    const { goTo, mobMenuShown, setMobMenuShown } = useNav()
    const { walletId } = useParams()
    const wallets = useWallets()
    const wallet = useWallet(walletId, wallets)
    const { deleteWallets, updateWallet } = useWalletsActions()
    const invalidWallets = React.useMemo(() => wallets && getInvalidWallets(wallets) || [], [wallets])
    const hasInvalidWallets = Boolean(invalidWallets.length)
    const needPin = hasInvalidWallets

    const showWalletActions = () => {
        if (!wallet) { return }

        setActionMenu({
            buttons: [
                {
                    text: 'Rename',
                    onClick: () => {
                        const title = prompt('New name:')

                        if (title === null) { return }

                        updateWallet({
                            ...wallet,
                            title,
                        })
                    },
                },
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
                        goTo(ROUTE_SUMMARY)
                    }
                },
                {
                    text: 'Create new wallet',
                    onClick: () => {
                        goTo(ROUTE_CREATE_WALLET)
                    }
                },
                {
                    text: 'Import wallet',
                    onClick: () => {
                        goTo(ROUTE_IMPORT_WALLET)
                    }
                },
                hasInvalidWallets && {
                    text: 'Delete invalid wallets',
                    textColor: 'red',
                    onClick: () => {
                        deleteWallets(invalidWallets)
                    }
                },
            ].filter(Boolean) as ActionMenuButtons
        })
    }

    return (
        <div className={cn(s.Root, mobMenuShown ? s.MenuShown : s.MenuHidden)}>
            <div className={s.LeftColShadow} onClick={() => setMobMenuShown(false)} />

            <div className={s.LeftCol}>
                <div className={s.Header}>
                    <div className={s.HideMenu} onClick={() => setMobMenuShown(false)}>
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

                <Wallets wallet={wallet} />
            </div>

            <div className={s.RightCol}>
                <div className={s.Header}>
                    <div className={s.ShowMenu} onClick={() => setMobMenuShown(true)}>
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
