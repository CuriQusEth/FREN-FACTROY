import { ERC8021_MARKER } from './constants';

export function hasERC8021Marker(calldata: string): boolean {
  return calldata.endsWith(ERC8021_MARKER);
}

export function validateSchema(calldata: string, expectedSchema: number): boolean {
  if (!hasERC8021Marker(calldata)) return false;
  const withoutMarker = calldata.slice(0, -32);
  const schemaHex = withoutMarker.slice(-2);
  return parseInt(schemaHex, 16) === expectedSchema;
}
