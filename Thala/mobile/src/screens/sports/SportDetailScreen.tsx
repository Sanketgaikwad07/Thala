import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { LoadingView } from '@/components/LoadingView';
import { useAppTheme } from '@/theme/ThemeProvider';
import { getSport } from '@/api/sports';

export function SportDetailScreen({ route }: NativeStackScreenProps<RootStackParamList, 'SportDetail'>) {
  const { colors } = useAppTheme();
  const { data: sport, isLoading } = useQuery({ queryKey: ['sports', route.params.sportId], queryFn: () => getSport(route.params.sportId) });

  if (isLoading || !sport) return <LoadingView />;

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.text }]}>{sport.name}</Text>
      <Text style={[styles.calories, { color: colors.accent }]}>{sport.caloriesBurnedPerHour} kcal burned per hour</Text>

      <SectionHeader title="Training Plans" />
      {sport.trainingPlans.map((plan) => (
        <Card key={plan.title} style={{ marginBottom: 10 }}>
          <View style={styles.planHeader}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{plan.title}</Text>
            <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 12 }}>{plan.durationWeeks} weeks</Text>
          </View>
          <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 4 }}>{plan.description}</Text>
        </Card>
      ))}

      <SectionHeader title="Tips" />
      <Card>
        {sport.tips.map((tip) => (
          <View key={tip} style={styles.bulletRow}>
            <MaterialCommunityIcons name="check-circle" size={16} color={colors.primary} />
            <Text style={{ color: colors.text, marginLeft: 8, flex: 1 }}>{tip}</Text>
          </View>
        ))}
      </Card>

      <SectionHeader title="Injury Prevention" />
      <Card>
        {sport.injuryPrevention.map((tip) => (
          <View key={tip} style={styles.bulletRow}>
            <MaterialCommunityIcons name="shield-alert-outline" size={16} color={colors.danger} />
            <Text style={{ color: colors.text, marginLeft: 8, flex: 1 }}>{tip}</Text>
          </View>
        ))}
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800' },
  calories: { fontWeight: '700', marginTop: 4, marginBottom: 8 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
});
