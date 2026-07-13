import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { useAppTheme } from '@/theme/ThemeProvider';
import { getDietPlan } from '@/api/nutrition';
import { getTodayActivity, upsertTodayActivity } from '@/api/activities';
import { useQueryClient } from '@tanstack/react-query';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';

type Props = CompositeScreenProps<BottomTabScreenProps<MainTabParamList, 'NutritionTab'>, NativeStackScreenProps<RootStackParamList>>;

export function NutritionHomeScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const queryClient = useQueryClient();
  const plan = useQuery({ queryKey: ['nutrition', 'diet-plan'], queryFn: getDietPlan });
  const today = useQuery({ queryKey: ['activities', 'today'], queryFn: () => getTodayActivity() });

  const waterMl = today.data?.waterMl ?? 0;
  const waterTarget = plan.data?.waterTargetMl ?? 3000;
  const waterPct = Math.min(100, Math.round((waterMl / waterTarget) * 100));

  const addWater = async (amountMl: number) => {
    await upsertTodayActivity({ waterMl: waterMl + amountMl });
    queryClient.invalidateQueries({ queryKey: ['activities', 'today'] });
  };

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.text }]}>Nutrition</Text>

      <Card>
        <View style={styles.calorieRow}>
          <View>
            <Text style={[styles.calorieValue, { color: colors.text }]}>{plan.data?.dailyCalories ?? '--'}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>kcal target / day</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: colors.primary, fontWeight: '700' }}>BMI {plan.data?.bmi ?? '--'}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>BMR {plan.data?.bmr ?? '--'} kcal</Text>
          </View>
        </View>
      </Card>

      <SectionHeader title="Water Reminder" />
      <Card>
        <View style={styles.waterRow}>
          <MaterialCommunityIcons name="cup-water" size={28} color="#3b82f6" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>
              {(waterMl / 1000).toFixed(1)}L / {(waterTarget / 1000).toFixed(1)}L
            </Text>
            <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
              <View style={[styles.progressFill, { width: `${waterPct}%`, backgroundColor: '#3b82f6' }]} />
            </View>
          </View>
        </View>
        <View style={styles.waterButtons}>
          {[250, 500, 750].map((amt) => (
            <TouchableOpacity key={amt} style={[styles.waterBtn, { borderColor: '#3b82f6' }]} onPress={() => addWater(amt)}>
              <Text style={{ color: '#3b82f6', fontWeight: '700' }}>+{amt}ml</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <SectionHeader title="Today's Meal Plan" actionLabel="Full planner" onAction={() => navigation.navigate('DietPlanner')} />
      <Card>
        {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map((meal) => (
          <View key={meal} style={styles.mealRow}>
            <Text style={[styles.mealLabel, { color: colors.primary }]}>{meal.toUpperCase()}</Text>
            <Text style={{ color: colors.text, fontSize: 13, flex: 1 }}>{plan.data?.meals[meal]?.[0] ?? '--'}</Text>
          </View>
        ))}
      </Card>

      <SectionHeader title="AI Fitness Coach" actionLabel="Open" onAction={() => navigation.navigate('AiCoach')} />
      <TouchableOpacity onPress={() => navigation.navigate('AiCoach')}>
        <Card style={styles.coachCard}>
          <MaterialCommunityIcons name="robot-happy-outline" size={26} color={colors.primary} />
          <Text style={{ color: colors.text, flex: 1, marginLeft: 12 }}>
            Get personalized recommendations based on your activity, sleep and recovery
          </Text>
          <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
        </Card>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', marginBottom: 16 },
  calorieRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  calorieValue: { fontSize: 28, fontWeight: '800' },
  waterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  progressTrack: { height: 8, borderRadius: 4, marginTop: 8, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4 },
  waterButtons: { flexDirection: 'row', gap: 10 },
  waterBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, alignItems: 'center' },
  mealRow: { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'center' },
  mealLabel: { fontSize: 11, fontWeight: '800', width: 70 },
  coachCard: { flexDirection: 'row', alignItems: 'center' },
});
