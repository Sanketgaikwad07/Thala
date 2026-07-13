import { db } from '../../data/db';
import { ActivityType } from '../../types/models';

type Range = 'daily' | 'weekly' | 'monthly';

function daysForRange(range: Range) {
  return range === 'daily' ? 7 : range === 'weekly' ? 28 : 90;
}

export function getRunningAnalytics(userId: string, range: Range) {
  const days = daysForRange(range);
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const sessions = db.activitySessions.filter(
    (s) => s.userId === userId && s.type === ('running' as ActivityType) && new Date(s.startedAt).getTime() >= cutoff,
  );
  return sessions
    .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())
    .map((s) => ({ date: s.startedAt.slice(0, 10), distanceKm: s.distanceKm, paceMinPerKm: s.avgPaceMinPerKm, calories: s.calories }));
}

export function getCaloriesAnalytics(userId: string, range: Range) {
  const days = daysForRange(range);
  return db.dailyActivities
    .filter((d) => d.userId === userId)
    .slice(-days)
    .map((d) => ({ date: d.date, caloriesBurned: d.caloriesBurned }));
}

export function getHeartRateAnalytics(userId: string, range: Range) {
  const days = daysForRange(range);
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return db.heartRateEntries
    .filter((h) => h.userId === userId && new Date(h.recordedAt).getTime() >= cutoff)
    .map((h) => ({ date: h.recordedAt, bpm: h.bpm }));
}

export function getWeightAnalytics(userId: string) {
  // Weight history is simulated from the user's current weight with slight variation,
  // since only the latest weight is stored on the profile in this mock dataset.
  const user = db.users.find((u) => u.id === userId);
  if (!user?.weightKg) return [];
  const base = user.weightKg;
  const points = [];
  for (let i = 29; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const drift = Math.sin(i / 5) * 0.6;
    points.push({ date: d.toISOString().slice(0, 10), weightKg: Number((base + drift).toFixed(1)) });
  }
  return points;
}

export function getBmiAnalytics(userId: string) {
  const weights = getWeightAnalytics(userId);
  const user = db.users.find((u) => u.id === userId);
  if (!user?.heightCm) return [];
  const heightM = user.heightCm / 100;
  return weights.map((w) => ({ date: w.date, bmi: Number((w.weightKg / (heightM * heightM)).toFixed(1)) }));
}

export function getDistanceAnalytics(userId: string, range: Range) {
  const days = daysForRange(range);
  return db.dailyActivities
    .filter((d) => d.userId === userId)
    .slice(-days)
    .map((d) => ({ date: d.date, distanceKm: d.distanceKm }));
}

export function getWorkoutTimeAnalytics(userId: string, range: Range) {
  const days = daysForRange(range);
  return db.dailyActivities
    .filter((d) => d.userId === userId)
    .slice(-days)
    .map((d) => ({ date: d.date, exerciseMinutes: d.exerciseMinutes }));
}

export function getAnalyticsOverview(userId: string, range: Range) {
  return {
    running: getRunningAnalytics(userId, range),
    calories: getCaloriesAnalytics(userId, range),
    heartRate: getHeartRateAnalytics(userId, range),
    weight: getWeightAnalytics(userId),
    bmi: getBmiAnalytics(userId),
    distance: getDistanceAnalytics(userId, range),
    workoutTime: getWorkoutTimeAnalytics(userId, range),
  };
}
