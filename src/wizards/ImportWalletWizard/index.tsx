import React from 'react'
import { Wallet } from 'model/Wallet'
import { ChainTicker } from 'model/Chain'
import { SelectChainStep } from 'wizards/steps/SelectChainStep'
import { SetWalletTitleStep } from 'wizards/steps/SetWalletTitleStep'
import { InputWalletStep } from 'wizards/steps/InputWalletStep'
import { useWalletsActions } from 'hooks/useWalletsActions'
import { getWalletById, getWalletId, isInvalidWallet } from 'service/wallets'
import { useWallets } from 'hooks/useWallets'
import s from './index.module.css'
import { useNavigate } from 'react-router-dom'
import { ROUTE_SUMMARY } from 'defs/routes'

export interface ImportWalletWizardProps {}

export function ImportWalletWizard({}: ImportWalletWizardProps) {
    const wallets = useWallets()
    const { addWallet } = useWalletsActions()
    const navigate = useNavigate()
    const [ticker, setTicker] = React.useState<ChainTicker>()
    const [wallet, setWallet] = React.useState<Wallet>()

    React.useEffect(() => {
        if (wallet?.title !== undefined) {
            if (isInvalidWallet(wallet)) {
                navigate(ROUTE_SUMMARY)
                return window.alert('Wallet is invalid')
            }

            if (getWalletById(wallets, getWalletId(wallet))) {
                navigate(ROUTE_SUMMARY)
                return window.alert('Wallet is already added')
            }

            addWallet(wallet)
        }
    }, [wallet?.title === undefined])

    const renderStep = () => {
        if (!ticker) {
            return (
                <SelectChainStep
                    onSubmit={data => setTicker(data.ticker)}
                />
            )
        }

        if (!wallet) {
            return (
                <InputWalletStep
                    ticker={ticker}
                    onSubmit={data => setWallet(data.wallet)}
                />
            )
        }

        if (wallet.title === undefined) {
            return (
                <SetWalletTitleStep
                    onSubmit={data => setWallet({
                        ...wallet,
                        title: data.title,
                    })}
                />
            )
        }
    }

    return (
        <div className={s.Root}>
            {renderStep()}
        </div>
    )
}
