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

  useEffect(() => {
    let mounted = true;
    
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading && mounted) {
        console.log('Auth loading timeout reached, setting loading to false');
        setLoading(false);
      }
    }, 3000); // Reduced to 3 seconds for better UX

    // Get initial session - this checks AsyncStorage for saved session
    const initializeAuth = async () => {
      try {
        console.log('🔍 Checking for existing session...');
        const session = await AuthService.getCurrentSession();
        
        if (!mounted) return;
        
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
        if (mounted) {
          setLoading(false);
        }
      } finally {
        clearTimeout(timeoutId);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        if (!mounted) return;
        
        console.log('🔄 Auth state changed:', event, session?.user?.id);
        console.log('Session details:', { 
          hasSession: !!session, 
          hasUser: !!session?.user,
          userEmail: session?.user?.email 
        });
        
        setSession(session);
        
        if (session?.user) {
          console.log('Loading user profile for:', session.user.id);
          await loadUserProfile(session.user);
        } else {
          console.log('No session/user, clearing auth state');
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (authUser: any) => {
    try {
      console.log('Loading user profile for userId:', authUser.id);
      let userProfile = await DatabaseService.getCurrentUser();
      
      // If user profile doesn't exist (common for OAuth), create it
      if (!userProfile && authUser) {
        console.log('User profile not found, creating new profile...');
        userProfile = await DatabaseService.createUserProfile(authUser);
      }
      
      if (userProfile) {
        console.log('User profile loaded successfully:', userProfile);
        setUser(userProfile);
      } else {
        console.log('Failed to load or create user profile, using basic info');
        // Fallback to basic user info from auth
        setUser({
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email.split('@')[0],
          avatar: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Fallback to basic user info from auth even on error
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email.split('@')[0],
        avatar: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await AuthService.signIn(email, password);
      return result;
    } catch (error) {
      return { user: null, error: 'Login failed' };
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
        loading,
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
