import { apiClient, ApiEnvelope, PaginatedEnvelope } from './client';
import { Post } from '@/types/models';

export async function getFeed(page = 1) {
  const { data } = await apiClient.get<PaginatedEnvelope<Post>>('/community/feed', { params: { page } });
  return data;
}

export async function createPost(content: string, imageUrl?: string) {
  const { data } = await apiClient.post<ApiEnvelope<Post>>('/community/feed', { content, imageUrl });
  return data.data;
}

export async function toggleLike(postId: string) {
  const { data } = await apiClient.post<ApiEnvelope<Post>>(`/community/posts/${postId}/like`);
  return data.data;
}

export async function addComment(postId: string, text: string) {
  const { data } = await apiClient.post<ApiEnvelope<Post>>(`/community/posts/${postId}/comments`, { text });
  return data.data;
}

export async function sharePost(postId: string) {
  const { data } = await apiClient.post<ApiEnvelope<Post>>(`/community/posts/${postId}/share`);
  return data.data;
}

export async function toggleFollow(userId: string) {
  const { data } = await apiClient.post<ApiEnvelope<{ following: boolean }>>(`/community/follow/${userId}`);
  return data.data;
}
