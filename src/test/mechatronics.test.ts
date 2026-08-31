import { describe, it, expect } from "vitest";
import { courses } from "../data/mockData";
import { roadmapNodes } from "../data/roadmapData";

describe("Mechatronics Engineering Course & Roadmap Relations", () => {
  it("should verify that mecha_design has mecha_plc and mecha_sensors as prerequisites", () => {
    const mechaDesignNode = roadmapNodes.find(node => node.id === "mecha_design");
    expect(mechaDesignNode).toBeDefined();
    expect(mechaDesignNode?.prerequisites).toContain("mecha_plc");
    expect(mechaDesignNode?.prerequisites).toContain("mecha_sensors");
  });

  it("should verify that advanced_control has auto_control as prerequisite", () => {
    const advControlNode = roadmapNodes.find(node => node.id === "advanced_control");
    expect(advControlNode).toBeDefined();
    expect(advControlNode?.prerequisites).toContain("auto_control");
  });

  it("should verify that mecha_plc has logic_design as prerequisite and mecha_plc_lab as corequisite", () => {
    const plcNode = roadmapNodes.find(node => node.id === "mecha_plc");
    expect(plcNode).toBeDefined();
    expect(plcNode?.prerequisites).toContain("logic_design");
    expect(plcNode?.corequisites).toContain("mecha_plc_lab");
  });

  it("should verify that robotics_lab has mecha_robot_dynamics as corequisite", () => {
    const robLabNode = roadmapNodes.find(node => node.id === "robotics_lab");
    expect(robLabNode).toBeDefined();
    expect(robLabNode?.corequisites).toContain("mecha_robot_dynamics");
  });

  it("should verify all mapped mechatronics nodes exist in courses list", () => {
    const mechaNodes = roadmapNodes.filter(node => node.category === "mechatronics");
    
    // Nodes that are shared or have external IDs in other categories but are relevant to mechatronics
    // can be skipped or resolved. Let's make sure every mechatronics category node is in courses.
    for (const node of mechaNodes) {
      const mockCourse = courses.find(c => 
        c.id.toLowerCase() === node.id.toLowerCase() || 
        c.code.replace(/\s+/g, "").toLowerCase() === node.id.toLowerCase()
      );
      expect(mockCourse, `Roadmap node ${node.id} not found in courses catalog`).toBeDefined();
    }
  });
});
