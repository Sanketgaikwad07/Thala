import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { LoadingView } from '@/components/LoadingView';
import { useAppTheme } from '@/theme/ThemeProvider';
import { getWorkout } from '@/api/workouts';

export function WorkoutDetailScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'WorkoutDetail'>) {
  const { colors } = useAppTheme();
  const { data: workout, isLoading } = useQuery({
    queryKey: ['workouts', route.params.workoutId],
    queryFn: () => getWorkout(route.params.workoutId),
  });

  if (isLoading || !workout) return <LoadingView />;

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.text }]}>{workout.name}</Text>
      <Text style={{ color: colors.textMuted, marginBottom: 16 }}>{workout.description}</Text>

      <View style={styles.metaRow}>
        <Meta icon="clock-outline" label={`${workout.durationMinutes} min`} />
        <Meta icon="fire" label={`${workout.caloriesBurned} kcal`} />
        <Meta icon="signal-cellular-3" label={workout.level} />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Exercises ({workout.exercises?.length ?? 0})</Text>
      {workout.exercises?.map((ex) => (
        <TouchableOpacity key={ex.id} onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: ex.id })}>
          <Card style={styles.exRow}>
            <View style={[styles.exThumb, { backgroundColor: `${colors.primary}22` }]}>
              <MaterialCommunityIcons name="arm-flex-outline" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ color: colors.text, fontWeight: '700' }}>{ex.name}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                {ex.sets} sets x {ex.reps} - rest {ex.restTimeSeconds}s
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
          </Card>
        </TouchableOpacity>
      ))}
    </ScreenContainer>
  );
}

function Meta({ icon, label }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string }) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.metaItem}>
      <MaterialCommunityIcons name={icon} size={18} color={colors.primary} />
      <Text style={{ color: colors.text, fontSize: 12, marginTop: 4, textTransform: 'capitalize' }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', marginBottom: 6 },
  metaRow: { flexDirection: 'row', gap: 20, marginBottom: 20 },
  metaItem: { alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  exRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  exThumb: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
