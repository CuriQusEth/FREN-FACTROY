import { useAccount, useConnect, useDisconnect, useSendTransaction } from 'wagmi'
import { Button } from '@/components/ui/button'
import { BUILDER_CODE } from '@/config'
import { toHex, encodeFunctionData } from 'viem'
import { FREN_FACTORY_ABI, FREN_FACTORY_ADDRESS } from '@/contracts'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, error } = useConnect()
  const { disconnect } = useDisconnect()

  const { sendTransaction } = useSendTransaction()

  if (isConnected) {
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
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          className="px-6 py-2 bg-[#0052FF] hover:bg-[#1a66ff] rounded-2xl font-bold text-sm border-b-4 border-blue-800 transition-all text-white flex items-center gap-2"
        >
          <span>🚀</span> Connect
        </button>
      ))}
      {error && <div className="text-red-400 mt-2 text-xs">{error.message}</div>}
    </div>
  )
}
