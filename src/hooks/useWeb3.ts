import React from 'react'
import Web3 from 'web3'
import { useProviders } from 'hooks/useProviders'

export function useWeb3() {
    const { web3: url } = useProviders()

    return React.useMemo(() => {
        if (url) {
            const provider = new Web3.providers.HttpProvider(url)
            const web3 = new Web3(provider)

            return web3
        } else {
            return null
        }
    }, [url])
}
