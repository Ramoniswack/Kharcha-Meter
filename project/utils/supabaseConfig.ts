export function isSupabaseConfigured(): boolean {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  
  return !!(url && key && url !== 'your-supabase-url' && key !== 'your-supabase-anon-key');
}
