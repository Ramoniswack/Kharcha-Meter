import { Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { AuthGuard } from '@/components/AuthGuard';
import { Chrome as Home, Plus, History, User } from 'lucide-react-native';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 8,
            height: 70,
            boxShadow: '0 -4px 8px rgba(0, 0, 0, 0.1)',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            letterSpacing: 0.2,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarItemStyle: {
            paddingTop: 4,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ size, color }) => (
              <Home size={size} color={color} />
            ),
            href: '/',
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: 'Add',
            tabBarIcon: ({ size, color }) => (
              <Plus size={size} color={color} />
            ),
            href: '/add',
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ size, color }) => (
              <History size={size} color={color} />
            ),
            href: '/history',
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ size, color }) => (
              <User size={size} color={color} />
            ),
            href: '/profile',
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}