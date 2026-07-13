import React, { useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput, Button } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { useAppTheme } from '@/theme/ThemeProvider';
import { createPost, getFeed, sharePost, toggleLike } from '@/api/community';

export function CommunityFeedScreen({}: NativeStackScreenProps<RootStackParamList, 'CommunityFeed'>) {
  const { colors } = useAppTheme();
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['community', 'feed'], queryFn: () => getFeed(1) });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['community', 'feed'] });
  const postMutation = useMutation({ mutationFn: (text: string) => createPost(text), onSuccess: () => { setContent(''); invalidate(); } });
  const likeMutation = useMutation({ mutationFn: toggleLike, onSuccess: invalidate });
  const shareMutation = useMutation({ mutationFn: sharePost, onSuccess: invalidate });

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        data={data?.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={!isLoading ? <EmptyState icon="account-group-outline" title="No posts yet" /> : null}
        ListHeaderComponent={
          <Card style={{ marginBottom: 16 }}>
            <TextInput
              mode="outlined"
              placeholder="Share your workout or run..."
              value={content}
              onChangeText={setContent}
              multiline
              style={{ marginBottom: 10 }}
            />
            <Button mode="contained" disabled={!content.trim()} loading={postMutation.isPending} onPress={() => postMutation.mutate(content)}>
              Post
            </Button>
          </Card>
        }
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 14 }}>
            <View style={styles.authorRow}>
              {item.author?.photoUrl ? (
                <Image source={{ uri: item.author.photoUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: colors.primary }]} />
              )}
              <View style={{ marginLeft: 10 }}>
                <Text style={{ color: colors.text, fontWeight: '700' }}>{item.author?.name ?? 'Unknown'}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 11 }}>{new Date(item.createdAt).toLocaleString()}</Text>
              </View>
            </View>
            <Text style={{ color: colors.text, marginTop: 10, lineHeight: 20 }}>{item.content}</Text>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.action} onPress={() => likeMutation.mutate(item.id)}>
                <MaterialCommunityIcons
                  name={item.likedByMe ? 'heart' : 'heart-outline'}
                  size={20}
                  color={item.likedByMe ? colors.danger : colors.textMuted}
                />
                <Text style={{ color: colors.textMuted, marginLeft: 6 }}>{item.likeCount}</Text>
              </TouchableOpacity>
              <View style={styles.action}>
                <MaterialCommunityIcons name="comment-outline" size={20} color={colors.textMuted} />
                <Text style={{ color: colors.textMuted, marginLeft: 6 }}>{item.commentCount}</Text>
              </View>
              <TouchableOpacity style={styles.action} onPress={() => shareMutation.mutate(item.id)}>
                <MaterialCommunityIcons name="share-outline" size={20} color={colors.textMuted} />
                <Text style={{ color: colors.textMuted, marginLeft: 6 }}>{item.shares}</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  authorRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  actionsRow: { flexDirection: 'row', gap: 24, marginTop: 14, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#8883' },
  action: { flexDirection: 'row', alignItems: 'center' },
});
