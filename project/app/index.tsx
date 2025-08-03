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
    console.log('Index: Auth state - user:', !!user, 'loading:', loading, 'userEmail:', user?.email);
    
    // Add a small delay to ensure auth state is stable
    const navigationTimeout = setTimeout(() => {
      if (!loading) {
        if (user && user.email) {
          console.log('Index: User authenticated, navigating to tabs for:', user.email);
          router.replace('/(tabs)');
        } else {
          console.log('Index: No user or incomplete user data, navigating to login');
          router.replace('/auth/login');
        }
      }
    }, 200); // Small delay to ensure state is stable

    return () => clearTimeout(navigationTimeout);
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
