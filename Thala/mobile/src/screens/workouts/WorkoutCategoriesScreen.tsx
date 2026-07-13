import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import type { ExerciseCategory } from '@/types/models';

type Props = CompositeScreenProps<BottomTabScreenProps<MainTabParamList, 'WorkoutsTab'>, NativeStackScreenProps<RootStackParamList>>;

const CATEGORIES: { key: ExerciseCategory; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { key: 'chest', label: 'Chest', icon: 'arm-flex' },
  { key: 'legs', label: 'Legs', icon: 'run' },
  { key: 'back', label: 'Back', icon: 'human-handsup' },
  { key: 'arms', label: 'Arms', icon: 'dumbbell' },
  { key: 'shoulder', label: 'Shoulder', icon: 'weight-lifter' },
  { key: 'core', label: 'Core', icon: 'yoga' },
  { key: 'cardio', label: 'Cardio', icon: 'heart-pulse' },
  { key: 'yoga', label: 'Yoga', icon: 'meditation' },
];

const LEVELS: { key: string; label: string }[] = [
  { key: 'beginner', label: 'Beginner' },
  { key: 'intermediate', label: 'Intermediate' },
  { key: 'advanced', label: 'Advanced' },
];

export function WorkoutCategoriesScreen({ navigation }: Props) {
  const { colors } = useAppTheme();

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.text }]}>Workouts</Text>

      <SectionHeader title="Browse by Level" />
      <View style={styles.levelRow}>
        {LEVELS.map((level) => (
          <TouchableOpacity
            key={level.key}
            style={[styles.levelChip, { borderColor: colors.primary }]}
            onPress={() => navigation.navigate('WorkoutList', { level: level.key })}
          >
            <Text style={{ color: colors.primary, fontWeight: '700' }}>{level.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionHeader title="Browse by Category" />
      <View style={styles.grid}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity key={cat.key} style={styles.gridItem} onPress={() => navigation.navigate('WorkoutList', { category: cat.key })}>
            <Card style={{ alignItems: 'center', paddingVertical: 18 }}>
              <MaterialCommunityIcons name={cat.icon} size={28} color={colors.primary} />
              <Text style={[styles.gridLabel, { color: colors.text }]}>{cat.label}</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <SectionHeader title="Sports" actionLabel="View all" onAction={() => navigation.navigate('SportsList')} />
      <TouchableOpacity onPress={() => navigation.navigate('SportsList')}>
        <Card style={styles.sportsCard}>
          <MaterialCommunityIcons name="trophy-variant-outline" size={26} color={colors.accent} />
          <Text style={{ color: colors.text, flex: 1, marginLeft: 12 }}>
            Training plans, calories & injury prevention for 10 sports
          </Text>
          <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
        </Card>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  levelRow: { flexDirection: 'row', gap: 10 },
  levelChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', marginBottom: 12 },
  gridLabel: { fontWeight: '700', marginTop: 8, fontSize: 13 },
  sportsCard: { flexDirection: 'row', alignItems: 'center' },
});
