import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { CoreData, CoreDataIV } from 'model/CoreData'
import { loadCoreData, getCoreDataIv } from 'service/coreData'
import { RequestKeyPage } from 'pages/RequestKeyPage'
import { LoadingPage } from 'pages/LoadingPage'
import { Toast } from 'components/Toast'
import { SetToastContext } from 'hooks/useToast'
import { SetActionMenuContext } from 'hooks/useActionMenu'
import { ActionMenu } from 'components/ActionMenu'
import { stringifyError } from 'lib/stringifyError'
import { SummaryPage } from 'pages/SummaryPage'
import { ROUTE_ALL, ROUTE_CREATE_WALLET, ROUTE_IMPORT_WALLET, ROUTE_SUMMARY } from 'defs/routes'
import { CreateWalletPage } from 'pages/CreateWalletPage'
import { Toast as ToastModel } from 'model/Toast'
import { ActionMenu as ActionMenuModel } from 'model/ActionMenu'
import { ErrorPage } from 'pages/ErrorPage'
import { ImportWalletPage } from 'pages/ImportWalletPage'

export function App() {
    const [key, setKey] = React.useState<string>()
    const [coreDataIv, setCoreDataIv] = React.useState<CoreDataIV>()
    const [coreData, setCoreData] = React.useState<CoreData>()
    const [toast, setToast] = React.useState<ToastModel>()
    const [actionMenu, setActionMenu] = React.useState<ActionMenuModel>()

    React.useEffect(() => {
        if (!key) { return }

        let coreDataIv: CoreDataIV

        getCoreDataIv()
            .then(iv => {
                coreDataIv = iv
                return loadCoreData(key, iv)
            })
            .then(coreData => {
                setCoreDataIv(coreDataIv)
                setCoreData(coreData)
            })
            .catch(error => {
                throw Error('Decoding failed', {
                    cause: Error(stringifyError(error)),
                })
            })
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
                <Route index element={<SummaryPage />} />

                <Route path={ROUTE_SUMMARY} element={<SummaryPage />} />

                <Route path={ROUTE_CREATE_WALLET} element={<CreateWalletPage />} />

                <Route path={ROUTE_IMPORT_WALLET} element={<ImportWalletPage />} />

                <Route path={ROUTE_ALL} element={<ErrorPage
                    message="Unknown url"
                />} />
            </Routes>
        )
    }

    return (
        <SetToastContext.Provider value={setToast}>
        <SetActionMenuContext.Provider value={setActionMenu}>
            {renderContent()}
            {toast ? <Toast data={toast} /> : null}
            {actionMenu ? <ActionMenu data={actionMenu} /> : null}
        </SetActionMenuContext.Provider>
        </SetToastContext.Provider>
    )
}
