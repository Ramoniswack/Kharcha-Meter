import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import 'react-native-url-polyfill/auto';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}