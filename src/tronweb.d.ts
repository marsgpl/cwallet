declare module 'tronweb' {
    export interface TronWebAccount {
        address: {
            base58: string
            hex: string
        }
        privateKey: string
        publicKey: string
    }

    export default class TronWeb {
        constructor(
            fullNode: string,
            solidityNode: string,
            eventServer: string,
        ) {}

        static createAccount(): Promise<TronWebAccount>
        static isAddress(address: string): boolean

        static address = {
            fromPrivateKey: (privateKey: string) => string
        }

        static providers = {
            HttpProvider: unknown
        }
    }
}
