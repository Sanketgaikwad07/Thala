export type Gender = 'male' | 'female' | 'other';
export type FitnessGoal = 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'fat_loss' | 'maintenance';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type Role = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  photoUrl?: string;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  targetWeightKg?: number;
  gender?: Gender;
  fitnessGoal?: FitnessGoal;
  experienceLevel?: ExperienceLevel;
  medicalConditions?: string[];
  role: Role;
  provider: 'password' | 'google' | 'otp';
  isEmailVerified: boolean;
  tokenVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface OtpRecord {
  id: string;
  destination: string; // email or phone
  code: string;
  purpose: 'login' | 'register' | 'reset_password';
  expiresAt: string;
  consumed: boolean;
}

export interface PasswordResetToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  used: boolean;
}

export type ActivityType = 'running' | 'cycling' | 'walking';

export interface RoutePoint {
  latitude: number;
  longitude: number;
  altitude?: number;
  timestamp: number;
  speed?: number;
}

export interface ActivitySession {
  id: string;
  userId: string;
  type: ActivityType;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  distanceKm: number;
  avgPaceMinPerKm?: number;
  avgSpeedKmh?: number;
  calories: number;
  elevationGainM?: number;
  steps?: number;
  route: RoutePoint[];
  createdAt: string;
}

export interface HeartRateEntry {
  id: string;
  userId: string;
  bpm: number;
  source: 'manual' | 'device';
  recordedAt: string;
}

export interface DailyActivity {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  steps: number;
  caloriesBurned: number;
  waterMl: number;
  sleepHours: number;
  exerciseMinutes: number;
  distanceKm: number;
  activeMinutes: number;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'chest' | 'legs' | 'back' | 'arms' | 'shoulder' | 'core' | 'cardio' | 'yoga';
  level: ExperienceLevel;
  mediaUrl: string;
  description: string;
  sets: number;
  reps: string;
  restTimeSeconds: number;
  caloriesBurned: number;
}

export interface Sport {
  id: string;
  name: string;
  icon: string;
  imageUrl: string;
  trainingPlans: { title: string; durationWeeks: number; description: string }[];
  caloriesBurnedPerHour: number;
  tips: string[];
  injuryPrevention: string[];
}

export interface DietPlan {
  id: string;
  userId: string;
  goal: FitnessGoal;
  bmi: number;
  bmr: number;
  dailyCalories: number;
  meals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  waterTargetMl: number;
  createdAt: string;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  criteria: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
}

export type ChallengeFrequency = 'daily' | 'weekly' | 'monthly';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  frequency: ChallengeFrequency;
  targetValue: number;
  unit: string;
  startDate: string;
  endDate: string;
}

export interface ChallengeParticipant {
  id: string;
  challengeId: string;
  userId: string;
  progress: number;
  completed: boolean;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  activitySessionId?: string;
  likes: string[]; // user ids
  comments: { id: string; userId: string; text: string; createdAt: string }[];
  shares: number;
  createdAt: string;
}

export interface Follow {
  followerId: string;
  followingId: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'reminder' | 'achievement' | 'social' | 'system';
  read: boolean;
  createdAt: string;
}

export interface Workout {
  id: string;
  name: string;
  level: ExperienceLevel;
  category: Exercise['category'];
  exerciseIds: string[];
  durationMinutes: number;
  caloriesBurned: number;
  imageUrl: string;
  description: string;
}
