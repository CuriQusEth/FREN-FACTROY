// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FrenToken is ERC20, Ownable {
    mapping(address => uint256) public lastClaimTime;
    mapping(address => uint256) public stakeAmount;

    constructor() ERC20("Fren Token", "FREN") Ownable(msg.sender) {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function claimPassiveYield() external {
        // Mock logic for passive yield claim
        require(block.timestamp > lastClaimTime[msg.sender] + 1 days, "Can only claim once per day");
        uint256 yield = stakeAmount[msg.sender] * 1 ether / 100; // 1% daily yield
        
        lastClaimTime[msg.sender] = block.timestamp;
        _mint(msg.sender, yield);
    }
}
