import { describe, it, expect } from "vitest";
import { courses } from "../data/mockData";
import { roadmapNodes } from "../data/roadmapData";

describe("Telecommunications Engineering Course & Roadmap Relations", () => {
  it("should verify that tele_analog has e_signals and circuit1 as prerequisites", () => {
    const node = roadmapNodes.find(n => n.id === "tele_analog");
    expect(node).toBeDefined();
    expect(node?.prerequisites).toContain("e_signals");
    expect(node?.prerequisites).toContain("circuit1");
    expect(node?.corequisites).toContain("tele_analog_lab");
  });

  it("should verify that tele_mobile has tele_digital and tele_antennas as prerequisites", () => {
    const node = roadmapNodes.find(n => n.id === "tele_mobile");
    expect(node).toBeDefined();
    expect(node?.prerequisites).toContain("tele_digital");
    expect(node?.prerequisites).toContain("tele_antennas");
    expect(node?.corequisites).toContain("tele_wireless_lab");
  });

  it("should verify legacy aliases mapping correctly", () => {
    const aliases = ["c1", "e1", "e2", "e3"];
    aliases.forEach(alias => {
      const node = roadmapNodes.find(n => n.id === alias);
      expect(node).toBeDefined();
      const course = courses.find(c => c.id === alias);
      expect(course).toBeDefined();
    });
  });

  it("should verify all telecommunications specialty nodes exist in the courses catalog", () => {
    const telecomNodeIds = [
      "tele_analog", "tele_analog_lab", "tele_digital", "tele_digital_lab",
      "tele_dsp", "tele_dsp_lab", "tele_antennas", "tele_ant_mw_lab",
      "tele_microwaves", "tele_optical", "tele_optical_lab", "tele_circuits",
      "tele_mobile", "tele_wireless_lab", "tele_radar", "tele_ic",
      "tele_crypto_info", "tele_satellite", "tele_wireless_systems",
      "tele_simulation", "tele_special_topics"
    ];

    telecomNodeIds.forEach(nodeId => {
      const node = roadmapNodes.find(n => n.id === nodeId);
      expect(node, `Roadmap node ${nodeId} not found`).toBeDefined();
      const course = courses.find(c => c.id === nodeId);
      expect(course, `Course ${nodeId} not found in catalog`).toBeDefined();
    });
  });
});
