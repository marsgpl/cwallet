import React from 'react'
import { ChainTicker, CHAIN_TICKER_ETH } from 'model/Chain'
import { Wallet } from 'model/Wallet'
import { InputText } from 'components/InputText'
import { EMPTY_OPTION, Select, SelectOptions } from 'components/Select'
import { Button } from 'components/Button'
import { createWalletTemplate, getEthAddressFromPrivateKey, getWalletById, getWalletId, isInvalidWallet } from 'service/wallets'
import { useNavigate } from 'react-router-dom'
import s from './index.module.css'
import { ROUTE_SUMMARY } from 'defs/routes'
import { useWallets } from 'hooks/useWallets'

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

export interface InputWalletStepFormData {
    wallet: Wallet
}

export interface InputWalletStepProps {
    ticker: ChainTicker
    onSubmit: (data: InputWalletStepFormData) => void
}

export function InputWalletStep({
    ticker,
    onSubmit,
}: InputWalletStepProps) {
    const navigate = useNavigate()
    const wallets = useWallets()
    const [importType, setImportType] = React.useState<IMPORT_TYPE>(IMPORT_TYPE.PRIVATE_KEY)
    const [privateKey, setPrivateKey] = React.useState('')
    const [address, setAddress] = React.useState('')

    const submit = (event: React.FormEvent) => {
        event.preventDefault()

        if (ticker !== CHAIN_TICKER_ETH) { return }

        const wallet = createWalletTemplate(ticker)

        if (importType === IMPORT_TYPE.PRIVATE_KEY) {
            if (!privateKey) { return }

            try {
                wallet.privateKey = privateKey
                wallet.address = getEthAddressFromPrivateKey(privateKey)
            } catch (error) {
                console.error('🔺 error:', error)
                return window.alert('Something went wrong\n' + error)
            }
        } else if (importType === IMPORT_TYPE.ADDRESS) {
            if (!address) { return }

            wallet.address = address
        } else {
            return
        }

        if (isInvalidWallet(wallet)) {
            navigate(ROUTE_SUMMARY)
            return window.alert('Wallet is invalid')
        }

        if (getWalletById(wallets, getWalletId(wallet))) {
            navigate(ROUTE_SUMMARY)
            return window.alert('Wallet is already added')
        }

        onSubmit({
            wallet,
        })
    }

    return (
        <form
            className={s.Root}
            onSubmit={submit}
        >
            <Select<IMPORT_TYPE>
                className={s.Input}
                options={SELECT_IMPORT_TYPE_OPTIONS}
                onChange={setImportType}
                selectAttrs={{
                    defaultValue: importType,
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
                text="Next"
                wide
            />
        </form>
    )
}
