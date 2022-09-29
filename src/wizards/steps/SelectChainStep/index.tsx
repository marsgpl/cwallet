import React from 'react'
import { Button } from 'components/Button'
import { Select } from 'components/Select'
import { ChainTicker, CHAIN_TICKER_ETH } from 'model/Chain'
import { selectChainOptions } from 'service/chains'
import s from './index.module.css'

export interface SelectChainStepFormData {
    ticker: ChainTicker
}

export interface SelectChainStepProps {
    onSubmit: (data: SelectChainStepFormData) => void
}

export function SelectChainStep({
    onSubmit,
}: SelectChainStepProps) {
    const [ticker, setTicker] = React.useState<ChainTicker>(CHAIN_TICKER_ETH)

    const submit = (event: React.FormEvent) => {
        event.preventDefault()

        if (!ticker) { return }

        onSubmit({
            ticker,
        })
    }

    return (
        <form
            className={s.Root}
            onSubmit={submit}
        >
            <Select<ChainTicker>
                className={s.Input}
                options={selectChainOptions()}
                onChange={setTicker}
                selectAttrs={{
                    defaultValue: ticker,
                    required: true,
                }}
            />

            <Button
                className={s.Input}
                type="submit"
                text="Next"
                wide
            />
        </form>
    )
}
