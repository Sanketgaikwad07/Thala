import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { LoadingView } from '@/components/LoadingView';
import { EmptyState } from '@/components/EmptyState';
import { useAppTheme } from '@/theme/ThemeProvider';
import { getAiCoachRecommendations } from '@/api/nutrition';

const CATEGORY_COLORS: Record<string, string> = {
  activity: '#0f8a58',
  nutrition: '#f59e0b',
  sleep: '#8b5cf6',
  hydration: '#3b82f6',
  recovery: '#22c55e',
  performance: '#ff6b00',
};

export function AiCoachScreen({}: NativeStackScreenProps<RootStackParamList, 'AiCoach'>) {
  const { colors } = useAppTheme();
  const { data, isLoading } = useQuery({ queryKey: ['nutrition', 'ai-coach'], queryFn: getAiCoachRecommendations });

  if (isLoading) return <LoadingView />;

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <MaterialCommunityIcons name="robot-happy-outline" size={32} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>Your AI Fitness Coach</Text>
        <Text style={{ color: colors.textMuted, textAlign: 'center' }}>
          Personalized tips based on your recent activity, sleep, hydration and heart rate
        </Text>
      </View>

      {data && data.length > 0 ? (
        data.map((rec) => (
          <Card key={rec.id} style={styles.recCard}>
            <View style={[styles.iconWrap, { backgroundColor: `${CATEGORY_COLORS[rec.category] ?? colors.primary}22` }]}>
              <MaterialCommunityIcons name={rec.icon as any} size={22} color={CATEGORY_COLORS[rec.category] ?? colors.primary} />
            </View>
            <Text style={{ color: colors.text, flex: 1, marginLeft: 12, lineHeight: 20 }}>{rec.message}</Text>
          </Card>
        ))
      ) : (
        <EmptyState icon="robot-confused-outline" title="No recommendations yet" subtitle="Log some activity to get personalized coaching." />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', gap: 8, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '800', marginTop: 4 },
  recCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
