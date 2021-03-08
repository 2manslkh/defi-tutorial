// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./Token.sol"; // let the bank know about the token

contract dBank {
    //assign Token contract to variable
    Token private token;

    //add mappings
    mapping(address => uint256) public etherBalanceOf;
    mapping(address => uint256) public depositStart;
    mapping(address => bool) public isDeposited;

    //add events
    event Deposit(address indexed user, uint256 etherAmount, uint256 timeStart);
    event Withdraw(
        address indexed user,
        uint256 etherAmount,
        uint256 timeStart
    );

    //pass as constructor argument deployed Token contract
    constructor(Token _token) public {
        //assign token deployed contract to variable
        token = _token;
    }

    function deposit() public payable {
        //check if msg.sender didn't already deposited funds
        require(
            isDeposited[msg.sender] == false,
            "ERROR: Deposit Already Active"
        );
        require(msg.value >= 1e16, "ERROR: Deposit Must be >= 0.01 ETH");
        //check if msg.value is >= than 0.01 ETH
        etherBalanceOf[msg.sender] = etherBalanceOf[msg.sender] + msg.value;

        //increase msg.sender ether deposit balance
        depositStart[msg.sender] = depositStart[msg.sender] + block.timestamp;
        //start msg.sender hodling time
        //set msg.sender deposit status to true
        isDeposited[msg.sender] = true;
        //emit Deposit event

        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    function withdraw() public {
        require(
            isDeposited[msg.sender] == true,
            "ERROR: Sender did not deposit any ETH"
        );
        //check if msg.sender deposit status is true
        //assign msg.sender ether deposit balance to variable for event
        //check user's hodl time
        uint256 depositTime = block.timestamp - depositStart[msg.sender];

        //calc interest per second
        uint256 interestPerSecond =
            31668017 * (etherBalanceOf[msg.sender] / 1e16);
        uint256 interest = interestPerSecond * depositTime;

        //calc accrued interest
        //send eth to user
        msg.sender.transfer(etherBalanceOf[msg.sender]);
        //send interest in tokens to user
        token.mint(msg.sender, interest);

        //reset depositer data
        depositStart[msg.sender] = 0;
        etherBalanceOf[msg.sender] = 0;
        isDeposited[msg.sender] = false;
        //emit event
    }

    function borrow() public payable {
        //check if collateral is >= than 0.01 ETH
        //check if user doesn't have active loan
        //add msg.value to ether collateral
        //calc tokens amount to mint, 50% of msg.value
        //mint&send tokens to user
        //activate borrower's loan status
        //emit event
    }

    function payOff() public {
        //check if loan is active
        //transfer tokens from user back to the contract
        //calc fee
        //send user's collateral minus fee
        //reset borrower's data
        //emit event
    }
}
