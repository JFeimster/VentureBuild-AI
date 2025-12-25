
import { createClient } from '@supabase/supabase-js';

// Access Vite env variables safely
const env = (import.meta as any).env || {};

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are actually set (not undefined, empty, or placeholder)
export const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  !supabaseUrl.includes('placeholder');

if (!isSupabaseConfigured) {
  console.log("Supabase not configured. App will run in Demo Mode.");
}

// Create client with fallbacks to prevent runtime crash during initialization
// requests will fail if not configured, but we guard them in the UI components
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
