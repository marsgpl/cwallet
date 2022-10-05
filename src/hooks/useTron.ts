import React from 'react'
import TronWeb from 'tronweb'
import { useProviders } from 'hooks/useProviders'

export function useTron() {
    const { tron } = useProviders()

    return React.useMemo(() => {
        if (tron) {
            const { HttpProvider } = TronWeb.providers

            const fullNode = new HttpProvider(tron.fullNode)
            const solidityNode = new HttpProvider(tron.solidityNode)
            const eventServer = new HttpProvider(tron.eventServer)

            const tronWeb = new TronWeb(
                fullNode,
                solidityNode,
                eventServer,
            )

            return tronWeb
        } else {
            return null
        }
    }, [tron])
}
