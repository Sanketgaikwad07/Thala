import { apiClient, ApiEnvelope } from './client';
import { AppNotification } from '@/types/models';

export async function listNotifications() {
  const { data } = await apiClient.get<ApiEnvelope<AppNotification[]>>('/notifications');
  return data.data;
}

export async function markAsRead(id: string) {
  const { data } = await apiClient.patch<ApiEnvelope<AppNotification>>(`/notifications/${id}/read`);
  return data.data;
}

export async function markAllAsRead() {
  const { data } = await apiClient.patch<ApiEnvelope<{ message: string }>>('/notifications/read-all');
  return data.data;
}
