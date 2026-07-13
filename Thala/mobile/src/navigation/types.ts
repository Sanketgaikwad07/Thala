import { ActivityType } from '@/types/models';

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OtpVerify: { destination: string; purpose: 'login' | 'register' | 'reset_password' };
};

export type MainTabParamList = {
  DashboardTab: undefined;
  ActivityTab: undefined;
  WorkoutsTab: undefined;
  NutritionTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ActivityTracker: { type: ActivityType };
  ActivitySummary: { sessionId: string };
  ActivityHistory: undefined;
  HeartRate: undefined;
  WorkoutList: { level?: string; category?: string } | undefined;
  WorkoutDetail: { workoutId: string };
  ExerciseDetail: { exerciseId: string };
  SportsList: undefined;
  SportDetail: { sportId: string };
  DietPlanner: undefined;
  AiCoach: undefined;
  ProgressAnalytics: undefined;
  Achievements: undefined;
  Challenges: undefined;
  Leaderboard: { challengeId: string };
  CommunityFeed: undefined;
  Notifications: undefined;
  Settings: undefined;
  EditProfile: undefined;
};
