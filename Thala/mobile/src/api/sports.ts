import { apiClient, ApiEnvelope } from './client';
import { Sport } from '@/types/models';

export async function listSports() {
  const { data } = await apiClient.get<ApiEnvelope<Sport[]>>('/sports');
  return data.data;
}

export async function getSport(id: string) {
  const { data } = await apiClient.get<ApiEnvelope<Sport>>(`/sports/${id}`);
  return data.data;
}
