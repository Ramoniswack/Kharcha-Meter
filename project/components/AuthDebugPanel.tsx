import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { StorageUtils } from '@/utils/storage';

export function AuthDebugPanel() {
  const { user, session, loading, refreshSession } = useAuth();
  const { colors } = useTheme();

  const checkStorage = async () => {
    const hasSession = await StorageUtils.hasStoredSession();
    const authKeys = await StorageUtils.getAuthKeys();
    console.log('🔍 Storage Debug:', { hasSession, authKeys });
    alert(`Has Session: ${hasSession}\nAuth Keys: ${authKeys.length}`);
  };

  const clearStorage = async () => {
    await StorageUtils.clearAuthData();
    alert('🗑️ Cleared all auth data');
  };

  if (__DEV__) {
    return (
      <View style={[styles.debugPanel, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>🐛 Auth Debug</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          Loading: {loading ? '⏳' : '✅'} | User: {user ? '👤' : '❌'} | Session: {session ? '🔑' : '❌'}
        </Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            onPress={checkStorage} 
            style={[styles.button, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.buttonText}>Check Storage</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={refreshSession} 
            style={[styles.button, { backgroundColor: colors.secondary }]}
          >
            <Text style={styles.buttonText}>Refresh Session</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={clearStorage} 
            style={[styles.button, { backgroundColor: colors.error }]}
          >
            <Text style={styles.buttonText}>Clear Storage</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  debugPanel: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    padding: 12,
    borderRadius: 8,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  text: {
    fontSize: 12,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    padding: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
