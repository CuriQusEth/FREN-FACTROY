import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    coinbaseWallet({ 
      appName: 'Fren Factory',
      preference: 'all'
    })
  ],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
})

export const BUILDER_CODE = "bc_i3cpa0pz";
