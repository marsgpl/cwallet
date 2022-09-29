import React from 'react'
import { ChainTicker } from 'model/Chain'
import { Wallet } from 'model/Wallet'
import { GenerateWalletStep } from 'wizards/steps/GenerateWalletStep'
import { SelectChainStep } from 'wizards/steps/SelectChainStep'
import { SetWalletTitleStep } from 'wizards/steps/SetWalletTitleStep'
import s from './index.module.css'
import { useWalletsActions } from 'hooks/useWalletsActions'

export interface CreateWalletWizardProps {}

export function CreateWalletWizard({}: CreateWalletWizardProps) {
    const { addWallet } = useWalletsActions()

    const [ticker, setTicker] = React.useState<ChainTicker>()
    const [wallet, setWallet] = React.useState<Wallet>()

    React.useEffect(() => {
        if (wallet?.title !== undefined) {
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
