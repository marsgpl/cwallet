import React from 'react'
import { Select } from 'components/Select'
import { ChainTicker } from 'model/Chain'
import { selectChainOptions } from 'service/chains'
import s from './index.module.css'

export interface ImportWalletPageProps {
}

export function ImportWalletPage({}: ImportWalletPageProps) {
    const [chainTicker, setChainTicker] = React.useState<ChainTicker>()

    return (
        <div className={s.Root}>
            <div className={s.Title}>
                Import wallet
            </div>

            <Select<ChainTicker>
                options={selectChainOptions()}
                onChange={setChainTicker}
            />
        </div>
    )
}
