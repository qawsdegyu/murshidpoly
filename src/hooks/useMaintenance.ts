import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface MaintenanceStatus {
  is_active: boolean;
  message_ar: string;
  message_en: string;
  expected_return?: string;
}

export function useMaintenance(pageId: string) {
  const [status, setStatus] = useState<MaintenanceStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkMaintenance() {
      try {
        const { data, error } = await supabase
          .from('maintenance_mode')
          .select('*')
          .eq('page_id', pageId)
          .maybeSingle();

        if (data) {
          setStatus(data);
        } else {
          // If no row exists, assume not in maintenance
          setStatus({ is_active: false, message_ar: '', message_en: '' });
        }
      } catch (e) {
        console.error("Maintenance check failed", e);
        setStatus({ is_active: false, message_ar: '', message_en: '' });
      } finally {
        setLoading(false);
      }
    }

    checkMaintenance();
  }, [pageId]);

  return { status, loading };
}
