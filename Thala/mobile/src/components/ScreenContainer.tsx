import React from 'react';
import { ScrollView, ScrollViewProps, View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/theme/ThemeProvider';

interface Props extends ViewProps {
  scroll?: boolean;
  children: React.ReactNode;
  refreshControl?: ScrollViewProps['refreshControl'];
}

export function ScreenContainer({ scroll = true, children, style, refreshControl, ...rest }: Props) {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[{ padding: 16, paddingBottom: 32 }, style]}
          refreshControl={refreshControl}
          {...rest}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1, padding: 16 }, style]} {...rest}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}
