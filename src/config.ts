import { http, createConfig, createStorage, cookieStorage } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { baseAccount, injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    injected(),
    baseAccount({ 
      appName: 'Fren Factory',
    }),
    coinbaseWallet({ appName: 'Fren Factory' }),
    walletConnect({ projectId: '50e051c720619717cb4587ece23b72b9' }) // using a public placeholder
  ],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
})

export const BUILDER_CODE = "bc_i3cpa0pz";
