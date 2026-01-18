// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {VotingSystem} from "../src/VotingSystem.sol";

contract VotingSystemTest is Test {
    VotingSystem public votingSystem;
    
    address public ADMIN = makeAddr("admin");
    address public VOTER1 = makeAddr("voter1");
    address public VOTER2 = makeAddr("voter2");
    address public VOTER3 = makeAddr("voter3");
    
    uint256 public constant VOTING_DURATION = 1 days;
    string public constant CANDIDATE1_NAME = "Alice";
    string public constant CANDIDATE2_NAME = "Bob";

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/
    event CandidateAdded(uint256 indexed candidateId, string name);
    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event VotingStarted(uint256 startTime, uint256 endTime);
    event VotingEnded(uint256 endTime);

    function setUp() public {
        vm.prank(ADMIN);
        votingSystem = new VotingSystem();
    }

    /*//////////////////////////////////////////////////////////////
                           CONSTRUCTOR TESTS
    //////////////////////////////////////////////////////////////*/
    function test_ConstructorSetsAdmin() public view {
        assertEq(votingSystem.getAdmin(), ADMIN);
    }

    /*//////////////////////////////////////////////////////////////
                        ADD CANDIDATE TESTS
    //////////////////////////////////////////////////////////////*/
    function test_AdminCanAddCandidate() public {
        vm.prank(ADMIN);
        vm.expectEmit(true, false, false, true);
        emit CandidateAdded(1, CANDIDATE1_NAME);
        votingSystem.addCandidate(CANDIDATE1_NAME);
        
        VotingSystem.Candidate memory candidate = votingSystem.getCandidate(1);
        assertEq(candidate.name, CANDIDATE1_NAME);
        assertEq(candidate.voteCount, 0);
        assertTrue(candidate.exists);
    }

    function test_RevertWhen_NonAdminAddsCandidate() public {
        vm.prank(VOTER1);
        vm.expectRevert(VotingSystem.VotingSystem__NotAdmin.selector);
        votingSystem.addCandidate(CANDIDATE1_NAME);
    }

    function test_RevertWhen_AddingCandidateAfterVotingStarts() public {
        vm.startPrank(ADMIN);
        votingSystem.addCandidate(CANDIDATE1_NAME);
        votingSystem.startVoting(VOTING_DURATION);
        
        vm.expectRevert(VotingSystem.VotingSystem__VotingAlreadyStarted.selector);
        votingSystem.addCandidate(CANDIDATE2_NAME);
        vm.stopPrank();
    }

    function test_CandidateCountIncrementsCorrectly() public {
        vm.startPrank(ADMIN);
        votingSystem.addCandidate(CANDIDATE1_NAME);
        votingSystem.addCandidate(CANDIDATE2_NAME);
        vm.stopPrank();
        assertEq(votingSystem.getCandidateCount(), 2);
    }

    /*//////////////////////////////////////////////////////////////
                        START VOTING TESTS
    //////////////////////////////////////////////////////////////*/
    function test_AdminCanStartVoting() public {
        vm.startPrank(ADMIN);
        votingSystem.addCandidate(CANDIDATE1_NAME);
        
        uint256 expectedStart = block.timestamp;
        uint256 expectedEnd = block.timestamp + VOTING_DURATION;
        
        vm.expectEmit(true, true, false, true);
        emit VotingStarted(expectedStart, expectedEnd);
        
        votingSystem.startVoting(VOTING_DURATION);
        vm.stopPrank();

        assertTrue(votingSystem.getVotingStatus());
        (uint256 start, uint256 end) = votingSystem.getVotingTimes();
        assertEq(start, expectedStart);
        assertEq(end, expectedEnd);
    }

    function test_RevertWhen_StartingVotingWithoutCandidates() public {
        vm.prank(ADMIN);
        vm.expectRevert(VotingSystem.VotingSystem__InvalidCandidate.selector);
        votingSystem.startVoting(VOTING_DURATION);
    }

    function test_RevertWhen_StartingVotingWithZeroDuration() public {
        vm.startPrank(ADMIN);
        votingSystem.addCandidate(CANDIDATE1_NAME);
        
        vm.expectRevert(VotingSystem.VotingSystem__InvalidVotingPeriod.selector);
        votingSystem.startVoting(0);
        vm.stopPrank();
    }

    function test_RevertWhen_StartingAlreadyActiveVoting() public {
        vm.startPrank(ADMIN);
        votingSystem.addCandidate(CANDIDATE1_NAME);
        votingSystem.startVoting(VOTING_DURATION);
        
        vm.expectRevert(VotingSystem.VotingSystem__VotingAlreadyStarted.selector);
        votingSystem.startVoting(VOTING_DURATION);
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                           VOTING TESTS
    //////////////////////////////////////////////////////////////*/
    function test_AnyoneCanVoteOnce() public {
        vm.startPrank(ADMIN);
        votingSystem.addCandidate(CANDIDATE1_NAME);
        votingSystem.startVoting(VOTING_DURATION);
        vm.stopPrank();

        vm.prank(VOTER1);
        vm.expectEmit(true, true, false, true);
        emit VoteCast(VOTER1, 1);
        votingSystem.vote(1);

        assertTrue(votingSystem.hasVoted(VOTER1));
        VotingSystem.Candidate memory candidate = votingSystem.getCandidate(1);
        assertEq(candidate.voteCount, 1);
    }

    function test_RevertWhen_VotingForInvalidCandidate() public {
        vm.startPrank(ADMIN);
        votingSystem.addCandidate(CANDIDATE1_NAME);
        votingSystem.startVoting(VOTING_DURATION);
        vm.stopPrank();

        vm.prank(VOTER1);
        vm.expectRevert(VotingSystem.VotingSystem__InvalidCandidate.selector);
        votingSystem.vote(999);
    }

    function test_RevertWhen_VotingTwice() public {
        vm.startPrank(ADMIN);
        votingSystem.addCandidate(CANDIDATE1_NAME);
        votingSystem.startVoting(VOTING_DURATION);
        vm.stopPrank();

        vm.startPrank(VOTER1);
        votingSystem.vote(1);
        
        vm.expectRevert(VotingSystem.VotingSystem__AlreadyVoted.selector);
        votingSystem.vote(1);
        vm.stopPrank();
    }

    function test_RevertWhen_VotingBeforeVotingStarts() public {
        vm.startPrank(ADMIN);
        votingSystem.addCandidate(CANDIDATE1_NAME);
        vm.stopPrank();

        vm.prank(VOTER1);
        vm.expectRevert(VotingSystem.VotingSystem__VotingNotActive.selector);
        votingSystem.vote(1);
    }

    function test_RevertWhen_VotingAfterVotingEnds() public {
        vm.startPrank(ADMIN);
        votingSystem.addCandidate(CANDIDATE1_NAME);
        votingSystem.startVoting(VOTING_DURATION);
        vm.stopPrank();

        vm.warp(block.timestamp + VOTING_DURATION + 1);

        vm.prank(VOTER1);
        vm.expectRevert(VotingSystem.VotingSystem__VotingNotActive.selector);
        votingSystem.vote(1);
    }

    /*//////////////////////////////////////////////////////////////
                         END VOTING TESTS
    //////////////////////////////////////////////////////////////*/
    function test_AdminCanEndVotingAfterPeriod() public {
        vm.startPrank(ADMIN);
        votingSystem.addCandidate(CANDIDATE1_NAME);
        votingSystem.startVoting(VOTING_DURATION);
        vm.stopPrank();

        vm.warp(block.timestamp + VOTING_DURATION + 1);
        
        vm.prank(ADMIN);
        votingSystem.endVoting();
        
        assertFalse(votingSystem.getVotingStatus());
    }

    function test_RevertWhen_EndingVotingBeforePeriodEnds() public {
        vm.startPrank(ADMIN);
        votingSystem.addCandidate(CANDIDATE1_NAME);
        votingSystem.startVoting(VOTING_DURATION);
        
        vm.expectRevert(VotingSystem.VotingSystem__VotingStillActive.selector);
        votingSystem.endVoting();
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                       GETTER FUNCTION TESTS
    //////////////////////////////////////////////////////////////*/
    function test_GetAllCandidatesReturnsCorrectly() public {
        vm.startPrank(ADMIN);
        votingSystem.addCandidate(CANDIDATE1_NAME);
        votingSystem.addCandidate(CANDIDATE2_NAME);
        vm.stopPrank();

        VotingSystem.Candidate[] memory candidates = votingSystem.getAllCandidates();
        assertEq(candidates.length, 2);
        assertEq(candidates[0].name, CANDIDATE1_NAME);
        assertEq(candidates[1].name, CANDIDATE2_NAME);
    }

    function test_GetWinnerReturnsCorrectWinner() public {
        vm.startPrank(ADMIN);
        votingSystem.addCandidate(CANDIDATE1_NAME);
        votingSystem.addCandidate(CANDIDATE2_NAME);
        votingSystem.startVoting(VOTING_DURATION);
        vm.stopPrank();

        vm.prank(VOTER1);
        votingSystem.vote(1);
        
        vm.prank(VOTER2);
        votingSystem.vote(1);
        
        vm.prank(VOTER3);
        votingSystem.vote(2);

        (uint256 winnerId, uint256 winnerVotes) = votingSystem.getWinner();
        assertEq(winnerId, 1);
        assertEq(winnerVotes, 2);
    }

    function test_GetRemainingTimeWorksCorrectly() public {
        vm.startPrank(ADMIN);
        votingSystem.addCandidate(CANDIDATE1_NAME);
        votingSystem.startVoting(VOTING_DURATION);
        vm.stopPrank();

        assertEq(votingSystem.getRemainingTime(), VOTING_DURATION);

        vm.warp(block.timestamp + 12 hours);
        assertEq(votingSystem.getRemainingTime(), 12 hours);

        vm.warp(block.timestamp + 13 hours);
        assertEq(votingSystem.getRemainingTime(), 0);
    }

    /*//////////////////////////////////////////////////////////////
                         INTEGRATION TESTS
    //////////////////////////////////////////////////////////////*/
    function test_CompleteVotingFlow() public {
        // Setup
        vm.startPrank(ADMIN);
        votingSystem.addCandidate(CANDIDATE1_NAME);
        votingSystem.addCandidate(CANDIDATE2_NAME);
        votingSystem.startVoting(VOTING_DURATION);
        vm.stopPrank();

        // Voting
        vm.prank(VOTER1);
        votingSystem.vote(1);
        
        vm.prank(VOTER2);
        votingSystem.vote(2);

        // End
        vm.warp(block.timestamp + VOTING_DURATION + 1);
        vm.prank(ADMIN);
        votingSystem.endVoting();

        // Verify
        VotingSystem.Candidate memory candidate1 = votingSystem.getCandidate(1);
        VotingSystem.Candidate memory candidate2 = votingSystem.getCandidate(2);
        
        assertEq(candidate1.voteCount, 1);
        assertEq(candidate2.voteCount, 1);
        assertFalse(votingSystem.getVotingStatus());
    }
}