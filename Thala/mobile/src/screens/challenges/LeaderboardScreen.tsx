import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { Card } from '@/components/Card';
import { LoadingView } from '@/components/LoadingView';
import { useAppTheme } from '@/theme/ThemeProvider';
import { getLeaderboard } from '@/api/challenges';
import { useAppSelector } from '@/app/hooks';

export function LeaderboardScreen({ route }: NativeStackScreenProps<RootStackParamList, 'Leaderboard'>) {
  const { colors } = useAppTheme();
  const currentUser = useAppSelector((state) => state.auth.user);
  const { data, isLoading } = useQuery({
    queryKey: ['challenges', route.params.challengeId, 'leaderboard'],
    queryFn: () => getLeaderboard(route.params.challengeId),
  });

  if (isLoading || !data) return <LoadingView />;

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      data={data.leaderboard}
      keyExtractor={(item) => item.userId}
      contentContainerStyle={{ padding: 16 }}
      ListHeaderComponent={<Text style={[styles.title, { color: colors.text }]}>{data.challenge.title}</Text>}
      renderItem={({ item }) => (
        <Card style={[styles.row, item.userId === currentUser?.id && { borderColor: colors.primary, borderWidth: 2 }]}>
          <Text style={[styles.rank, { color: item.rank <= 3 ? colors.accent : colors.textMuted }]}>#{item.rank}</Text>
          {item.photoUrl ? (
            <Image source={{ uri: item.photoUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.primary }]} />
          )}
          <Text style={{ color: colors.text, flex: 1, marginLeft: 12, fontWeight: '600' }}>{item.name}</Text>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>{item.progress}</Text>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '800', marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  rank: { fontWeight: '800', width: 32 },
  avatar: { width: 36, height: 36, borderRadius: 18 },
});
