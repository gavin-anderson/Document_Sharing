// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract DocumentSharing {
    mapping(address => mapping(uint256 => string)) public Ownership;
    mapping(string => mapping(address => bool)) public Accessible;

    modifier owner(string memory url, uint256 documentId) {
        require(
            keccak256(abi.encodePacked(Ownership[msg.sender][documentId])) ==
                keccak256(abi.encodePacked(url))
        );

        console.log("Original URL");
        console.log(Ownership[msg.sender][documentId]);
        console.log("Test URL");
        console.log(url);

        _;
    }

    modifier accesser(string memory url) {
        require(Accessible[url][msg.sender]);
        _;
    }

    function checkOwnership(string memory url, uint256 documentId)
        public
        view
        returns (bool)
    {
        console.log("---------------");
        console.log("Check Ownership");
        if (
            keccak256(abi.encodePacked(Ownership[msg.sender][documentId])) ==
            keccak256(abi.encodePacked(url))
        ) {
            console.log("This is the owner");
            return true;
        }
        console.log("This is not the owner");
        return false;
    }

    function checkAccess(string memory url) public view returns (bool) {
        console.log("---------------");
        console.log("Checking access");
        console.log(Accessible[url][msg.sender]);
        return Accessible[url][msg.sender];
    }

    function addAccess(
        address addy,
        string memory url,
        uint256 documentId
    ) public owner(url, documentId) {
        Accessible[url][addy] = true;
        console.log("---------------");
        console.log("Added access");
    }

    function removeAccess(
        address addy,
        string memory url,
        uint256 documentId
    ) external owner(url, documentId) {
        delete Accessible[url][addy];
        console.log("---------------");
        console.log("Removed access");
        console.log(Accessible[url][addy]);
    }

    function addOwnership(string memory url, uint256 documentId) external {
        console.log("Add ownership");
        Ownership[msg.sender][documentId] = url;
        addAccess(msg.sender, url, documentId);
        console.log("---------------");
        console.log("Finished add ownership");
    }

    function removeOwnership(string memory url, uint256 documentId)
        public
        owner(url, documentId)
    {
        delete Ownership[msg.sender][documentId];
        console.log("Removed Owner");
    }

    function transferOwnership(
        address addy,
        string memory url,
        uint256 documentId
    ) external owner(url, documentId) {
        removeOwnership(url, documentId);
        Ownership[addy][documentId] = url;
        console.log("---------------");
        console.log("Transfered ownership");
    }
}
