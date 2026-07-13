import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { LoadingView } from '@/components/LoadingView';
import { useAppTheme } from '@/theme/ThemeProvider';
import { getActivity } from '@/api/activities';
import { formatDuration } from '@/utils/activityMath';

export function ActivitySummaryScreen({ route }: NativeStackScreenProps<RootStackParamList, 'ActivitySummary'>) {
  const { colors } = useAppTheme();
  const { data: session, isLoading } = useQuery({
    queryKey: ['activities', route.params.sessionId],
    queryFn: () => getActivity(route.params.sessionId),
  });

  if (isLoading || !session) return <LoadingView label="Loading activity..." />;

  const hasRoute = session.route.length > 1;

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name={session.type === 'running' ? 'run' : session.type === 'cycling' ? 'bike' : 'walk'}
          size={28}
          color={colors.primary}
        />
        <Text style={[styles.title, { color: colors.text }]}>
          {session.type.charAt(0).toUpperCase() + session.type.slice(1)} Complete!
        </Text>
        <Text style={{ color: colors.textMuted }}>{new Date(session.startedAt).toLocaleString()}</Text>
      </View>

      {hasRoute && (
        <View style={styles.mapWrap}>
          <MapView
            style={StyleSheet.absoluteFillObject}
            provider={PROVIDER_GOOGLE}
            scrollEnabled={false}
            zoomEnabled={false}
            initialRegion={{
              latitude: session.route[0].latitude,
              longitude: session.route[0].longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <Polyline coordinates={session.route} strokeColor={colors.primary} strokeWidth={4} />
            <Marker coordinate={session.route[0]} pinColor="green" />
            <Marker coordinate={session.route[session.route.length - 1]} pinColor="red" />
          </MapView>
        </View>
      )}

      <View style={styles.statsGrid}>
        <Stat label="Distance" value={`${session.distanceKm.toFixed(2)} km`} />
        <Stat label="Duration" value={formatDuration(session.durationSeconds)} />
        <Stat label="Calories" value={`${session.calories} kcal`} />
        {session.avgPaceMinPerKm ? <Stat label="Avg Pace" value={`${session.avgPaceMinPerKm.toFixed(2)} /km`} /> : null}
        {session.avgSpeedKmh ? <Stat label="Avg Speed" value={`${session.avgSpeedKmh.toFixed(1)} km/h`} /> : null}
        {session.elevationGainM ? <Stat label="Elevation" value={`${session.elevationGainM} m`} /> : null}
        {session.steps ? <Stat label="Steps" value={`${session.steps}`} /> : null}
      </View>
    </ScreenContainer>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();
  return (
    <Card style={styles.statCard}>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textMuted }]}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: 16, gap: 4 },
  title: { fontSize: 20, fontWeight: '800', marginTop: 8 },
  mapWrap: { height: 220, borderRadius: 20, overflow: 'hidden', marginBottom: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', marginBottom: 12, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 12, marginTop: 4 },
});
