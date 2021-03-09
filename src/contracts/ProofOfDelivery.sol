// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ProofOfDelivery {
    //add mappings
    mapping(address => address) public senderMap;
    mapping(address => address) public receiverMap;

    //add minter changed event
    event itemSent(address indexed from, address to);
    event itemReceived(address indexed from, address to);

    constructor() {
        //assign token deployed contract to variable
    }

    function sendTo(address receiver) public returns (bool) {
        senderMap[msg.sender] = receiver;
        receiverMap[receiver] = msg.sender;

        emit itemSent(msg.sender, receiver);
        return true;
    }

    //Add pass minter role function

    function receive(address sender) public returns (bool) {
        //check if msg.sender have minter role
        require(
            sender == receiverMap[msg.sender],
            "This package is not for this address"
        );

        emit itemReceived(sender, msg.sender);
        return true;
    }
}
