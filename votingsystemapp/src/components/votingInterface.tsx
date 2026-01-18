'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { 
  useGetAllCandidates, 
  useGetVotingStatus,
  useHasVoted,
  useVote 
} from '@/hooks/useVoting';

export function VotingInterface() {
  const { address } = useAccount();
  const [selectedCandidate, setSelectedCandidate] = useState<bigint | null>(null);

  const { data: candidates, isLoading: loadingCandidates, refetch: refetchCandidates } = useGetAllCandidates();
  const { data: isVotingActive } = useGetVotingStatus();
  const { data: hasVoted, refetch: refetchHasVoted } = useHasVoted(address);
  
  const { vote, isPending, isConfirming, isConfirmed, error } = useVote();

  const handleVote = () => {
    if (selectedCandidate !== null) {
      vote(selectedCandidate);
    }
  };

  if (isConfirmed) {
    refetchCandidates();
    refetchHasVoted();
  }

  if (loadingCandidates) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="text-center text-gray-600">Loading candidates...</div>
      </div>
    );
  }

  if (!candidates || candidates.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="text-center text-gray-600">No candidates available yet</div>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">✅</div>
          <p className="text-green-600 font-semibold mb-2">Vote Recorded</p>
          <p className="text-gray-600">You have already cast your vote</p>
        </div>
        <CandidateList candidates={candidates} />
      </div>
    );
  }

  if (!isVotingActive) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">⏸️</div>
          <p className="text-yellow-600 font-semibold mb-2">Voting Not Active</p>
          <p className="text-gray-600">Voting has not started or has ended</p>
        </div>
        <CandidateList candidates={candidates} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">🗳️ Cast Your Vote</h2>
        <p className="text-sm text-gray-600 mt-1">
          ✨ Open voting - Anyone can vote once per address!
        </p>
      </div>
      
      <div className="space-y-3 mb-6">
        {candidates.map((candidate) => (
          <div
            key={candidate.id.toString()}
            onClick={() => setSelectedCandidate(candidate.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedCandidate === candidate.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  checked={selectedCandidate === candidate.id}
                  onChange={() => setSelectedCandidate(candidate.id)}
                  className="w-5 h-5 text-blue-600"
                />
                <div>
                  <p className="font-semibold text-lg text-gray-900">{candidate.name}</p>
                  <p className="text-sm text-gray-500">ID: {candidate.id.toString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {candidate.voteCount.toString()}
                </p>
                <p className="text-xs text-gray-500">votes</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleVote}
        disabled={selectedCandidate === null || isPending || isConfirming}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isPending || isConfirming ? '🔄 Confirming...' : '✅ Submit Vote'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">
            ⚠️ Error: {error.message}
          </p>
        </div>
      )}

      {isConfirmed && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm">
            ✅ Vote successfully recorded!
          </p>
        </div>
      )}
    </div>
  );
}

function CandidateList({ candidates }: { candidates: readonly any[] }) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg mb-3 text-gray-900">Current Results</h3>
      {candidates.map((candidate) => (
        <div
          key={candidate.id.toString()}
          className="p-4 border border-gray-200 rounded-lg bg-gray-50"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-900">{candidate.name}</p>
              <p className="text-sm text-gray-500">ID: {candidate.id.toString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-blue-600">
                {candidate.voteCount.toString()}
              </p>
              <p className="text-xs text-gray-500">votes</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}