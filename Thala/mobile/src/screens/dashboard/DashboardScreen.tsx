import React from 'react';
import { RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionHeader } from '@/components/SectionHeader';
import { StatCard } from '@/components/StatCard';
import { Card } from '@/components/Card';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useAppSelector } from '@/app/hooks';
import { getTodayActivity, getWeeklySummary } from '@/api/activities';
import { getLatestHeartRate } from '@/api/heartRate';
import { getAiCoachRecommendations } from '@/api/nutrition';
import type { MainTabParamList } from '@/navigation/types';
import type { RootStackParamList } from '@/navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'DashboardTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function DashboardScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const user = useAppSelector((state) => state.auth.user);

  const today = useQuery({ queryKey: ['activities', 'today'], queryFn: () => getTodayActivity() });
  const weekly = useQuery({ queryKey: ['activities', 'weekly'], queryFn: getWeeklySummary });
  const heartRate = useQuery({ queryKey: ['heartRate', 'latest'], queryFn: getLatestHeartRate });
  const coach = useQuery({ queryKey: ['nutrition', 'ai-coach'], queryFn: getAiCoachRecommendations });

  const isRefreshing = today.isFetching || weekly.isFetching;
  const refresh = () => {
    today.refetch();
    weekly.refetch();
    heartRate.refetch();
    coach.refetch();
  };

  const data = today.data;

  return (
    <ScreenContainer refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={colors.primary} />}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textMuted }]}>Welcome back,</Text>
          <Text style={[styles.name, { color: colors.text }]}>{user?.name?.split(' ')[0] ?? 'Athlete'}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          {user?.photoUrl ? (
            <Image source={{ uri: user.photoUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.primary }]} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.quickStart}>
        {(['running', 'cycling', 'walking'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.quickBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('ActivityTracker', { type })}
          >
            <MaterialCommunityIcons
              name={type === 'running' ? 'run' : type === 'cycling' ? 'bike' : 'walk'}
              size={22}
              color="#fff"
            />
            <Text style={styles.quickBtnLabel}>{type === 'running' ? 'Run' : type === 'cycling' ? 'Ride' : 'Walk'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionHeader title="Today's Activity" />
      <View style={styles.statsGrid}>
        <StatCard icon="shoe-print" label="Steps" value={`${data?.steps ?? 0}`} color={colors.primary} delay={0} />
        <StatCard icon="fire" label="Calories" value={`${data?.caloriesBurned ?? 0} kcal`} color={colors.accent} delay={60} />
        <StatCard icon="map-marker-distance" label="Distance" value={`${(data?.distanceKm ?? 0).toFixed(1)} km`} color={colors.info} delay={120} />
        <StatCard
          icon="heart-pulse"
          label="Heart Rate"
          value={heartRate.data ? `${heartRate.data.bpm} bpm` : '--'}
          color={colors.danger}
          delay={180}
        />
        <StatCard icon="cup-water" label="Water Intake" value={`${((data?.waterMl ?? 0) / 1000).toFixed(1)} L`} color="#3b82f6" delay={240} />
        <StatCard icon="sleep" label="Sleep" value={`${data?.sleepHours ?? 0} h`} color="#8b5cf6" delay={300} />
      </View>

      <SectionHeader title="Weekly Summary" actionLabel="View analytics" onAction={() => navigation.navigate('ProgressAnalytics')} />
      <Card>
        <View style={styles.summaryRow}>
          <SummaryItem label="Distance" value={`${weekly.data?.totals.distanceKm ?? 0} km`} />
          <SummaryItem label="Calories" value={`${weekly.data?.totals.caloriesBurned ?? 0}`} />
          <SummaryItem label="Avg Sleep" value={`${weekly.data?.averages.sleepHours ?? 0} h`} />
        </View>
      </Card>

      <SectionHeader title="AI Coach" actionLabel="See all" onAction={() => navigation.navigate('AiCoach')} />
      <Card>
        {coach.data?.slice(0, 2).map((rec) => (
          <View key={rec.id} style={styles.coachRow}>
            <MaterialCommunityIcons name={rec.icon as any} size={20} color={colors.primary} />
            <Text style={[styles.coachText, { color: colors.text }]}>{rec.message}</Text>
          </View>
        ))}
      </Card>
    </ScreenContainer>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.summaryItem}>
      <Text style={[styles.summaryValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 14 },
  name: { fontSize: 22, fontWeight: '800' },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  quickStart: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  quickBtn: { flex: 1, borderRadius: 16, paddingVertical: 14, alignItems: 'center', gap: 4 },
  quickBtnLabel: { color: '#fff', fontWeight: '700', fontSize: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryValue: { fontSize: 17, fontWeight: '700' },
  summaryLabel: { fontSize: 12, marginTop: 4 },
  coachRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: 10 },
  coachText: { flex: 1, fontSize: 13, lineHeight: 19 },
});
