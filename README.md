# 🗳️ Decentralized Voting System - Smart Contracts

Solidity smart contracts for a transparent, tamper-proof voting system built with Foundry.

## 📋 Features

- ✅ **Open Voting** - Anyone can vote once (no registration required)
- ✅ **Admin Controls** - Only admin can add candidates and manage voting
- ✅ **Time-Bound Voting** - Set start and end times for voting periods
- ✅ **Real-Time Results** - View live vote counts on-chain
- ✅ **Transparent** - All votes are recorded on blockchain
- ✅ **Gas Optimized** - Efficient storage and operations
- ✅ **Event Logging** - All actions emit events for tracking

## 🛠 Tech Stack

- **Solidity** ^0.8.24
- **Foundry** - Development framework
- **Forge** - Testing and deployment

## 📁 Project Structure

```
contracts/
├── src/
│   └── VotingSystem.sol          # Main voting contract
├── test/
│   ├── VotingSystem.t.sol        # Unit & integration tests
│   └── VotingSystem.fuzz.t.sol   # Fuzz tests
├── script/
│   ├── DeployVotingSystem.s.sol  # Deployment script
│   └── HelperConfig.s.sol        # Network configurations
├── foundry.toml                   # Foundry config
├── .env.example                   # Environment template
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Git

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd contracts

# Install dependencies
forge install

# Build contracts
forge build
```

## 🧪 Testing

```bash
# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Run with gas report
forge test --gas-report

# Run coverage
forge coverage

# Run specific test
forge test --match-test test_AnyoneCanVote -vvv

# Run only unit tests
forge test --match-path test/VotingSystem.t.sol

# Run only fuzz tests
forge test --match-path test/VotingSystem.fuzz.t.sol
```

## 📦 Deployment

### Deploy to Hedera Testnet

```bash
# 1. Create .env file
cp .env.example .env

# 2. Add your credentials to .env
# HEDERA_PRIVATE_KEY=your_private_key
# HEDERA_RPC_URL=https://testnet.hashio.io/api

# 3. Deploy
forge script script/DeployVotingSystem.s.sol \
  --rpc-url $HEDERA_RPC_URL \
  --broadcast \
  --legacy \
  --private-key $HEDERA_PRIVATE_KEY

# 4. Note the deployed contract address
```

### Deploy to Other Networks

```bash
# Local (Anvil)
anvil  # In one terminal
forge script script/DeployVotingSystem.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Sepolia
forge script script/DeployVotingSystem.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  --private-key $PRIVATE_KEY
```

## 📝 Contract Interface

### Admin Functions

```solidity
// Add a candidate (before voting starts)
function addCandidate(string memory _name) external onlyAdmin

// Start voting period
function startVoting(uint256 _durationInSeconds) external onlyAdmin

// End voting period (after time expires)
function endVoting() external onlyAdmin
```

### Public Functions

```solidity
// Cast a vote (anyone can vote once)
function vote(uint256 _candidateId) external

// View all candidates
function getAllCandidates() external view returns (Candidate[] memory)

// Check voting status
function getVotingStatus() external view returns (bool)

// Get winner
function getWinner() external view returns (uint256 id, uint256 votes)

// Check if address has voted
function hasVoted(address _voter) external view returns (bool)

// Get remaining time
function getRemainingTime() external view returns (uint256)
```

## 🔍 Contract Verification

After deployment, verify on block explorer:

```bash
# Hedera (HashScan)
# Manual verification at: https://hashscan.io/testnet

# Ethereum Sepolia
forge verify-contract \
  <CONTRACT_ADDRESS> \
  src/VotingSystem.sol:VotingSystem \
  --chain sepolia \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

## 🎯 Usage Example

```solidity
// 1. Deploy contract (you become admin)
VotingSystem voting = new VotingSystem();

// 2. Add candidates
voting.addCandidate("Alice");
voting.addCandidate("Bob");
voting.addCandidate("Charlie");

// 3. Start voting (7 days)
voting.startVoting(7 days);

// 4. Anyone can vote
voting.vote(1); // Vote for candidate 1

// 5. Check results
(uint256 winnerId, uint256 votes) = voting.getWinner();

// 6. End voting (after period expires)
voting.endVoting();
```

## 🔒 Security Features

- ✅ Custom errors (gas efficient)
- ✅ Access control (admin-only functions)
- ✅ Input validation
- ✅ Prevent double voting
- ✅ Time-based voting periods
- ✅ Safe math (Solidity 0.8+)
- ✅ Event emission for transparency
- ✅ Comprehensive test coverage

## 📊 Gas Optimization

- Immutable variables for constant data
- Efficient storage layout
- Minimal storage writes
- Custom errors instead of require strings
- Optimized loops

## 🧩 Integration

### Using with Web3 Frontend

```javascript
import { VotingSystemABI } from './abi';

const contract = new ethers.Contract(
  contractAddress,
  VotingSystemABI,
  signer
);

// Vote for candidate
await contract.vote(candidateId);

// Get all candidates
const candidates = await contract.getAllCandidates();
```

## 📈 Test Coverage

```bash
forge coverage

# Expected: >95% coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests
5. Ensure all tests pass: `forge test`
6. Submit a pull request

## 📄 License

MIT

## 🔗 Links

- [Foundry Book](https://book.getfoundry.sh/)
- [Solidity Docs](https://docs.soliditylang.org/)
- [Hedera Docs](https://docs.hedera.com/)

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review test cases for usage examples

---

Built with ❤️ using Foundry and Solidity