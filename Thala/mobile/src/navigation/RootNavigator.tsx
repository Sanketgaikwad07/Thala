import React from 'react';
import { NavigationContainer, DarkTheme as NavDarkTheme, DefaultTheme as NavDefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { useAppSelector } from '@/app/hooks';
import { useAuthBootstrap } from '@/features/auth/useAuthBootstrap';
import { useAppTheme } from '@/theme/ThemeProvider';
import { LoadingView } from '@/components/LoadingView';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';

import { ActivityTrackerScreen } from '@/screens/activity/ActivityTrackerScreen';
import { ActivitySummaryScreen } from '@/screens/activity/ActivitySummaryScreen';
import { ActivityHistoryScreen } from '@/screens/activity/ActivityHistoryScreen';
import { HeartRateScreen } from '@/screens/heartrate/HeartRateScreen';
import { WorkoutListScreen } from '@/screens/workouts/WorkoutListScreen';
import { WorkoutDetailScreen } from '@/screens/workouts/WorkoutDetailScreen';
import { ExerciseDetailScreen } from '@/screens/workouts/ExerciseDetailScreen';
import { SportsListScreen } from '@/screens/sports/SportsListScreen';
import { SportDetailScreen } from '@/screens/sports/SportDetailScreen';
import { DietPlannerScreen } from '@/screens/nutrition/DietPlannerScreen';
import { AiCoachScreen } from '@/screens/nutrition/AiCoachScreen';
import { ProgressAnalyticsScreen } from '@/screens/analytics/ProgressAnalyticsScreen';
import { AchievementsScreen } from '@/screens/achievements/AchievementsScreen';
import { ChallengesScreen } from '@/screens/challenges/ChallengesScreen';
import { LeaderboardScreen } from '@/screens/challenges/LeaderboardScreen';
import { CommunityFeedScreen } from '@/screens/community/CommunityFeedScreen';
import { NotificationsScreen } from '@/screens/notifications/NotificationsScreen';
import { SettingsScreen } from '@/screens/settings/SettingsScreen';
import { EditProfileScreen } from '@/screens/profile/EditProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  useAuthBootstrap();
  const { colors, isDark } = useAppTheme();
  const status = useAppSelector((state) => state.auth.status);

  const navTheme = {
    ...(isDark ? NavDarkTheme : NavDefaultTheme),
    colors: {
      ...(isDark ? NavDarkTheme.colors : NavDefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  if (status === 'idle') return <LoadingView label="Preparing Thala..." />;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerTintColor: colors.primary, headerStyle: { backgroundColor: colors.surface } }}>
        {status === 'unauthenticated' ? (
          <Stack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="ActivityTracker" component={ActivityTrackerScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ActivitySummary" component={ActivitySummaryScreen} options={{ title: 'Activity Summary' }} />
            <Stack.Screen name="ActivityHistory" component={ActivityHistoryScreen} options={{ title: 'Activity History' }} />
            <Stack.Screen name="HeartRate" component={HeartRateScreen} options={{ title: 'Heart Rate' }} />
            <Stack.Screen name="WorkoutList" component={WorkoutListScreen} options={{ title: 'Workouts' }} />
            <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} options={{ title: 'Workout' }} />
            <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} options={{ title: 'Exercise' }} />
            <Stack.Screen name="SportsList" component={SportsListScreen} options={{ title: 'Sports' }} />
            <Stack.Screen name="SportDetail" component={SportDetailScreen} options={{ title: 'Sport' }} />
            <Stack.Screen name="DietPlanner" component={DietPlannerScreen} options={{ title: 'Diet Planner' }} />
            <Stack.Screen name="AiCoach" component={AiCoachScreen} options={{ title: 'AI Coach' }} />
            <Stack.Screen name="ProgressAnalytics" component={ProgressAnalyticsScreen} options={{ title: 'Analytics' }} />
            <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ title: 'Achievements' }} />
            <Stack.Screen name="Challenges" component={ChallengesScreen} options={{ title: 'Challenges' }} />
            <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ title: 'Leaderboard' }} />
            <Stack.Screen name="CommunityFeed" component={CommunityFeedScreen} options={{ title: 'Community' }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
