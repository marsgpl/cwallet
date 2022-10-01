# CWallet - Crypto Wallet

Non-custodial crypto wallet

## Features

- Stores all your data AES-encrypted, locally in your browser (localStorage)
- Does not send your data anywhere
- Does not gather any statistics, metrics
- All your data can be exported as encrypted backup and then imported on other devices
- UI is optimized for phones, tablets and desktops
- Open source - MIT License (however npm deps with different licenses are required - see package.json)
- Small codebase, easy to audit

## Live demo

<https://cwallet.marsgpl.com>

## Development

```bash
cd ~/projects
git clone git@github.com:marsgpl/cwallet.git
cd cwallet
nvm use
npm ci
npm start
```

## Production build

```bash
npm run build
```

## TODO

- popup
- balances saving
- global web3
- state management maybe
