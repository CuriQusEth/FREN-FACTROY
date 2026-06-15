import { useCapabilities } from 'wagmi';
import { baseSepolia, base } from 'wagmi/chains';
import { useMemo } from 'react';

export function useWalletCapabilities() {
  const { data: capabilities } = useCapabilities();

  const supportsBatching = useMemo(() => {
    const atomicSepolia = capabilities?.[baseSepolia.id]?.atomic;
    const atomicMainnet = capabilities?.[base.id]?.atomic;
    const statusSepolia = atomicSepolia?.status || '';
    const statusMainnet = atomicMainnet?.status || '';
    return statusSepolia === 'ready' || statusSepolia === 'supported' || statusMainnet === 'ready' || statusMainnet === 'supported';
  }, [capabilities]);

  const supportsPaymaster = useMemo(() => {
    return capabilities?.[baseSepolia.id]?.paymasterService?.supported === true || capabilities?.[base.id]?.paymasterService?.supported === true;
  }, [capabilities]);

  return { supportsBatching, supportsPaymaster };
}
