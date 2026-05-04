import { useSendTransaction } from 'wagmi';
import { appendAttribution } from '../utils';
import { ERC8021Config } from '../types';

export function useERC8021Transaction(config: ERC8021Config) {
  const { sendTransaction, ...rest } = useSendTransaction();

  const sendERC8021Transaction = (args: Parameters<typeof sendTransaction>[0], options?: Parameters<typeof sendTransaction>[1]) => {
    const finalData = args.data ? appendAttribution(args.data, config) : appendAttribution('0x', config);
    return sendTransaction({ ...args, data: finalData }, options);
  };

  return { sendTransaction: sendERC8021Transaction, ...rest };
}
