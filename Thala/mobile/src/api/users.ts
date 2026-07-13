import { apiClient, ApiEnvelope } from './client';
import { User } from '@/types/models';

export async function getMe() {
  const { data } = await apiClient.get<ApiEnvelope<User>>('/users/me');
  return data.data;
}

export async function updateMe(updates: Partial<User>) {
  const { data } = await apiClient.patch<ApiEnvelope<User>>('/users/me', updates);
  return data.data;
}

export async function uploadPhoto(fileUri: string) {
  const form = new FormData();
  form.append('photo', { uri: fileUri, name: 'photo.jpg', type: 'image/jpeg' } as unknown as Blob);
  const { data } = await apiClient.post<ApiEnvelope<User>>('/users/me/photo', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function deleteAccount() {
  const { data } = await apiClient.delete<ApiEnvelope<{ message: string }>>('/users/me');
  return data.data;
}

export async function exportMyData() {
  const { data } = await apiClient.get<ApiEnvelope<unknown>>('/users/me/export');
  return data.data;
}
