import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { LoadingView } from '@/components/LoadingView';
import { useAppTheme } from '@/theme/ThemeProvider';
import { listWorkouts } from '@/api/workouts';
import type { ExerciseCategory, ExperienceLevel } from '@/types/models';

export function WorkoutListScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'WorkoutList'>) {
  const { colors } = useAppTheme();
  const level = route.params?.level as ExperienceLevel | undefined;
  const category = route.params?.category as ExerciseCategory | undefined;

  const { data, isLoading } = useQuery({
    queryKey: ['workouts', level, category],
    queryFn: () => listWorkouts(level, category),
  });

  if (isLoading) return <LoadingView />;

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      data={data?.data ?? []}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={<EmptyState icon="dumbbell" title="No workouts found" />}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('WorkoutDetail', { workoutId: item.id })}>
          <Card style={styles.card}>
            <View style={[styles.thumb, { backgroundColor: `${colors.primary}22` }]}>
              <MaterialCommunityIcons name="dumbbell" size={26} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
                {item.durationMinutes} min - {item.caloriesBurned} kcal - {item.level}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
          </Card>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  thumb: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  name: { fontWeight: '700', fontSize: 15, textTransform: 'capitalize' },
});
