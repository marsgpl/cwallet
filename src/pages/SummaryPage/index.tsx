import React from 'react'
import { Loader } from 'components/Loader'
import { useWallets } from 'hooks/useWallets'
import { useProviders } from 'hooks/useProviders'
import { InputText } from 'components/InputText'
import { useWeb3 } from 'hooks/useWeb3'
import { Button } from 'components/Button'
import { useAppActions } from 'hooks/useAppActions'
import { cn } from 'lib/cn'
import s from './index.module.css'
import { Icon } from 'components/Icon'

const WEB3_EXAMPLE = 'https://mainnet.infura.io/v3/61954c3098b54990ad4fa0e7b1323daa'

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
                <div className={s.RowKey}>Wallets:</div>
                <div className={s.RowValue}>
                    {wallets?.length || 0}
                </div>
            </div>

            <div className={s.Providers}>
                <div className={s.ProvidersTitle}>Data providers:</div>

                <div className={s.Provider}>
                    <div className={s.ProviderTitle}>ETH (web3):</div>

                    <div className={s.ProviderDescr}>
                        How to get the url:
                        <br />
                        <ol>
                            <li>Register: <a href="https://infura.io/" target="_blank">https://infura.io/</a></li>
                            <li>Go to dashboard: <a href="https://infura.io/dashboard" target="_blank">https://infura.io/dashboard</a></li>
                            <li>Create new key, network: Web3 API</li>
                            <li>
                                Compose url by the template:
                                {' '}
                                <b>https://$NETWORK.infura.io/v3/$YOUR_KEY</b>
                                <br />
                                Where <b>$NETWORK</b> is <b>mainnet</b> for main network,
                                <br />
                                and <b>$YOUR_KEY</b> is your api key you just received.
                            </li>
                        </ol>
                    </div>

                    <div className={s.ProviderDescr}>
                        Example:
                        {' '}
                        {WEB3_EXAMPLE}
                        {' '}
                        <Button text="Use" size="s" onClick={() => {
                            setWeb3Url(WEB3_EXAMPLE)
                            updateProvider('web3', WEB3_EXAMPLE)
                        }} />
                    </div>

                    <InputText
                        className={s.ProviderInput}
                        inputAttrs={{
                            placeholder: 'URL',
                            value: web3Url,
                            onChange: event => setWeb3Url(event.target.value),
                        }}
                    />

                    <div className={s.ProviderButtons}>
                        <Button
                            className={s.ProviderButtonsButton}
                            text="Set web3"
                            onClick={() => updateProvider('web3', web3Url)}
                        />

                        <div className={s.ProviderButtonsStatus}>
                            status: {web3 ? 'set' : 'unset'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
