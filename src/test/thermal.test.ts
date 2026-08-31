import { describe, it, expect } from "vitest";
import { courses } from "../data/mockData";
import { roadmapNodes } from "../data/roadmapData";

describe("Thermal & Hydraulic Machines Engineering Course & Roadmap Relations", () => {
  it("should verify that therm_gas_dynamics has auto_heat_transfer as prerequisite", () => {
    const node = roadmapNodes.find(n => n.id === "therm_gas_dynamics");
    expect(node).toBeDefined();
    expect(node?.prerequisites).toContain("auto_heat_transfer");
  });

  it("should verify that therm_fluid_systems has auto_heat_transfer as prerequisite", () => {
    const node = roadmapNodes.find(n => n.id === "therm_fluid_systems");
    expect(node).toBeDefined();
    expect(node?.prerequisites).toContain("auto_heat_transfer");
  });

  it("should verify that therm_boilers has power_plants as prerequisite", () => {
    const node = roadmapNodes.find(n => n.id === "therm_boilers");
    expect(node).toBeDefined();
    expect(node?.prerequisites).toContain("power_plants");
  });

  it("should verify that therm_piping has hydraulic_machines as prerequisite", () => {
    const node = roadmapNodes.find(n => n.id === "therm_piping");
    expect(node).toBeDefined();
    expect(node?.prerequisites).toContain("hydraulic_machines");
  });

  it("should verify all thermal specialty nodes exist in the courses catalog", () => {
    const thermalNodeIds = [
      "therm_gas_dynamics", "therm_refrigeration", "therm_applied_heat",
      "therm_fluid_systems", "therm_boilers", "therm_piping",
      "therm_pneumatic", "therm_special_hydraulic", "therm_special_gas"
    ];

    thermalNodeIds.forEach(nodeId => {
      const node = roadmapNodes.find(n => n.id === nodeId);
      expect(node, `Roadmap node ${nodeId} not found`).toBeDefined();
      const course = courses.find(c => c.id === nodeId);
      expect(course, `Course ${nodeId} not found in catalog`).toBeDefined();
    });
  });
});
