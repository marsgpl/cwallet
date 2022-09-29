import React from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { CoreData, CoreDataIV } from 'model/CoreData'
import { loadCoreData, getCoreDataIv, saveCoreData } from 'service/coreData'
import { RequestKeyPage } from 'pages/RequestKeyPage'
import { LoadingPage } from 'pages/LoadingPage'
import { Toast } from 'components/Toast'
import { SetToastContext } from 'hooks/useToast'
import { SetActionMenuContext } from 'hooks/useActionMenu'
import { ActionMenu } from 'components/ActionMenu'
import { stringifyError } from 'lib/stringifyError'
import {
    ROUTE_ALL,
    ROUTE_CREATE_WALLET,
    ROUTE_IMPORT_WALLET,
    ROUTE_SUMMARY,
    ROUTE_WALLET_BY_ID,
} from 'defs/routes'
import { Toast as ToastModel } from 'model/Toast'
import { ActionMenu as ActionMenuModel } from 'model/ActionMenu'
import { ErrorPage } from 'pages/ErrorPage'
import { Layout } from 'components/Layout'
import { Summary } from 'components/Summary'
import { CreateWalletWizard } from 'wizards/CreateWalletWizard'
import { ImportWalletWizard } from 'wizards/ImportWalletWizard'
import { WalletsContext } from 'hooks/useWallets'
import { Wallet } from 'model/Wallet'
import { Wallet as WalletSummary } from 'components/Wallet'
import { getWalletId } from 'service/wallets'
import { WalletsActionsContext } from 'hooks/useWalletsActions'

export function App() {
    const [key, setKey] = React.useState<string>()
    const [coreDataIv, setCoreDataIv] = React.useState<CoreDataIV>()
    const [coreData, setCoreData] = React.useState<CoreData>()
    const [toast, setToast] = React.useState<ToastModel>()
    const [actionMenu, setActionMenu] = React.useState<ActionMenuModel>()
    const navigate = useNavigate()

    const addWallet = React.useCallback((wallet: Wallet) => {
        if (!key) { return }
        if (!coreDataIv) { return }
        if (!coreData) { return }

        const newCoreData = {
            ...coreData,
            wallets: [
                ...coreData.wallets,
                wallet,
            ]
        }

        setCoreData(newCoreData)
        saveCoreData(newCoreData, key, coreDataIv)
        navigate(ROUTE_SUMMARY)
        setToast({
            message: 'Wallet saved',
        })
    }, [
        key,
        coreDataIv,
        coreData,
    ])

    const deleteWallets = React.useCallback((walletsToDelete: Wallet[]) => {
        if (!key) { return }
        if (!coreDataIv) { return }
        if (!coreData) { return }

        const message = `Are you sure want to delete ${walletsToDelete.length} wallet${walletsToDelete.length === 1 ? '' : 's'}?${walletsToDelete.map(wallet => `\n\n${JSON.stringify(wallet)}`)}`

        if (!window.confirm(message)) { return }

        const idsToDel = new Set(walletsToDelete.map(wallet => getWalletId(wallet)))

        const newCoreData = {
            ...coreData,
            wallets: coreData.wallets.filter(wallet => !idsToDel.has(getWalletId(wallet))),
        }

        setCoreData(newCoreData)
        saveCoreData(newCoreData, key, coreDataIv)
        navigate(ROUTE_SUMMARY)
        setToast({
            message: `${idsToDel.size} wallet${idsToDel.size === 1 ? ' was' : 's were'} deleted`,
        })
    }, [
        key,
        coreDataIv,
        coreData,
    ])

    React.useEffect(() => {
        if (!key) { return }

        try {
            const iv = getCoreDataIv()
            const data = loadCoreData(key, iv)

            setCoreDataIv(iv)
            setCoreData(data)
        } catch (error) {
            throw Error('Decoding failed', {
                cause: Error(stringifyError(error)),
            })
        }
    }, [key])

    const renderContent = () => {
        if (!key) {
            return <RequestKeyPage onSubmit={setKey} />
        }

        if (coreData === undefined) {
            return <LoadingPage />
        }

        return (
            <Routes>
                <Route index element={<Layout
                    title="Summary"
                >
                    <Summary />
                </Layout>} />

                <Route path={ROUTE_SUMMARY} element={<Layout
                    title="Summary"
                >
                    <Summary />
                </Layout>} />

                <Route path={ROUTE_CREATE_WALLET} element={<Layout
                    title="Create new wallet"
                >
                    <CreateWalletWizard />
                </Layout>} />

                <Route path={ROUTE_IMPORT_WALLET} element={<Layout
                    title="Import wallet"
                >
                    <ImportWalletWizard />
                </Layout>} />

                <Route path={ROUTE_WALLET_BY_ID} element={<Layout
                    title="Wallet"
                >
                    <WalletSummary />
                </Layout>} />

                <Route path={ROUTE_ALL} element={<ErrorPage
                    message="Unknown url"
                />} />
            </Routes>
        )
    }

    return (
        <WalletsActionsContext.Provider value={{
            addWallet,
            deleteWallets,
        }}>
            <WalletsContext.Provider value={coreData?.wallets}>
                <SetToastContext.Provider value={setToast}>
                    <SetActionMenuContext.Provider value={setActionMenu}>
                        {renderContent()}
                        {toast ? <Toast data={toast} /> : null}
                        {actionMenu ? <ActionMenu data={actionMenu} /> : null}
                    </SetActionMenuContext.Provider>
                </SetToastContext.Provider>
            </WalletsContext.Provider>
        </WalletsActionsContext.Provider>
    )
}
