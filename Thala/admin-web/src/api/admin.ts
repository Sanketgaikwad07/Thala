import { apiClient } from './client';
import type { ApiEnvelope, PaginatedEnvelope } from './client';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  fitnessGoal?: string;
  experienceLevel?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalSessions: number;
  totalDistanceKm: number;
  totalWorkouts: number;
  totalSports: number;
  totalPosts: number;
  activeChallenges: number;
  userGrowth: { date: string; activeUsers: number }[];
}

export interface AdminWorkout {
  id: string;
  name: string;
  level: string;
  category: string;
  durationMinutes: number;
  caloriesBurned: number;
  description: string;
}

export interface AdminSport {
  id: string;
  name: string;
  caloriesBurnedPerHour: number;
  tips: string[];
  injuryPrevention: string[];
}

export interface AdminAchievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  criteria: string;
}

export async function login(email: string, password: string) {
  const { data } = await apiClient.post<ApiEnvelope<{ user: AdminUser; accessToken: string; refreshToken: string }>>('/auth/login', {
    email,
    password,
  });
  return data.data;
}

export async function getDashboard() {
  const { data } = await apiClient.get<ApiEnvelope<DashboardStats>>('/admin/dashboard');
  return data.data;
}

export async function listUsers(page = 1, search = '') {
  const { data } = await apiClient.get<PaginatedEnvelope<AdminUser>>('/admin/users', { params: { page, search, limit: 20 } });
  return data;
}

export async function deleteUser(id: string) {
  await apiClient.delete(`/admin/users/${id}`);
}

export async function listWorkoutsPublic(page = 1) {
  const { data } = await apiClient.get<PaginatedEnvelope<AdminWorkout>>('/workouts', { params: { page, limit: 20 } });
  return data;
}

export async function listSportsPublic() {
  const { data } = await apiClient.get<ApiEnvelope<AdminSport[]>>('/sports');
  return data.data;
}

export async function listAchievementsPublic() {
  const { data } = await apiClient.get<ApiEnvelope<AdminAchievement[]>>('/achievements');
  return data.data;
}

export async function createWorkout(input: Partial<AdminWorkout> & { exerciseIds?: string[]; imageUrl?: string }) {
  const { data } = await apiClient.post<ApiEnvelope<AdminWorkout>>('/admin/workouts', {
    exerciseIds: [],
    imageUrl: 'https://media.thala.app/workouts/custom.jpg',
    ...input,
  });
  return data.data;
}

export async function deleteWorkout(id: string) {
  await apiClient.delete(`/admin/workouts/${id}`);
}

export async function createSport(input: {
  name: string;
  icon: string;
  imageUrl: string;
  caloriesBurnedPerHour: number;
  tips: string[];
  injuryPrevention: string[];
  trainingPlans: { title: string; durationWeeks: number; description: string }[];
}) {
  const { data } = await apiClient.post<ApiEnvelope<AdminSport>>('/admin/sports', input);
  return data.data;
}

export async function deleteSport(id: string) {
  await apiClient.delete(`/admin/sports/${id}`);
}

export async function listDietPlans(page = 1) {
  const { data } = await apiClient.get<PaginatedEnvelope<{ id: string; userId: string; goal: string; dailyCalories: number; bmi: number }>>(
    '/admin/diet-plans',
    { params: { page, limit: 20 } },
  );
  return data;
}

export async function createAchievement(input: Omit<AdminAchievement, 'id'>) {
  const { data } = await apiClient.post<ApiEnvelope<AdminAchievement>>('/admin/achievements', input);
  return data.data;
}

export async function deleteAchievement(id: string) {
  await apiClient.delete(`/admin/achievements/${id}`);
}

export async function getPlatformAnalytics() {
  const { data } = await apiClient.get<ApiEnvelope<{ usersByGoal: Record<string, number>; sessionsByType: Record<string, number> }>>(
    '/admin/analytics',
  );
  return data.data;
}

export async function getReportsOverview() {
  const { data } = await apiClient.get<
    ApiEnvelope<{ totalReportsGenerated: number; mostActiveUsers: { id: string; name: string; sessions: number }[] }>
  >('/admin/reports');
  return data.data;
}

export async function broadcastNotification(title: string, body: string) {
  const { data } = await apiClient.post<ApiEnvelope<{ sentTo: number }>>('/admin/notifications/broadcast', { title, body });
  return data.data;
}
