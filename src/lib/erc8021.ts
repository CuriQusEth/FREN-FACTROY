import { stringToHex, toHex } from 'viem';

export const ERC8021_MARKER = '80218021802180218021802180218021';

export function generateSchema0Suffix(builderCode: string): `0x${string}` {
  const codeHex = stringToHex(builderCode).replace('0x', '');
  const lengthHex = toHex(builderCode.length, { size: 1 }).replace('0x', '');
  const schemaHex = '00';
  
  return `0x${codeHex}${lengthHex}${schemaHex}${ERC8021_MARKER}`;
}

export function appendERC8021(calldata: string, builderCode: string): `0x${string}` {
  const suffix = generateSchema0Suffix(builderCode).replace('0x', '');
  const cleanData = calldata.startsWith('0x') ? calldata.slice(2) : calldata;
  return `0x${cleanData}${suffix}`;
}
