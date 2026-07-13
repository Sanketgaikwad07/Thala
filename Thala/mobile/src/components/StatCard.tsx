import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from './Card';
import { useAppTheme } from '@/theme/ThemeProvider';

interface Props {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  subtitle?: string;
  color?: string;
  delay?: number;
}

export function StatCard({ icon, label, value, subtitle, color, delay = 0 }: Props) {
  const { colors } = useAppTheme();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 400 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const tint = color ?? colors.primary;

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <Card style={styles.card}>
        <View style={[styles.iconWrap, { backgroundColor: `${tint}1A` }]}>
          <MaterialCommunityIcons name={icon} size={22} color={tint} />
        </View>
        <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: tint }]}>{subtitle}</Text> : null}
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '48%', marginBottom: 12 },
  card: { paddingVertical: 14 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  value: { fontSize: 20, fontWeight: '700' },
  label: { fontSize: 13, marginTop: 2 },
  subtitle: { fontSize: 12, marginTop: 4, fontWeight: '600' },
});
