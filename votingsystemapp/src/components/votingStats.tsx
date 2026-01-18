'use client';
import { useEffect, useState } from 'react';
import {
  useGetVotingStatus,
  useGetRemainingTime,
  useGetWinner,
  useGetVotingTimes,
  useGetAllCandidates
} from '@/hooks/useVoting';

export function VotingStats() {
  const { data: isVotingActive } = useGetVotingStatus();
  const { data: remainingTime, refetch: refetchTime } = useGetRemainingTime();
  const { data: winner } = useGetWinner() as { data: [unknown, bigint] | null };
  const { data: votingTimes } = useGetVotingTimes();
  const { data: candidates } = useGetAllCandidates();

  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!remainingTime) return;

    const updateTimer = () => {
      const seconds = Number(remainingTime);
      if (seconds <= 0) {
        setTimeLeft('Ended');
        return;
      }
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${secs}s`);
    };

    updateTimer();
    const interval = setInterval(() => {
      refetchTime();
      updateTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime, refetchTime]);

  const winningCandidate = winner && Array.isArray(candidates) && candidates
    ? candidates.find(c => c.id === winner[0])
    : null;

  const totalVotes = Array.isArray(candidates) ? candidates.reduce((sum, c) => sum + Number(c.voteCount), 0) : 0;

  const vt = votingTimes as bigint[] | undefined;
  const isVotingTimesValid = Array.isArray(vt) && vt.length >= 2 && vt[0] > BigInt(0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Status */}
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400 mb-1">Status</p>
              <p className="text-2xl font-bold">
                {isVotingActive ? (
                  <span className="text-emerald-400">Active</span>
                ) : (
                  <span className="text-gray-400">Inactive</span>
                )}
              </p>
            </div>
            <span className="text-3xl opacity-80">{isVotingActive ? '🟢' : '⚪'}</span>
          </div>
        </div>

        {/* Time Left */}
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400 mb-1">Time Left</p>
              <p className="text-xl font-semibold text-cyan-300">{timeLeft || 'Ended'}</p>
            </div>
            <span className="text-3xl opacity-80">⏱️</span>
          </div>
        </div>

        {/* Total Votes */}
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Votes</p>
              <p className="text-2xl font-bold text-purple-300">{totalVotes}</p>
            </div>
            <span className="text-3xl opacity-80">🗳️</span>
          </div>
        </div>

        {/* Leading */}
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-400 mb-1">Leading</p>
              <p className="text-xl font-bold text-yellow-300 truncate">
                {winningCandidate?.name || 'No votes yet'}
              </p>
              {winner && winner[1] > BigInt(0) && (
                <p className="text-sm text-gray-500 mt-1">
                  {winner[1].toString()} votes
                </p>
              )}
            </div>
            <span className="text-3xl opacity-80">👑</span>
          </div>
        </div>
      </div>

      {isVotingTimesValid && vt && (
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-gray-700 rounded-2xl p-6 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="text-gray-400">Start: </span>
              <span className="font-medium text-cyan-200">
                {new Date(Number(vt[0]) * 1000).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-gray-400">End: </span>
              <span className="font-medium text-cyan-200">
                {new Date(Number(vt[1]) * 1000).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}