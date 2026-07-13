import { v4 as uuid } from 'uuid';
import { db } from '../../data/db';
import { ApiError } from '../../utils/ApiError';
import { PaginationParams, paginate } from '../../utils/pagination';
import { Sport, Workout, Achievement, DietPlan } from '../../types/models';

export function getDashboardStats() {
  const totalUsers = db.users.filter((u) => u.role === 'user').length;
  const totalSessions = db.activitySessions.length;
  const totalDistanceKm = Number(db.activitySessions.reduce((sum, s) => sum + s.distanceKm, 0).toFixed(2));
  const totalWorkouts = db.workouts.length;
  const totalSports = db.sports.length;
  const totalPosts = db.posts.length;
  const activeChallenges = db.challenges.length;

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const date = d.toISOString().slice(0, 10);
    const activeUsers = new Set(db.dailyActivities.filter((a) => a.date === date).map((a) => a.userId)).size;
    return { date, activeUsers };
  });

  return {
    totalUsers,
    totalSessions,
    totalDistanceKm,
    totalWorkouts,
    totalSports,
    totalPosts,
    activeChallenges,
    userGrowth: last7Days,
  };
}

export function listUsers(pagination: PaginationParams, search?: string) {
  const items = db.users
    .filter((u) => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    .map(({ passwordHash, ...rest }) => rest);
  return paginate(items, pagination);
}

export function getUser(id: string) {
  const user = db.users.find((u) => u.id === id);
  if (!user) throw ApiError.notFound('User not found');
  const { passwordHash, ...rest } = user;
  return rest;
}

export function deleteUser(id: string) {
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) throw ApiError.notFound('User not found');
  db.users.splice(idx, 1);
  return { message: 'User removed' };
}

export function createWorkout(input: Omit<Workout, 'id'>) {
  const workout: Workout = { ...input, id: uuid() };
  db.workouts.push(workout);
  return workout;
}

export function updateWorkout(id: string, updates: Partial<Workout>) {
  const workout = db.workouts.find((w) => w.id === id);
  if (!workout) throw ApiError.notFound('Workout not found');
  Object.assign(workout, updates);
  return workout;
}

export function deleteWorkout(id: string) {
  const idx = db.workouts.findIndex((w) => w.id === id);
  if (idx === -1) throw ApiError.notFound('Workout not found');
  db.workouts.splice(idx, 1);
  return { message: 'Workout removed' };
}

export function createSport(input: Omit<Sport, 'id'>) {
  const sport: Sport = { ...input, id: uuid() };
  db.sports.push(sport);
  return sport;
}

export function updateSport(id: string, updates: Partial<Sport>) {
  const sport = db.sports.find((s) => s.id === id);
  if (!sport) throw ApiError.notFound('Sport not found');
  Object.assign(sport, updates);
  return sport;
}

export function deleteSport(id: string) {
  const idx = db.sports.findIndex((s) => s.id === id);
  if (idx === -1) throw ApiError.notFound('Sport not found');
  db.sports.splice(idx, 1);
  return { message: 'Sport removed' };
}

export function listDietPlans(pagination: PaginationParams): { data: DietPlan[]; meta: ReturnType<typeof paginate>['meta'] } {
  return paginate(db.dietPlans, pagination);
}

export function createAchievement(input: Omit<Achievement, 'id'>) {
  const achievement: Achievement = { ...input, id: uuid() };
  db.achievements.push(achievement);
  return achievement;
}

export function deleteAchievement(id: string) {
  const idx = db.achievements.findIndex((a) => a.id === id);
  if (idx === -1) throw ApiError.notFound('Achievement not found');
  db.achievements.splice(idx, 1);
  return { message: 'Achievement removed' };
}

export function platformAnalytics() {
  const byGoal = db.users.reduce<Record<string, number>>((acc, u) => {
    if (!u.fitnessGoal) return acc;
    acc[u.fitnessGoal] = (acc[u.fitnessGoal] ?? 0) + 1;
    return acc;
  }, {});

  const byActivityType = db.activitySessions.reduce<Record<string, number>>((acc, s) => {
    acc[s.type] = (acc[s.type] ?? 0) + 1;
    return acc;
  }, {});

  return { usersByGoal: byGoal, sessionsByType: byActivityType };
}

export function listReportsOverview() {
  return {
    totalReportsGenerated: db.users.length * 2,
    mostActiveUsers: [...db.users]
      .map((u) => ({
        id: u.id,
        name: u.name,
        sessions: db.activitySessions.filter((s) => s.userId === u.id).length,
      }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 5),
  };
}

export async function broadcastNotification(title: string, body: string) {
  const { createAndSend } = await import('../notifications/notifications.service');
  const results = await Promise.all(db.users.filter((u) => u.role === 'user').map((u) => createAndSend(u.id, title, body, 'system')));
  return { sentTo: results.length };
}
