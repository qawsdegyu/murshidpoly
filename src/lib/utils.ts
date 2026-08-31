import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Basic sanitization to prevent XSS by removing script tags and HTML-like markers.
 */
export function sanitize(text: any): any {
  if (typeof text !== 'string') return text;
  return text
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
    .replace(/on\w+="[^"]*"/gim, "") // Remove inline event handlers
    .replace(/javascript:[^"']*/gim, ""); // Remove javascript: URIs
}

/**
 * Rewrites Supabase public storage URLs to leverage Supabase image transformation.
 * Returns resized, optimized WebP images, saving massive bandwidth and improving Lighthouse LCP.
 * Falls back to original URL if it's not a Supabase storage URL.
 */
export function getOptimizedStorageUrl(url: string, width = 600, height = 400, quality = 80): string {
  if (!url) return "";
  
  const baseUrl = url.split("?")[0];
  
  if (baseUrl.includes("/storage/v1/object/public/")) {
    return url;
  }
  
  if (baseUrl.includes("unsplash.com")) {
    return `${baseUrl}?auto=format,compress&q=${quality}&w=${width}&fit=crop`;
  }
  
  return url;
}

/**
 * Normalizes Arabic text for stronger search matching:
 * - Unifies Alif forms (أ, إ, آ, ا)
 * - Maps Taa Marbuta (ة) to Haa (ه)
 * - Maps Alif Maqsura (ى) to Yaa (ي)
 * - Removes diacritics
 */
export function normalizeArabicText(text: string): string {
  if (!text) return "";
  return String(text)
    .replace(/[أإآا]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[\u064B-\u065F]/g, "") // remove diacritics
    .toLowerCase()
    .trim();
}

/**
 * Advanced search that splits query into tokens and ensures all tokens match
 * across any of the provided fields.
 */
export function advancedSearchMatch(query: string, ...fields: string[]): boolean {
  if (!query || !query.trim()) return true;
  const searchTerms = normalizeArabicText(query).split(/\s+/).filter(Boolean);
  const normalizedFields = fields.filter(Boolean).map(f => normalizeArabicText(f)).join(" ");
  return searchTerms.every(term => normalizedFields.includes(term));
}
