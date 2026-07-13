export type Gender = 'male' | 'female' | 'other';
export type FitnessGoal = 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'fat_loss' | 'maintenance';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type ActivityType = 'running' | 'cycling' | 'walking';
export type ExerciseCategory = 'chest' | 'legs' | 'back' | 'arms' | 'shoulder' | 'core' | 'cardio' | 'yoga';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  targetWeightKg?: number;
  gender?: Gender;
  fitnessGoal?: FitnessGoal;
  experienceLevel?: ExperienceLevel;
  medicalConditions?: string[];
  role: 'user' | 'admin';
  bmi?: { bmi: number; category: string };
  createdAt: string;
}

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
  bpm: number;
  source: 'manual' | 'device';
  recordedAt: string;
}

export interface DailyActivity {
  id: string;
  date: string;
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
  category: ExerciseCategory;
  level: ExperienceLevel;
  mediaUrl: string;
  description: string;
  sets: number;
  reps: string;
  restTimeSeconds: number;
  caloriesBurned: number;
}

export interface Workout {
  id: string;
  name: string;
  level: ExperienceLevel;
  category: ExerciseCategory;
  exerciseIds: string[];
  exercises?: Exercise[];
  durationMinutes: number;
  caloriesBurned: number;
  imageUrl: string;
  description: string;
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
  goal: FitnessGoal;
  bmi: number;
  bmr: number;
  dailyCalories: number;
  meals: { breakfast: string[]; lunch: string[]; dinner: string[]; snacks: string[] };
  waterTargetMl: number;
}

export interface CoachRecommendation {
  id: string;
  icon: string;
  message: string;
  category: string;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  criteria: string;
  unlocked: boolean;
  unlockedAt: string | null;
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
  myProgress: number;
  joined: boolean;
  completed: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  photoUrl?: string;
  progress: number;
  completed: boolean;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  author: { id: string; name: string; photoUrl?: string } | null;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  comments: { id: string; userId: string; text: string; createdAt: string }[];
  shares: number;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'reminder' | 'achievement' | 'social' | 'system';
  read: boolean;
  createdAt: string;
}
