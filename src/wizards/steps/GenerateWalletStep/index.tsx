import React from 'react'
import { ChainTicker, CHAIN_TICKER_ETH } from 'model/Chain'
import { Wallet } from 'model/Wallet'
import { generateEthWallet } from 'service/wallets'
import { InputText } from 'components/InputText'
import { Button } from 'components/Button'
import { useCopyValue } from 'hooks/useCopyValue'
import s from './index.module.css'

export interface GenerateWalletStepFormData {
    wallet: Wallet
}

export interface GenerateWalletStepProps {
    ticker: ChainTicker
    onSubmit: (data: GenerateWalletStepFormData) => void
}

export function GenerateWalletStep({
    ticker,
    onSubmit,
}: GenerateWalletStepProps) {
    const copyValue = useCopyValue()
    const [wallet, setWallet] = React.useState<Wallet>()

    const submit = (event: React.FormEvent) => {
        event.preventDefault()

        if (!wallet) { return }

        onSubmit({
            wallet,
        })
    }

    const generate = () => {
        if (ticker === CHAIN_TICKER_ETH) {
            setWallet(generateEthWallet())
        }
    }

    React.useEffect(() => {
        generate()
    }, [])

    return (
        <form
            className={s.Root}
            onSubmit={submit}
        >
            <InputText
                className={s.Input}
                rightIcon="copy"
                rightAction={() => copyValue(wallet?.address || '', 'Address copied')}
                inputAttrs={{
                    placeholder: 'Address',
                    value: wallet?.address,
                    readOnly: true,
                }}
            />

            <InputText
                className={s.Input}
                rightIcon="copy"
                rightAction={() => copyValue(wallet?.privateKey || '', 'Private key copied')}
                inputAttrs={{
                    placeholder: 'Private key',
                    value: wallet?.privateKey,
                    readOnly: true,
                }}
            />

            <Button
                className={s.Input}
                type="submit"
                text="Next"
                wide
            />

            <Button
                className={s.GenerateButton}
                type="button"
                text="Generate again"
                wide
                bg="trans"
                onClick={generate}
            />
        </form>
    )
}
