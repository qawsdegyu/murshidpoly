import { describe, expect, it, vi } from "vitest";

vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => ({ user: null }) }));
vi.mock("@/hooks/useSiteSettings", () => ({ useSiteSettings: () => ({}) }));

import { hasFeatureAccess } from "@/components/FeatureGate";

const student = (email: string, major?: string) => ({ email, user_metadata: { major } });

describe("feature access controls", () => {
  it("allows everyone when a feature is Live and configured for all users", () => {
    expect(hasFeatureAccess({ knowledge_assistant_enabled: "true", knowledge_assistant_access_mode: "all" }, "ai_assistant", null)).toBe(true);
  });

  it("hides the feature completely in Offline mode", () => {
    expect(hasFeatureAccess({ knowledge_assistant_enabled: "false", knowledge_assistant_access_mode: "all" }, "ai_assistant", student("student@example.com"))).toBe(false);
  });

  it("matches Gmail access using the feature-specific key", () => {
    const settings = {
      exam_study_planner_enabled: "true",
      exam_planner_access_mode: "emails",
      exam_planner_allowed_emails: "allowed@example.com\nsecond@example.com",
    };
    expect(hasFeatureAccess(settings, "exam_planner", student("ALLOWED@example.com"))).toBe(true);
    expect(hasFeatureAccess(settings, "exam_planner", student("other@example.com"))).toBe(false);
  });

  it("matches Murshid AI access by major using the major-specific key", () => {
    const settings = {
      knowledge_assistant_enabled: "true",
      knowledge_assistant_access_mode: "major",
      knowledge_assistant_allowed_majors: "هندسة شبكات\nهندسة حاسوب",
    };
    expect(hasFeatureAccess(settings, "ai_assistant", student("student@example.com", "هندسة شبكات"))).toBe(true);
    expect(hasFeatureAccess(settings, "ai_assistant", student("student@example.com", "هندسة كيميائية"))).toBe(false);
  });
});
