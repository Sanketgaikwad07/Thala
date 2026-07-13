import { db } from '../../data/db';
import { ApiError } from '../../utils/ApiError';
import { calculateBmi } from '../../utils/calculations';
import { User } from '../../types/models';

function toPublicUser(user: User) {
  const { passwordHash, tokenVersion, ...rest } = user;
  const bmi = rest.weightKg && rest.heightCm ? calculateBmi(rest.weightKg, rest.heightCm) : undefined;
  return { ...rest, bmi };
}

export function getProfile(userId: string) {
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw ApiError.notFound('User not found');
  return toPublicUser(user);
}

export function updateProfile(userId: string, updates: Partial<User>) {
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw ApiError.notFound('User not found');

  const disallowed = ['id', 'passwordHash', 'role', 'tokenVersion', 'createdAt', 'email', 'provider'];
  for (const key of Object.keys(updates)) {
    if (!disallowed.includes(key)) {
      // @ts-expect-error dynamic assignment guarded by disallowed-list above
      user[key] = updates[key as keyof User];
    }
  }
  user.updatedAt = new Date().toISOString();
  return toPublicUser(user);
}

export function updatePhoto(userId: string, photoUrl: string) {
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw ApiError.notFound('User not found');
  user.photoUrl = photoUrl;
  user.updatedAt = new Date().toISOString();
  return toPublicUser(user);
}

export function deleteAccount(userId: string) {
  const idx = db.users.findIndex((u) => u.id === userId);
  if (idx === -1) throw ApiError.notFound('User not found');
  db.users.splice(idx, 1);
  return { message: 'Account deleted successfully' };
}

export function exportData(userId: string) {
  return {
    profile: getProfile(userId),
    activitySessions: db.activitySessions.filter((a) => a.userId === userId),
    dailyActivities: db.dailyActivities.filter((a) => a.userId === userId),
    heartRateEntries: db.heartRateEntries.filter((a) => a.userId === userId),
    dietPlans: db.dietPlans.filter((a) => a.userId === userId),
    achievements: db.userAchievements.filter((a) => a.userId === userId),
    exportedAt: new Date().toISOString(),
  };
}
