import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/types';
import { FormTextInput } from '@/components/FormTextInput';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useForgotPassword, useResetPassword } from '@/features/auth/useAuthActions';

export function ForgotPasswordScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>) {
  const { colors } = useAppTheme();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const { control, handleSubmit, getValues } = useForm<{ email: string; code: string; newPassword: string }>();
  const forgotPassword = useForgotPassword();
  const resetPassword = useResetPassword();

  const onRequest = handleSubmit(({ email }) => {
    forgotPassword.mutate(email, {
      onSuccess: () => {
        Toast.show({ type: 'success', text1: 'Reset code sent (check console in dev mode)' });
        setStep('reset');
      },
    });
  });

  const onReset = handleSubmit(({ email, code, newPassword }) => {
    resetPassword.mutate(
      { email, code, newPassword },
      {
        onSuccess: () => {
          Toast.show({ type: 'success', text1: 'Password reset! Please log in.' });
          navigation.navigate('Login');
        },
        onError: () => Toast.show({ type: 'error', text1: 'Invalid or expired code' }),
      },
    );
  });

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Reset your password</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          {step === 'request' ? "Enter your email and we'll send a reset code." : 'Enter the code sent to your email and a new password.'}
        </Text>

        <FormTextInput
          control={control}
          name="email"
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={step === 'request'}
          rules={{ required: 'Email is required' }}
        />

        {step === 'reset' && (
          <>
            <FormTextInput control={control} name="code" label="Reset code" keyboardType="number-pad" rules={{ required: true }} />
            <FormTextInput control={control} name="newPassword" label="New password" secureTextEntry rules={{ required: true, minLength: 6 }} />
          </>
        )}

        <Button
          mode="contained"
          style={styles.button}
          loading={forgotPassword.isPending || resetPassword.isPending}
          onPress={step === 'request' ? onRequest : onReset}
        >
          {step === 'request' ? 'Send Reset Code' : 'Reset Password'}
        </Button>

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
  button: { marginTop: 12, borderRadius: 12 },
  back: { textAlign: 'center', marginTop: 20, fontWeight: '600' },
});
