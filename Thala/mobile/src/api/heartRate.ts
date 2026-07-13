import { apiClient, ApiEnvelope } from './client';
import { HeartRateEntry } from '@/types/models';

export interface HeartRateData {
  range: 'daily' | 'weekly' | 'monthly';
  entries: HeartRateEntry[];
  stats: { avg: number; max: number; min: number; count: number };
}

export async function addHeartRate(bpm: number, source: 'manual' | 'device' = 'manual') {
  const { data } = await apiClient.post<ApiEnvelope<HeartRateEntry>>('/heart-rate', { bpm, source });
  return data.data;
}

export async function getHeartRate(range: 'daily' | 'weekly' | 'monthly' = 'daily') {
  const { data } = await apiClient.get<ApiEnvelope<HeartRateData>>('/heart-rate', { params: { range } });
  return data.data;
}

export async function getLatestHeartRate() {
  const { data } = await apiClient.get<ApiEnvelope<HeartRateEntry | null>>('/heart-rate/latest');
  return data.data;
}
