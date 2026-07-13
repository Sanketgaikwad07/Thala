import { v4 as uuid } from 'uuid';
import { db } from '../../data/db';

export function listAchievements(userId: string) {
  const unlockedMap = new Map(db.userAchievements.filter((ua) => ua.userId === userId).map((ua) => [ua.achievementId, ua.unlockedAt]));
  return db.achievements.map((a) => ({
    ...a,
    unlocked: unlockedMap.has(a.id),
    unlockedAt: unlockedMap.get(a.id) ?? null,
  }));
}

/** Evaluates the user's stats against achievement criteria and unlocks any newly earned badges. */
export function evaluateAchievements(userId: string) {
  const sessions = db.activitySessions.filter((s) => s.userId === userId);
  const totalRunningKm = sessions.filter((s) => s.type === 'running').reduce((sum, s) => sum + s.distanceKm, 0);
  const dailyActivities = db.dailyActivities.filter((d) => d.userId === userId);
  const maxSteps = Math.max(0, ...dailyActivities.map((d) => d.steps));
  const hasMarathon = sessions.some((s) => s.type === 'running' && s.distanceKm >= 42.0);
  const activeDays = new Set(dailyActivities.filter((d) => d.exerciseMinutes > 0).map((d) => d.date)).size;

  const checks: Record<string, boolean> = {
    first_run: sessions.some((s) => s.type === 'running'),
    ten_km: totalRunningKm >= 10,
    hundred_km: totalRunningKm >= 100,
    streak_30: activeDays >= 30,
    steps_10000: maxSteps >= 10000,
    marathon: hasMarathon,
  };

  const newlyUnlocked: string[] = [];
  db.achievements.forEach((a) => {
    if (!checks[a.code]) return;
    const already = db.userAchievements.some((ua) => ua.userId === userId && ua.achievementId === a.id);
    if (!already) {
      db.userAchievements.push({ id: uuid(), userId, achievementId: a.id, unlockedAt: new Date().toISOString() });
      newlyUnlocked.push(a.title);
    }
  });

  return { newlyUnlocked, achievements: listAchievements(userId) };
}
