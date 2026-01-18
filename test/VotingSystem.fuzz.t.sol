// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console, StdUtils} from "forge-std/Test.sol";
import {VotingSystem} from "../src/VotingSystem.sol";

/**
 * @title VotingSystemFuzzTest
 * @notice Fuzz tests for the VotingSystem contract (open voting version)
 * @dev Tests edge cases and random inputs — no registration, no weights
 */
contract VotingSystemFuzzTest is Test {
    VotingSystem public votingSystem;
    
    address public ADMIN = makeAddr("admin");
    
    string public constant BASE_CANDIDATE_NAME = "Candidate";

    function setUp() public {
        vm.prank(ADMIN);
        votingSystem = new VotingSystem();
    }

    /*//////////////////////////////////////////////////////////////
                            FUZZ TESTS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Fuzz test: voting with random number of voters
     * @dev Each unique address votes at most once
     */
    function testFuzz_VotingWithRandomNumberOfVoters(uint256 numVoters) public {
        numVoters = bound(numVoters, 1, 120);

        vm.startPrank(ADMIN);
        votingSystem.addCandidate("Alice");
        votingSystem.addCandidate("Bob");
        votingSystem.startVoting(1 days);
        vm.stopPrank();

        uint256 votesFor1 = 0;
        uint256 votesFor2 = 0;

        // Use different addresses for each voter
        for (uint256 i = 0; i < numVoters; i++) {
            address voter = address(uint160(1000 + i)); // avoid collision with ADMIN etc.
            
            // 50/50 chance to vote for candidate 1 or 2
            uint256 candidateId = (i % 2 == 0) ? 1 : 2;

            vm.prank(voter);
            votingSystem.vote(candidateId);

            if (candidateId == 1) votesFor1++;
            else votesFor2++;
        }

        VotingSystem.Candidate memory c1 = votingSystem.getCandidate(1);
        VotingSystem.Candidate memory c2 = votingSystem.getCandidate(2);

        assertEq(c1.voteCount, votesFor1);
        assertEq(c2.voteCount, votesFor2);
        assertEq(c1.voteCount + c2.voteCount, numVoters);
    }

    /**
     * @notice Fuzz test: voting duration handling
     */
    function testFuzz_VotingDuration(uint256 duration) public {
        duration = bound(duration, 1 hours, 365 days);

        vm.startPrank(ADMIN);
        votingSystem.addCandidate("Test");
        votingSystem.startVoting(duration);
        vm.stopPrank();

        assertTrue(votingSystem.getVotingStatus());

        // Just before end → still active
        vm.warp(block.timestamp + duration - 1);
        assertTrue(votingSystem.getVotingStatus());

        // Just after end → inactive
        vm.warp(block.timestamp + 2);
        assertFalse(votingSystem.getVotingStatus());
    }

    /**
     * @notice Fuzz test: candidate name variations
     */
    function testFuzz_CandidateNames(string memory name1, string memory name2) public {
        vm.assume(bytes(name1).length > 0 && bytes(name1).length < 80);
        vm.assume(bytes(name2).length > 0 && bytes(name2).length < 80);
        vm.assume(keccak256(bytes(name1)) != keccak256(bytes(name2)));

        vm.startPrank(ADMIN);
        votingSystem.addCandidate(name1);
        votingSystem.addCandidate(name2);
        vm.stopPrank();

        VotingSystem.Candidate memory c1 = votingSystem.getCandidate(1);
        VotingSystem.Candidate memory c2 = votingSystem.getCandidate(2);

        assertEq(c1.name, name1);
        assertEq(c2.name, name2);
        assertEq(votingSystem.getCandidateCount(), 2);
    }

    /**
     * @notice Fuzz test: many candidates added
     */
    function testFuzz_MultipleCandidates(uint8 numCandidates) public {
        numCandidates = uint8(bound(numCandidates, 2, 60));

        vm.startPrank(ADMIN);

        for (uint256 i = 0; i < numCandidates; i++) {
            string memory name = string(abi.encodePacked(BASE_CANDIDATE_NAME, vm.toString(i + 1)));
            votingSystem.addCandidate(name);
        }

        vm.stopPrank();

        assertEq(votingSystem.getCandidateCount(), numCandidates);

        for (uint256 i = 1; i <= numCandidates; i++) {
            VotingSystem.Candidate memory c = votingSystem.getCandidate(i);
            assertTrue(c.exists);
            assertEq(c.id, i);
            assertEq(c.voteCount, 0);
        }
    }

    /**
     * @notice Fuzz test: random vote distribution → correct winner
     */
    function testFuzz_RandomVoteDistribution(uint256 seed) public {
        uint256 numVoters = bound(seed, 10, 80); // use seed to influence count a bit
        uint256 numCandidates = 5;

        vm.startPrank(ADMIN);
        
        for (uint256 i = 0; i < numCandidates; i++) {
            votingSystem.addCandidate(string(abi.encodePacked("Cand", vm.toString(i + 1))));
        }

        votingSystem.startVoting(2 days);
        vm.stopPrank();

        uint256[] memory voteCounts = new uint256[](numCandidates);

        for (uint256 i = 0; i < numVoters; i++) {
            address voter = address(uint160(2000 + i));
            
            // Pseudo-random candidate using seed + loop index
            uint256 candidateId = (uint256(keccak256(abi.encodePacked(seed, i))) % numCandidates) + 1;

            vm.prank(voter);
            votingSystem.vote(candidateId);

            voteCounts[candidateId - 1]++;
        }

        // Manual winner calculation
        uint256 maxVotes = 0;
        uint256 expectedWinner = 0;
        for (uint256 i = 0; i < numCandidates; i++) {
            if (voteCounts[i] > maxVotes) {
                maxVotes = voteCounts[i];
                expectedWinner = i + 1;
            }
        }

        (uint256 actualWinner, uint256 winnerVotes) = votingSystem.getWinner();
        
        assertEq(actualWinner, expectedWinner);
        assertEq(winnerVotes, maxVotes);
    }

    /**
     * @notice Fuzz test: remaining time calculation at random points
     */
    function testFuzz_RemainingTimeCalculation(uint256 duration, uint256 elapsed) public {
        duration = bound(duration, 1 hours, 90 days);
        elapsed  = bound(elapsed,  0, duration);

        vm.startPrank(ADMIN);
        votingSystem.addCandidate("TestCand");
        votingSystem.startVoting(duration);
        vm.stopPrank();

        vm.warp(block.timestamp + elapsed);

        uint256 remaining = votingSystem.getRemainingTime();
        uint256 expected   = (elapsed <= duration) ? duration - elapsed : 0;

        assertEq(remaining, expected);
    }

    /**
     * @notice Fuzz test: trying to vote after end (various warp amounts)
     */
    function testFuzz_VotingAfterEnd(uint256 extraTimeAfterEnd) public {
        extraTimeAfterEnd = bound(extraTimeAfterEnd, 1, 60 days);

        vm.startPrank(ADMIN);
        votingSystem.addCandidate("A");
        votingSystem.startVoting(2 days);
        vm.stopPrank();

        address voter = makeAddr("lateVoter");

        vm.warp(block.timestamp + 2 days + extraTimeAfterEnd);

        vm.prank(voter);
        vm.expectRevert(VotingSystem.VotingSystem__VotingNotActive.selector);
        votingSystem.vote(1);
    }
}