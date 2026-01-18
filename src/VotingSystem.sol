// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title VotingSystem
 * @author SALAMI SELIM
 * @notice A decentralized voting system for transparent, tamper-proof voting
 * @dev Implements one-vote-per-address mechanism with time-bound voting periods
 * @dev Open voting: Any address can vote once (no registration required)
 */
contract VotingSystem {
    //////////////////////////////////
    ////////    ERRORS  /////////////
    /////////////////////////////////
    error VotingSystem__NotAdmin();
    error VotingSystem__VotingNotActive();
    error VotingSystem__VotingAlreadyStarted();
    error VotingSystem__VotingStillActive();
    error VotingSystem__AlreadyVoted();
    error VotingSystem__InvalidCandidate();
    error VotingSystem__InvalidVotingPeriod();

    //////////////////////////////////////////////////////
    /////// STATE VARIABLES ////////////////////////////
    ////////////////////////////////////////////////////
    address private immutable i_admin;
    uint256 private s_votingStartTime;
    uint256 private s_votingEndTime;
    uint256 private s_candidateCount;
    bool private s_votingActive;

    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
        bool exists;
    }

    mapping(uint256 => Candidate) private s_candidates;
    mapping(address => bool) private s_hasVoted;

    //////////////////////////////////
    ////////    EVENTS  /////////////
    /////////////////////////////////
    event CandidateAdded(uint256 indexed candidateId, string name);
    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event VotingStarted(uint256 startTime, uint256 endTime);
    event VotingEnded(uint256 endTime);

    ///////////////////////////////////
    /////////   MODIFIERS /////////// 
    //////////////////////////////////
    modifier onlyAdmin() {
        if (msg.sender != i_admin) revert VotingSystem__NotAdmin();
        _;
    }

    modifier votingIsActive() {
        if (!s_votingActive || block.timestamp < s_votingStartTime || block.timestamp > s_votingEndTime) {
            revert VotingSystem__VotingNotActive();
        }
        _;
    }

    modifier hasNotVoted() {
        if (s_hasVoted[msg.sender]) revert VotingSystem__AlreadyVoted();
        _;
    }

    ////////////////////////////////////////
    ///////////   FUNCTIONS  /////////////
    //////////////////////////////////////
    constructor() {
        i_admin = msg.sender;
    }

    /**
     * @notice Adds a new candidate to the voting system
     * @param _name The name of the candidate
     * @dev Can only be called by admin before voting starts
     */
    function addCandidate(string memory _name) external onlyAdmin {
        if (s_votingActive) revert VotingSystem__VotingAlreadyStarted();
        
        s_candidateCount++;
        s_candidates[s_candidateCount] = Candidate({
            id: s_candidateCount,
            name: _name,
            voteCount: 0,
            exists: true
        });

        emit CandidateAdded(s_candidateCount, _name);
    }

    /**
     * @notice Starts the voting period
     * @param _durationInSeconds The duration of the voting period in seconds
     */
    function startVoting(uint256 _durationInSeconds) external onlyAdmin {
        if (s_votingActive) revert VotingSystem__VotingAlreadyStarted();
        if (_durationInSeconds == 0) revert VotingSystem__InvalidVotingPeriod();
        if (s_candidateCount == 0) revert VotingSystem__InvalidCandidate();

        s_votingStartTime = block.timestamp;
        s_votingEndTime = block.timestamp + _durationInSeconds;
        s_votingActive = true;

        emit VotingStarted(s_votingStartTime, s_votingEndTime);
    }

    /**
     * @notice Ends the voting period
     * @dev Can be called by admin after end time has passed
     */
    function endVoting() external onlyAdmin {
        if (!s_votingActive) revert VotingSystem__VotingNotActive();
        if (block.timestamp < s_votingEndTime) revert VotingSystem__VotingStillActive();

        s_votingActive = false;

        emit VotingEnded(block.timestamp);
    }

    /**
     * @notice Casts a vote for a candidate
     * @param _candidateId The ID of the candidate to vote for
     * @dev Anyone can vote once - no registration required
     */
    function vote(uint256 _candidateId) 
        external 
        votingIsActive 
        hasNotVoted 
    {
        if (!s_candidates[_candidateId].exists) revert VotingSystem__InvalidCandidate();

        s_hasVoted[msg.sender] = true;
        s_candidates[_candidateId].voteCount += 1;

        emit VoteCast(msg.sender, _candidateId);
    }

    ///////////////////////////////////////////// 
    //////////    VIEW & PURE FUNCTIONS ////////
    ////////////////////////////////////////////
    
    function getCandidate(uint256 _candidateId) external view returns (Candidate memory) {
        return s_candidates[_candidateId];
    }

    function getCandidateCount() external view returns (uint256) {
        return s_candidateCount;
    }

    function getVotingStatus() external view returns (bool) {
        return s_votingActive && 
               block.timestamp >= s_votingStartTime && 
               block.timestamp <= s_votingEndTime;
    }

    function getVotingTimes() external view returns (uint256 startTime, uint256 endTime) {
        return (s_votingStartTime, s_votingEndTime);
    }

    function hasVoted(address _voter) external view returns (bool) {
        return s_hasVoted[_voter];
    }

    function getAdmin() external view returns (address) {
        return i_admin;
    }

    function getRemainingTime() external view returns (uint256) {
        if (block.timestamp >= s_votingEndTime) return 0;
        return s_votingEndTime - block.timestamp;
    }

    /**
     * @notice Gets the winning candidate
     * @return winningCandidateId The ID of the winning candidate
     * @return winningVoteCount The vote count of the winner
     */
    function getWinner() external view returns (uint256 winningCandidateId, uint256 winningVoteCount) {
        winningVoteCount = 0;
        winningCandidateId = 0;

        for (uint256 i = 1; i <= s_candidateCount; i++) {
            if (s_candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = s_candidates[i].voteCount;
                winningCandidateId = i;
            }
        }
    }

    /**
     * @notice Gets all candidates and their vote counts
     * @return An array of all candidates
     */
    function getAllCandidates() external view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](s_candidateCount);
        
        for (uint256 i = 1; i <= s_candidateCount; i++) {
            allCandidates[i - 1] = s_candidates[i];
        }
        
        return allCandidates;
    }
}