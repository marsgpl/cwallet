import React from 'react'
import { ChainTicker } from 'model/Chain'
import { useAppActions } from 'hooks/useAppActions'
import { useWallets } from 'hooks/useWallets'
import { randomInteger } from 'lib/randomInteger'
import { WALLET_TITLES } from 'defs/words'
import { Button } from 'components/Button'
import { InputText } from 'components/InputText'
import { Select } from 'components/Select'
import { selectChainOptions } from 'service/chains'
import { Wallet, WalletETH, WalletTRX } from 'model/Wallet'
import { useCopyValue } from 'hooks/useCopyValue'
import { getWalletById, getWalletId, isInvalidWallet } from 'service/wallets'
import { generateEthWallet, isEthTicker } from 'service/wallets/eth'
import { generateTrxWallet, isTrxTicker } from 'service/wallets/trx'
import s from './index.module.css'

export interface CreateWalletPageProps {}

export function CreateWalletPage({}: CreateWalletPageProps) {
    const copyValue = useCopyValue()
    const wallets = useWallets()
    const { addWallet } = useAppActions()
    const [title, setTitle] = React.useState('')
    const [titleIndex, setTitleIndex] = React.useState(randomInteger(0, WALLET_TITLES.length - 1))
    const [ticker, setTicker] = React.useState<ChainTicker>()
    const [wallet, setWallet] = React.useState<Wallet>()

    const generateEth = () => {
        setWallet(generateEthWallet({
            title,
        }))
    }

    const generateTrx = () => {
        generateTrxWallet({
            title,
        }).then(setWallet)
    }

    const submit = (event: React.FormEvent) => {
        event.preventDefault()

        if (!wallet) {
            return window.alert('Tap "Generate new"')
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

    const renderEth = () => {
        const w = wallet as WalletETH | undefined

        return <>
            <InputText
                className={s.Input}
                rightIcon="copy"
                rightAction={() => copyValue(w?.privateKey || '', 'Private key copied')}
                inputAttrs={{
                    placeholder: 'Private key',
                    value: w?.privateKey,
                    readOnly: true,
                    required: true,
                }}
            />

            <InputText
                className={s.Input}
                rightIcon="copy"
                rightAction={() => copyValue(w?.address || '', 'Address copied')}
                inputAttrs={{
                    placeholder: 'Address',
                    value: w?.address,
                    readOnly: true,
                    required: true,
                }}
            />

            <Button
                className={s.Input}
                text="Generate new"
                wide
                bg="trans"
                onClick={generateEth}
            />
        </>
    }

    const renderTrx = () => {
        const w = wallet as WalletTRX | undefined

        return <>
            <InputText
                className={s.Input}
                rightIcon="copy"
                rightAction={() => copyValue(w?.privateKey || '', 'Private key copied')}
                inputAttrs={{
                    placeholder: 'Private key',
                    value: w?.privateKey,
                    readOnly: true,
                    required: true,
                }}
            />

            <InputText
                className={s.Input}
                rightIcon="copy"
                rightAction={() => copyValue(w?.address || '', 'Address copied')}
                inputAttrs={{
                    placeholder: 'Address (Base58)',
                    value: w?.address,
                    readOnly: true,
                    required: true,
                }}
            />

            <Button
                className={s.Input}
                text="Generate new"
                wide
                bg="trans"
                onClick={generateTrx}
            />
        </>
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
                onChange={ticker => {
                    setTicker(ticker)
                    setWallet(undefined)
                }}
                selectAttrs={{
                    defaultValue: '',
                    required: true,
                }}
            />

            {isEthTicker(ticker) && renderEth()}
            {isTrxTicker(ticker) && renderTrx()}

            <Button
                className={s.Input}
                type="submit"
                text="Create"
                wide
            />
        </form>
    )
}
