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
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side before doing anything
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Only run on client side
    
    let isMounted = true;
    
    // Shorter timeout for better UX
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        console.log('⏰ Auth timeout - setting loading to false');
        setLoading(false);
      }
    }, 3000);

    const initAuth = async () => {
      try {
        console.log('🔍 Client-side auth initialization...');
        
        // Small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 50));
        
        if (!isMounted) return;
        
        // Get current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        console.log('📋 Session check:', { 
          hasSession: !!currentSession, 
          hasUser: !!currentSession?.user,
          error: error?.message 
        });
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          console.log('✅ Session found, setting user...');
          await loadUserProfile(currentSession.user);
        } else {
          console.log('❌ No session found');
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Auth init error:', error);
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        if (!isMounted) return;
        
        console.log('🔄 Auth state changed:', event, session?.user?.id);
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
      isMounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [isClient]); // Depend on client state

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
        loading: loading || !isClient, // Keep loading until client-side
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
