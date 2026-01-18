export const VOTING_SYSTEM_ABI = [
    { "type": "constructor", "inputs": [], "stateMutability": "nonpayable" },
    {
      "type": "function",
      "name": "addCandidate",
      "inputs": [
        { "name": "_name", "type": "string", "internalType": "string" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "endVoting",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getAdmin",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getAllCandidates",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct VotingSystem.Candidate[]",
          "components": [
            { "name": "id", "type": "uint256", "internalType": "uint256" },
            { "name": "name", "type": "string", "internalType": "string" },
            {
              "name": "voteCount",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "exists", "type": "bool", "internalType": "bool" }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getCandidate",
      "inputs": [
        { "name": "_candidateId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple",
          "internalType": "struct VotingSystem.Candidate",
          "components": [
            { "name": "id", "type": "uint256", "internalType": "uint256" },
            { "name": "name", "type": "string", "internalType": "string" },
            {
              "name": "voteCount",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "exists", "type": "bool", "internalType": "bool" }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getCandidateCount",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getRemainingTime",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getVotingStatus",
      "inputs": [],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getVotingTimes",
      "inputs": [],
      "outputs": [
        { "name": "startTime", "type": "uint256", "internalType": "uint256" },
        { "name": "endTime", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getWinner",
      "inputs": [],
      "outputs": [
        {
          "name": "winningCandidateId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "winningVoteCount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "hasVoted",
      "inputs": [
        { "name": "_voter", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "startVoting",
      "inputs": [
        {
          "name": "_durationInSeconds",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "vote",
      "inputs": [
        { "name": "_candidateId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "CandidateAdded",
      "inputs": [
        {
          "name": "candidateId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "name",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "VoteCast",
      "inputs": [
        {
          "name": "voter",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "candidateId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "VotingEnded",
      "inputs": [
        {
          "name": "endTime",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "VotingStarted",
      "inputs": [
        {
          "name": "startTime",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "endTime",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    { "type": "error", "name": "VotingSystem__AlreadyVoted", "inputs": [] },
    { "type": "error", "name": "VotingSystem__InvalidCandidate", "inputs": [] },
    {
      "type": "error",
      "name": "VotingSystem__InvalidVotingPeriod",
      "inputs": []
    },
    { "type": "error", "name": "VotingSystem__NotAdmin", "inputs": [] },
    {
      "type": "error",
      "name": "VotingSystem__VotingAlreadyStarted",
      "inputs": []
    },
    { "type": "error", "name": "VotingSystem__VotingNotActive", "inputs": [] },
    { "type": "error", "name": "VotingSystem__VotingStillActive", "inputs": [] }
  ]