/**
 * Supabase client — replaces Firebase entirely for database/auth/storage.
 * Get your URL and anon key from: supabase.com → your project → Settings → API
 * Paste them into your .env file.
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    persistSession:     true,
    autoRefreshToken:   true,
    detectSessionInUrl: true,
  },
})

export default supabase
