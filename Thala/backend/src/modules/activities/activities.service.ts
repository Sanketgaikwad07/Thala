import { v4 as uuid } from 'uuid';
import { db } from '../../data/db';
import { ApiError } from '../../utils/ApiError';
import { ActivitySession, ActivityType, DailyActivity, RoutePoint } from '../../types/models';
import { paceMinPerKm } from '../../utils/calculations';
import { PaginationParams, paginate } from '../../utils/pagination';

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

export function createActivitySession(userId: string, input: CreateActivityInput): ActivitySession {
  const avgPaceMinPerKm = input.type !== 'cycling' ? paceMinPerKm(input.distanceKm, input.durationSeconds) : undefined;
  const avgSpeedKmh = input.distanceKm > 0 ? Number(((input.distanceKm / input.durationSeconds) * 3600).toFixed(2)) : 0;

  const session: ActivitySession = {
    id: uuid(),
    userId,
    type: input.type,
    startedAt: input.startedAt,
    endedAt: input.endedAt,
    durationSeconds: input.durationSeconds,
    distanceKm: input.distanceKm,
    avgPaceMinPerKm,
    avgSpeedKmh,
    calories: input.calories,
    elevationGainM: input.elevationGainM,
    steps: input.steps,
    route: input.route,
    createdAt: new Date().toISOString(),
  };
  db.activitySessions.push(session);
  upsertDailyActivityFromSession(session);
  return session;
}

function upsertDailyActivityFromSession(session: ActivitySession) {
  const date = session.startedAt.slice(0, 10);
  let daily = db.dailyActivities.find((d) => d.userId === session.userId && d.date === date);
  if (!daily) {
    daily = {
      id: uuid(),
      userId: session.userId,
      date,
      steps: 0,
      caloriesBurned: 0,
      waterMl: 0,
      sleepHours: 0,
      exerciseMinutes: 0,
      distanceKm: 0,
      activeMinutes: 0,
    };
    db.dailyActivities.push(daily);
  }
  daily.steps += session.steps ?? 0;
  daily.caloriesBurned += session.calories;
  daily.distanceKm = Number((daily.distanceKm + session.distanceKm).toFixed(2));
  daily.exerciseMinutes += Math.round(session.durationSeconds / 60);
  daily.activeMinutes += Math.round(session.durationSeconds / 60);
}

export function listActivitySessions(userId: string, pagination: PaginationParams, type?: ActivityType) {
  const items = db.activitySessions
    .filter((s) => s.userId === userId && (!type || s.type === type))
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  return paginate(items, pagination);
}

export function getActivitySession(userId: string, id: string): ActivitySession {
  const session = db.activitySessions.find((s) => s.id === id && s.userId === userId);
  if (!session) throw ApiError.notFound('Activity session not found');
  return session;
}

export function deleteActivitySession(userId: string, id: string) {
  const idx = db.activitySessions.findIndex((s) => s.id === id && s.userId === userId);
  if (idx === -1) throw ApiError.notFound('Activity session not found');
  db.activitySessions.splice(idx, 1);
  return { message: 'Activity session deleted' };
}

export function getDailyActivity(userId: string, date: string): DailyActivity {
  const daily = db.dailyActivities.find((d) => d.userId === userId && d.date === date);
  return (
    daily ?? {
      id: 'none',
      userId,
      date,
      steps: 0,
      caloriesBurned: 0,
      waterMl: 0,
      sleepHours: 0,
      exerciseMinutes: 0,
      distanceKm: 0,
      activeMinutes: 0,
    }
  );
}

export interface DailyActivityUpsertInput {
  steps?: number;
  waterMl?: number;
  sleepHours?: number;
}

export function upsertManualDailyActivity(userId: string, date: string, input: DailyActivityUpsertInput) {
  let daily = db.dailyActivities.find((d) => d.userId === userId && d.date === date);
  if (!daily) {
    daily = {
      id: uuid(),
      userId,
      date,
      steps: 0,
      caloriesBurned: 0,
      waterMl: 0,
      sleepHours: 0,
      exerciseMinutes: 0,
      distanceKm: 0,
      activeMinutes: 0,
    };
    db.dailyActivities.push(daily);
  }
  if (input.steps !== undefined) daily.steps = input.steps;
  if (input.waterMl !== undefined) daily.waterMl = input.waterMl;
  if (input.sleepHours !== undefined) daily.sleepHours = input.sleepHours;
  return daily;
}

export function listDailyActivities(userId: string, days: number) {
  return [...db.dailyActivities]
    .filter((d) => d.userId === userId)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, days)
    .reverse();
}

export function getWeeklySummary(userId: string) {
  const days = listDailyActivities(userId, 7);
  return summarize(days);
}

export function getMonthlySummary(userId: string) {
  const days = listDailyActivities(userId, 30);
  return summarize(days);
}

function summarize(days: DailyActivity[]) {
  const totals = days.reduce(
    (acc, d) => {
      acc.steps += d.steps;
      acc.caloriesBurned += d.caloriesBurned;
      acc.distanceKm += d.distanceKm;
      acc.exerciseMinutes += d.exerciseMinutes;
      acc.waterMl += d.waterMl;
      acc.sleepHours += d.sleepHours;
      return acc;
    },
    { steps: 0, caloriesBurned: 0, distanceKm: 0, exerciseMinutes: 0, waterMl: 0, sleepHours: 0 },
  );
  const count = days.length || 1;
  return {
    days,
    totals: { ...totals, distanceKm: Number(totals.distanceKm.toFixed(2)) },
    averages: {
      steps: Math.round(totals.steps / count),
      caloriesBurned: Math.round(totals.caloriesBurned / count),
      distanceKm: Number((totals.distanceKm / count).toFixed(2)),
      sleepHours: Number((totals.sleepHours / count).toFixed(1)),
      waterMl: Math.round(totals.waterMl / count),
    },
  };
}
