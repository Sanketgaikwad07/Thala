import React, { useState } from 'react';
import { Alert, Share, StyleSheet, Text, View } from 'react-native';
import { List, RadioButton, Switch } from 'react-native-paper';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setLanguage, setNotificationsEnabled, setThemeMode, ThemeMode } from '@/features/ui/uiSlice';
import { deleteAccount, exportMyData } from '@/api/users';
import { useLogout } from '@/features/auth/useAuthActions';

export function SettingsScreen({}: NativeStackScreenProps<RootStackParamList, 'Settings'>) {
  const { colors } = useAppTheme();
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.ui.themeMode);
  const notificationsEnabled = useAppSelector((state) => state.ui.notificationsEnabled);
  const language = useAppSelector((state) => state.ui.language);
  const logout = useLogout();

  const exportData = useMutation({
    mutationFn: exportMyData,
    onSuccess: async (data) => {
      await Share.share({ message: JSON.stringify(data, null, 2).slice(0, 4000) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => logout.mutate(),
  });

  const confirmDelete = () => {
    Alert.alert('Delete account', 'This permanently deletes your account and all data. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate() },
    ]);
  };

  return (
    <ScreenContainer>
      <SectionHeader title="Appearance" />
      <Card>
        <RadioButton.Group value={themeMode} onValueChange={(v) => dispatch(setThemeMode(v as ThemeMode))}>
          <RadioButton.Item label="Light Mode" value="light" />
          <RadioButton.Item label="Dark Mode" value="dark" />
          <RadioButton.Item label="Follow System" value="system" />
        </RadioButton.Group>
      </Card>

      <SectionHeader title="Notifications" />
      <Card>
        <View style={styles.switchRow}>
          <Text style={{ color: colors.text }}>Push Notifications</Text>
          <Switch value={notificationsEnabled} onValueChange={(v) => { dispatch(setNotificationsEnabled(v)); }} />
        </View>
      </Card>

      <SectionHeader title="Language" />
      <Card>
        <RadioButton.Group value={language} onValueChange={(v) => dispatch(setLanguage(v as 'en' | 'hi' | 'es'))}>
          <RadioButton.Item label="English" value="en" />
          <RadioButton.Item label="Hindi" value="hi" />
          <RadioButton.Item label="Spanish" value="es" />
        </RadioButton.Group>
      </Card>

      <SectionHeader title="Privacy & Data" />
      <Card style={{ padding: 0 }}>
        <List.Item title="Privacy Policy" left={(props) => <List.Icon {...props} icon="shield-lock-outline" />} onPress={() => Toast.show({ type: 'info', text1: 'Privacy policy coming soon' })} />
        <List.Item
          title="Export My Data"
          left={(props) => <List.Icon {...props} icon="download-outline" />}
          onPress={() => exportData.mutate()}
        />
        <List.Item
          title="Delete Account"
          titleStyle={{ color: colors.danger }}
          left={(props) => <List.Icon {...props} icon="delete-outline" color={colors.danger} />}
          onPress={confirmDelete}
        />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
});
