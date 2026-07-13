import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as authApi from '@/api/auth';
import { saveTokens, clearTokens } from '@/utils/tokenStorage';
import { useAppDispatch } from '@/app/hooks';
import { setUnauthenticated, setUser } from './authSlice';
import { AuthResult } from '@/api/auth';

function useAuthSuccessHandler() {
  const dispatch = useAppDispatch();
  return async (result: AuthResult) => {
    await saveTokens(result.accessToken, result.refreshToken);
    dispatch(setUser(result.user));
  };
}

export function useLogin() {
  const onSuccess = useAuthSuccessHandler();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => authApi.login(email, password),
    onSuccess,
  });
}

export function useRegister() {
  const onSuccess = useAuthSuccessHandler();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess,
  });
}

export function useGoogleSignIn() {
  const onSuccess = useAuthSuccessHandler();
  return useMutation({
    mutationFn: (idToken: string) => authApi.googleSignIn(idToken),
    onSuccess,
  });
}

export function useRequestOtp() {
  return useMutation({
    mutationFn: ({ destination, purpose }: { destination: string; purpose: 'login' | 'register' | 'reset_password' }) =>
      authApi.requestOtp(destination, purpose),
  });
}

export function useVerifyOtp() {
  const onSuccess = useAuthSuccessHandler();
  return useMutation({
    mutationFn: ({ destination, code, purpose }: { destination: string; code: string; purpose: 'login' | 'register' | 'reset_password' }) =>
      authApi.verifyOtp(destination, code, purpose),
    onSuccess: async (result) => {
      if ('accessToken' in result) {
        await onSuccess(result);
      }
    },
  });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: (email: string) => authApi.forgotPassword(email) });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ email, code, newPassword }: { email: string; code: string; newPassword: string }) =>
      authApi.resetPassword(email, code, newPassword),
  });
}

export function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: async () => {
      await clearTokens();
      queryClient.clear();
      dispatch(setUnauthenticated());
    },
  });
}
