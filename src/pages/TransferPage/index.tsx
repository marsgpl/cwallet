import React from 'react'
import Web3 from 'web3'
import { useWallet } from 'hooks/useWalletById'
import { useWallets } from 'hooks/useWallets'
import { useParams } from 'react-router-dom'
import { InputText } from 'components/InputText'
import { Button } from 'components/Button'
import { TransactionConfig } from 'web3-core/types'
import { EMPTY_OPTION, Select, SelectOptions } from 'components/Select'
import { useWeb3 } from 'hooks/useWeb3'
import s from './index.module.css'
import { ETH_USDT_ABI, ETH_USDT_CONTRACT_ADDR, ETH_USDT_MULTIPLIER } from 'defs/eth'
import { Loader } from 'components/Loader'

const enum TRANSFER_TYPE {
    COIN = 'coin',
    TOKEN_USDT = 'token:usdt',
}

const SELECT_TRANSFER_TYPE_OPTIONS: SelectOptions = [
    {
        ...EMPTY_OPTION,
        title: 'What to transfer',
    },
    {
        title: 'ETH',
        value: TRANSFER_TYPE.COIN,
    },
    {
        title: 'USDT',
        value: TRANSFER_TYPE.TOKEN_USDT,
    },
]

export interface TransferPageProps {
}

