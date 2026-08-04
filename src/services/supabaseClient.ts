import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('[SupabaseClient] FATAL ERROR: Supabase URL or Anon Key is missing from environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
