import { describe, expect, it } from "vitest";
import { isAnnouncementVisibleForMajor } from "@/lib/majors";

describe("isAnnouncementVisibleForMajor", () => {
  it("matches a student against any major in a comma-separated target list", () => {
    const announcement = { is_global: false, target_major: "computer,network-security,chemical" };

    expect(isAnnouncementVisibleForMajor(announcement, "network-security")).toBe(true);
    expect(isAnnouncementVisibleForMajor(announcement, "mechanical")).toBe(false);
  });

  it("supports legacy single-major values and array values", () => {
    expect(isAnnouncementVisibleForMajor({ target_major: "chemical" }, "chemical")).toBe(true);
    expect(isAnnouncementVisibleForMajor({ target_major: ["chemical", "civil"] }, "civil")).toBe(true);
  });

  it("shows global and legacy all announcements to every student", () => {
    expect(isAnnouncementVisibleForMajor({ is_global: true, target_major: null }, "mechanical")).toBe(true);
    expect(isAnnouncementVisibleForMajor({ target_major: "all" }, "mechanical")).toBe(true);
  });

  it("always shows targeted announcements to administrators", () => {
    expect(isAnnouncementVisibleForMajor({ target_major: "chemical" }, "mechanical", true)).toBe(true);
  });
});
