// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FrenNFT is ERC721Enumerable, Ownable {
    uint256 private _nextTokenId;

    enum Rarity { Common, Rare, Epic, Legendary, Mythic }

    struct Fren {
        Rarity rarity;
        uint256 level;
        uint256 gooProductionRate;
    }

    mapping(uint256 => Fren) public frens;

    constructor() ERC721("Fren NFT", "FRENFT") Ownable(msg.sender) {}

    function mintFren(address to, Rarity rarity) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);
        
        uint256 productionRate = (uint256(rarity) + 1) * 10;
        
        frens[tokenId] = Fren({
            rarity: rarity,
            level: 1,
            gooProductionRate: productionRate
        });
        
        return tokenId;
    }

    function mergeFrens(uint256 tokenId1, uint256 tokenId2) external {
        require(ownerOf(tokenId1) == msg.sender, "Not owner");
        require(ownerOf(tokenId2) == msg.sender, "Not owner");
        require(frens[tokenId1].rarity == frens[tokenId2].rarity, "Must be same rarity");
        
        _burn(tokenId1);
        _burn(tokenId2);
        
        Rarity nextRarity = Rarity(uint256(frens[tokenId1].rarity) + 1);
        if (uint256(nextRarity) > uint256(Rarity.Mythic)) {
            nextRarity = Rarity.Mythic;
        }

        uint256 newTokenId = _nextTokenId++;
        _mint(msg.sender, newTokenId);
        
        frens[newTokenId] = Fren({
            rarity: nextRarity,
            level: 1,
            gooProductionRate: (uint256(nextRarity) + 1) * 10
        });
    }
}
