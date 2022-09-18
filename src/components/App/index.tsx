import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { CoreData } from 'model/CoreData'
import { loadCoreData, getCoreDataIv, CoreDataIV } from 'service/coreData'
import { RequestKeyPage } from 'pages/RequestKeyPage'
import { LoadingPage } from 'pages/LoadingPage'
import { Toast as ToastModel } from 'model/Toast'
import { ActionMenu as ActionMenuModel } from 'model/ActionMenu'
import { Toast } from 'components/Toast'
import { SetToastContext } from 'hooks/useToast'
import { SetActionMenuContext } from 'hooks/useActionMenu'
import { ActionMenu } from 'components/ActionMenu'
import { stringifyError } from 'lib/stringifyError'

export function App() {
    const [key, setKey] = React.useState<string>()
    const [coreDataIv, setCoreDataIv] = React.useState<CoreDataIV>()
    const [coreData, setCoreData] = React.useState<CoreData>()
    const [toast, setToast] = React.useState<ToastModel>()
    const [actionMenu, setActionMenu] = React.useState<ActionMenuModel>()

    React.useEffect(() => {
        if (!key) { return }

        try {
            const iv = getCoreDataIv()
            const coreData = loadCoreData(key, iv)

            setCoreDataIv(iv)
            setCoreData(coreData)
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
                <Route index element="TODO" />
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
