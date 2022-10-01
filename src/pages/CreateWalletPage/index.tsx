import React from 'react'
import { ChainTicker, CHAIN_TICKER_ETH } from 'model/Chain'
import { useAppActions } from 'hooks/useAppActions'
import { useWallets } from 'hooks/useWallets'
import { randomInteger } from 'lib/randomInteger'
import { WALLET_TITLES } from 'defs/words'
import { Button } from 'components/Button'
import { InputText } from 'components/InputText'
import { Select } from 'components/Select'
import { selectChainOptions } from 'service/chains'
import { Wallet } from 'model/Wallet'
import { useCopyValue } from 'hooks/useCopyValue'
import { generateEthWallet, getWalletById, getWalletId, isInvalidWallet } from 'service/wallets'
import s from './index.module.css'

export interface CreateWalletPageProps {}

export function CreateWalletPage({}: CreateWalletPageProps) {
    const copyValue = useCopyValue()
    const wallets = useWallets()
    const { addWallet } = useAppActions()
    const [title, setTitle] = React.useState('')
    const [titleIndex, setTitleIndex] = React.useState(randomInteger(0, WALLET_TITLES.length - 1))
    const [ticker, setTicker] = React.useState<ChainTicker>(CHAIN_TICKER_ETH)
    const [wallet, setWallet] = React.useState<Wallet>()

    const generate = () => {
        if (ticker === CHAIN_TICKER_ETH) {
            setWallet(generateEthWallet())
        }
    }

    const submit = (event: React.FormEvent) => {
        event.preventDefault()

        if (ticker !== CHAIN_TICKER_ETH) { return }

        if (!wallet) {
            return window.alert('Tap "Generate new" button')
        }

        wallet.title = title

        if (isInvalidWallet(wallet)) {
            return window.alert('Wallet is invalid')
        }

        if (getWalletById(wallets, getWalletId(wallet))) {
            return window.alert('Wallet is already added')
        }

        addWallet(wallet)
    }

    return (
        <form className={s.Root} onSubmit={submit}>
            <InputText
                className={s.Input}
                rightIcon="wand"
                rightAction={() => {
                    setTitle(WALLET_TITLES[titleIndex])
                    setTitleIndex(titleIndex + 1 < WALLET_TITLES.length ? titleIndex + 1 : 0)
                }}
                inputAttrs={{
                    value: title,
                    placeholder: 'Title',
                    onChange: event => setTitle(event.target.value),
                }}
            />

            <Select<ChainTicker>
                className={s.Input}
                options={selectChainOptions()}
                onChange={setTicker}
                selectAttrs={{
                    defaultValue: ticker,
                    required: true,
                }}
            />

            <InputText
                className={s.Input}
                rightIcon="copy"
                rightAction={() => copyValue(wallet?.address || '', 'Address copied')}
                inputAttrs={{
                    placeholder: 'Address',
                    value: wallet?.address,
                    readOnly: true,
                    required: true,
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
                    required: true,
                }}
            />

            <Button
                className={s.Input}
                text="Generate new"
                wide
                bg="trans"
                onClick={generate}
            />

            <Button
                className={s.Input}
                type="submit"
                text="Create"
                wide
            />
        </form>
    )
}
