import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthStackParamList } from './types';
import { OnboardingScreen, ONBOARDING_KEY } from '@/screens/auth/OnboardingScreen';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { RegisterScreen } from '@/screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '@/screens/auth/ForgotPasswordScreen';
import { OtpVerifyScreen } from '@/screens/auth/OtpVerifyScreen';
import { LoadingView } from '@/components/LoadingView';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((value) => setHasOnboarded(value === 'true'));
  }, []);

  if (hasOnboarded === null) return <LoadingView />;

  return (
    <Stack.Navigator
      initialRouteName={hasOnboarded ? 'Login' : 'Onboarding'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} />
    </Stack.Navigator>
  );
}
