import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { useAppSelector } from '@/app/hooks';
import { darkColors, lightColors, AppColors } from './colors';

interface ThemeContextValue {
  colors: AppColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({ colors: lightColors, isDark: false });

export function useAppTheme() {
  return useContext(ThemeContext);
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const themeMode = useAppSelector((state) => state.ui.themeMode);

  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const paperTheme = useMemo(() => {
    const base = isDark ? MD3DarkTheme : MD3LightTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        secondary: colors.accent,
        background: colors.background,
        surface: colors.surface,
        error: colors.danger,
      },
    };
  }, [isDark, colors]);

  return (
    <ThemeContext.Provider value={{ colors, isDark }}>
      <PaperProvider theme={paperTheme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
}
