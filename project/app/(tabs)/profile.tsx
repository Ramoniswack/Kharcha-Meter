import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  Switch,
  Image,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { DatabaseService } from '@/services/database';
import { router } from 'expo-router';
import { 
  User, 
  LogOut, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Info, 
  Settings,
  ChevronRight,
  CreditCard,
  FileText,
  Palette,
  Volume2,
  Lock,
  HelpCircle,
  Mail,
  Smartphone
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  
  // Loading and stats state
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalIncome: 0,
    transactionCount: 0,
    thisMonthExpenses: 0
  });
  
  // Notification settings
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Privacy settings
  const [dataSharing, setDataSharing] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  const isDarkMode = theme === 'dark';

  // Load user stats
  useEffect(() => {
    loadUserStats();
  }, [user]);

  const loadUserStats = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Loading stats for user:', user.id);
      
      // Get all transactions for the user
      const transactions = await DatabaseService.getTransactions(user.id);
      console.log('Loaded transactions:', transactions.length);
      
      // Calculate stats
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      // Calculate this month's expenses
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const thisMonthExpenses = transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          return t.type === 'expense' && 
                 transactionDate.getMonth() === currentMonth &&
                 transactionDate.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      setStats({
        totalExpenses,
        totalIncome,
        transactionCount: transactions.length,
        thisMonthExpenses
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    console.log('Logout button pressed - clearing session and going to signin');
    
    try {
      // Clear the user session first
      await signOut();
      console.log('Session cleared successfully');
      
      // Then navigate to login
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if signOut fails, still navigate to login
      router.replace('/auth/login');
    }
  };

  const showPrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'KharchaMeter Privacy Policy\n\nWe are committed to protecting your privacy and personal information. Here are the key points:\n\n• Your financial data is encrypted and stored securely\n• We never share your personal information with third parties\n• Data is processed locally when possible\n• You have full control over your data\n• GDPR compliant data protection\n• Right to data deletion and export\n\nFor complete details, visit our website privacy section.',
      [{ text: 'OK' }]
    );
  };

  const showTermsOfService = () => {
    Alert.alert(
      'Terms of Service',
      'KharchaMeter Terms of Service\n\nBy using this app, you agree to:\n\n• Use the app responsibly for personal expense tracking\n• Provide accurate information\n• Not attempt to reverse engineer or hack the app\n• Respect intellectual property rights\n• Report bugs and security issues responsibly\n\nThe app is provided "as is" without warranties. We are not liable for financial decisions made based on app data.\n\nLast updated: August 2025',
      [{ text: 'OK' }]
    );
  };

  const showAbout = () => {
    Alert.alert(
      'About KharchaMeter',
      'KharchaMeter v1.0.0\n\nYour personal expense tracking companion designed to help you manage your finances better.\n\nFeatures:\n• Smart expense categorization\n• Visual spending analytics\n• Multi-currency support\n• Dark/Light theme\n• Secure data encryption\n• Cloud backup & sync\n\nDeveloped with ❤️ for better financial management.\n\n© 2025 KharchaMeter. All rights reserved.',
      [{ text: 'OK' }]
    );
  };

  const handleNotificationSettings = () => {
    Alert.alert(
      'Notification Settings',
      'Configure your notification preferences:',
      [
        {
          text: 'Daily Reminders',
          onPress: () => Alert.alert('Daily Reminders', 'You will receive daily expense tracking reminders at 8 PM.')
        },
        {
          text: 'Weekly Reports',
          onPress: () => Alert.alert('Weekly Reports', 'Weekly spending summary will be sent every Sunday.')
        },
        {
          text: 'Budget Alerts',
          onPress: () => Alert.alert('Budget Alerts', 'Get notified when you approach your spending limits.')
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const ProfileOption = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    showArrow = true,
    rightComponent 
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showArrow?: boolean;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity 
      style={[styles.optionItem, { backgroundColor: colors.surface }]}
      onPress={onPress}
    >
      <View style={styles.optionLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
          <Icon size={20} color={colors.primary} />
        </View>
        <View style={styles.optionText}>
          <Text style={[styles.optionTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.optionRight}>
        {rightComponent}
        {showArrow && !rightComponent && (
          <ChevronRight size={20} color={colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerContent}>
          <Image 
            source={require('@/assets/images/KharchaMeter.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        </View>
      </View>
      
      {/* User Info Section */}
      <View style={[styles.userInfo, { backgroundColor: colors.surface }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
          <User size={40} color={colors.primary} />
        </View>
        <View style={styles.userDetails}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.name || 'User'}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {user?.email || 'user@example.com'}
          </Text>
        </View>
      </View>

      {/* Theme & Preferences Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance & Settings</Text>
        
        <ProfileOption
          icon={isDarkMode ? Sun : Moon}
          title="Theme"
          subtitle={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          onPress={toggleTheme}
          showArrow={false}
          rightComponent={
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          }
        />

        <ProfileOption
          icon={Settings}
          title="App Settings"
          subtitle="Currency, language, and preferences"
          onPress={() => Alert.alert('Settings', 'Advanced settings coming soon!')}
        />
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
        
        <ProfileOption
          icon={Bell}
          title="Push Notifications"
          subtitle="Expense reminders and alerts"
          onPress={() => setPushNotifications(!pushNotifications)}
          showArrow={false}
          rightComponent={
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          }
        />

        <ProfileOption
          icon={Bell}
          title="Email Notifications"
          subtitle="Weekly reports and summaries"
          onPress={() => setEmailNotifications(!emailNotifications)}
          showArrow={false}
          rightComponent={
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          }
        />

        <ProfileOption
          icon={Bell}
          title="Notification Settings"
          subtitle="Configure alerts and reminders"
          onPress={handleNotificationSettings}
        />
      </View>

      {/* Legal & Support Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Legal & Support</Text>
        
        <ProfileOption
          icon={Shield}
          title="Privacy Policy"
          subtitle="How we protect your data"
          onPress={showPrivacyPolicy}
        />

        <ProfileOption
          icon={FileText}
          title="Terms of Service"
          subtitle="Terms and conditions"
          onPress={showTermsOfService}
        />

        <ProfileOption
          icon={Info}
          title="About KharchaMeter"
          subtitle="Version 1.0.0 - Learn more"
          onPress={showAbout}
        />
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
        
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: '#ef4444' }]}
          onPress={handleLogout}
        >
          <LogOut size={20} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    margin: 16,
    borderRadius: 16,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  section: {
    margin: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 12,
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});