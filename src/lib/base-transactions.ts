import { useSendCalls, useSendTransaction, useAccount } from 'wagmi';
import { useWalletCapabilities } from './wallet-capabilities';
import { appendERC8021, generateSchema0Suffix } from './erc8021';
import { BUILDER_CODE } from '@/config';
import { eventDispatcher } from './game-events';

export function useGameTransaction() {
  const { address } = useAccount();
  const { supportsBatching } = useWalletCapabilities();
  const sendCallsObj = useSendCalls();
  const sendTxObj = useSendTransaction();

  const execute = async (to: `0x${string}`, data: `0x${string}`, value?: bigint) => {
    eventDispatcher.dispatch('transaction_initiated', { to, hasValue: !!value, isBatch: supportsBatching });
    
    if (supportsBatching) {
      // Smart Wallet - useSendCalls with dataSuffix capability
      const suffixHex = generateSchema0Suffix(BUILDER_CODE);
      sendCallsObj.sendCalls({
        calls: [{ to, data, value }],
        capabilities: {
          dataSuffix: {
            value: suffixHex,
            optional: true
          }
        }
      });
    } else {
      // EOA - append suffix manually via useSendTransaction
      const finalData = appendERC8021(data, BUILDER_CODE);
      sendTxObj.sendTransaction({
        to,
        data: finalData,
        value
      });
    }
  };

  return {
    execute,
    isPending: sendCallsObj.isPending || sendTxObj.isPending
  };
}
