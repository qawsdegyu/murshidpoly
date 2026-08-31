import { describe, it, expect } from "vitest";
import { courses } from "../data/mockData";
import { roadmapNodes } from "../data/roadmapData";

describe("Computer Engineering Course & Roadmap Relations", () => {
  it("should verify that comp_embedded has comp_os and comp_architecture as prerequisites", () => {
    const embeddedNode = roadmapNodes.find(node => node.id === "comp_embedded");
    expect(embeddedNode).toBeDefined();
    expect(embeddedNode?.prerequisites).toContain("comp_os");
    expect(embeddedNode?.prerequisites).toContain("comp_architecture");
    expect(embeddedNode?.corequisites).toContain("comp_embedded_lab");
  });

  it("should verify that comp_ai has stat101 and comp_oop as prerequisites", () => {
    const aiNode = roadmapNodes.find(node => node.id === "comp_ai");
    expect(aiNode).toBeDefined();
    expect(aiNode?.prerequisites).toContain("stat101");
    expect(aiNode?.prerequisites).toContain("comp_oop");
    expect(aiNode?.corequisites).toContain("comp_ai_lab");
  });

  it("should verify that e_communications has e_signals and logic_design as prerequisites", () => {
    const commNode = roadmapNodes.find(node => node.id === "e_communications");
    expect(commNode).toBeDefined();
    expect(commNode?.prerequisites).toContain("e_signals");
    expect(commNode?.prerequisites).toContain("logic_design");
  });

  it("should verify that ns_networks has e_communications as prerequisite and ns_networks_lab as corequisite", () => {
    const networksNode = roadmapNodes.find(node => node.id === "ns_networks");
    expect(networksNode).toBeDefined();
    expect(networksNode?.prerequisites).toContain("e_communications");
    expect(networksNode?.corequisites).toContain("ns_networks_lab");
  });

  it("should verify all mapped computer nodes exist in courses list", () => {
    const computerNodes = roadmapNodes.filter(node => node.category === "computer");
    
    for (const node of computerNodes) {
      const mockCourse = courses.find(c => 
        c.id.toLowerCase() === node.id.toLowerCase() || 
        c.code.replace(/\s+/g, "").toLowerCase() === node.id.toLowerCase()
      );
      expect(mockCourse, `Roadmap node ${node.id} not found in courses catalog`).toBeDefined();
    }
  });
});
