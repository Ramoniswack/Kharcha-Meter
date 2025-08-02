import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function Index() {
  const { user, loading } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    console.log('Index: Auth state changed - user:', user, 'loading:', loading);
    
    // Add a small delay to ensure everything is properly loaded
    const timeoutId = setTimeout(() => {
      if (!loading) {
        if (user) {
          console.log('Index: Navigating to tabs, user authenticated:', user.email || user.name);
          // User is authenticated, redirect to tabs
          router.replace('/(tabs)');
        } else {
          console.log('Index: Navigating to login, no user');
          // User is not authenticated, redirect to login
          router.replace('/auth/login');
        }
      }
    }, 100); // Small delay to ensure context is ready

    return () => clearTimeout(timeoutId);
  }, [user, loading, router]);

  // Show loading screen while checking authentication
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: colors.background 
    }}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ 
        marginTop: 16, 
        color: colors.textSecondary,
        fontSize: 16
      }}>
        Loading KharchaMeter...
      </Text>
    </View>
  );
}
