import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface OAuthButtonProps {
  provider: 'google' | 'github';
  onPress: () => void;
  loading?: boolean;
}

export function OAuthButton({ provider, onPress, loading = false }: OAuthButtonProps) {
  const { colors } = useTheme();

  const getProviderConfig = () => {
    switch (provider) {
      case 'google':
        return {
          name: 'Google',
          backgroundColor: '#4285F4',
          icon: '🔍', // You can replace with actual Google icon
          textColor: '#FFFFFF'
        };
      case 'github':
        return {
          name: 'GitHub',
          backgroundColor: '#333333',
          icon: '🐙', // You can replace with actual GitHub icon
          textColor: '#FFFFFF'
        };
      default:
        return {
          name: provider,
          backgroundColor: colors.primary,
          icon: '🔐',
          textColor: '#FFFFFF'
        };
    }
  };

  const config = getProviderConfig();
  
  // Compute styles to avoid web CSS parsing issues
  const buttonOpacity = loading ? 0.7 : 1;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { 
          backgroundColor: config.backgroundColor,
          opacity: buttonOpacity
        }
      ]}
      onPress={onPress}
      disabled={loading}
    >
      <Text style={styles.icon}>{config.icon}</Text>
      <Text style={[styles.text, { color: config.textColor }]}>
        {loading ? 'Signing in...' : `Continue with ${config.name}`}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    gap: 12,
  },
  icon: {
    fontSize: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
