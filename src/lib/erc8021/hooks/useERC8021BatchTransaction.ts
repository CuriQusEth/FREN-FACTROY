import { useSendCalls } from 'wagmi';
import { generateAttributionSuffix } from '../utils';
import { ERC8021Config } from '../types';

export function useERC8021BatchTransaction(config: ERC8021Config) {
  const { sendCalls, ...rest } = useSendCalls();

  const sendERC8021Calls = (args: Parameters<typeof sendCalls>[0], options?: Parameters<typeof sendCalls>[1]) => {
    const dataSuffix = generateAttributionSuffix(config);
    
    // Add capability for dataSuffix
    const capabilities = {
      ...(args.capabilities || {}),
      dataSuffix: {
        value: dataSuffix,
        optional: true
      }
    };
    
    return sendCalls({ ...args, capabilities }, options);
  };

  return { sendCalls: sendERC8021Calls, ...rest };
}
