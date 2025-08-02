import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Redirect } from 'expo-router';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const { colors } = useTheme();

  // Show loading while authentication is being determined
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading...
        </Text>
      </View>
    );
  }

  // Only redirect if we definitely need auth and don't have a user
  if (requireAuth && !user) {
    return <Redirect href="/auth/login" />;
  }

  // Only redirect if we don't need auth but have a user 
  if (!requireAuth && user) {
    return <Redirect href="/(tabs)" />;
  }

  // Otherwise, render children normally
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
});
