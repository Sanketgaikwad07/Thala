import { apiClient, ApiEnvelope, PaginatedEnvelope } from './client';
import { ActivitySession, ActivityType, DailyActivity, RoutePoint } from '@/types/models';

export interface CreateActivityInput {
  type: ActivityType;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  distanceKm: number;
  calories: number;
  elevationGainM?: number;
  steps?: number;
  route: RoutePoint[];
}

export async function createActivity(input: CreateActivityInput) {
  const { data } = await apiClient.post<ApiEnvelope<ActivitySession>>('/activities', input);
  return data.data;
}

export async function listActivities(type?: ActivityType, page = 1) {
  const { data } = await apiClient.get<PaginatedEnvelope<ActivitySession>>('/activities', { params: { type, page } });
  return data;
}

export async function getActivity(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<ActivitySession>>(`/activities/${id}`);
  return data.data;
}

export async function deleteActivity(id: string) {
  const { data } = await apiClient.delete<ApiEnvelope<{ message: string }>>(`/activities/${id}`);
  return data.data;
}

export async function getTodayActivity(date?: string) {
  const { data } = await apiClient.get<ApiEnvelope<DailyActivity>>('/activities/daily/today', { params: { date } });
  return data.data;
}

export async function upsertTodayActivity(input: { date?: string; steps?: number; waterMl?: number; sleepHours?: number }) {
  const { data } = await apiClient.patch<ApiEnvelope<DailyActivity>>('/activities/daily/today', input);
  return data.data;
}

export async function listDailyActivityHistory(days = 30) {
  const { data } = await apiClient.get<ApiEnvelope<DailyActivity[]>>('/activities/daily/history', { params: { days } });
  return data.data;
}

export async function getWeeklySummary() {
  const { data } = await apiClient.get<ApiEnvelope<{ totals: Record<string, number>; averages: Record<string, number> }>>(
    '/activities/summary/weekly',
  );
  return data.data;
}

export async function getMonthlySummary() {
  const { data } = await apiClient.get<ApiEnvelope<{ totals: Record<string, number>; averages: Record<string, number> }>>(
    '/activities/summary/monthly',
  );
  return data.data;
}
