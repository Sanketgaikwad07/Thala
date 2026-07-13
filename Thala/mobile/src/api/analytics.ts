import { apiClient, ApiEnvelope } from './client';

export interface AnalyticsOverview {
  running: { date: string; distanceKm: number; paceMinPerKm?: number; calories: number }[];
  calories: { date: string; caloriesBurned: number }[];
  heartRate: { date: string; bpm: number }[];
  weight: { date: string; weightKg: number }[];
  bmi: { date: string; bmi: number }[];
  distance: { date: string; distanceKm: number }[];
  workoutTime: { date: string; exerciseMinutes: number }[];
}

export async function getAnalyticsOverview(range: 'daily' | 'weekly' | 'monthly' = 'weekly') {
  const { data } = await apiClient.get<ApiEnvelope<AnalyticsOverview>>('/analytics/overview', { params: { range } });
  return data.data;
}
