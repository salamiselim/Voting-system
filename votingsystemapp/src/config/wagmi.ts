import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet, localhost } from 'wagmi/chains';
import { defineChain } from 'viem';


export const hederaTestnet = defineChain({
  id: 296,
  name: 'Hedera Testnet',
  network: 'hedera-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'HBAR',
    symbol: 'HBAR',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_HEDERA_RPC_URL || 'https://testnet.hashio.io/api'],
    },
    public: {
      http: ['https://testnet.hashio.io/api'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'HashScan', 
      url: 'https://hashscan.io/testnet' 
    },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: 'Decentralized Voting System',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [
    hederaTestnet,
    ...(process.env.NODE_ENV === 'development' ? [localhost] : []),
    sepolia,
    mainnet,
  ],
  ssr: true,
});

export const VOTING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS as `0x${string}`;