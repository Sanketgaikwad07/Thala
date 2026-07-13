import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { Card } from '@/components/Card';
import { LoadingView } from '@/components/LoadingView';
import { useAppTheme } from '@/theme/ThemeProvider';
import { listSports } from '@/api/sports';

const ICON_MAP: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  run: 'run',
  cricket: 'cricket',
  football: 'soccer',
  basketball: 'basketball',
  volleyball: 'volleyball',
  bike: 'bike',
  dumbbell: 'dumbbell',
  swim: 'swim',
  tennis: 'tennis',
  badminton: 'badminton',
};

export function SportsListScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'SportsList'>) {
  const { colors } = useAppTheme();
  const { data, isLoading } = useQuery({ queryKey: ['sports'], queryFn: listSports });

  if (isLoading) return <LoadingView />;

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      data={data ?? []}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={{ padding: 16 }}
      columnWrapperStyle={{ gap: 12 }}
      renderItem={({ item }) => (
        <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('SportDetail', { sportId: item.id })}>
          <Card style={styles.card}>
            <View style={[styles.iconWrap, { backgroundColor: `${colors.accent}22` }]}>
              <MaterialCommunityIcons name={ICON_MAP[item.icon] ?? 'trophy-outline'} size={26} color={colors.accent} />
            </View>
            <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }}>{item.caloriesBurnedPerHour} kcal/hr</Text>
          </Card>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', paddingVertical: 18, marginBottom: 12 },
  iconWrap: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  name: { fontWeight: '700', fontSize: 13 },
});
