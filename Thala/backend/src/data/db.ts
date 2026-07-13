import {
  Achievement,
  ActivitySession,
  Challenge,
  ChallengeParticipant,
  DailyActivity,
  DietPlan,
  Exercise,
  Follow,
  HeartRateEntry,
  Notification,
  OtpRecord,
  PasswordResetToken,
  Post,
  Sport,
  User,
  UserAchievement,
  Workout,
} from '../types/models';

/**
 * In-memory "database" acting as the single mock data store shared by every module.
 * Swappable for a real database later without changing controller/service call sites much,
 * since each collection is just a typed array behind a small accessor.
 */
class InMemoryDatabase {
  users: User[] = [];
  otps: OtpRecord[] = [];
  passwordResets: PasswordResetToken[] = [];
  activitySessions: ActivitySession[] = [];
  heartRateEntries: HeartRateEntry[] = [];
  dailyActivities: DailyActivity[] = [];
  exercises: Exercise[] = [];
  workouts: Workout[] = [];
  sports: Sport[] = [];
  dietPlans: DietPlan[] = [];
  achievements: Achievement[] = [];
  userAchievements: UserAchievement[] = [];
  challenges: Challenge[] = [];
  challengeParticipants: ChallengeParticipant[] = [];
  posts: Post[] = [];
  follows: Follow[] = [];
  notifications: Notification[] = [];
}

export const db = new InMemoryDatabase();
