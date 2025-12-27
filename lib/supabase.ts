import { createClient } from '@supabase/supabase-js';

// INSTRUCTIONS:
// 1. Create a project at https://supabase.com
// 2. Paste your Project URL and Anon Key below
// 3. For production, use import.meta.env.VITE_SUPABASE_URL

// Cast import.meta to any to access env variables without relying on vite/client types which are missing
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE';
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE';

if (!supabaseUrl || supabaseUrl.includes('YOUR_SUPABASE_URL')) {
  console.warn('⚠️ SUPABASE SETUP WARNING: Please replace "YOUR_SUPABASE_URL_HERE" and "YOUR_SUPABASE_ANON_KEY_HERE" in lib/supabase.ts with your actual keys from the Supabase Dashboard > Project Settings > API.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);