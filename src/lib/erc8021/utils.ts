import { ERC8021Config } from './types';
import { ERC8021_MARKER } from './constants';

export const stringToHex = (str: string) => 
  str.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');

export const numberToHex = (num: number, byteLength = 1) => 
  num.toString(16).padStart(byteLength * 2, '0');

export function generateAttributionSuffix(config: ERC8021Config): `0x${string}` {
  const schema = config.schema ?? 0;
  let suffixBytes = '';

  if (schema === 0) {
    const codes = [config.code, ...(config.additionalCodes || [])].join(',');
    const codesHex = stringToHex(codes);
    const codesLengthHex = numberToHex(codes.length, 1);
    const schemaIdHex = '00';
    suffixBytes = `${codesHex}${codesLengthHex}${schemaIdHex}${ERC8021_MARKER}`;
  } else if (schema === 1) {
    const codes = [config.code, ...(config.additionalCodes || [])].join(',');
    const codesHex = stringToHex(codes);
    const codesLengthHex = numberToHex(codes.length, 1);
    
    const regChainHex = numberToHex(config.registryChainId || 8453, 4); // simplistic
    const regChainLenHex = numberToHex(regChainHex.length / 2, 1);
    const regAddrHex = config.registryAddress?.replace('0x', '') || '0000000000000000000000000000000000000000';
    
    const schemaIdHex = '01';
    suffixBytes = `${regAddrHex}${regChainLenHex}${regChainHex}${codesHex}${codesLengthHex}${schemaIdHex}${ERC8021_MARKER}`;
  } else if (schema === 2) {
    // simplified CBOR mock - in production use a real CBOR encoder
    const cborStr = JSON.stringify({ a: config.code, ...config.schema2Data });
    const cborHex = stringToHex(cborStr);
    const cborLenHex = numberToHex(cborHex.length / 2, 2);
    const schemaIdHex = '02';
    suffixBytes = `${cborHex}${cborLenHex}${schemaIdHex}${ERC8021_MARKER}`;
  }

  return `0x${suffixBytes}` as `0x${string}`;
}

export function appendAttribution(calldata: string, config: ERC8021Config): `0x${string}` {
  const cleanCalldata = calldata.startsWith('0x') ? calldata.slice(2) : calldata;
  const suffix = generateAttributionSuffix(config).slice(2);
  return `0x${cleanCalldata}${suffix}` as `0x${string}`;
}
