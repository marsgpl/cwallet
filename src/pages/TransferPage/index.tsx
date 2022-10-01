import React from 'react'
import Web3 from 'web3'
import { useWallet } from 'hooks/useWalletById'
import { useWallets } from 'hooks/useWallets'
import { useParams } from 'react-router-dom'
import { InputText } from 'components/InputText'
import { Button } from 'components/Button'
import { TransactionConfig } from 'web3-core/types'
import s from './index.module.css'
import { EMPTY_OPTION, Select, SelectOptions } from 'components/Select'

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

    if (!walletId || !wallet) {
        throw Error('Wallet not found')
    }

    const submitForSend = async () => {
        try {
            if (!rawTx) {
                throw Error('no tx')
            }

            const network = 'mainnet' // goerli, sepolia
            const apiKey = '61954c3098b54990ad4fa0e7b1323daa' // https://infura.io/dashboard
            const provider = new Web3.providers.HttpProvider(`https://${network}.infura.io/v3/${apiKey}`)
            const web3 = new Web3(provider)

            const signed = await web3.eth.accounts.signTransaction(rawTx, wallet.privateKey)

            console.log('🔸 signed:', signed)

            if (!signed.rawTransaction) {
                throw Error('signing failed')
            }

            const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction)

            console.log('🔸 receipt:', receipt)

            window.alert('done. hash: ' + receipt.transactionHash)
        } catch (error) {
            console.error('🔺 error:', error)
            window.alert('Error:\n' + (error as any).message)
        }
    }

    const submitForPreview = async (event: React.FormEvent) => {
        event.preventDefault()

        const network = 'mainnet' // goerli, sepolia
        const apiKey = '61954c3098b54990ad4fa0e7b1323daa' // https://infura.io/dashboard
        const provider = new Web3.providers.HttpProvider(`https://${network}.infura.io/v3/${apiKey}`)
        const web3 = new Web3(provider)

        if (transferType === TRANSFER_TYPE.COIN) {
            try {
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

                const abiJson = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_upgradedAddress","type":"address"}],"name":"deprecate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"deprecated","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_evilUser","type":"address"}],"name":"addBlackList","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"upgradedAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maximumFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_maker","type":"address"}],"name":"getBlackListStatus","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newBasisPoints","type":"uint256"},{"name":"newMaxFee","type":"uint256"}],"name":"setParams","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"issue","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"redeem","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"basisPointsRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isBlackListed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_clearedUser","type":"address"}],"name":"removeBlackList","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_UINT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_blackListedUser","type":"address"}],"name":"destroyBlackFunds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_initialSupply","type":"uint256"},{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"Issue","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"Redeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAddress","type":"address"}],"name":"Deprecate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"feeBasisPoints","type":"uint256"},{"indexed":false,"name":"maxFee","type":"uint256"}],"name":"Params","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_blackListedUser","type":"address"},{"indexed":false,"name":"_balance","type":"uint256"}],"name":"DestroyedBlackFunds","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_user","type":"address"}],"name":"AddedBlackList","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_user","type":"address"}],"name":"RemovedBlackList","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"}]
                const contractAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7' // USDT

                const contract = new web3.eth.Contract(abiJson as any, contractAddress, {
                    from: wallet.address,
                    gasPrice,
                    gas: gasRequired,
                })

                const tx: TransactionConfig = {
                    from: wallet.address,
                    to: contractAddress,
                    value: 0x0,
                    gas: gasRequired,
                    gasPrice: Web3.utils.toHex(gasPrice),
                    data: contract.methods.transfer(toAddress, parseFloat(amountToSend)).encodeABI(),
                    nonce: txCount,
                    chainId,
                }

                const feeWei = BigInt(gasRequired) * BigInt(gasPrice)

                const balance = await contract.methods.balanceOf(wallet.address).call()

                console.log('🔸 balance:', balance)
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
            text="Confirm and send"
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
