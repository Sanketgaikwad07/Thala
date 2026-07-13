import { apiClient, ApiEnvelope } from './client';
import { Achievement } from '@/types/models';

export async function listAchievements() {
  const { data } = await apiClient.get<ApiEnvelope<Achievement[]>>('/achievements');
  return data.data;
}

export async function evaluateAchievements() {
  const { data } = await apiClient.post<ApiEnvelope<{ newlyUnlocked: string[]; achievements: Achievement[] }>>(
    '/achievements/evaluate',
  );
  return data.data;
}
