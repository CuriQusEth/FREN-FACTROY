export const FREN_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000001";
export const FREN_NFT_ADDRESS = "0x0000000000000000000000000000000000000002";
export const FREN_FACTORY_ADDRESS = "0x0000000000000000000000000000000000000003";

// Minimal ABIs for the game interactions
export const FREN_TOKEN_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimPassiveYield",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const FREN_NFT_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId1", "type": "uint256" }, { "internalType": "uint256", "name": "tokenId2", "type": "uint256" }],
    "name": "mergeFrens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const FREN_FACTORY_ABI = [
  {
    "inputs": [],
    "name": "produceGoo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "gooAmount", "type": "uint256" }],
    "name": "hatchFren",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
