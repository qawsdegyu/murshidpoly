import { obfuscate, deobfuscate } from './security';

/**
 * Custom storage implementation for Supabase that obfuscates data in localStorage.
 * This prevents auth tokens from being visible in plain text.
 */
export const obfuscatedStorage = {
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
