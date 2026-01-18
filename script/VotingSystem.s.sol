// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {VotingSystem} from "../src/VotingSystem.sol";

contract DeployVotingSystem is Script {
    function run() external returns (VotingSystem) {
        vm.startBroadcast();
        VotingSystem votingSystem = new VotingSystem();
        vm.stopBroadcast();

        console.log("VotingSystem deployed at:", address(votingSystem));
        console.log("Admin address:", votingSystem.getAdmin());

        return votingSystem;
    }
}