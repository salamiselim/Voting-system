'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { VotingInterface } from '@/components/votingInterface';
import { AdminPanel } from '@/components/adminPanel';
import { VotingStats } from '@/components/votingStats';
import { CandidatesDisplay } from '@/components/candidatesDisplay';
import { useGetAdmin } from '@/hooks/useVoting';
import { useState } from 'react';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: adminAddress } = useGetAdmin();
  const [activeTab, setActiveTab] = useState<'vote' | 'admin'>('vote');
  
  const isAdmin: boolean = Boolean(
    address && 
    adminAddress && 
    typeof adminAddress === 'string' &&
    address.toLowerCase() === adminAddress.toLowerCase()
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🗳️</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Decentralized Voting
              </h1>
            </div>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-md border border-gray-200">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🗳️</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome</h2>
              <p className="text-gray-600 mb-8">
                Connect your wallet to participate in transparent, secure, on-chain voting
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <VotingStats />

            <CandidatesDisplay />
            
            {isAdmin && (
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setActiveTab('vote')}
                  className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    activeTab === 'vote'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Vote
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    activeTab === 'admin'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Admin Panel
                </button>
              </div>
            )}
            
            {isAdmin && activeTab === 'admin' ? (
              <AdminPanel />
            ) : (
              <VotingInterface /> 
            )}
          </div>
        )}
      </div>

      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Built with Solidity, Foundry, Next.js, and Wagmi • Deployed on Hedera Testnet
          </p>
        </div>
      </footer>
    </main>
  );
}