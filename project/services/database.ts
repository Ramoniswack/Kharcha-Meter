import { supabase } from '../lib/supabase';
import { Transaction, User } from '../types';

export interface DatabaseTransaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  notes?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export class DatabaseService {
  // User operations
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar_url
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<DatabaseUser>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar_url
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }

  static async createUserProfile(user: any): Promise<User | null> {
    try {
      console.log('Creating user profile for:', user);
      
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        // If user already exists, try to get existing user
        if (error.code === '23505') {
          console.log('User already exists, fetching existing profile...');
          return await this.getCurrentUser();
        }
        throw error;
      }

      console.log('User profile created successfully:', data);
      
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar_url
      };
    } catch (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
  }

  // Transaction operations
  static async getTransactions(userId: string): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;

      return data.map(this.transformTransaction);
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  }

  static async createTransaction(transaction: Omit<Transaction, 'id'>, userId: string): Promise<Transaction | null> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          title: transaction.title,
          amount: transaction.amount,
          type: transaction.type,
          category: transaction.category,
          date: transaction.date,
          notes: transaction.notes,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return this.transformTransaction(data);
    } catch (error) {
      console.error('Error creating transaction:', error);
      return null;
    }
  }

  static async updateTransaction(transactionId: string, updates: Partial<Transaction>): Promise<Transaction | null> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId)
        .select()
        .single();

      if (error) throw error;

      return this.transformTransaction(data);
    } catch (error) {
      console.error('Error updating transaction:', error);
      return null;
    }
  }

  static async deleteTransaction(transactionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return false;
    }
  }

  static async getTransactionsByDateRange(
    userId: string, 
    startDate: string, 
    endDate: string
  ): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

      if (error) throw error;

      return data.map(this.transformTransaction);
    } catch (error) {
      console.error('Error getting transactions by date range:', error);
      return [];
    }
  }

  static async getTransactionsByCategory(userId: string, category: string): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('category', category)
        .order('date', { ascending: false });

      if (error) throw error;

      return data.map(this.transformTransaction);
    } catch (error) {
      console.error('Error getting transactions by category:', error);
      return [];
    }
  }

  // Helper method to transform database transaction to app transaction
  private static transformTransaction(dbTransaction: DatabaseTransaction): Transaction {
    return {
      id: dbTransaction.id,
      title: dbTransaction.title,
      amount: dbTransaction.amount,
      type: dbTransaction.type,
      category: dbTransaction.category,
      date: dbTransaction.date,
      notes: dbTransaction.notes
    };
  }
}

// Authentication helpers
export class AuthService {
  static async signUp(email: string, password: string, name: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) throw error;

      // Create user profile
      if (data.user) {
        await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            name: name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }

      return { user: data.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  }

  // OAuth Authentication Methods
  static async signInWithGoogle() {
    try {
      console.log('Starting Google OAuth...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Google OAuth error:', error);
        throw error;
      }
      
      console.log('Google OAuth initiated successfully');
      return { data, error: null };
    } catch (error: any) {
      console.error('Google OAuth failed:', error);
      return { data: null, error: error.message || 'Google sign-in failed. Please check if Google OAuth is configured in Supabase.' };
    }
  }

  static async signInWithGitHub() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  static async getCurrentSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }
}
