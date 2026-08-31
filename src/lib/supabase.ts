import { createClient } from '@supabase/supabase-js';

// Obfuscation helpers moved here to ensure they are available during initialization
const obfuscate = (text: string): string => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const binString = String.fromCodePoint(...data);
    return btoa(binString);
  } catch (e) {
    return text;
  }
};

const deobfuscate = (encoded: string): string => {
  try {
    const binString = atob(encoded);
    const data = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
    return new TextDecoder().decode(data);
  } catch (e) {
    return "";
  }
};

const customStorage = {
  getItem: (key: string): string | null => {
    const value = localStorage.getItem(`_m_${key}`);
    if (!value) return null;
    return deobfuscate(value);
  },
  setItem: (key: string, value: string): void => {
    localStorage.setItem(`_m_${key}`, obfuscate(value));
  },
  removeItem: (key: string): void => {
    localStorage.removeItem(`_m_${key}`);
  },
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || supabaseUrl === 'your_supabase_url') {
  console.warn('MISSING: VITE_SUPABASE_URL is not set correctly.');
}

if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_key') {
  console.warn('MISSING: VITE_SUPABASE_ANON_KEY is not set correctly.');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: customStorage,
    }
  }
);

