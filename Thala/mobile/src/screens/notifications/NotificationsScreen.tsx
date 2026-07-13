import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { LoadingView } from '@/components/LoadingView';
import { useAppTheme } from '@/theme/ThemeProvider';
import { listNotifications, markAllAsRead, markAsRead } from '@/api/notifications';

const ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  reminder: 'bell-ring-outline',
  achievement: 'trophy-outline',
  social: 'account-group-outline',
  system: 'information-outline',
};

export function NotificationsScreen({}: NativeStackScreenProps<RootStackParamList, 'Notifications'>) {
  const { colors } = useAppTheme();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['notifications'], queryFn: listNotifications });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['notifications'] });
  const readOne = useMutation({ mutationFn: markAsRead, onSuccess: invalidate });
  const readAll = useMutation({ mutationFn: markAllAsRead, onSuccess: invalidate });

  if (isLoading) return <LoadingView />;

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      data={data ?? []}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={<EmptyState icon="bell-off-outline" title="You're all caught up" />}
      ListHeaderComponent={
        (data?.length ?? 0) > 0 ? (
          <TouchableOpacity onPress={() => readAll.mutate()} style={{ alignSelf: 'flex-end', marginBottom: 8 }}>
            <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 12 }}>Mark all as read</Text>
          </TouchableOpacity>
        ) : null
      }
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => !item.read && readOne.mutate(item.id)}>
          <Card style={[styles.row, !item.read && { borderColor: colors.primary, borderWidth: 1.5 }]}>
            <MaterialCommunityIcons name={ICONS[item.type] ?? 'bell-outline'} size={22} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ color: colors.text, fontWeight: '700' }}>{item.title}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>{item.body}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 10, marginTop: 4 }}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
            {!item.read && <View style={[styles.dot, { backgroundColor: colors.primary }]} />}
          </Card>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
});
