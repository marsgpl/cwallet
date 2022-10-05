import React from 'react'
import { useParams } from 'react-router-dom'
import { useWallets } from 'hooks/useWallets'
import { useCopyValue } from 'hooks/useCopyValue'
import { Button } from 'components/Button'
import { routeTransfer } from 'defs/routes'
import { useWallet } from 'hooks/useWalletById'
import { useNav } from 'hooks/useNav'
import { useWeb3 } from 'hooks/useWeb3'
import {
    ethTokenBalanceToString,
    fetchEthBalance,
    fetchEthTokenBalance,
    isEthWallet,
} from 'service/wallets/eth'
import { isTrxWallet } from 'service/wallets/trx'
import { useTron } from 'hooks/useTron'
import { CHAIN_TICKER_ETH, ETH_TOKEN_TICKER_USDT } from 'model/Chain/Eth'
import { DEFAULT_ERROR_MESSAGE } from 'defs/messages'
import { stringifyError } from 'lib/stringifyError'
import { Loader } from 'components/Loader'
import s from './index.module.css'

export interface WalletPageProps {
}

export function WalletPage({}: WalletPageProps) {
    const { goTo } = useNav()
    const copyValue = useCopyValue()
    const wallets = useWallets()
    const { walletId } = useParams()
    const wallet = useWallet(walletId, wallets)
    const web3 = useWeb3()
    const tron = useTron()
    const [balanceBusy, setBalanceBusy] = React.useState(false)
    const [balance, setBalance] = React.useState<{ value: string, ticker: string }[]>()

    React.useEffect(() => {
        setBalance(undefined)
    }, [walletId])

    if (!walletId || !wallet) {
        throw Error('Wallet not found')
    }

    const fetchBalance = async () => {
        setBalanceBusy(true)

        try {
            if (isEthWallet(wallet)) {
                const [eth, usdt] = await Promise.all([
                    fetchEthBalance(web3, wallet, 'pending'),
                    fetchEthTokenBalance(web3, wallet, ETH_TOKEN_TICKER_USDT),
                ])

                setBalance([
                    { value: eth, ticker: CHAIN_TICKER_ETH },
                    { value: ethTokenBalanceToString(usdt), ticker: ETH_TOKEN_TICKER_USDT },
                ])
            }

            if (isTrxWallet(wallet)) {
                console.log('🔸 tron balance:', 'TODO')
            }
        } catch (error) {
            console.error('🔺 error:', error)
            window.alert(DEFAULT_ERROR_MESSAGE + '\n' + stringifyError(error))
        }

        setBalanceBusy(false)
    }

    return (
        <div className={s.Root}>
            <div>
                ticker:
                {' '}
                <b>{wallet.ticker}</b>
            </div>

            <div className={s.PadTop}>
                address:
                {' '}

                {isEthWallet(wallet) && <>
                    <a
                        target="_blank"
                        href={`https://etherscan.io/address/${wallet.address}`}
                    >{wallet.address.substring(0, 10)}...</a>
                    {' '}
                    <Button
                        text="Copy"
                        bg="trans"
                        size="s"
                        onClick={() => copyValue(wallet.address, 'Address copied')}
                    />
                </>}

                {isTrxWallet(wallet) && <>
                    <a
                        target="_blank"
                        href={`https://tronscan.org/#/address/${wallet.address}`}
                    >{wallet.address.substring(0, 10)}...</a>
                    {' '}
                    <Button
                        text="Copy"
                        bg="trans"
                        size="s"
                        onClick={() => copyValue(wallet.address, 'Address copied')}
                    />
                </>}
            </div>

            {wallet.privateKey && (
                <div className={s.PadTop}>
                    private key:
                    {' '}
                    <Button
                        text="Copy"
                        bg="trans"
                        size="s"
                        onClick={() => copyValue(wallet.privateKey || '', 'Private key copied')}
                    />
                </div>
            )}

            <div className={s.PadTop}>
                balance:
                {' '}
                {balanceBusy ? (
                    <div className={s.BalanceLoader}>
                        <Loader mini />
                    </div>
                ) : <>
                    <Button
                        text="Refresh"
                        bg="trans"
                        onClick={fetchBalance}
                        size="s"
                    />
                </>}
            </div>

            {balance && (
                <div className={s.PadTopSm}>
                    {balance.map(b => (
                        <div>{b.value} <b>{b.ticker}</b></div>
                    ))}
                </div>
            )}

            {wallet.privateKey && (
                <div className={s.PadTop}>
                    <Button
                        text="Transfer"
                        onClick={() => goTo(routeTransfer(walletId))}
                    />
                </div>
            )}
        </div>
    )
}
