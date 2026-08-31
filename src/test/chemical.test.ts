import { describe, it, expect } from "vitest";
import { courses } from "../data/mockData";
import { roadmapNodes } from "../data/roadmapData";

describe("Chemical Industries Engineering Course & Roadmap Relations", () => {
  it("should verify that chem_polymers has chem_organic as prerequisite", () => {
    const node = roadmapNodes.find(n => n.id === "chem_polymers");
    expect(node).toBeDefined();
    expect(node?.prerequisites).toContain("chem_organic");
  });

  it("should verify that m_bioprocess has m_reaction_eng2 as prerequisite", () => {
    const node = roadmapNodes.find(n => n.id === "m_bioprocess");
    expect(node).toBeDefined();
    expect(node?.prerequisites).toContain("m_reaction_eng2");
  });

  it("should verify that chem_pharmaceutical has m_bioprocess as prerequisite", () => {
    const node = roadmapNodes.find(n => n.id === "chem_pharmaceutical");
    expect(node).toBeDefined();
    expect(node?.prerequisites).toContain("m_bioprocess");
  });

  it("should verify that m_plant_design has ee201 and m_equip_design as prerequisites", () => {
    const node = roadmapNodes.find(n => n.id === "m_plant_design");
    expect(node).toBeDefined();
    expect(node?.prerequisites).toContain("m_equip_design");
    expect(node?.prerequisites).toContain("ee201");
  });

  it("should verify all chemical specialty nodes exist in the courses catalog", () => {
    const chemicalNodeIds = [
      "chem_polymers", "chem_membrane_sep", "chem_electrochemical",
      "chem_pharmaceutical", "chem_catalysis", "chem_food",
      "chem_oil_shale", "chem_fertilizers", "chem_nano",
      "chem_mineral_proc", "chem_petrochemicals", "chem_special_topics"
    ];

    chemicalNodeIds.forEach(nodeId => {
      const course = courses.find(c => c.id === nodeId);
      expect(course, `Course ${nodeId} not found in catalog`).toBeDefined();
    });
  });
});
