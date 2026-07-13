import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useAppSelector } from '@/app/hooks';
import { useLogout } from '@/features/auth/useAuthActions';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';

type Props = CompositeScreenProps<BottomTabScreenProps<MainTabParamList, 'ProfileTab'>, NativeStackScreenProps<RootStackParamList>>;

const MENU: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; route: keyof RootStackParamList }[] = [
  { icon: 'trophy-outline', label: 'Achievements', route: 'Achievements' },
  { icon: 'flag-checkered', label: 'Challenges', route: 'Challenges' },
  { icon: 'chart-line', label: 'Progress Analytics', route: 'ProgressAnalytics' },
  { icon: 'history', label: 'Activity History', route: 'ActivityHistory' },
  { icon: 'heart-pulse', label: 'Heart Rate', route: 'HeartRate' },
  { icon: 'account-group-outline', label: 'Community', route: 'CommunityFeed' },
  { icon: 'cog-outline', label: 'Settings', route: 'Settings' },
];

export function ProfileScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const user = useAppSelector((state) => state.auth.user);
  const logout = useLogout();

  return (
    <ScreenContainer>
      <View style={styles.header}>
        {user?.photoUrl ? (
          <Image source={{ uri: user.photoUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }]}>
            <MaterialCommunityIcons name="account" size={40} color="#fff" />
          </View>
        )}
        <Text style={[styles.name, { color: colors.text }]}>{user?.name}</Text>
        <Text style={[styles.email, { color: colors.textMuted }]}>{user?.email}</Text>
        <TouchableOpacity style={[styles.editBtn, { borderColor: colors.primary }]} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.metricsRow}>
        <Metric label="Age" value={user?.age ? `${user.age}` : '--'} />
        <Metric label="Height" value={user?.heightCm ? `${user.heightCm} cm` : '--'} />
        <Metric label="Weight" value={user?.weightKg ? `${user.weightKg} kg` : '--'} />
        <Metric label="BMI" value={user?.bmi ? `${user.bmi.bmi}` : '--'} />
      </View>

      <Card style={{ marginTop: 8 }}>
        <Row label="Fitness Goal" value={user?.fitnessGoal?.replace('_', ' ') ?? 'Not set'} />
        <Row label="Experience" value={user?.experienceLevel ?? 'Not set'} />
        <Row label="Target Weight" value={user?.targetWeightKg ? `${user.targetWeightKg} kg` : 'Not set'} />
        <Row label="Medical Conditions" value={user?.medicalConditions?.length ? user.medicalConditions.join(', ') : 'None'} last />
      </Card>

      <SectionHeader title="More" />
      <Card style={{ padding: 0 }}>
        {MENU.map((item, idx) => (
          <TouchableOpacity
            key={item.route}
            style={[styles.menuRow, idx !== MENU.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
            onPress={() => navigation.navigate(item.route as any)}
          >
            <MaterialCommunityIcons name={item.icon} size={20} color={colors.primary} />
            <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </Card>

      <TouchableOpacity style={[styles.logout, { borderColor: colors.danger }]} onPress={() => logout.mutate()}>
        <Text style={{ color: colors.danger, fontWeight: '700' }}>Log Out</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.metric}>
      <Text style={[styles.metricValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.metricLabel, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  const { colors, isDark } = useAppTheme();
  return (
    <View style={[styles.row, !last && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
      <Text style={{ color: colors.textMuted, fontSize: 13 }}>{label}</Text>
      <Text style={{ color: colors.text, fontWeight: '600', fontSize: 13, textTransform: 'capitalize' }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 88, height: 88, borderRadius: 44, marginBottom: 12 },
  name: { fontSize: 20, fontWeight: '800' },
  email: { fontSize: 13, marginTop: 2 },
  editBtn: { marginTop: 12, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  metric: { alignItems: 'center', flex: 1 },
  metricValue: { fontSize: 17, fontWeight: '700' },
  metricLabel: { fontSize: 12, marginTop: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '600' },
  logout: { marginTop: 24, borderWidth: 1.5, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
});
