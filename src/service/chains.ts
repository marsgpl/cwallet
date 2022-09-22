import { EMPTY_OPTION, SelectOptions } from 'components/Select'
import { CHAINS } from 'defs/chains'

export function selectChainOptions(): SelectOptions {
    const options: SelectOptions = []

    options.push({
        ...EMPTY_OPTION,
        title: 'Select chain',
    })

    Object.values(CHAINS).forEach(chain => {
        options.push({
            title: `${chain.ticker} - ${chain.title}`,
            value: chain.ticker,
        })
    })

    return options
}
