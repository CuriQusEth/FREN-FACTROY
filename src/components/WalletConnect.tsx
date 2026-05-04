import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { SignInWithBase } from './SignInWithBase'

export function WalletConnect() {
  const { address, status } = useAccount()
  const { connect, connectors, error } = useConnect()
  const { disconnect } = useDisconnect()

  if (status === 'connected') {
    return (
      <div className="flex items-center gap-3">
        <button className="px-6 py-2 bg-[#0052FF] hover:bg-[#1a66ff] rounded-2xl font-bold text-sm border-b-4 border-blue-800 transition-all font-mono text-white">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </button>
        <button className="text-white/50 hover:text-white text-xs underline" onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      {connectors.map((connector) => {
        if (connector.name === 'Base Account') {
          return <SignInWithBase key={connector.uid} connector={connector} />
        } else {
          return (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-2xl font-bold text-sm border-b-4 border-white/20 transition-all text-white flex items-center gap-2"
            >
              {connector.name}
            </button>
          )
        }
      })}
      {error && <div className="text-red-400 mt-2 text-xs absolute right-0 top-16">{error.message}</div>}
    </div>
  )
}
