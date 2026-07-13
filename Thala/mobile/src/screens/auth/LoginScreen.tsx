import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Text as PaperText } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Toast from 'react-native-toast-message';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/types';
import { FormTextInput } from '@/components/FormTextInput';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useGoogleSignIn, useLogin } from '@/features/auth/useAuthActions';
import { GOOGLE_WEB_CLIENT_ID } from '@/constants/config';

WebBrowser.maybeCompleteAuthSession();

interface LoginForm {
  email: string;
  password: string;
}

export function LoginScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Login'>) {
  const { colors } = useAppTheme();
  const [secure, setSecure] = useState(true);
  const { control, handleSubmit } = useForm<LoginForm>({ defaultValues: { email: 'demo@thala.app', password: '' } });
  const login = useLogin();
  const googleSignIn = useGoogleSignIn();

  const [, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
    clientId: GOOGLE_WEB_CLIENT_ID || undefined,
  });

  React.useEffect(() => {
    if (googleResponse?.type === 'success' && googleResponse.authentication?.idToken) {
      googleSignIn.mutate(googleResponse.authentication.idToken, {
        onError: () => Toast.show({ type: 'error', text1: 'Google sign-in failed' }),
      });
    }
  }, [googleResponse]);

  const onSubmit = (values: LoginForm) => {
    login.mutate(values, {
      onError: () => Toast.show({ type: 'error', text1: 'Invalid email or password' }),
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoWrap}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
            <MaterialCommunityIcons name="run-fast" size={36} color="#fff" />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>Thala Fitness</Text>
          <Text style={[styles.tagline, { color: colors.textMuted }]}>Train smarter. Move further.</Text>
        </View>

        <FormTextInput
          control={control}
          name="email"
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          left={<MaterialCommunityIcons name="email-outline" size={18} />}
          rules={{ required: 'Email is required' }}
        />
        <FormTextInput
          control={control}
          name="password"
          label="Password"
          secureTextEntry={secure}
          right={
            <PaperText onPress={() => setSecure((s) => !s)} style={{ paddingRight: 8 }}>
              {secure ? 'Show' : 'Hide'}
            </PaperText>
          }
          rules={{ required: 'Password is required' }}
        />

        <Text style={[styles.forgot, { color: colors.primary }]} onPress={() => navigation.navigate('ForgotPassword')}>
          Forgot password?
        </Text>

        <Button mode="contained" loading={login.isPending} onPress={handleSubmit(onSubmit)} style={styles.button}>
          Log In
        </Button>

        <Button
          mode="outlined"
          icon="cellphone-message"
          style={styles.button}
          onPress={() => navigation.navigate('OtpVerify', { destination: '', purpose: 'login' })}
        >
          Login with OTP
        </Button>

        <Button mode="outlined" icon="google" style={styles.button} onPress={() => promptGoogleAsync()} loading={googleSignIn.isPending}>
          Continue with Google
        </Button>

        <View style={styles.footerRow}>
          <Text style={{ color: colors.textMuted }}>Don't have an account? </Text>
          <Text style={{ color: colors.primary, fontWeight: '700' }} onPress={() => navigation.navigate('Register')}>
            Sign up
          </Text>
        </View>

        <Text style={[styles.demoHint, { color: colors.textMuted }]}>Demo login: demo@thala.app / Demo@1234</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  logoWrap: { alignItems: 'center', marginBottom: 32 },
  logoCircle: { width: 72, height: 72, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  appName: { fontSize: 24, fontWeight: '800' },
  tagline: { fontSize: 13, marginTop: 4 },
  forgot: { textAlign: 'right', marginBottom: 16, fontWeight: '600' },
  button: { marginTop: 10, borderRadius: 12 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  demoHint: { textAlign: 'center', marginTop: 16, fontSize: 12 },
});
