import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { AuthService, DatabaseService } from '../services/database';
import { User } from '../types';
import { Session } from '@supabase/supabase-js';

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  return url && key && 
         url !== 'your_supabase_url_here' && 
         key !== 'your_supabase_anon_key_here';
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: any; error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ user: any; error: string | null }>;
  signInWithGoogle: () => Promise<{ user: any; error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch by ensuring client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Don't run until client-side mounted
    
    let componentMounted = true;
    
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading && componentMounted) {
        console.log('Auth loading timeout reached, setting loading to false');
        setLoading(false);
      }
    }, 5000); // Increased timeout for production

    // Get initial session - this checks storage for saved session
    const initializeAuth = async () => {
      try {
        console.log('🔍 Checking for existing session...');
        
        // Add a small delay to ensure client-side rendering is complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const session = await AuthService.getCurrentSession();
        
        if (!componentMounted) return;
        
        console.log('Initial session check:', !!session, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          console.log('✅ Found existing session, loading user profile...');
          await loadUserProfile(session.user);
        } else {
          console.log('❌ No existing session found');
          setLoading(false);
        }
        } catch (error) {
        console.error('Error getting initial session:', error);
        if (componentMounted) {
          setLoading(false);
        }
      } finally {
        clearTimeout(timeoutId);
      }
    };

    // Only initialize auth after client-side mount
    if (componentMounted) {
      initializeAuth();
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        if (!componentMounted) return;        console.log('🔄 Auth state changed:', event, session?.user?.id);
        console.log('Session details:', { 
          hasSession: !!session, 
          hasUser: !!session?.user,
          userEmail: session?.user?.email,
          event: event
        });
        
        setSession(session);
        
        if (session?.user && event !== 'SIGNED_OUT') {
          console.log('✅ User authenticated, loading profile for:', session.user.id);
          await loadUserProfile(session.user);
        } else {
          console.log('❌ No session/user or signed out, clearing auth state');
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      componentMounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [mounted]); // Depend on mounted state

  const loadUserProfile = async (authUser: any) => {
    try {
      console.log('📝 Loading user profile for:', authUser.id);
      
      // Immediately set basic user info and stop loading
      const basicUser = {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email.split('@')[0],
        avatar: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture
      };
      
      console.log('✅ Setting user and stopping loading:', basicUser);
      setUser(basicUser);
      setLoading(false); // CRITICAL: Stop loading immediately
      
      // Try to get full profile in background (non-blocking)
      try {
        let userProfile = await DatabaseService.getCurrentUser();
        
        if (!userProfile && authUser) {
          console.log('Creating new user profile...');
          userProfile = await DatabaseService.createUserProfile(authUser);
        }
        
        // Update with full profile if different
        if (userProfile && userProfile.id === basicUser.id) {
          console.log('Updating with full profile:', userProfile);
          setUser(userProfile);
        }
      } catch (profileError) {
        console.warn('Profile loading failed, keeping basic user:', profileError);
        // Keep the basic user, don't fail authentication
      }
      
    } catch (error) {
      console.error('❌ Error in loadUserProfile:', error);
      // Still set basic user info and stop loading
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email.split('@')[0],
        avatar: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture
      });
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 AuthContext: Signing in user:', email);
      const result = await AuthService.signIn(email, password);
      
      if (result.user) {
        console.log('✅ AuthContext: Sign in successful, user:', result.user.id);
        // The auth state change listener will handle setting the user
        // No need to call loadUserProfile here as it will be called by the listener
      } else if (result.error) {
        console.error('❌ AuthContext: Sign in failed:', result.error);
      }
      
      return result;
    } catch (error: any) {
      console.error('💥 AuthContext: Sign in exception:', error);
      return { user: null, error: error.message || 'Login failed' };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const result = await AuthService.signUp(email, password, name);
      return result;
    } catch (error) {
      return { user: null, error: 'Signup failed' };
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting signOut process...');
      const result = await AuthService.signOut();
      
      if (!result.error) {
        console.log('SignOut successful, clearing user state...');
        setUser(null);
        setSession(null);
      }
      
      return result;
    } catch (error: any) {
      console.error('SignOut error:', error);
      return { error: error.message || 'Logout failed' };
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Always use real Google OAuth - no mock authentication
      const result = await AuthService.signInWithGoogle();
      if (result.error) {
        return { user: null, error: result.error };
      }
      
      // The user will be set automatically by the auth state change listener
      return { user: null, error: null };
    } catch (error: any) {
      return { user: null, error: error.message || 'Google login failed' };
    }
  };

  const resetPassword = async (email: string) => {
    return AuthService.resetPassword(email);
  };

  const refreshSession = async () => {
    try {
      console.log('🔄 Manually refreshing session...');
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
      } else {
        console.log('✅ Session refreshed successfully');
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading: loading || !mounted, // Keep loading until mounted
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        resetPassword,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
