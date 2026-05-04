# Batch Wizard 🧙‍♂️✨

A magical, fully on-chain Web3 clicker experience integrating modern Base Ecosystem tools! Players generate Goo, hatch magical creatures, and submit high scores permanently to the Base Mainnet.

## Core Features ✨
- **ERC-8021 Transaction Attribution:** Full native integration with Schema 0, 1, and 2. All on-chain actions use the code `batchwizard`.
- **Smart Wallet & Wagmi:** Effortlessly connect via **Base Account** with a unified Wagmi setup.
- **SIWE Integration:** Authenticate your wallet and sign your highest score directly off-chain or on-chain using a verifiable SIWE message!
- **Say GM Button:** Execute an official "Say GM" 0 ETH transaction securely to yourself, with `batchwizard` attribution attached.
- **Mobile-First PWA:** Crafted responsive layout perfect for mobile Smart Wallets.
- **Idle Clicker Mechanics:** Tap to produce Goo and construct a factory!
- **Merge & Evolve:** Hatch frens and combine them into Legendary and Mythic monsters!

## ERC-8021 Integration Hub
The codebase includes a fully-functional, robust **ERC-8021 Integration Template** located in `/src/lib/erc8021`:
- Custom React Hooks: `useERC8021Transaction` and `useERC8021BatchTransaction` natively append `batchwizard` tags seamlessly on Wagmi configurations.
- Validation, Parsing, and Utilities standard-ready.

## Tech Stack 🛠️
- React + Vite
- Wagmi v2 + Viem
- `@base-org/account` and `@base-org/account-ui` integration
- Tailwind CSS v4 + Framer Motion
- Complete SIWE architecture

## Getting Started 🚀
1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Game Mechanics 🧬
1. **Produce Goo:** Click the 💧 button to generate Goo directly to your balance.
2. **Submit High Score:** Hit "Submit SIWE High Score 🏅" to sign a message and attest your achievements!
3. **Say GM:** Use the "Say GM On-Chain! ☀️" button to send an on-chain transaction completely safely.

## Deployment
This app can be deployed to Vercel, Netlify, or any static hosting service. Thanks to Vite, the build process is lightning fast.
