import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import { Link } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const buttonDisabled = !email || isLoading;
  const buttonOpacity = buttonDisabled ? 0.6 : 1;

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        Alert.alert('Reset Failed', error);
      } else {
        Alert.alert(
          'Reset Link Sent', 
          'Please check your email for a password reset link.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.mainContainer}>
          {/* Left Side - Branding */}
          <View style={[styles.leftSide, { backgroundColor: '#3B82F6' }]}>
            <View style={styles.brandingContainer}>
              <View style={styles.logoContainer}>
                <Image 
                  source={require('@/assets/images/KharchaMeter.png')} 
                  style={styles.brandLogo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.brandSubtext}>
                Reset your password and get back to tracking expenses
              </Text>
            </View>
          </View>

          {/* Right Side - Form */}
          <View style={styles.rightSide}>
            {/* Back Button */}
            <Link href="/auth/login" asChild>
              <TouchableOpacity style={styles.backButton}>
                <ArrowLeft size={24} color="#6B7280" />
                <Text style={styles.backText}>Back to Login</Text>
              </TouchableOpacity>
            </Link>

            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password
            </Text>
            
            <View style={styles.form}>
              {/* Email Input with Floating Label */}
              <View style={styles.floatingInputContainer}>
                <TextInput
                  style={[styles.floatingInput, { 
                    color: colors.text,
                    borderBottomColor: email ? '#3B82F6' : colors.border 
                  }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder=" "
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Text style={[styles.floatingLabel, { 
                  color: email ? '#3B82F6' : colors.textSecondary,
                  top: email ? 2 : 14,
                  fontSize: email ? 12 : 16
                }]}>
                  Email address
                </Text>
              </View>

              {/* Reset Button */}
              <TouchableOpacity
                style={[styles.resetButton, { opacity: buttonOpacity }]}
                onPress={handleResetPassword}
                disabled={buttonDisabled}
              >
                <Text style={styles.resetButtonText}>
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Text>
              </TouchableOpacity>

              {/* Sign In Link */}
              <View style={styles.signInRow}>
                <Text style={[styles.signInText, { color: colors.textSecondary }]}>
                  Remember your password?{' '}
                </Text>
                <Link href="/auth/login" asChild>
                  <TouchableOpacity>
                    <Text style={styles.signInLink}>Sign in</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  mainContainer: {
    width: '100%',
    maxWidth: 1200,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    flexDirection: 'column',
    minHeight: 500,
    boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.25)',
    elevation: 20,
  },
  leftSide: {
    flex: 0,
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  brandingContainer: {
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    borderRadius: 16,
    padding: 12,
  },
  brandLogo: {
    width: 80,
    height: 80,
  },
  brandSubtext: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.95,
    textAlign: 'center',
    fontWeight: '500',
  },
  rightSide: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    color: '#1F2937',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  form: {
    gap: 24,
  },
  floatingInputContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  floatingInput: {
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: '#D1D5DB',
    paddingVertical: 12,
    paddingHorizontal: 4,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  floatingLabel: {
    position: 'absolute',
    left: 4,
    fontSize: 14,
    color: '#6B7280',
  },
  resetButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signInText: {
    fontSize: 14,
    color: '#6B7280',
  },
  signInLink: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
});
