import { describe, it, expect } from "vitest";
import { courses } from "../data/mockData";
import { roadmapNodes } from "../data/roadmapData";

describe("Network Security Engineering Course & Roadmap Relations", () => {
  it("should verify that ns_crypto has comp_cyber_security as prerequisite and ns_security_lab as corequisite", () => {
    const cryptoNode = roadmapNodes.find(node => node.id === "ns_crypto");
    expect(cryptoNode).toBeDefined();
    expect(cryptoNode?.prerequisites).toContain("comp_cyber_security");
    expect(cryptoNode?.corequisites).toContain("ns_security_lab");
  });

  it("should verify that ns_forensics has ns_crypto as prerequisite and ns_forensics_lab as corequisite", () => {
    const forensicsNode = roadmapNodes.find(node => node.id === "ns_forensics");
    expect(forensicsNode).toBeDefined();
    expect(forensicsNode?.prerequisites).toContain("ns_crypto");
    expect(forensicsNode?.corequisites).toContain("ns_forensics_lab");
  });

  it("should verify that ns_wireless has ns_networks as prerequisite and ns_wireless_lab as corequisite", () => {
    const wirelessNode = roadmapNodes.find(node => node.id === "ns_wireless");
    expect(wirelessNode).toBeDefined();
    expect(wirelessNode?.prerequisites).toContain("ns_networks");
    expect(wirelessNode?.corequisites).toContain("ns_wireless_lab");
  });

  it("should verify that ns_iot has ns_protocols as prerequisite (Footnote *** rule)", () => {
    const iotNode = roadmapNodes.find(node => node.id === "ns_iot");
    expect(iotNode).toBeDefined();
    expect(iotNode?.prerequisites).toContain("ns_protocols");
  });

  it("should verify all mapped security nodes exist in courses list", () => {
    // Only verify the custom network security category nodes
    const securityNodeIds = [
      "ns_protocols_lab", "ns_crypto", "ns_security_lab", "ns_forensics", "ns_forensics_lab",
      "ns_net_programming", "ns_wireless", "ns_wireless_lab", "ns_ethical_hacking",
      "ns_project1", "ns_project2", "ns_training", "ns_iot", "ns_wireless_security",
      "ns_modeling_simulation", "ns_special_topics", "ns_sensor_networks", "ns_linux"
    ];
    
    for (const nodeId of securityNodeIds) {
      const node = roadmapNodes.find(rn => rn.id === nodeId);
      expect(node, `Roadmap node ${nodeId} not found in roadmapNodes`).toBeDefined();
      
      const mockCourse = courses.find(c => 
        c.id.toLowerCase() === nodeId.toLowerCase() || 
        c.code.replace(/\s+/g, "").toLowerCase() === nodeId.toLowerCase()
      );
      expect(mockCourse, `Roadmap node ${nodeId} not found in courses catalog`).toBeDefined();
    }
  });
});