export function TransferPage({}: TransferPageProps) {
    const { walletId } = useParams()
    const wallets = useWallets()
    const wallet = useWallet(walletId, wallets)
    const [toAddress, setToAddress] = React.useState('')
    const [amountToSend, setAmountToSend] = React.useState('')
    const [transferType, setTransferType] = React.useState('')
    const [rawTx, setRawTx] = React.useState<any>()
    const [txFee, setTxFee] = React.useState<string>()
    const [gasToUse, setGasToUse] = React.useState<string>()
    const web3 = useWeb3()
    const [sending, setSending] = React.useState(false)

    if (!walletId || !wallet) {
        throw Error('Wallet not found')
    }

    const submitForSend = async () => {
        try {
            if (!web3) { throw Error('Web3 is missing') }
            if (!rawTx) { throw Error('rawTx is missing') }

            const signed = await web3.eth.accounts.signTransaction(rawTx, wallet.privateKey)

            console.log('🔸 signed:', signed)

            if (!signed.rawTransaction) {
                throw Error('signing failed')
            }

            setSending(true)
            const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction)

            setSending(false)
            setRawTx(undefined)
            setTxFee(undefined)

            console.log('🔸 receipt:', receipt)
            window.alert('done. hash: ' + receipt.transactionHash)
        } catch (error) {
            console.error('🔺 error:', error)
            window.alert('Error:\n' + (error as any).message)
            setSending(false)
            setRawTx(undefined)
            setTxFee(undefined)
        }
    }

    const submitForPreview = async (event: React.FormEvent) => {
        event.preventDefault()

        if (transferType === TRANSFER_TYPE.COIN) {
            try {
                if (!web3) { throw Error('Web3 is missing') }

                const [
                    chainId,
                    txCount,
                    gasPrice,
                    gasRequired,
                ] = await Promise.all([
                    web3.eth.getChainId(),
                    web3.eth.getTransactionCount(wallet.address),
                    web3.eth.getGasPrice(),
                    web3.eth.estimateGas({
                        from: wallet.address,
                        to: toAddress,
                        value: Web3.utils.toWei(amountToSend, 'ether'),
                    }),
                ])

                console.log('🔸 chainId:', chainId)
                console.log('🔸 txCount:', txCount, typeof txCount)
                console.log('🔸 gasPrice:', gasPrice, typeof gasPrice)
                console.log('🔸 gasRequired:', gasRequired, typeof gasRequired)

                const tx: TransactionConfig = {
                    from: wallet.address,
                    to: toAddress,
                    value: Web3.utils.toWei(amountToSend, 'ether'),
                    gas: gasRequired,
                    gasPrice: Web3.utils.toHex(gasPrice),
                    nonce: txCount,
                    chainId,
                }

                const feeWei = BigInt(gasRequired) * BigInt(gasPrice)

                console.log('🔸 tx:', tx)
                console.log('🔸 feeWei:', feeWei)
                console.log('🔸 feeEth:', Web3.utils.fromWei(String(feeWei), 'ether'))

                setRawTx(tx)
                setTxFee(feeWei.toString())
            } catch (error) {
                console.error('🔺 error:', error)
                window.alert('Error:\n' + (error as any).message)
            }
        } else if (transferType === TRANSFER_TYPE.TOKEN_USDT) {
            try {
                if (!web3) { throw Error('Web3 is missing') }

                const [
                    chainId,
                    txCount,
                    gasPrice,
                ] = await Promise.all([
                    web3.eth.getChainId(),
                    web3.eth.getTransactionCount(wallet.address),
                    web3.eth.getGasPrice(),
                ])

                const gasRequired = parseInt(gasToUse || '') || 0

                console.log('🔸 chainId:', chainId)
                console.log('🔸 txCount:', txCount, typeof txCount)
                console.log('🔸 gasPrice:', gasPrice, typeof gasPrice)
                console.log('🔸 gasRequired:', gasRequired, typeof gasRequired)

                const contract = new web3.eth.Contract(ETH_USDT_ABI as any, ETH_USDT_CONTRACT_ADDR, {
                    from: wallet.address,
                    gasPrice,
                    gas: gasRequired,
                })

                const tx: TransactionConfig = {
                    from: wallet.address,
                    to: ETH_USDT_CONTRACT_ADDR,
                    value: 0x0,
                    gas: gasRequired,
                    gasPrice: Web3.utils.toHex(gasPrice),
                    data: contract.methods.transfer(toAddress, Math.ceil(parseFloat(amountToSend) * ETH_USDT_MULTIPLIER)).encodeABI(),
                    nonce: txCount,
                    chainId,
                }

                const feeWei = BigInt(gasRequired) * BigInt(gasPrice)

                console.log('🔸 contract:', contract)
                console.log('🔸 tx:', tx)
                console.log('🔸 feeWei:', feeWei)
                console.log('🔸 feeEth:', Web3.utils.fromWei(String(feeWei), 'ether'))

                setRawTx(tx)
                setTxFee(feeWei.toString())
            } catch (error) {
                console.error('🔺 error:', error)
                window.alert('Error:\n' + (error as any).message)
            }
        } else {
            window.alert('Error: transfer type not implemented')
        }
    }

    const renderFill = () => (
        <form onSubmit={submitForPreview}>
            <InputText
                className={s.Input}
                inputAttrs={{
                    readOnly: true,
                    required: true,
                    value: wallet.address,
                    placeholder: 'From address',
                }}
            />

            <InputText
                className={s.Input}
                inputAttrs={{
                    required: true,
                    value: toAddress,
                    placeholder: 'To address',
                    onChange: event => setToAddress(event.target.value)
                }}
            />

            <Select<TRANSFER_TYPE>
                className={s.Input}
                options={SELECT_TRANSFER_TYPE_OPTIONS}
                onChange={setTransferType}
                selectAttrs={{
                    defaultValue: '',
                    required: true,
                }}
            />

            {transferType === TRANSFER_TYPE.COIN && (
                <InputText
                    className={s.Input}
                    inputAttrs={{
                        required: true,
                        value: amountToSend,
                        placeholder: 'ETH amount to send',
                        onChange: event => setAmountToSend(event.target.value)
                    }}
                />
            )}

            {transferType === TRANSFER_TYPE.TOKEN_USDT && <>
                <InputText
                    className={s.Input}
                    inputAttrs={{
                        required: true,
                        value: amountToSend,
                        placeholder: 'USDT amount to send',
                        onChange: event => setAmountToSend(event.target.value)
                    }}
                />

                <InputText
                    className={s.Input}
                    inputAttrs={{
                        required: true,
                        value: gasToUse,
                        placeholder: 'Gas to use',
                        onChange: event => setGasToUse(event.target.value)
                    }}
                />
            </>}

            <Button
                type="submit"
                text="Preview"
                className={s.Input}
            />

            {sending && <>
                <div style={{marginTop:'20px'}}>
                    <Loader />
                </div>
                <div style={{marginTop:'20px'}}>
                    TX was sent, wait for completion
                </div>
            </>}
        </form>
    )

    const renderPreview = () => <>
        <code style={{display:'block',marginTop:'20px'}}>
            tx: {JSON.stringify(rawTx, null, 4)}
        </code>

        <br />

        fee:
        &nbsp;
        <b>{Web3.utils.fromWei(txFee || '0', 'ether')} ETH</b>

        <br />
        <br />

        <Button
            text="Sign and send"
            className={s.Input}
            onClick={submitForSend}
        />
    </>

    return (
        <div className={s.Root}>
            {renderFill()}
            {rawTx && renderPreview()}
        </div>
    )
}
