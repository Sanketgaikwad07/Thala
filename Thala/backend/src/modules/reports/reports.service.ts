import { db } from '../../data/db';
import { getWeeklySummary, getMonthlySummary } from '../activities/activities.service';

export function getUserReport(userId: string, period: 'weekly' | 'monthly') {
  const summary = period === 'weekly' ? getWeeklySummary(userId) : getMonthlySummary(userId);
  const sessions = db.activitySessions.filter((s) => s.userId === userId);
  const achievementsUnlocked = db.userAchievements.filter((a) => a.userId === userId).length;

  return {
    period,
    generatedAt: new Date().toISOString(),
    summary,
    totalSessions: sessions.length,
    totalDistanceKm: Number(sessions.reduce((sum, s) => sum + s.distanceKm, 0).toFixed(2)),
    totalCaloriesFromActivities: sessions.reduce((sum, s) => sum + s.calories, 0),
    achievementsUnlocked,
  };
}
