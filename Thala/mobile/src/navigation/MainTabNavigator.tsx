import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { MainTabParamList } from './types';
import { useAppTheme } from '@/theme/ThemeProvider';
import { DashboardScreen } from '@/screens/dashboard/DashboardScreen';
import { ActivityHubScreen } from '@/screens/activity/ActivityHubScreen';
import { WorkoutCategoriesScreen } from '@/screens/workouts/WorkoutCategoriesScreen';
import { NutritionHomeScreen } from '@/screens/nutrition/NutritionHomeScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, keyof typeof MaterialCommunityIcons.glyphMap> = {
  DashboardTab: 'view-dashboard-outline',
  ActivityTab: 'run',
  WorkoutsTab: 'dumbbell',
  NutritionTab: 'food-apple-outline',
  ProfileTab: 'account-outline',
};

export function MainTabNavigator() {
  const { colors } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name={ICONS[route.name as keyof MainTabParamList]} color={color} size={size} />
        ),
      })}
    >
      <Tab.Screen name="DashboardTab" component={DashboardScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="ActivityTab" component={ActivityHubScreen} options={{ title: 'Activity' }} />
      <Tab.Screen name="WorkoutsTab" component={WorkoutCategoriesScreen} options={{ title: 'Workouts' }} />
      <Tab.Screen name="NutritionTab" component={NutritionHomeScreen} options={{ title: 'Nutrition' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
