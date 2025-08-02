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

export default function LoginScreen() {
  const { colors } = useTheme();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const buttonDisabled = isLoading;
  const buttonOpacity = buttonDisabled ? 0.7 : 1;
  const containerStyle = [styles.container, { backgroundColor: colors.background }];

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const { user, error } = await signIn(email, password);
      
      if (error) {
        Alert.alert('Login Failed', error);
      } else if (user) {
        // Success! Auth state will handle navigation
        console.log('Login successful:', user);
        // Keep loading state until navigation completes
        setTimeout(() => setIsLoading(false), 1000);
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { user, error } = await signInWithGoogle();
      
      if (error) {
        Alert.alert('Google Sign-In Failed', error);
      } else if (user) {
        // Success! Auth state will handle navigation
        console.log('Google login successful:', user);
        // Keep loading state until navigation completes
        setTimeout(() => setIsLoading(false), 1000);
      }
    } catch (err) {
      Alert.alert('Error', 'Google Sign-In failed');
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={containerStyle}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainContainer}>
          {/* Left Side - Image/Branding */}
          <View style={[styles.leftSide, { backgroundColor: '#3B82F6' }]}>
            <View style={styles.brandingContainer}>
              <View style={styles.logoContainer}>
                <Image 
                  source={require('@/assets/images/KharchaMeter.png')} 
                  style={styles.brandLogo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.brandSubtext}>Track your expenses smartly</Text>
            </View>
          </View>

          {/* Right Side - Login Form */}
          <View style={[styles.rightSide, { backgroundColor: colors.surface }]}>
            <Text style={[styles.title, { color: colors.text }]}>
              Sign in to your account
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
                  textContentType="emailAddress"
                  autoComplete="email"
                />
                <Text style={[styles.floatingLabel, { 
                  color: email ? '#3B82F6' : colors.textSecondary,
                  top: email ? 2 : 14,
                  fontSize: email ? 12 : 16,
                  pointerEvents: 'none'
                }]}>
                  Email address
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
                  textContentType="password"
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

              {/* Options Row */}
              <View style={styles.optionsRow}>
                <View style={styles.rememberMe}>
                  <TouchableOpacity style={styles.checkbox}>
                    <View style={[styles.checkboxInner, { borderColor: colors.border }]} />
                  </TouchableOpacity>
                  <Text style={[styles.rememberText, { color: colors.textSecondary }]}>
                    Remember me
                  </Text>
                </View>
                <Link href="/auth/forgot-password" asChild>
                  <TouchableOpacity>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </TouchableOpacity>
                </Link>
              </View>

              {/* Sign In Button */}
              <TouchableOpacity
                style={[styles.signInButton, { opacity: buttonOpacity }]}
                onPress={handleLogin}
                disabled={buttonDisabled}
              >
                <Text style={styles.signInButtonText}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.textSecondary }]}>OR</Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              </View>

              {/* Google Login Button */}
              <TouchableOpacity
                style={[styles.socialButton, { 
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: buttonOpacity
                }]}
                onPress={handleGoogleLogin}
                disabled={buttonDisabled}
              >
                <Text style={styles.googleIcon}>G</Text>
                <Text style={[styles.socialButtonText, { color: colors.text }]}>
                  Continue with Google
                </Text>
              </TouchableOpacity>

              {/* Sign Up Link */}
              <View style={styles.signUpRow}>
                <Text style={[styles.signUpText, { color: colors.textSecondary }]}>
                  Don't have an account?{' '}
                </Text>
                <Link href="/auth/signup" asChild>
                  <TouchableOpacity>
                    <Text style={styles.signUpLink}>Sign up</Text>
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
    minHeight: 600,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
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
    gap: 20,
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
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
  },
  checkboxInner: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#D1D5DB',
  },
  rememberText: {
    fontSize: 14,
    color: '#6B7280',
  },
  forgotText: {
    fontSize: 14,
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  signInButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)',
    elevation: 8,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  dividerText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  googleIcon: {
    width: 20,
    height: 20,
    fontSize: 14,
    fontWeight: '700',
    color: '#4285F4',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
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
    textDecorationLine: 'underline',
  },
});
