import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage // Explicitly set storage to avoid multiple instances
  }
});

// Export types
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  is_subscribed: boolean;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  token_usage: {
    total: number;
    limit: number;
    remaining: number;
  };
} 