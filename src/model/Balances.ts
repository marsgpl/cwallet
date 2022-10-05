export interface Balance {
    [ticker: string]: {
        busy?: boolean
        value?: string
        ts?: number
    }
}

export interface Balances {
    [walletId: string]: Balance
}
