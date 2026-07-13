import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { VictoryAxis, VictoryChart, VictoryLine, VictoryScatter } from 'victory-native';
import { TextInput, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { useAppTheme } from '@/theme/ThemeProvider';
import { addHeartRate, getHeartRate } from '@/api/heartRate';

const RANGES: { key: 'daily' | 'weekly' | 'monthly'; label: string }[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

const CHART_WIDTH = Dimensions.get('window').width - 32;

export function HeartRateScreen({}: NativeStackScreenProps<RootStackParamList, 'HeartRate'>) {
  const { colors } = useAppTheme();
  const [range, setRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [manualBpm, setManualBpm] = useState('');
  const queryClient = useQueryClient();

  const { data } = useQuery({ queryKey: ['heartRate', range], queryFn: () => getHeartRate(range) });

  const addMutation = useMutation({
    mutationFn: (bpm: number) => addHeartRate(bpm, 'manual'),
    onSuccess: () => {
      setManualBpm('');
      queryClient.invalidateQueries({ queryKey: ['heartRate'] });
    },
  });

  const chartData = (data?.entries ?? []).map((entry, idx) => ({ x: idx + 1, y: entry.bpm }));

  return (
    <ScreenContainer>
      <View style={styles.rangeRow}>
        {RANGES.map((r) => (
          <TouchableOpacity
            key={r.key}
            style={[styles.chip, { borderColor: colors.primary }, range === r.key && { backgroundColor: colors.primary }]}
            onPress={() => setRange(r.key)}
          >
            <Text style={{ color: range === r.key ? '#fff' : colors.primary, fontWeight: '700', fontSize: 12 }}>{r.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsRow}>
        <Stat label="Average" value={`${data?.stats.avg ?? 0}`} />
        <Stat label="Max" value={`${data?.stats.max ?? 0}`} />
        <Stat label="Min" value={`${data?.stats.min ?? 0}`} />
      </View>

      <Card>
        {chartData.length > 1 ? (
          <VictoryChart width={CHART_WIDTH} height={220} padding={{ top: 20, bottom: 30, left: 40, right: 20 }}>
            <VictoryAxis dependentAxis style={{ tickLabels: { fill: colors.textMuted, fontSize: 10 } }} />
            <VictoryAxis style={{ tickLabels: { fill: colors.textMuted, fontSize: 10 } }} />
            <VictoryLine data={chartData} style={{ data: { stroke: colors.danger, strokeWidth: 2 } }} />
            <VictoryScatter data={chartData} size={3} style={{ data: { fill: colors.danger } }} />
          </VictoryChart>
        ) : (
          <EmptyState icon="heart-pulse" title="Not enough data yet" subtitle="Log a reading below to start your trend." />
        )}
      </Card>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Log a Reading</Text>
      <Card>
        <View style={styles.manualRow}>
          <MaterialCommunityIcons name="heart-pulse" size={22} color={colors.danger} />
          <TextInput
            mode="outlined"
            placeholder="BPM"
            keyboardType="number-pad"
            value={manualBpm}
            onChangeText={setManualBpm}
            style={{ flex: 1, marginHorizontal: 12 }}
          />
          <Button
            mode="contained"
            loading={addMutation.isPending}
            disabled={!manualBpm}
            onPress={() => addMutation.mutate(Number(manualBpm))}
          >
            Save
          </Button>
        </View>
        <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 8 }}>
          If a smartwatch is connected via Health Connect / HealthKit, readings sync automatically as "device" entries.
        </Text>
      </Card>
    </ScreenContainer>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();
  return (
    <Card style={styles.statCard}>
      <Text style={[styles.statValue, { color: colors.danger }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textMuted }]}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  rangeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 18, borderWidth: 1.5 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 12, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 20, marginBottom: 10 },
  manualRow: { flexDirection: 'row', alignItems: 'center' },
});
