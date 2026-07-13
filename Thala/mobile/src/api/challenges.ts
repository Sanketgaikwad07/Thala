import { apiClient, ApiEnvelope } from './client';
import { Challenge, ChallengeFrequency, LeaderboardEntry } from '@/types/models';

export async function listChallenges(frequency?: ChallengeFrequency) {
  const { data } = await apiClient.get<ApiEnvelope<Challenge[]>>('/challenges', { params: { frequency } });
  return data.data;
}

export async function joinChallenge(id: string) {
  const { data } = await apiClient.post<ApiEnvelope<unknown>>(`/challenges/${id}/join`);
  return data.data;
}

export async function updateChallengeProgress(id: string, progress: number) {
  const { data } = await apiClient.patch<ApiEnvelope<unknown>>(`/challenges/${id}/progress`, { progress });
  return data.data;
}

export async function getLeaderboard(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ challenge: Challenge; leaderboard: LeaderboardEntry[] }>>(
    `/challenges/${id}/leaderboard`,
  );
  return data.data;
}
