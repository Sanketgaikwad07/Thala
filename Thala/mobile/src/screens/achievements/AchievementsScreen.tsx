import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { Card } from '@/components/Card';
import { LoadingView } from '@/components/LoadingView';
import { useAppTheme } from '@/theme/ThemeProvider';
import { evaluateAchievements, listAchievements } from '@/api/achievements';

export function AchievementsScreen({}: NativeStackScreenProps<RootStackParamList, 'Achievements'>) {
  const { colors } = useAppTheme();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['achievements'], queryFn: listAchievements });

  const evaluate = useMutation({
    mutationFn: evaluateAchievements,
    onSuccess: (result) => {
      queryClient.setQueryData(['achievements'], result.achievements);
      if (result.newlyUnlocked.length > 0) {
        Toast.show({ type: 'success', text1: `Unlocked: ${result.newlyUnlocked.join(', ')}` });
      } else {
        Toast.show({ type: 'info', text1: 'No new badges yet - keep going!' });
      }
    },
  });

  if (isLoading) return <LoadingView />;

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      data={data ?? []}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={{ padding: 16 }}
      columnWrapperStyle={{ gap: 12 }}
      ListHeaderComponent={
        <Button mode="outlined" style={{ marginBottom: 16, borderRadius: 12 }} loading={evaluate.isPending} onPress={() => evaluate.mutate()}>
          Check for new badges
        </Button>
      }
      renderItem={({ item }) => (
        <Card style={[styles.card, !item.unlocked && { opacity: 0.4 }]}>
          <View style={[styles.iconWrap, { backgroundColor: item.unlocked ? `${colors.accent}22` : colors.border }]}>
            <MaterialCommunityIcons name="medal-outline" size={30} color={item.unlocked ? colors.accent : colors.textMuted} />
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{item.title}</Text>
          <Text style={{ color: colors.textMuted, fontSize: 11, textAlign: 'center', marginTop: 4 }}>{item.description}</Text>
          {item.unlocked && item.unlockedAt ? (
            <Text style={{ color: colors.primary, fontSize: 10, marginTop: 6, fontWeight: '700' }}>
              {new Date(item.unlockedAt).toLocaleDateString()}
            </Text>
          ) : null}
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, alignItems: 'center', paddingVertical: 20, marginBottom: 12 },
  iconWrap: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  name: { fontWeight: '700', fontSize: 13, textAlign: 'center' },
});
