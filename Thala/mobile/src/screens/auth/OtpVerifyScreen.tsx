import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/types';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useRequestOtp, useVerifyOtp } from '@/features/auth/useAuthActions';

export function OtpVerifyScreen({ route, navigation }: NativeStackScreenProps<AuthStackParamList, 'OtpVerify'>) {
  const { colors } = useAppTheme();
  const { purpose } = route.params;
  const [destination, setDestination] = useState(route.params.destination);
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();

  const send = () => {
    if (!destination) {
      Toast.show({ type: 'error', text1: 'Enter your email or phone number' });
      return;
    }
    requestOtp.mutate(
      { destination, purpose },
      {
        onSuccess: (res) => {
          setSent(true);
          Toast.show({ type: 'success', text1: 'OTP sent', text2: res.devHint ? `Dev code: ${res.devHint}` : undefined });
        },
      },
    );
  };

  const verify = () => {
    verifyOtp.mutate(
      { destination, code, purpose },
      {
        onSuccess: () => {
          Toast.show({ type: 'success', text1: 'Verified!' });
        },
        onError: () => Toast.show({ type: 'error', text1: 'Invalid or expired code' }),
      },
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Login with OTP</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          We'll send a one-time code to verify it's you (demo code is always 123456).
        </Text>

        <TextInput
          mode="outlined"
          label="Email or phone"
          value={destination}
          onChangeText={setDestination}
          autoCapitalize="none"
          editable={!sent}
          style={styles.input}
        />

        {sent && (
          <TextInput mode="outlined" label="OTP Code" value={code} onChangeText={setCode} keyboardType="number-pad" style={styles.input} />
        )}

        <Button mode="contained" loading={requestOtp.isPending} style={styles.button} onPress={sent ? send : send}>
          {sent ? 'Resend Code' : 'Send Code'}
        </Button>

        {sent && (
          <Button mode="contained-tonal" loading={verifyOtp.isPending} style={styles.button} onPress={verify}>
            Verify & Continue
          </Button>
        )}

        <Text style={[styles.back, { color: colors.primary }]} onPress={() => navigation.navigate('Login')}>
          Back to login
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 6 },
  subtitle: { fontSize: 14, marginBottom: 24, lineHeight: 20 },
  input: { marginBottom: 12 },
  button: { marginTop: 8, borderRadius: 12 },
  back: { textAlign: 'center', marginTop: 20, fontWeight: '600' },
});
