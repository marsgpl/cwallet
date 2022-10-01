import React from 'react'
import { NavigateOptions, Route, Routes, To, useNavigate } from 'react-router-dom'
import { CoreData, CoreDataIV, CoreDataProviders } from 'model/CoreData'
import { loadCoreData, getCoreDataIv, saveCoreData } from 'service/coreData'
import { RequestKeyPage } from 'pages/RequestKeyPage'
import { LoadingPage } from 'pages/LoadingPage'
import { Toast } from 'components/Toast'
import { SetToastContext } from 'hooks/useToast'
import { SetActionMenuContext } from 'hooks/useActionMenu'
import { ActionMenu } from 'components/ActionMenu'
import { stringifyError } from 'lib/stringifyError'
import {
    routeWallet,
    ROUTE_ALL,
    ROUTE_CREATE_WALLET,
    ROUTE_IMPORT_WALLET,
    ROUTE_SUMMARY,
    ROUTE_TRANSFER,
    ROUTE_WALLET,
} from 'defs/routes'
import { Toast as ToastModel } from 'model/Toast'
import { ActionMenu as ActionMenuModel } from 'model/ActionMenu'
import { ErrorPage } from 'pages/ErrorPage'
import { Layout } from 'components/Layout'
import { SummaryPage } from 'pages/SummaryPage'
import { CreateWalletPage } from 'pages/CreateWalletPage'
import { ImportWalletPage } from 'pages/ImportWalletPage'
import { WalletsContext } from 'hooks/useWallets'
import { Wallet, WalletBalances } from 'model/Wallet'
import { WalletPage } from 'pages/WalletPage'
import { equalWallets, getWalletId } from 'service/wallets'
import { AppActionsContext } from 'hooks/useAppActions'
import { TransferPage } from 'pages/TransferPage'
import { NavContext } from 'hooks/useNav'
import { ProvidersContext } from 'hooks/useProviders'

export function App() {
    const [key, setKey] = React.useState<string>()
    const [toast, setToast] = React.useState<ToastModel>()
    const [actionMenu, setActionMenu] = React.useState<ActionMenuModel>()
    const [mobMenuShown, setMobMenuShown] = React.useState(false)
    const [coreDataIv, setCoreDataIv] = React.useState<CoreDataIV>()
    const [coreData, setCoreData] = React.useState<CoreData>()
    const [balances, setBalances] = React.useState<WalletBalances>()
    const navigate = useNavigate()

    React.useEffect(() => {
        if (!key) { return }

        try {
            const iv = getCoreDataIv()
            const data = loadCoreData(key, iv)

            setCoreDataIv(iv)
            setCoreData(data)
        } catch (error) {
            console.error('🔺 error:', error)
            throw Error('Decoding failed', {
                cause: Error(stringifyError(error)),
            })
        }
    }, [key])

    const goTo = React.useCallback((to: To, options?: NavigateOptions) => {
        navigate(to, options)
        setMobMenuShown(false)
    }, [
        navigate,
        setMobMenuShown,
    ])

    const updateWallet = React.useCallback((wallet: Wallet) => {
        if (!key || !coreData || !coreDataIv) { return }

        const newCoreData = {
            ...coreData,
            wallets: coreData.wallets.map(w => equalWallets(w, wallet) ? wallet : w),
        }

        setCoreData(newCoreData)
        saveCoreData(newCoreData, key, coreDataIv)
        setToast({
            message: 'Wallet updated',
        })
    }, [
        key,
        coreDataIv,
        coreData,
    ])

    const addWallet = React.useCallback((wallet: Wallet) => {
        if (!key || !coreData || !coreDataIv) { return }

        const newCoreData = {
            ...coreData,
            wallets: [
                ...coreData.wallets,
                wallet,
            ]
        }

        setCoreData(newCoreData)
        saveCoreData(newCoreData, key, coreDataIv)
        goTo(routeWallet(getWalletId(wallet)))
        setToast({
            message: 'Wallet added',
        })
    }, [
        key,
        coreDataIv,
        coreData,
    ])

    const deleteWallets = React.useCallback((walletsToDelete: Wallet[]) => {
        if (!key || !coreData || !coreDataIv) { return }

        const message = `Are you sure want to delete ${walletsToDelete.length} wallet${walletsToDelete.length === 1 ? '' : 's'}?${walletsToDelete.map(wallet => `\n\n${JSON.stringify(wallet)}`)}`

        if (!window.confirm(message)) { return }

        const idsToDel = new Set(walletsToDelete.map(wallet => getWalletId(wallet)))

        const newCoreData = {
            ...coreData,
            wallets: coreData.wallets.filter(wallet => !idsToDel.has(getWalletId(wallet))),
        }

        setCoreData(newCoreData)
        saveCoreData(newCoreData, key, coreDataIv)
        goTo(ROUTE_SUMMARY)
        setToast({
            message: `${idsToDel.size} wallet${idsToDel.size === 1 ? ' was' : 's were'} deleted`,
        })
    }, [
        key,
        coreDataIv,
        coreData,
    ])

    const updateProvider = React.useCallback((k: keyof CoreDataProviders, v: string) => {
        if (!key || !coreData || !coreDataIv) { return }

        const newCoreData = {
            ...coreData,
            providers: {
                ...coreData.providers,
                [k]: v,
            },
        }

        setCoreData(newCoreData)
        saveCoreData(newCoreData, key, coreDataIv)
        setToast({
            message: `${k} updated`,
        })
    }, [
        key,
        coreDataIv,
        coreData,
    ])

    const renderContent = () => {
        if (!key) {
            return <RequestKeyPage onSubmit={setKey} />
        }

        if (coreData === undefined) {
            return <LoadingPage />
        }

        return (
            <Routes>
                <Route index element={<Layout title="Summary"><SummaryPage /></Layout>} />
                <Route path={ROUTE_SUMMARY} element={<Layout title="Summary"><SummaryPage /></Layout>} />
                <Route path={ROUTE_CREATE_WALLET} element={<Layout title="Create new wallet"><CreateWalletPage /></Layout>} />
                <Route path={ROUTE_IMPORT_WALLET} element={<Layout title="Import wallet"><ImportWalletPage /></Layout>} />
                <Route path={ROUTE_WALLET} element={<Layout title="Wallet"><WalletPage /></Layout>} />
                <Route path={ROUTE_TRANSFER} element={<Layout title="Transfer"><TransferPage /></Layout>} />
                <Route path={ROUTE_ALL} element={<ErrorPage message="Unknown url" />} />
            </Routes>
        )
    }

    return (
        <NavContext.Provider value={{
            mobMenuShown,
            setMobMenuShown,
            goTo,
        }}>
        <AppActionsContext.Provider value={{
            addWallet,
            deleteWallets,
            updateWallet,
            updateProvider,
        }}>
        <WalletsContext.Provider value={coreData?.wallets}>
        <ProvidersContext.Provider value={coreData?.providers || {}}>
        <SetToastContext.Provider value={setToast}>
        <SetActionMenuContext.Provider value={setActionMenu}>
            {renderContent()}
            {toast ? <Toast data={toast} /> : null}
            {actionMenu ? <ActionMenu data={actionMenu} /> : null}
        </SetActionMenuContext.Provider>
        </SetToastContext.Provider>
        </ProvidersContext.Provider>
        </WalletsContext.Provider>
        </AppActionsContext.Provider>
        </NavContext.Provider>
    )
}
