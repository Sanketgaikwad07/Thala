import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme/ThemeProvider';

interface Props {
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon = 'information-outline', title, subtitle }: Props) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={40} color={colors.textMuted} />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 6 },
  title: { fontSize: 15, fontWeight: '600', marginTop: 8 },
  subtitle: { fontSize: 13, textAlign: 'center', paddingHorizontal: 24 },
});
