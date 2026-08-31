import { ReactNode, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export type FeatureKey = "ai_assistant" | "study_planner" | "exam_planner";

const ACCESS_CONFIG: Record<FeatureKey, { enabled: string; mode: string; emails: string; majors?: string }> = {
  ai_assistant: {
    enabled: "knowledge_assistant_enabled",
    mode: "knowledge_assistant_access_mode",
    emails: "knowledge_assistant_allowed_emails",
    majors: "knowledge_assistant_allowed_majors",
  },
  study_planner: {
    enabled: "study_schedule_planner_enabled",
    mode: "study_planner_access_mode",
    emails: "study_planner_allowed_emails",
  },
  exam_planner: {
    enabled: "exam_study_planner_enabled",
    mode: "exam_planner_access_mode",
    emails: "exam_planner_allowed_emails",
  },
};

export function hasFeatureAccess(settings: Record<string, string>, feature: FeatureKey, user: { email?: string | null; user_metadata?: Record<string, unknown> } | null, major?: string | null) {
  const config = ACCESS_CONFIG[feature];
  if (settings[config.enabled] === "false") return false;
  const mode = settings[config.mode] || "all";
  if (mode === "all") return true;
  const allowedKey = mode === "major" && config.majors ? config.majors : config.emails;
  const values = (settings[allowedKey] || "").split(/[\n,]/).map((v) => v.trim().toLowerCase()).filter(Boolean);
  if (mode === "emails") return Boolean(user?.email && values.includes(user.email.toLowerCase()));
  const currentMajor = String(major || user?.user_metadata?.major || "").trim().toLowerCase();
  return Boolean(currentMajor && values.some((v) => currentMajor === v || currentMajor.includes(v) || v.includes(currentMajor)));
}

export default function FeatureGate({ feature, children, fallback = null }: { feature: FeatureKey; children: ReactNode; fallback?: ReactNode }) {
  const settings = useSiteSettings();
  const { user } = useAuth();
  const allowed = useMemo(() => hasFeatureAccess(settings, feature, user), [settings, feature, user]);
  return allowed ? <>{children}</> : <>{fallback}</>;
}
