import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLine } from 'victory-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { LoadingView } from '@/components/LoadingView';
import { useAppTheme } from '@/theme/ThemeProvider';
import { getAnalyticsOverview } from '@/api/analytics';

const CHART_WIDTH = Dimensions.get('window').width - 32;
const RANGES: { key: 'daily' | 'weekly' | 'monthly'; label: string }[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

export function ProgressAnalyticsScreen({}: NativeStackScreenProps<RootStackParamList, 'ProgressAnalytics'>) {
  const { colors } = useAppTheme();
  const [range, setRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const { data, isLoading } = useQuery({ queryKey: ['analytics', range], queryFn: () => getAnalyticsOverview(range) });

  if (isLoading || !data) return <LoadingView />;

  const distanceData = data.distance.map((d, i) => ({ x: i + 1, y: d.distanceKm }));
  const caloriesData = data.calories.map((d, i) => ({ x: i + 1, y: d.caloriesBurned }));
  const weightData = data.weight.slice(-14).map((d, i) => ({ x: i + 1, y: d.weightKg }));
  const bmiData = data.bmi.slice(-14).map((d, i) => ({ x: i + 1, y: d.bmi }));
  const workoutTimeData = data.workoutTime.map((d, i) => ({ x: i + 1, y: d.exerciseMinutes }));

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.text }]}>Progress Analytics</Text>

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

      <ChartCard title="Distance (km)" data={distanceData} color={colors.primary} type="line" />
      <ChartCard title="Calories Burned" data={caloriesData} color={colors.accent} type="bar" />
      <ChartCard title="Workout Time (min)" data={workoutTimeData} color="#8b5cf6" type="bar" />
      <ChartCard title="Weight Trend (kg)" data={weightData} color="#3b82f6" type="line" />
      <ChartCard title="BMI Trend" data={bmiData} color="#22c55e" type="line" />
    </ScreenContainer>
  );
}

function ChartCard({
  title,
  data,
  color,
  type,
}: {
  title: string;
  data: { x: number; y: number }[];
  color: string;
  type: 'line' | 'bar';
}) {
  const { colors } = useAppTheme();
  return (
    <View>
      <SectionHeader title={title} />
      <Card>
        {data.length > 0 ? (
          <VictoryChart width={CHART_WIDTH} height={180} padding={{ top: 10, bottom: 30, left: 40, right: 20 }}>
            <VictoryAxis dependentAxis style={{ tickLabels: { fill: colors.textMuted, fontSize: 9 } }} />
            <VictoryAxis style={{ tickLabels: { fill: 'transparent' } }} />
            {type === 'line' ? (
              <VictoryLine data={data} style={{ data: { stroke: color, strokeWidth: 2 } }} />
            ) : (
              <VictoryBar data={data} style={{ data: { fill: color } }} cornerRadius={{ top: 4 }} />
            )}
          </VictoryChart>
        ) : (
          <Text style={{ color: colors.textMuted, textAlign: 'center', paddingVertical: 20 }}>No data yet</Text>
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  rangeRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 18, borderWidth: 1.5 },
});
