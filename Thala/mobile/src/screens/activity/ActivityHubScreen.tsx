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
import { EmptyState } from '@/components/EmptyState';
import { useAppTheme } from '@/theme/ThemeProvider';
import { listActivities } from '@/api/activities';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import type { ActivityType } from '@/types/models';

type Props = CompositeScreenProps<BottomTabScreenProps<MainTabParamList, 'ActivityTab'>, NativeStackScreenProps<RootStackParamList>>;

const TRACKERS: { type: ActivityType; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; color: string }[] = [
  { type: 'running', label: 'Running', icon: 'run', color: '#0f8a58' },
  { type: 'cycling', label: 'Cycling', icon: 'bike', color: '#3b82f6' },
  { type: 'walking', label: 'Walking', icon: 'walk', color: '#f59e0b' },
];

export function ActivityHubScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const recent = useQuery({ queryKey: ['activities', 'recent'], queryFn: () => listActivities(undefined, 1) });

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.text }]}>Start Tracking</Text>
      <View style={styles.trackerGrid}>
        {TRACKERS.map((t) => (
          <TouchableOpacity
            key={t.type}
            style={styles.trackerCard}
            onPress={() => navigation.navigate('ActivityTracker', { type: t.type })}
          >
            <Card style={{ alignItems: 'center', paddingVertical: 20 }}>
              <View style={[styles.iconWrap, { backgroundColor: `${t.color}22` }]}>
                <MaterialCommunityIcons name={t.icon} size={28} color={t.color} />
              </View>
              <Text style={[styles.trackerLabel, { color: colors.text }]}>{t.label}</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <SectionHeader title="Heart Rate" actionLabel="View" onAction={() => navigation.navigate('HeartRate')} />
      <TouchableOpacity onPress={() => navigation.navigate('HeartRate')}>
        <Card style={styles.hrCard}>
          <MaterialCommunityIcons name="heart-pulse" size={26} color={colors.danger} />
          <Text style={{ color: colors.text, flex: 1, marginLeft: 12 }}>View readings, log manually, and see trends</Text>
          <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
        </Card>
      </TouchableOpacity>

      <SectionHeader title="Recent Activity" actionLabel="See all" onAction={() => navigation.navigate('ActivityHistory')} />
      {recent.data && recent.data.data.length > 0 ? (
        recent.data.data.map((session) => (
          <TouchableOpacity key={session.id} onPress={() => navigation.navigate('ActivitySummary', { sessionId: session.id })}>
            <Card style={styles.sessionRow}>
              <MaterialCommunityIcons
                name={session.type === 'running' ? 'run' : session.type === 'cycling' ? 'bike' : 'walk'}
                size={22}
                color={colors.primary}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ color: colors.text, fontWeight: '700', textTransform: 'capitalize' }}>{session.type}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                  {session.distanceKm.toFixed(2)} km - {Math.round(session.durationSeconds / 60)} min - {session.calories} kcal
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))
      ) : (
        <EmptyState icon="run" title="No activities yet" subtitle="Start a run, ride or walk to see it here." />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', marginBottom: 16 },
  trackerGrid: { flexDirection: 'row', gap: 12 },
  trackerCard: { flex: 1 },
  iconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  trackerLabel: { fontWeight: '700', fontSize: 13 },
  hrCard: { flexDirection: 'row', alignItems: 'center' },
  sessionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
});
