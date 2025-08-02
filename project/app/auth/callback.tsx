import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallbackScreen() {
  const { colors } = useTheme();
  const { user, loading } = useAuth();
  const [debugInfo, setDebugInfo] = useState('Processing authentication...');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) {
        if (user) {
          console.log('User authenticated:', user.email);
          setDebugInfo('Authentication successful! Redirecting...');
          router.replace('/(tabs)');
        } else {
          console.log('No user found, redirecting to login');
          setDebugInfo('Authentication failed. Redirecting to login...');
          router.replace('/auth/login');
        }
      }
    }, 2000); // Wait 2 seconds for auth to complete

    return () => clearTimeout(timer);
  }, [user, loading]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.text, { color: colors.text }]}>
        Completing sign in...
      </Text>
      <Text style={[styles.debugText, { color: colors.textSecondary }]}>
        {debugInfo}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  debugText: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 10,
  },
});
