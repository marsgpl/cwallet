export const ROUTE_ALL = '*'
export const ROUTE_INDEX = '/'
export const ROUTE_SUMMARY = '/summary'
export const ROUTE_CREATE_WALLET = '/wallet/new'
export const ROUTE_IMPORT_WALLET = '/wallet/import'
export const ROUTE_WALLET = '/wallet/:walletId'
export const ROUTE_TRANSFER = '/transfer/:walletId'

export type Route =
    | typeof ROUTE_ALL
    | typeof ROUTE_INDEX
    | typeof ROUTE_SUMMARY
    | typeof ROUTE_CREATE_WALLET
    | typeof ROUTE_IMPORT_WALLET
    | typeof ROUTE_WALLET

export function routeWallet(walletId: string) {
    return ROUTE_WALLET.replace(':walletId', walletId)
}

export function routeTransfer(fromWalletId: string) {
    return ROUTE_TRANSFER.replace(':walletId', fromWalletId)
}
