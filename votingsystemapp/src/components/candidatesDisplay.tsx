'use client';

import { useGetAllCandidates, useGetWinner } from '@/hooks/useVoting';

export function CandidatesDisplay() {
  const { data: candidates, isLoading } = useGetAllCandidates();
  const { data: winner } = useGetWinner();

  // ensure we have a real array to avoid accessing .length on an object
  const candidatesArray = Array.isArray(candidates) ? candidates : [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">📋 Candidates</h2>
        <div className="text-center text-gray-600 py-8">Loading candidates...</div>
      </div>
    );
  }

  if (candidatesArray.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">📋 Candidates</h2>
        <div className="text-center text-gray-600 py-8">
          No candidates have been added yet
        </div>
      </div>
    );
  }

  const totalVotes = candidatesArray.reduce((sum, c) => sum + Number(c.voteCount), 0);
  const leaderId = Array.isArray(winner) && winner.length > 0 ? (winner as any)[0] : null;

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">📋 All Candidates</h2>
        <span className="text-sm text-gray-600">
          {candidatesArray.length} {candidatesArray.length === 1 ? 'Candidate' : 'Candidates'}
        </span>
      </div>

      <div className="space-y-3">
        {candidatesArray.map((candidate, index) => {
          const isLeader = leaderId && candidate.id === leaderId && Number(candidate.voteCount) > 0;
          const percentage = totalVotes > 0 
            ? ((Number(candidate.voteCount) / totalVotes) * 100).toFixed(1)
            : '0';

          return (
            <div
              key={candidate.id.toString()}
              className={`p-5 rounded-lg border-2 transition-all ${
                isLeader
                  ? 'border-yellow-400 bg-yellow-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    isLeader 
                      ? 'bg-yellow-400 text-yellow-900' 
                      : 'bg-blue-100 text-blue-900'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-bold text-lg text-gray-900">{candidate.name}</p>
                      {isLeader && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-yellow-900">
                          👑 Leading
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">ID: {candidate.id.toString()}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-3xl font-bold ${
                    isLeader ? 'text-yellow-600' : 'text-blue-600'
                  }`}>
                    {candidate.voteCount.toString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {percentage}% of votes
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLeader ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Total Candidates</p>
            <p className="text-2xl font-bold text-gray-900">{candidatesArray.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Votes Cast</p>
            <p className="text-2xl font-bold text-blue-600">{totalVotes}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Leading Candidate</p>
            <p className="text-lg font-bold text-yellow-600">
              {leaderId ? candidatesArray.find(c => c.id === leaderId)?.name || 'N/A' : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}