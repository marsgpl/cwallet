import React from 'react'
import { Select } from 'components/Select'
import { ChainTicker } from 'model/Chain'
import { selectChainOptions } from 'service/chains'
import s from './index.module.css'

export interface CreateWalletPageProps {
}

export function CreateWalletPage({}: CreateWalletPageProps) {
    const [chainTicker, setChainTicker] = React.useState<ChainTicker>()

    return (
        <div className={s.Root}>
            <div className={s.Title}>
                Create wallet
            </div>

            <Select<ChainTicker>
                className={s.Select}
                options={selectChainOptions()}
                onChange={setChainTicker}
                selectAttrs={{
                    required: true,
                }}
            />
        </div>
    )
}
