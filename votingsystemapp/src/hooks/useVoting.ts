import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { VOTING_SYSTEM_ABI } from '@/config/abi';
import { VOTING_CONTRACT_ADDRESS } from '@/config/wagmi';

// Read hooks
export function useGetAllCandidates() {
  return useReadContract({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_SYSTEM_ABI,
    functionName: 'getAllCandidates',
  });
}

export function useGetVotingStatus() {
  return useReadContract({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_SYSTEM_ABI,
    functionName: 'getVotingStatus',
  });
}

export function useGetRemainingTime() {
  return useReadContract({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_SYSTEM_ABI,
    functionName: 'getRemainingTime',
  });
}

export function useHasVoted(address?: `0x${string}`) {
  return useReadContract({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_SYSTEM_ABI,
    functionName: 'hasVoted',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

export function useIsRegistered(address?: `0x${string}`) {
  return useReadContract({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_SYSTEM_ABI,
    functionName: 'isRegistered',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

export function useGetWinner() {
  return useReadContract({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_SYSTEM_ABI,
    functionName: 'getWinner',
  });
}

export function useGetAdmin() {
  return useReadContract({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_SYSTEM_ABI,
    functionName: 'getAdmin',
  });
}

export function useGetVotingTimes() {
  return useReadContract({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_SYSTEM_ABI,
    functionName: 'getVotingTimes',
  });
}

// Write hooks
export function useVote() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const vote = (candidateId: bigint) => {
    writeContract({
      address: VOTING_CONTRACT_ADDRESS,
      abi: VOTING_SYSTEM_ABI,
      functionName: 'vote',
      args: [candidateId],
    });
  };

  return {
    vote,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

export function useAddCandidate() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const addCandidate = (name: string) => {
    writeContract({
      address: VOTING_CONTRACT_ADDRESS,
      abi: VOTING_SYSTEM_ABI,
      functionName: 'addCandidate',
      args: [name],
    });
  };

  return {
    addCandidate,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

export function useRegisterVoter() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const registerVoter = (voter: `0x${string}`, weight: bigint) => {
    writeContract({
      address: VOTING_CONTRACT_ADDRESS,
      abi: VOTING_SYSTEM_ABI,
      functionName: 'registerVoter',
      args: [voter, weight],
    });
  };

  return {
    registerVoter,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

export function useStartVoting() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const startVoting = (durationInSeconds: bigint) => {
    writeContract({
      address: VOTING_CONTRACT_ADDRESS,
      abi: VOTING_SYSTEM_ABI,
      functionName: 'startVoting',
      args: [durationInSeconds],
    });
  };

  return {
    startVoting,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

export function useEndVoting() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const endVoting = () => {
    writeContract({
      address: VOTING_CONTRACT_ADDRESS,
      abi: VOTING_SYSTEM_ABI,
      functionName: 'endVoting',
    });
  };

  return {
    endVoting,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}