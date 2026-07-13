import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { LoadingView } from '@/components/LoadingView';
import { useAppTheme } from '@/theme/ThemeProvider';
import { listActivities } from '@/api/activities';
import type { ActivityType } from '@/types/models';

const FILTERS: { key: ActivityType | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'running', label: 'Running' },
  { key: 'cycling', label: 'Cycling' },
  { key: 'walking', label: 'Walking' },
];

export function ActivityHistoryScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'ActivityHistory'>) {
  const { colors } = useAppTheme();
  const [filter, setFilter] = useState<ActivityType | 'all'>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['activities', 'history', filter],
    queryFn: () => listActivities(filter === 'all' ? undefined : filter, 1),
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.chip,
              { borderColor: colors.primary },
              filter === f.key && { backgroundColor: colors.primary },
            ]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={{ color: filter === f.key ? '#fff' : colors.primary, fontWeight: '700', fontSize: 12 }}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <LoadingView />
      ) : (
        <FlatList
          data={data?.data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<EmptyState icon="run" title="No activities found" />}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('ActivitySummary', { sessionId: item.id })}>
              <Card style={styles.row}>
                <MaterialCommunityIcons
                  name={item.type === 'running' ? 'run' : item.type === 'cycling' ? 'bike' : 'walk'}
                  size={24}
                  color={colors.primary}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ color: colors.text, fontWeight: '700', textTransform: 'capitalize' }}>{item.type}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>{new Date(item.startedAt).toLocaleDateString()}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: colors.text, fontWeight: '700' }}>{item.distanceKm.toFixed(2)} km</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>{item.calories} kcal</Text>
                </View>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  filterRow: { flexDirection: 'row', gap: 8, padding: 16, paddingBottom: 0 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, borderWidth: 1.5 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
});
