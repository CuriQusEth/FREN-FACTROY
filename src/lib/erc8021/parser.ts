import { ERC8021_MARKER } from './constants';
import { Schema2Data } from './types';

export function parseAttributionSuffix(calldata: string) {
  if (!calldata.endsWith(ERC8021_MARKER)) return null;
  const noMarker = calldata.slice(0, -32);
  const schemaHex = noMarker.slice(-2);
  const schema = parseInt(schemaHex, 16);
  
  // Real implementation would unpack according to schema
  return {
    schema,
    markerFound: true,
  };
}
