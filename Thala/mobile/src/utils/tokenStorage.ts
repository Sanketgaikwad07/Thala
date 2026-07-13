import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '@/constants/config';

export async function saveTokens(accessToken: string, refreshToken: string) {
  await Promise.all([
    SecureStore.setItemAsync(STORAGE_KEYS.accessToken, accessToken),
    SecureStore.setItemAsync(STORAGE_KEYS.refreshToken, refreshToken),
  ]);
}

export async function getAccessToken() {
  return SecureStore.getItemAsync(STORAGE_KEYS.accessToken);
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync(STORAGE_KEYS.refreshToken);
}

export async function clearTokens() {
  await Promise.all([
    SecureStore.deleteItemAsync(STORAGE_KEYS.accessToken),
    SecureStore.deleteItemAsync(STORAGE_KEYS.refreshToken),
  ]);
}
