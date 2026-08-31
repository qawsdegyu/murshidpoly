import { supabase } from "./supabase";

/**
 * Centralized list of admin emails for frontend checks.
 * IMPORTANT: This is for UI/UX convenience. Real security must be enforced via Supabase RLS.
 */
export const ALLOWED_ADMINS = [
  "mocvskhfssr@gmail.com",
  "mohammedsaqer151@gmail.com",
  "abdallahtahat2006@gmail.com",
  "murshidpolytechnic372@gmail.com"
];

/**
 * Checks if a user is an admin based on their email.
 */
export const isUserAdmin = (email: string | undefined | null): boolean => {
  if (!email) return false;
  return ALLOWED_ADMINS.includes(email.toLowerCase());
};

/**
 * Helper to get the admin status for the current session.
 */
export async function checkAdminStatus(userId: string) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin, full_name")
      .eq("id", userId)
      .maybeSingle();

    if (error) return { isAdmin: false, profile: null };
    return { 
      isAdmin: !!data?.is_admin, 
      profile: data 
    };
  } catch (err) {
    return { isAdmin: false, profile: null };
  }
}
