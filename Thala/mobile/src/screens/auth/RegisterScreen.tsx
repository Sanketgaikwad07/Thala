import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/types';
import { FormTextInput } from '@/components/FormTextInput';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useRegister } from '@/features/auth/useAuthActions';

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export function RegisterScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Register'>) {
  const { colors } = useAppTheme();
  const { control, handleSubmit } = useForm<RegisterForm>();
  const register = useRegister();

  const onSubmit = (values: RegisterForm) => {
    register.mutate(values, {
      onError: (err: any) => Toast.show({ type: 'error', text1: err?.response?.data?.message ?? 'Registration failed' }),
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Create your account</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Start tracking your fitness journey today</Text>

        <FormTextInput control={control} name="name" label="Full name" rules={{ required: 'Name is required' }} />
        <FormTextInput
          control={control}
          name="email"
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          rules={{ required: 'Email is required' }}
        />
        <FormTextInput control={control} name="phone" label="Phone (optional)" keyboardType="phone-pad" />
        <FormTextInput
          control={control}
          name="password"
          label="Password"
          secureTextEntry
          rules={{ required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } }}
        />

        <Button mode="contained" loading={register.isPending} onPress={handleSubmit(onSubmit)} style={styles.button}>
          Create Account
        </Button>

        <View style={styles.footerRow}>
          <Text style={{ color: colors.textMuted }}>Already have an account? </Text>
          <Text style={{ color: colors.primary, fontWeight: '700' }} onPress={() => navigation.navigate('Login')}>
            Log in
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 6 },
  subtitle: { fontSize: 14, marginBottom: 24 },
  button: { marginTop: 12, borderRadius: 12 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
});
