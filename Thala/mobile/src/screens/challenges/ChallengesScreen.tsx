import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { Card } from '@/components/Card';
import { LoadingView } from '@/components/LoadingView';
import { useAppTheme } from '@/theme/ThemeProvider';
import { joinChallenge, listChallenges } from '@/api/challenges';
import type { ChallengeFrequency } from '@/types/models';

const FREQUENCIES: { key: ChallengeFrequency; label: string }[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

export function ChallengesScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Challenges'>) {
  const { colors } = useAppTheme();
  const [frequency, setFrequency] = useState<ChallengeFrequency>('daily');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['challenges', frequency], queryFn: () => listChallenges(frequency) });

  const join = useMutation({
    mutationFn: joinChallenge,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['challenges'] }),
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.freqRow}>
        {FREQUENCIES.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.chip, { borderColor: colors.primary }, frequency === f.key && { backgroundColor: colors.primary }]}
            onPress={() => setFrequency(f.key)}
          >
            <Text style={{ color: frequency === f.key ? '#fff' : colors.primary, fontWeight: '700', fontSize: 12 }}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <LoadingView />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => {
            const progressPct = Math.min(100, Math.round((item.myProgress / item.targetValue) * 100));
            return (
              <Card style={{ marginBottom: 12 }}>
                <View style={styles.headerRow}>
                  <Text style={{ color: colors.text, fontWeight: '700', flex: 1 }}>{item.title}</Text>
                  {item.completed && <MaterialCommunityIcons name="check-circle" size={20} color={colors.primary} />}
                </View>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>{item.description}</Text>

                <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                  <View style={[styles.progressFill, { width: `${progressPct}%`, backgroundColor: colors.primary }]} />
                </View>
                <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 4 }}>
                  {item.myProgress} / {item.targetValue} {item.unit}
                </Text>

                <View style={styles.actionsRow}>
                  {!item.joined && (
                    <Button mode="contained" compact onPress={() => join.mutate(item.id)}>
                      Join Challenge
                    </Button>
                  )}
                  <Button mode="text" compact onPress={() => navigation.navigate('Leaderboard', { challengeId: item.id })}>
                    Leaderboard
                  </Button>
                </View>
              </Card>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  freqRow: { flexDirection: 'row', gap: 8, padding: 16, paddingBottom: 0 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 18, borderWidth: 1.5 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  progressTrack: { height: 8, borderRadius: 4, marginTop: 10, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
});
