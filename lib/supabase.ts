import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables without crashing
const getEnv = (key: string) => {
  // Try accessing import.meta.env safely
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {
    console.warn('Error reading env var:', key);
  }
  return '';
};

const envUrl = getEnv('VITE_SUPABASE_URL');
const envKey = getEnv('VITE_SUPABASE_ANON_KEY');

// Fallback values to prevent application crash if env vars are missing
const supabaseUrl = envUrl && envUrl.startsWith('http') ? envUrl : 'https://placeholder.supabase.co';
const supabaseKey = envKey || 'placeholder-key';

if (!envUrl || !envKey) {
  console.warn(
    '⚠️ Supabase credentials missing! Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Vercel Project Settings > Environment Variables.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);