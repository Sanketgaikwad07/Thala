export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';
export const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';

export const STORAGE_KEYS = {
  accessToken: 'thala.accessToken',
  refreshToken: 'thala.refreshToken',
  themePreference: 'thala.themePreference',
} as const;
