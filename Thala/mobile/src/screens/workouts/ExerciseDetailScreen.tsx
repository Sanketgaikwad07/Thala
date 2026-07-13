import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { LoadingView } from '@/components/LoadingView';
import { useAppTheme } from '@/theme/ThemeProvider';
import { getExercise } from '@/api/workouts';

export function ExerciseDetailScreen({ route }: NativeStackScreenProps<RootStackParamList, 'ExerciseDetail'>) {
  const { colors } = useAppTheme();
  const { data: exercise, isLoading } = useQuery({
    queryKey: ['exercises', route.params.exerciseId],
    queryFn: () => getExercise(route.params.exerciseId),
  });

  if (isLoading || !exercise) return <LoadingView />;

  return (
    <ScreenContainer>
      <View style={[styles.mediaPlaceholder, { backgroundColor: `${colors.primary}18` }]}>
        <MaterialCommunityIcons name="arm-flex-outline" size={56} color={colors.primary} />
      </View>

      <Text style={[styles.title, { color: colors.text, textTransform: 'capitalize' }]}>{exercise.name}</Text>
      <Text style={[styles.category, { color: colors.primary }]}>{exercise.category.toUpperCase()} - {exercise.level}</Text>

      <Text style={{ color: colors.textMuted, lineHeight: 20, marginBottom: 20 }}>{exercise.description}</Text>

      <View style={styles.statsGrid}>
        <Stat label="Sets" value={`${exercise.sets}`} />
        <Stat label="Reps" value={exercise.reps} />
        <Stat label="Rest" value={`${exercise.restTimeSeconds}s`} />
        <Stat label="Calories" value={`${exercise.caloriesBurned} kcal`} />
      </View>
    </ScreenContainer>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();
  return (
    <Card style={styles.statCard}>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  mediaPlaceholder: { height: 180, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800' },
  category: { fontSize: 12, fontWeight: '700', marginTop: 4, marginBottom: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', marginBottom: 12, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800' },
});
