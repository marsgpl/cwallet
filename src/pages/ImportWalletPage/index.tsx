import React from 'react'
import { ChainTicker, CHAIN_TICKER_ETH } from 'model/Chain'
import { useAppActions } from 'hooks/useAppActions'
import { randomInteger } from 'lib/randomInteger'
import { WALLET_TITLES } from 'defs/words'
import { InputText } from 'components/InputText'
import { Button } from 'components/Button'
import { EMPTY_OPTION, Select, SelectOptions } from 'components/Select'
import { selectChainOptions } from 'service/chains'
import {
    createWalletTemplate,
    getEthAddressFromPrivateKey,
    getWalletById,
    getWalletId,
    isInvalidWallet,
} from 'service/wallets'
import { useWallets } from 'hooks/useWallets'
import s from './index.module.css'

const enum IMPORT_TYPE {
    ADDRESS = 'address',
    PRIVATE_KEY = 'privateKey',
}

const SELECT_IMPORT_TYPE_OPTIONS: SelectOptions = [
    {
        ...EMPTY_OPTION,
        title: 'Import type',
    },
    {
        title: 'Private key (you owe funds)',
        value: IMPORT_TYPE.PRIVATE_KEY,
    },
    {
        title: 'Address (read-only)',
        value: IMPORT_TYPE.ADDRESS,
    },
]

export interface ImportWalletPageProps {}

export function ImportWalletPage({}: ImportWalletPageProps) {
    const wallets = useWallets()
    const { addWallet } = useAppActions()
    const [title, setTitle] = React.useState('')
    const [titleIndex, setTitleIndex] = React.useState(randomInteger(0, WALLET_TITLES.length - 1))
    const [importType, setImportType] = React.useState<IMPORT_TYPE>()
    const [ticker, setTicker] = React.useState<ChainTicker>(CHAIN_TICKER_ETH)
    const [privateKey, setPrivateKey] = React.useState('')
    const [address, setAddress] = React.useState('')

    const submit = (event: React.FormEvent) => {
        event.preventDefault()

        if (ticker !== CHAIN_TICKER_ETH) { return }

        const wallet = createWalletTemplate(ticker)

        wallet.title = title

        if (importType === IMPORT_TYPE.PRIVATE_KEY) {
            try {
                wallet.privateKey = privateKey
                wallet.address = getEthAddressFromPrivateKey(privateKey)
            } catch (error) {
                return window.alert('Something went wrong\n' + error)
            }
        } else if (importType === IMPORT_TYPE.ADDRESS) {
            wallet.address = address
        } else {
            return window.alert('Unknown import type')
        }

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

            <Select<IMPORT_TYPE>
                className={s.Input}
                options={SELECT_IMPORT_TYPE_OPTIONS}
                onChange={setImportType}
                selectAttrs={{
                    defaultValue: '',
                    required: true,
                }}
            />

            {importType === IMPORT_TYPE.PRIVATE_KEY && (
                <InputText
                    className={s.Input}
                    inputAttrs={{
                        placeholder: 'Private key',
                        required: true,
                        onChange: event => setPrivateKey(event.target.value),
                    }}
                />
            )}

            {importType === IMPORT_TYPE.ADDRESS && (
                <InputText
                    className={s.Input}
                    inputAttrs={{
                        placeholder: 'Address',
                        required: true,
                        onChange: event => setAddress(event.target.value),
                    }}
                />
            )}

            <Button
                className={s.Input}
                type="submit"
                text="Import"
                wide
            />
        </form>
    )
}
