import { createClient } from '@supabase/supabase-js';

// NOTA: Crea un archivo .env.local con estas variables:
// NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
// NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_anonima_de_supabase

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fallback a localStorage si no hay configuración de Supabase
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
