import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Check if we have valid Supabase credentials
if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'your_supabase_url_here' || 
    supabaseAnonKey === 'your_supabase_anon_key_here') {
  console.warn('⚠️ Supabase not configured! Using mock mode for development.');
  console.warn('To connect to Supabase:');
  console.warn('1. Create a project at https://supabase.com');
  console.warn('2. Update your .env file with real credentials');
  console.warn('3. Run the SQL schema from supabase-schema.sql');
}

// Always create real Supabase client if credentials are provided
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
export default supabase;
