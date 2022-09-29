import React from 'react'
import { ChainTicker } from 'model/Chain'
import { Wallet } from 'model/Wallet'
import { GenerateWalletStep } from 'wizards/steps/GenerateWalletStep'
import { SelectChainStep } from 'wizards/steps/SelectChainStep'
import { SetWalletTitleStep } from 'wizards/steps/SetWalletTitleStep'
import { useNavigate } from 'react-router-dom'
import { useToast } from 'hooks/useToast'
import { ROUTE_SUMMARY } from 'defs/routes'
import s from './index.module.css'

export interface CreateWalletWizardProps {
    onAdd: (wallet: Wallet) => void
}

export function CreateWalletWizard({ onAdd }: CreateWalletWizardProps) {
    const navigate = useNavigate()
    const setToast = useToast()

    const [ticker, setTicker] = React.useState<ChainTicker>()
    const [wallet, setWallet] = React.useState<Wallet>()

    React.useEffect(() => {
        if (wallet?.title !== undefined) {
            onAdd(wallet)
            setToast({
                message: 'Wallet saved',
            })
            navigate(ROUTE_SUMMARY)
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
                <GenerateWalletStep
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
