import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark' | 'system';

interface UiState {
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
  language: 'en' | 'hi' | 'es';
}

const initialState: UiState = {
  themeMode: 'system',
  notificationsEnabled: true,
  language: 'en',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.themeMode = action.payload;
    },
    setNotificationsEnabled(state, action: PayloadAction<boolean>) {
      state.notificationsEnabled = action.payload;
    },
    setLanguage(state, action: PayloadAction<UiState['language']>) {
      state.language = action.payload;
    },
  },
});

export const { setThemeMode, setNotificationsEnabled, setLanguage } = uiSlice.actions;
export default uiSlice.reducer;
