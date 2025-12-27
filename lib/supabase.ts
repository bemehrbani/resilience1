import { createClient } from '@supabase/supabase-js';

// Access environment variables safely
const envUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const envKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// Use placeholders if env vars are missing to prevent "Invalid URL" crash
// This ensures the app renders even if misconfigured (though auth will fail)
const supabaseUrl = envUrl && envUrl.startsWith('http') ? envUrl : 'https://placeholder.supabase.co';
const supabaseKey = envKey || 'placeholder-key';

if (!envUrl || !envKey) {
  console.error(
    '🔴 Supabase Config Missing: Please create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);