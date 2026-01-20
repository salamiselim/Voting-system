'use client';

import { useState } from 'react';
import { 
  useAddCandidate, 
  useStartVoting,
  useEndVoting,
  useGetVotingStatus 
} from '@/hooks/useVoting';

export function AdminPanel() {
  const [candidateName, setCandidateName] = useState('');
  const [votingDuration, setVotingDuration] = useState('7');

  const { data: votingStatusData } = useGetVotingStatus();
  const isVotingActive: boolean = Boolean(votingStatusData);
  
  const addCandidate = useAddCandidate();
  const startVoting = useStartVoting();
  const endVoting = useEndVoting();

  const handleAddCandidate = () => {
    if (candidateName.trim()) {
      addCandidate.addCandidate(candidateName);
      setCandidateName('');
    }
  };

  const handleStartVoting = () => {
    const durationInSeconds = BigInt(parseInt(votingDuration) * 24 * 60 * 60);
    startVoting.startVoting(durationInSeconds);
  };

  const handleEndVoting = () => {
    endVoting.endVoting();
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">👑 Admin Control Panel</h2>
      <p className="text-sm text-gray-600 mb-6">
        ✨ Open voting enabled - No registration required, anyone can vote once!
      </p>

      <div className="space-y-6">
        {/* Add Candidate */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">➕ Add Candidate</h3>
          <input
            type="text"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="Enter candidate name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isVotingActive}
          />
          <button
            onClick={handleAddCandidate}
            disabled={!candidateName.trim() || addCandidate.isPending || isVotingActive}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {addCandidate.isPending ? 'Adding...' : 'Add Candidate'}
          </button>
          {isVotingActive && (
            <p className="text-sm text-yellow-600 mt-2">⚠️ Cannot add while voting is active</p>
          )}
          {addCandidate.isConfirmed && (
            <p className="text-sm text-green-600 mt-2">✓ Candidate added successfully!</p>
          )}
        </div>

        {/* Start Voting */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">🚀 Start Voting</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (days)
            </label>
            <input
              type="number"
              value={votingDuration}
              onChange={(e) => setVotingDuration(e.target.value)}
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isVotingActive}
            />
          </div>
          <button
            onClick={handleStartVoting}
            disabled={startVoting.isPending || isVotingActive}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {startVoting.isPending ? 'Starting...' : 'Start Voting Period'}
          </button>
          {isVotingActive && (
            <p className="text-sm text-yellow-600 mt-2">✓ Voting is currently active</p>
          )}
          {startVoting.isConfirmed && (
            <p className="text-sm text-green-600 mt-2">✓ Voting started successfully!</p>
          )}
        </div>

        {/* End Voting */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">🛑 End Voting</h3>
          <p className="text-sm text-gray-600 mb-4">
            Manually end the voting period after the deadline has passed
          </p>
          <button
            onClick={handleEndVoting}
            disabled={endVoting.isPending || !isVotingActive}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {endVoting.isPending ? 'Ending...' : 'End Voting Period'}
          </button>
          {!isVotingActive && (
            <p className="text-sm text-gray-500 mt-2">⚠️ Voting is not active</p>
          )}
          {endVoting.isConfirmed && (
            <p className="text-sm text-green-600 mt-2">✓ Voting ended successfully!</p>
          )}
        </div>
      </div>

      {/* Error Display */}
      {(addCandidate.error || startVoting.error || endVoting.error) && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">
            ⚠️ {addCandidate.error?.message || 
             startVoting.error?.message || 
             endVoting.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}