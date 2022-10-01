import { Loader } from 'components/Loader'
import { useWallets } from 'hooks/useWallets'
import { useProviders } from 'hooks/useProviders'
import { InputText } from 'components/InputText'
import { useWeb3 } from 'hooks/useWeb3'
import { Button } from 'components/Button'
import { useAppActions } from 'hooks/useAppActions'
import { cn } from 'lib/cn'
import s from './index.module.css'
import React from 'react'

export interface SummaryPageProps {
}

export function SummaryPage({}: SummaryPageProps) {
    const wallets = useWallets()
    const providers = useProviders()
    const web3 = useWeb3()
    const { updateProvider } = useAppActions()
    const [web3Url, setWeb3Url] = React.useState(providers.web3 || '')

    const ready = wallets !== undefined

    if (!ready) {
        return (
            <div className={cn(s.Root, s.RootLoader)}>
                <Loader />
            </div>
        )
    }

    return (
        <div className={s.Root}>
            <div className={s.Row}>
                <div className={s.Key}>Wallets:</div>
                <div className={s.Value}>
                    {wallets?.length || 0}
                </div>
            </div>

            <div>
                <div>ETH provider (web3):</div>
                <div>Example: https://mainnet.infura.io/v3/61954c3098b54990ad4fa0e7b1323daa</div>
                <div>Register your key here: https://infura.io/dashboard (25000 requests/day for free)</div>

                <InputText
                    inputAttrs={{
                        placeholder: 'URL',
                        value: web3Url,
                        onChange: event => setWeb3Url(event.target.value),
                    }}
                />

                <Button
                    text="Update"
                    onClick={() => updateProvider('web3', web3Url)}
                />

                <div>
                    status: {web3 ? 'set' : 'unset'}
                </div>
            </div>
        </div>
    )
}
