// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./FrenToken.sol";
import "./FrenNFT.sol";

contract FrenFactory {
    FrenToken public token;
    FrenNFT public nft;

    mapping(address => uint256) public gooBalance;

    constructor(address _token, address _nft) {
        token = FrenToken(_token);
        nft = FrenNFT(_nft);
    }

    function produceGoo() external {
        // Player clicks to produce basic resource
        gooBalance[msg.sender] += 10;
    }

    function hatchFren(uint256 gooAmount) external {
        require(gooAmount >= 100, "Need at least 100 Goo");
        require(gooBalance[msg.sender] >= gooAmount, "Insufficient Goo");
        
        gooBalance[msg.sender] -= gooAmount;
        
        // Basic probability mock
        FrenNFT.Rarity rarity = FrenNFT.Rarity.Common;
        if (gooAmount > 500) {
            rarity = FrenNFT.Rarity.Rare;
        }
        
        nft.mintFren(msg.sender, rarity);
    }
}
