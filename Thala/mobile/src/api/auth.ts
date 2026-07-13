import { apiClient, ApiEnvelope } from './client';
import { User } from '@/types/models';

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export async function login(email: string, password: string) {
  const { data } = await apiClient.post<ApiEnvelope<AuthResult>>('/auth/login', { email, password });
  return data.data;
}

export async function register(input: { name: string; email: string; password: string; phone?: string }) {
  const { data } = await apiClient.post<ApiEnvelope<AuthResult>>('/auth/register', input);
  return data.data;
}

export async function requestOtp(destination: string, purpose: 'login' | 'register' | 'reset_password') {
  const { data } = await apiClient.post<ApiEnvelope<{ message: string; devHint?: string }>>('/auth/otp/request', {
    destination,
    purpose,
  });
  return data.data;
}

export async function verifyOtp(destination: string, code: string, purpose: 'login' | 'register' | 'reset_password') {
  const { data } = await apiClient.post<ApiEnvelope<AuthResult | { verified: boolean }>>('/auth/otp/verify', {
    destination,
    code,
    purpose,
  });
  return data.data;
}

export async function googleSignIn(idToken: string) {
  const { data } = await apiClient.post<ApiEnvelope<AuthResult>>('/auth/google', { idToken });
  return data.data;
}

export async function forgotPassword(email: string) {
  const { data } = await apiClient.post<ApiEnvelope<{ message: string }>>('/auth/forgot-password', { email });
  return data.data;
}

export async function resetPassword(email: string, code: string, newPassword: string) {
  const { data } = await apiClient.post<ApiEnvelope<{ message: string }>>('/auth/reset-password', {
    email,
    code,
    newPassword,
  });
  return data.data;
}

export async function logout() {
  const { data } = await apiClient.post<ApiEnvelope<{ success: boolean }>>('/auth/logout');
  return data.data;
}
