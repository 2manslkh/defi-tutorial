// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    //add minter variable
    address public minter;

    //add minter changed event
    event MinterChanged(address indexed from, address to);

    constructor() payable ERC20("Kenk", "Kenk") {
        //asign initial minter
        minter = msg.sender;
    }

    function passMinterRole(address dBank) public returns (bool) {
        require(
            msg.sender == minter,
            "Error, only current minter can pass minter role"
        );
        minter = dBank;

        emit MinterChanged(msg.sender, dBank);
        return true;
    }

    //Add pass minter role function

    function mint(address account, uint256 amount) public {
        //check if msg.sender have minter role
        require(msg.sender == minter, "Error, account is not the minter");
        _mint(account, amount);
    }
}
