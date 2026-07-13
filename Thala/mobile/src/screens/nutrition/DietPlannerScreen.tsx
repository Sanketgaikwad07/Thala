import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { LoadingView } from '@/components/LoadingView';
import { useAppTheme } from '@/theme/ThemeProvider';
import { getDietPlan, regenerateDietPlan } from '@/api/nutrition';

const MEAL_ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  breakfast: 'coffee-outline',
  lunch: 'food-outline',
  dinner: 'silverware-fork-knife',
  snacks: 'food-apple-outline',
};

export function DietPlannerScreen({}: NativeStackScreenProps<RootStackParamList, 'DietPlanner'>) {
  const { colors } = useAppTheme();
  const queryClient = useQueryClient();
  const { data: plan, isLoading } = useQuery({ queryKey: ['nutrition', 'diet-plan'], queryFn: getDietPlan });

  const regenerate = useMutation({
    mutationFn: regenerateDietPlan,
    onSuccess: (updated) => queryClient.setQueryData(['nutrition', 'diet-plan'], updated),
  });

  if (isLoading || !plan) return <LoadingView />;

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.text }]}>Daily Diet Plan</Text>
      <Text style={{ color: colors.textMuted, textTransform: 'capitalize', marginBottom: 16 }}>Goal: {plan.goal.replace('_', ' ')}</Text>

      <View style={styles.metricsRow}>
        <Metric label="BMI" value={`${plan.bmi}`} />
        <Metric label="BMR" value={`${plan.bmr}`} />
        <Metric label="Calories" value={`${plan.dailyCalories}`} />
        <Metric label="Water" value={`${(plan.waterTargetMl / 1000).toFixed(1)}L`} />
      </View>

      {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map((meal) => (
        <View key={meal}>
          <SectionHeader title={meal.charAt(0).toUpperCase() + meal.slice(1)} />
          <Card>
            {plan.meals[meal].map((item) => (
              <View key={item} style={styles.mealItem}>
                <MaterialCommunityIcons name={MEAL_ICONS[meal]} size={18} color={colors.primary} />
                <Text style={{ color: colors.text, marginLeft: 10, flex: 1 }}>{item}</Text>
              </View>
            ))}
          </Card>
        </View>
      ))}

      <Button mode="outlined" loading={regenerate.isPending} onPress={() => regenerate.mutate()} style={styles.button}>
        Regenerate from latest profile
      </Button>
    </ScreenContainer>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.metric}>
      <Text style={[styles.metricValue, { color: colors.text }]}>{value}</Text>
      <Text style={{ color: colors.textMuted, fontSize: 11 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800' },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  metric: { alignItems: 'center', flex: 1 },
  metricValue: { fontSize: 17, fontWeight: '800' },
  mealItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  button: { marginTop: 20, marginBottom: 24, borderRadius: 12 },
});
