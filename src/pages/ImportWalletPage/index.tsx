import React from 'react'
import { Wallet } from 'model/Wallet'
import { ChainTicker } from 'model/Chain'
import { SelectChainStep } from 'steps/SelectChainStep'
import { SetWalletTitleStep } from 'steps/SetWalletTitleStep'
import { InputWalletStep } from 'steps/InputWalletStep'
import { useWalletsActions } from 'hooks/useWalletsActions'
import s from './index.module.css'

export interface ImportWalletPageProps {}

export function ImportWalletPage({}: ImportWalletPageProps) {
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
