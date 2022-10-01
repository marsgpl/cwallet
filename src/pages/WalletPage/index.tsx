import React from 'react'
import Web3 from 'web3'
import { useNavigate, useParams } from 'react-router-dom'
import { useWallets } from 'hooks/useWallets'
import { useCopyValue } from 'hooks/useCopyValue'
import { Button } from 'components/Button'
import { routeTransfer } from 'defs/routes'
import { useWallet } from 'hooks/useWalletById'
import s from './index.module.css'

export interface WalletPageProps {
}

export function WalletPage({}: WalletPageProps) {
    const navigate = useNavigate()
    const copyValue = useCopyValue()
    const wallets = useWallets()
    const { walletId } = useParams()
    const wallet = useWallet(walletId, wallets)
    const [balance, setBalance] = React.useState<number>()

    if (!walletId || !wallet) {
        throw Error('Wallet not found')
    }

    const fetchBalance = async () => {
        const network = 'mainnet' // goerli, sepolia
        const apiKey = '61954c3098b54990ad4fa0e7b1323daa' // https://infura.io/dashboard
        const provider = new Web3.providers.HttpProvider(`https://${network}.infura.io/v3/${apiKey}`)
        const web3 = new Web3(provider)
        const defaultBlock = 'latest' // "earliest", "latest" , "pending", "safe", "finalized"
        const balanceWei = await web3.eth.getBalance(wallet.address, defaultBlock)
        const balanceEth = Web3.utils.fromWei(balanceWei, 'ether')
        setBalance(parseFloat(balanceEth))
    }

    return (
        <div className={s.Root}>
            ticker:
            &nbsp;
            <b>{wallet.ticker}</b>

            <br />
            <br />

            address:
            &nbsp;
            <b onClick={() => copyValue(wallet.address, 'Address copied')}>copy</b>

            <br />

            <a href={`https://etherscan.io/address/${wallet.address}`} target="_blank">
                view on etherscan
            </a>

            {wallet.privateKey && <>
                <br />
                <br />

                private key:
                &nbsp;
                <b onClick={() => copyValue(wallet.privateKey, 'Private key copied')}>copy</b>
            </>}

            <br />
            <br />

            balance:
            &nbsp;
            {balance === undefined ? '' : <b>{balance} ETH</b>}
            &nbsp;
            &nbsp;
            <Button text="fetch" onClick={fetchBalance} size="s" />

            {wallet.privateKey && <>
                <br />
                <br />

                <Button text="Transfer" onClick={() => navigate(routeTransfer(walletId))} />
            </>}
        </div>
    )
}
