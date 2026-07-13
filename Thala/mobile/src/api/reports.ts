import { apiClient, ApiEnvelope } from './client';

export interface UserReport {
  period: 'weekly' | 'monthly';
  generatedAt: string;
  summary: { totals: Record<string, number>; averages: Record<string, number> };
  totalSessions: number;
  totalDistanceKm: number;
  totalCaloriesFromActivities: number;
  achievementsUnlocked: number;
}

export async function getReport(period: 'weekly' | 'monthly' = 'weekly') {
  const { data } = await apiClient.get<ApiEnvelope<UserReport>>('/reports', { params: { period } });
  return data.data;
}
