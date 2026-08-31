/**
 * Security utilities for Murshid Engineering Hub
 * Provides masking and obfuscation for sensitive student data
 */

/**
 * Masks an email address for privacy
 * Example: mohammed***@gmail.com
 */
export const maskEmail = (email: string | null | undefined): string => {
  if (!email) return "••••••••@••••.•••";
  const [local, domain] = email.split("@");
  if (!domain) return email;
  
  if (local.length <= 3) {
    return `${local[0]}***@${domain}`;
  }
  
  return `${local.substring(0, 3)}***${local.substring(local.length - 2)}@${domain}`;
};

/**
 * Masks a student ID or phone number
 * Example: 2021***45
 */
export const maskSensitiveInfo = (info: string | null | undefined): string => {
  if (!info) return "••••••••";
  if (info.length <= 4) return "****";
  
  const visibleStart = Math.ceil(info.length * 0.2);
  const visibleEnd = Math.ceil(info.length * 0.2);
  const maskedLength = info.length - visibleStart - visibleEnd;
  
  return (
    info.substring(0, visibleStart) +
    "•".repeat(Math.max(3, maskedLength)) +
    info.substring(info.length - visibleEnd)
  );
};

/**
 * Obfuscates a string to prevent plain-text visibility in localStorage.
 * Uses a UTF-8 safe Base64 encoding to support Arabic characters and prevent btoa crashes.
 */
export const obfuscate = (text: string): string => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const binString = String.fromCodePoint(...data);
    return btoa(binString);
  } catch (e) {
    console.error("Obfuscation error:", e);
    return text;
  }
};

/**
 * De-obfuscates a string created by the obfuscate function
 */
export const deobfuscate = (encoded: string): string => {
  try {
    const binString = atob(encoded);
    const data = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
    return new TextDecoder().decode(data);
  } catch (e) {
    console.error("Deobfuscation error:", e);
    return "";
  }
};

/**
 * Masks a full name to show only first name and initial
 */
export const maskName = (name: string | null | undefined): string => {
  if (!name) return "طالب مهندس";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0];
  
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
};
