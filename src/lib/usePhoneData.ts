// src/lib/usePhoneData.ts
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

/**
 * Hook to fetch the current user's phone number.
 * Returns phone, loading and error states.
 */
export function usePhoneData() {
  const [phone, setPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    async function fetchPhone() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          if (active) setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("phone")
          .eq("id", user.id)
          .maybeSingle();
        if (error) throw error;
        if (active) setPhone(data?.phone ?? null);
      } catch (e: any) {
        if (active) setError(e);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchPhone();

    return () => {
      active = false;
    };
  }, []);

  return { phone, loading, error };
}
