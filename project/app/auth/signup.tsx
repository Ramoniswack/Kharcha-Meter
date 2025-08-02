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
import { Link, router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react-native';

export default function SignupScreen() {
  const { colors } = useTheme();
  const { signUp, signInWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const buttonDisabled = !name || !email || !password || !confirmPassword || isLoading;
  const buttonOpacity = buttonDisabled ? 0.6 : 1;

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const { user, error } = await signUp(email, password, name);
      
      if (error) {
        Alert.alert('Signup Failed', error);
      } else if (user) {
        // Success! Auth state will handle navigation
        console.log('Signup successful:', user);
        // Keep loading state until navigation completes
        setTimeout(() => setIsLoading(false), 1000);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const { user, error } = await signInWithGoogle();
      
      if (error) {
        Alert.alert('Google Signup Failed', error);
      } else if (user) {
        // Success! Auth state will handle navigation
        console.log('Google signup successful:', user);
        // Keep loading state until navigation completes
        setTimeout(() => setIsLoading(false), 1000);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
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
                Track your expenses smartly with KharchaMeter
              </Text>
            </View>
          </View>

          {/* Right Side - Form */}
          <View style={styles.rightSide}>
            <Text style={styles.title}>Create Account</Text>
            
            <View style={styles.form}>
              {/* Name Input with Floating Label */}
              <View style={styles.floatingInputContainer}>
                <TextInput
                  style={[styles.floatingInput, { 
                    color: colors.text,
                    borderBottomColor: name ? '#3B82F6' : colors.border 
                  }]}
                  value={name}
                  onChangeText={setName}
                  placeholder=" "
                  autoCapitalize="words"
                />
                <Text style={[styles.floatingLabel, { 
                  color: name ? '#3B82F6' : colors.textSecondary,
                  top: name ? 2 : 14,
                  fontSize: name ? 12 : 16,
                  pointerEvents: 'none'
                }]}>
                  Full Name
                </Text>
              </View>

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
                  fontSize: email ? 12 : 16,
                  pointerEvents: 'none'
                }]}>
                  Email
                </Text>
              </View>

              {/* Password Input with Floating Label */}
              <View style={styles.floatingInputContainer}>
                <TextInput
                  style={[styles.floatingInput, { 
                    color: colors.text,
                    borderBottomColor: password ? '#3B82F6' : colors.border 
                  }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder=" "
                  secureTextEntry={!showPassword}
                />
                <Text style={[styles.floatingLabel, { 
                  color: password ? '#3B82F6' : colors.textSecondary,
                  top: password ? 2 : 14,
                  fontSize: password ? 12 : 16,
                  pointerEvents: 'none'
                }]}>
                  Password
                </Text>
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIconFloating}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>

              {/* Confirm Password Input with Floating Label */}
              <View style={styles.floatingInputContainer}>
                <TextInput
                  style={[styles.floatingInput, { 
                    color: colors.text,
                    borderBottomColor: confirmPassword ? '#3B82F6' : colors.border 
                  }]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder=" "
                  secureTextEntry={!showConfirmPassword}
                />
                <Text style={[styles.floatingLabel, { 
                  color: confirmPassword ? '#3B82F6' : colors.textSecondary,
                  top: confirmPassword ? 2 : 14,
                  fontSize: confirmPassword ? 12 : 16,
                  pointerEvents: 'none'
                }]}>
                  Confirm Password
                </Text>
                <TouchableOpacity 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIconFloating}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[styles.signInButton, { opacity: buttonOpacity }]}
                onPress={handleSignUp}
                disabled={buttonDisabled}
              >
                <Text style={styles.signInButtonText}>
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.textSecondary }]}>OR</Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              </View>

              {/* Google Signup Button */}
              <TouchableOpacity
                style={[styles.socialButton, { 
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: buttonOpacity
                }]}
                onPress={handleGoogleSignup}
                disabled={buttonDisabled}
              >
                <Text style={styles.googleIcon}>G</Text>
                <Text style={[styles.socialButtonText, { color: colors.text }]}>
                  Continue with Google
                </Text>
              </TouchableOpacity>

              {/* Sign In Link */}
              <View style={styles.signUpRow}>
                <Text style={[styles.signUpText, { color: colors.textSecondary }]}>
                  Already have an account?{' '}
                </Text>
                <Link href="/auth/login" asChild>
                  <TouchableOpacity>
                    <Text style={styles.signUpLink}>Sign in</Text>
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
    minHeight: 700,
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
    elevation: 20,
  },
  leftSide: {
    flex: 0,
    minHeight: 200,
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 32,
    color: '#1F2937',
    textAlign: 'center',
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
  eyeIconFloating: {
    position: 'absolute',
    right: 8,
    top: 12,
    padding: 4,
  },
  signInButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signUpText: {
    fontSize: 14,
    color: '#6B7280',
  },
  signUpLink: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
});