import { courses, resourcesByCourse } from "./mockData";

export interface RoadmapNode {
  id: string;
  prerequisites: string[];
  corequisites: string[]; // Added corequisites
  level: number;
  position: { x: number; y: number };
  category: "common" | "computer" | "civil" | "mechatronics" | "mechanical" | "chemical" | "electrical";
  fallbackName?: string;
  fallbackNameAr?: string;
}

export const roadmapNodes: RoadmapNode[] = [
  // --- Mathematics Track ---
  { id: "MATH101", prerequisites: [], corequisites: [], level: 1, position: { x: 15, y: 10 }, category: "common" },
  { id: "MATH102", prerequisites: ["MATH101"], corequisites: [], level: 2, position: { x: 30, y: 10 }, category: "common" },
  { id: "numerical", prerequisites: ["MATH102"], corequisites: [], level: 2, position: { x: 45, y: 5 }, category: "common" },
  { id: "diff_eq", prerequisites: ["MATH102"], corequisites: [], level: 2, position: { x: 45, y: 15 }, category: "common" },
  { id: "stat101", prerequisites: ["MATH102"], corequisites: [], level: 2, position: { x: 45, y: 25 }, category: "common" },
  { id: "linear_algebra", prerequisites: [], corequisites: [], level: 0, position: { x: 15, y: 20 }, category: "common" },

  // --- Physics Track ---
  { id: "PHYS101", prerequisites: [], corequisites: [], level: 1, position: { x: 15, y: 35 }, category: "common" },
  { id: "PHYS102", prerequisites: ["PHYS101"], corequisites: [], level: 2, position: { x: 30, y: 35 }, category: "common" },
  { id: "plab101", prerequisites: [], corequisites: ["PHYS101"], level: 0, position: { x: 15, y: 45 }, category: "common" },
  { id: "plab102", prerequisites: [], corequisites: ["PHYS102"], level: 1, position: { x: 30, y: 45 }, category: "common" },
  { id: "c4", prerequisites: ["PHYS101", "MATH101"], corequisites: [], level: 1, position: { x: 30, y: 25 }, category: "common" },

  // --- Chemistry Track ---
  { id: "CHEM101", prerequisites: [], corequisites: [], level: 0, position: { x: 15, y: 60 }, category: "common" },
  { id: "chemlab101", prerequisites: [], corequisites: ["CHEM101"], level: 0, position: { x: 15, y: 70 }, category: "common" },

  // --- Computer & Engineering Track ---
  { id: "cs99", prerequisites: [], corequisites: [], level: 0, position: { x: 5, y: 85 }, category: "common" },
  { id: "cs101", prerequisites: ["cs99"], corequisites: [], level: 1, position: { x: 20, y: 85 }, category: "common" },
  { id: "programming_cpp", prerequisites: ["cs101"], corequisites: [], level: 2, position: { x: 35, y: 80 }, category: "common" },
  { id: "engineering_workshop", prerequisites: [], corequisites: [], level: 0, position: { x: 20, y: 95 }, category: "common" },
  { id: "engineering_drawing", prerequisites: ["cs101", "engineering_workshop"], corequisites: [], level: 2, position: { x: 35, y: 90 }, category: "common" },

  // --- Languages Track ---
  { id: "arabic99", prerequisites: [], corequisites: [], level: 0, position: { x: 55, y: 10 }, category: "common" },
  { id: "ARAB101", prerequisites: ["arabic99"], corequisites: [], level: 1, position: { x: 70, y: 10 }, category: "common" },
  { id: "eng99", prerequisites: [], corequisites: [], level: 0, position: { x: 55, y: 25 }, category: "common" },
  { id: "ENGL101", prerequisites: ["eng99"], corequisites: [], level: 1, position: { x: 70, y: 25 }, category: "common" },
  { id: "english102", prerequisites: ["ENGL101"], corequisites: [], level: 2, position: { x: 85, y: 25 }, category: "common" },

  // --- Standalone Subjects ---
  { id: "EE201", prerequisites: [], corequisites: [], level: 3, position: { x: 60, y: 45 }, category: "common" },
  { id: "national_studies", prerequisites: [], corequisites: [], level: 3, position: { x: 60, y: 55 }, category: "common" },
  { id: "military_science", prerequisites: [], corequisites: [], level: 3, position: { x: 60, y: 65 }, category: "common" },
  { id: "entrepreneurship", prerequisites: [], corequisites: [], level: 3, position: { x: 75, y: 45 }, category: "common" },
  { id: "ISLM101", prerequisites: [], corequisites: [], level: 3, position: { x: 75, y: 55 }, category: "common" },
  { id: "technical_writing", prerequisites: [], corequisites: [], level: 3, position: { x: 75, y: 65 }, category: "common" },

  // --- Civil Engineering Track (المدنية) ---
  // Structural & Geotechnical
  { id: "ce_dynamics", prerequisites: ["c4", "MATH102"], corequisites: [], level: 2, position: { x: 45, y: 15 }, category: "civil" },
  { id: "ce_strength", prerequisites: ["c4"], corequisites: [], level: 2, position: { x: 45, y: 25 }, category: "civil" },
  { id: "ce_structural1", prerequisites: ["ce_strength"], corequisites: [], level: 3, position: { x: 60, y: 25 }, category: "civil" },
  { id: "ce_structural2", prerequisites: ["ce_structural1"], corequisites: [], level: 4, position: { x: 75, y: 15 }, category: "civil", fallbackName: "Structural Analysis 2", fallbackNameAr: "تحليل إنشائي 2" },
  { id: "ce_concrete_props", prerequisites: ["ce_strength"], corequisites: [], level: 5, position: { x: 90, y: 30 }, category: "civil", fallbackName: "Concrete Properties", fallbackNameAr: "خواص الخرسانة" },
  { id: "ce_concrete_lab", prerequisites: [], corequisites: ["ce_concrete_props"], level: 5, position: { x: 90, y: 35 }, category: "civil", fallbackName: "Concrete Lab", fallbackNameAr: "مختبر خواص الخرسانة" },
  { id: "ce_concrete1", prerequisites: ["ce_structural1"], corequisites: [], level: 4, position: { x: 75, y: 25 }, category: "civil", fallbackName: "Reinforced Concrete 1", fallbackNameAr: "تصميم الخرسانة المسلحة 1" },
  { id: "ce_concrete2", prerequisites: ["ce_concrete1"], corequisites: [], level: 5, position: { x: 90, y: 20 }, category: "civil", fallbackName: "Reinforced Concrete 2", fallbackNameAr: "تصميم الخرسانة المسلحة 2" },
  { id: "ce_steel", prerequisites: ["ce_structural1"], corequisites: [], level: 4, position: { x: 75, y: 35 }, category: "civil", fallbackName: "Steel Structures", fallbackNameAr: "منشآت فولاذية" },
  
  { id: "ce_geology", prerequisites: [], corequisites: [], level: 2, position: { x: 30, y: 40 }, category: "civil", fallbackName: "Engineering Geology", fallbackNameAr: "الجيولوجيا الهندسية" },
  { id: "ce_geology_lab", prerequisites: [], corequisites: ["ce_geology"], level: 2, position: { x: 30, y: 45 }, category: "civil", fallbackName: "Geology Lab", fallbackNameAr: "مختبر الجيولوجيا الهندسية" },
  { id: "ce_geotechnical", prerequisites: ["ce_strength", "ce_geology"], corequisites: [], level: 3, position: { x: 45, y: 40 }, category: "civil", fallbackName: "Geotechnical Engineering", fallbackNameAr: "الهندسة الجيوتقنية" },
  { id: "ce_geotechnical_lab", prerequisites: [], corequisites: ["ce_geotechnical"], level: 3, position: { x: 45, y: 45 }, category: "civil", fallbackName: "Geotechnical Lab", fallbackNameAr: "مختبر الهندسة الجيوتقنية" },
  { id: "ce_foundations", prerequisites: ["ce_geotechnical"], corequisites: [], level: 4, position: { x: 60, y: 40 }, category: "civil", fallbackName: "Foundation Engineering", fallbackNameAr: "هندسة الأساسات" },

  // Roads & Surveying
  { id: "ce_surveying", prerequisites: ["MATH101"], corequisites: [], level: 2, position: { x: 30, y: 55 }, category: "civil" },
  { id: "ce_surveying_lab", prerequisites: [], corequisites: ["ce_surveying"], level: 2, position: { x: 30, y: 60 }, category: "civil", fallbackName: "Surveying Lab", fallbackNameAr: "مختبر مساحة" },
  { id: "ce_roads", prerequisites: ["ce_surveying"], corequisites: [], level: 3, position: { x: 45, y: 55 }, category: "civil", fallbackName: "Highway Engineering", fallbackNameAr: "هندسة الطرق" },
  { id: "ce_traffic", prerequisites: ["ce_roads"], corequisites: [], level: 4, position: { x: 60, y: 50 }, category: "civil" },
  { id: "ce_pavement", prerequisites: ["ce_roads"], corequisites: [], level: 4, position: { x: 60, y: 60 }, category: "civil", fallbackName: "Pavement Design", fallbackNameAr: "تصميم رصفات" },
  { id: "ce_pavement_lab", prerequisites: ["ce_pavement"], corequisites: [], level: 5, position: { x: 75, y: 65 }, category: "civil", fallbackName: "Pavement Lab", fallbackNameAr: "مختبر رصفات" },

  // Water & Environment
  { id: "ce_fluids", prerequisites: ["c4"], corequisites: [], level: 2, position: { x: 45, y: 75 }, category: "civil", fallbackName: "Fluid Mechanics", fallbackNameAr: "ميكانيكا الموائع" },
  { id: "ce_hydraulics", prerequisites: ["ce_fluids"], corequisites: [], level: 3, position: { x: 60, y: 75 }, category: "civil", fallbackName: "Hydraulics", fallbackNameAr: "هندسة المائيات" },
  { id: "ce_hydraulics_lab", prerequisites: [], corequisites: ["ce_hydraulics"], level: 3, position: { x: 60, y: 80 }, category: "civil", fallbackName: "Hydraulics Lab", fallbackNameAr: "مختبر هندسة مائيات" },
  { id: "ce_hydrology", prerequisites: ["ce_hydraulics"], corequisites: [], level: 4, position: { x: 75, y: 80 }, category: "civil", fallbackName: "Engineering Hydrology", fallbackNameAr: "الهيدرولوجيا الهندسية" },
  { id: "ce_water_treatment", prerequisites: ["chem101"], corequisites: [], level: 3, position: { x: 45, y: 85 }, category: "civil", fallbackName: "Water Treatment", fallbackNameAr: "معالجة المياه" },
  { id: "ce_wastewater", prerequisites: ["ce_water_treatment"], corequisites: [], level: 4, position: { x: 60, y: 85 }, category: "civil", fallbackName: "Wastewater Engineering", fallbackNameAr: "هندسة مياه عادمة" },

  // Projects & Core Requirements
  { id: "ce_project1", prerequisites: [], corequisites: [], level: 5, position: { x: 75, y: 85 }, category: "civil", fallbackName: "Graduation Project 1", fallbackNameAr: "مشروع 1" },
  { id: "ce_project2", prerequisites: ["ce_project1"], corequisites: [], level: 6, position: { x: 90, y: 85 }, category: "civil", fallbackName: "Graduation Project 2", fallbackNameAr: "مشروع 2" },
  { id: "ce_specs", prerequisites: ["ce_surveying"], corequisites: [], level: 4, position: { x: 60, y: 90 }, category: "civil", fallbackName: "Specifications, Contracts & Quantities", fallbackNameAr: "المواصفات والعقود وحساب الكميات" },
  { id: "ce_comp_apps", prerequisites: ["ce_structural1"], corequisites: [], level: 4, position: { x: 60, y: 95 }, category: "civil", fallbackName: "Computer Applications in Civil Engineering", fallbackNameAr: "تطبيقات حاسوب في الهندسة المدنية" },
  { id: "ce_civil_drawing", prerequisites: ["engineering_drawing"], corequisites: [], level: 2, position: { x: 35, y: 100 }, category: "civil", fallbackName: "Civil Drawing", fallbackNameAr: "الرسم المدني" },
  { id: "eng_applied_math", prerequisites: ["diff_eq"], corequisites: [], level: 3, position: { x: 60, y: 5 }, category: "civil", fallbackName: "Applied Mathematics for Engineers", fallbackNameAr: "الرياضيات التطبيقية للمهندسين" },

  // Specialty Roads and Bridges Track
  { id: "ce_tunnels", prerequisites: ["ce_foundations"], corequisites: [], level: 5, position: { x: 90, y: 40 }, category: "civil", fallbackName: "Tunnel Engineering", fallbackNameAr: "هندسة الأنفاق" },
  { id: "ce_safety", prerequisites: [], corequisites: [], level: 4, position: { x: 75, y: 45 }, category: "civil", fallbackName: "Occupational Safety", fallbackNameAr: "السلامة المهنية" },
  { id: "ce_airports_railways", prerequisites: ["ce_roads"], corequisites: [], level: 4, position: { x: 60, y: 65 }, category: "civil", fallbackName: "Airport & Railway Engineering", fallbackNameAr: "هندسة مطارات وسكك حديدية" },
  { id: "ce_pavement_rehab", prerequisites: ["ce_pavement"], corequisites: [], level: 5, position: { x: 75, y: 60 }, category: "civil", fallbackName: "Road & Pavement Rehabilitation", fallbackNameAr: "تأهيل الطرق والرصفات" },
  { id: "ce_bridges", prerequisites: ["ce_concrete1"], corequisites: [], level: 5, position: { x: 90, y: 25 }, category: "civil", fallbackName: "Bridge Engineering", fallbackNameAr: "هندسة الجسور" },
  { id: "ce_prestressed", prerequisites: ["ce_concrete1"], corequisites: [], level: 5, position: { x: 90, y: 15 }, category: "civil", fallbackName: "Prestressed Concrete", fallbackNameAr: "خرسانة مسبقة الإجهاد" },
  { id: "ce_seismic", prerequisites: ["ce_structural1"], corequisites: [], level: 5, position: { x: 90, y: 10 }, category: "civil", fallbackName: "Introduction to Earthquake Engineering", fallbackNameAr: "مقدمة في هندسة الزلازل" },
  { id: "ce_rehab_concrete", prerequisites: ["ce_concrete1"], corequisites: [], level: 5, position: { x: 90, y: 35 }, category: "civil", fallbackName: "Rehabilitation of Concrete Structures", fallbackNameAr: "تأهيل منشآت خرسانية" },
  { id: "ce_advanced_structural", prerequisites: ["ce_structural2"], corequisites: [], level: 5, position: { x: 90, y: 5 }, category: "civil", fallbackName: "Advanced Structural Analysis", fallbackNameAr: "تحليل إنشائي متقدم" },
  { id: "ce_its", prerequisites: ["ce_traffic"], corequisites: [], level: 5, position: { x: 75, y: 50 }, category: "civil", fallbackName: "Intelligent Transportation Systems", fallbackNameAr: "أنظمة النقل الذكية" },
  { id: "ce_building_construction", prerequisites: ["ce_civil_drawing"], corequisites: [], level: 3, position: { x: 45, y: 100 }, category: "civil", fallbackName: "Building Construction", fallbackNameAr: "إنشاء مباني" },
  { id: "ce_urban_transit", prerequisites: ["ce_roads"], corequisites: [], level: 4, position: { x: 60, y: 70 }, category: "civil", fallbackName: "Urban Transportation", fallbackNameAr: "النقل الحضري" },

  // --- Computer Engineering Track (الحاسوب) ---
  { id: "logic_design", prerequisites: ["programming_cpp"], corequisites: ["comp_digital_lab"], level: 2, position: { x: 45, y: 85 }, category: "computer", fallbackName: "Digital Logic Design", fallbackNameAr: "تصميم المنطق الرقمي" },
  { id: "comp_digital_lab", prerequisites: [], corequisites: ["logic_design"], level: 2, position: { x: 45, y: 90 }, category: "computer", fallbackName: "Digital Logic Lab", fallbackNameAr: "مختبر تصميم المنطق الرقمي" },
  
  { id: "comp_oop", prerequisites: ["programming_cpp"], corequisites: [], level: 2, position: { x: 45, y: 95 }, category: "computer", fallbackName: "Object-Oriented Programming", fallbackNameAr: "البرمجة بلغة الكينونة" },
  
  { id: "comp_data_structures", prerequisites: ["comp_oop"], corequisites: ["comp_data_struct_lab"], level: 3, position: { x: 60, y: 85 }, category: "computer", fallbackName: "Data Structures & Algorithms", fallbackNameAr: "تراكيب البيانات والخوارزميات" },
  { id: "comp_data_struct_lab", prerequisites: [], corequisites: ["comp_data_structures"], level: 3, position: { x: 60, y: 90 }, category: "computer", fallbackName: "Data Structures Lab", fallbackNameAr: "مختبر تراكيب البيانات والخوارزميات" },
  
  { id: "comp_adv_programming", prerequisites: ["comp_data_structures"], corequisites: [], level: 4, position: { x: 75, y: 80 }, category: "computer", fallbackName: "Advanced Programming", fallbackNameAr: "البرمجة المتقدمة" },
  { id: "comp_os", prerequisites: ["comp_data_structures"], corequisites: [], level: 4, position: { x: 75, y: 85 }, category: "computer", fallbackName: "Operating Systems", fallbackNameAr: "نظم تشغيل" },
  { id: "comp_db", prerequisites: ["comp_data_structures"], corequisites: ["comp_db_lab"], level: 4, position: { x: 75, y: 90 }, category: "computer", fallbackName: "Database Systems", fallbackNameAr: "أنظمة قواعد البيانات" },
  { id: "comp_db_lab", prerequisites: [], corequisites: ["comp_db"], level: 4, position: { x: 75, y: 95 }, category: "computer", fallbackName: "Database Lab", fallbackNameAr: "مختبر أنظمة قواعد البيانات" },
  
  { id: "comp_microprocessors", prerequisites: ["logic_design"], corequisites: ["comp_micro_ctrl_lab"], level: 3, position: { x: 60, y: 95 }, category: "computer", fallbackName: "Microprocessor Systems", fallbackNameAr: "أنظمة المعالجات الدقيقة والحاكمات" },
  { id: "comp_micro_ctrl_lab", prerequisites: [], corequisites: ["comp_microprocessors"], level: 3, position: { x: 60, y: 100 }, category: "computer", fallbackName: "Microprocessors & Controllers Lab", fallbackNameAr: "مختبر أنظمة المعالجات الدقيقة والحاكمات" },
  
  { id: "comp_architecture", prerequisites: ["comp_microprocessors"], corequisites: ["comp_arch_lab"], level: 4, position: { x: 75, y: 100 }, category: "computer", fallbackName: "Computer Architecture", fallbackNameAr: "معمارية الحاسوب وتنظيمه" },
  { id: "comp_arch_lab", prerequisites: [], corequisites: ["comp_architecture"], level: 4, position: { x: 75, y: 105 }, category: "computer", fallbackName: "Computer Architecture Lab", fallbackNameAr: "مختبر معمارية الحاسوب" },
  
  { id: "comp_embedded", prerequisites: ["comp_os", "comp_architecture"], corequisites: ["comp_embedded_lab"], level: 5, position: { x: 90, y: 85 }, category: "computer", fallbackName: "Embedded Systems", fallbackNameAr: "الأنظمة المضمنة" },
  { id: "comp_embedded_lab", prerequisites: [], corequisites: ["comp_embedded"], level: 5, position: { x: 90, y: 90 }, category: "computer", fallbackName: "Embedded Systems Lab", fallbackNameAr: "مختبر الأنظمة المضمنة" },
  
  { id: "comp_adv_architecture", prerequisites: ["comp_architecture"], corequisites: [], level: 5, position: { x: 90, y: 95 }, category: "computer", fallbackName: "Advanced Computer Architecture", fallbackNameAr: "معمارية الحواسيب المتقدمة" },
  
  { id: "comp_parallel", prerequisites: ["comp_architecture"], corequisites: ["comp_parallel_lab"], level: 5, position: { x: 90, y: 100 }, category: "computer", fallbackName: "Parallel Processing Systems", fallbackNameAr: "أنظمة المعالجة المتوازية" },
  { id: "comp_parallel_lab", prerequisites: [], corequisites: ["comp_parallel"], level: 5, position: { x: 90, y: 105 }, category: "computer", fallbackName: "Parallel Processing Lab", fallbackNameAr: "مختبر أنظمة المعالجة المتوازية" },
  
  { id: "comp_ai", prerequisites: ["stat101", "comp_oop"], corequisites: ["comp_ai_lab"], level: 4, position: { x: 75, y: 70 }, category: "computer", fallbackName: "AI & Machine Learning", fallbackNameAr: "الذكاء الاصطناعي وتعلم الآلة" },
  { id: "comp_ai_lab", prerequisites: [], corequisites: ["comp_ai"], level: 4, position: { x: 75, y: 75 }, category: "computer", fallbackName: "AI Lab", fallbackNameAr: "مختبر الذكاء الاصطناعي" },
  
  { id: "ns_networks", prerequisites: ["e_communications"], corequisites: ["ns_networks_lab"], level: 4, position: { x: 75, y: 60 }, category: "computer", fallbackName: "Computer Networks Fundamentals", fallbackNameAr: "أساسيات شبكات الحاسوب" },
  { id: "ns_networks_lab", prerequisites: [], corequisites: ["ns_networks"], level: 4, position: { x: 75, y: 65 }, category: "computer", fallbackName: "Computer Networks Lab", fallbackNameAr: "مختبر شبكات الحاسوب" },
  
  { id: "ns_protocols", prerequisites: ["ns_networks"], corequisites: [], level: 5, position: { x: 90, y: 60 }, category: "computer", fallbackName: "Network Protocols", fallbackNameAr: "بروتوكولات الشبكات" },
  { id: "comp_cyber_security", prerequisites: ["ns_networks"], corequisites: [], level: 5, position: { x: 90, y: 65 }, category: "computer", fallbackName: "Cyber Security Fundamentals", fallbackNameAr: "أساسيات الأمن السيبراني" },
  
  { id: "comp_project1", prerequisites: [], corequisites: [], level: 5, position: { x: 95, y: 110 }, category: "computer", fallbackName: "Graduation Project I", fallbackNameAr: "مشروع 1" },
  { id: "comp_project2", prerequisites: ["comp_project1"], corequisites: [], level: 6, position: { x: 105, y: 110 }, category: "computer", fallbackName: "Graduation Project II", fallbackNameAr: "مشروع 2" },
  { id: "comp_training", prerequisites: [], corequisites: [], level: 4, position: { x: 90, y: 115 }, category: "computer", fallbackName: "Field Training", fallbackNameAr: "التدريب الميداني" },


  // --- Mechatronics Engineering Track (الميكاترونكس) ---
  { id: "electronics", prerequisites: ["circuit1"], corequisites: ["e_electronics_lab"], level: 3, position: { x: 60, y: 30 }, category: "electrical", fallbackName: "Electronics I", fallbackNameAr: "الإلكترونيات 1" },
  { id: "e_electronics_lab", prerequisites: [], corequisites: ["electronics"], level: 3, position: { x: 60, y: 35 }, category: "electrical", fallbackName: "Electronics Lab I", fallbackNameAr: "مختبر إلكترونيات 1" },
  
  { id: "mecha_sensors", prerequisites: ["electronics"], corequisites: ["mecha_sensors_lab"], level: 3, position: { x: 45, y: 45 }, category: "mechatronics", fallbackName: "Sensors & Actuators", fallbackNameAr: "المجسات والمشغلات" },
  { id: "mecha_sensors_lab", prerequisites: [], corequisites: ["mecha_sensors"], level: 3, position: { x: 45, y: 50 }, category: "mechatronics", fallbackName: "Sensors & Actuators Lab", fallbackNameAr: "مختبر المجسات والمشغلات" },
  
  { id: "mecha_power_elec_lab", prerequisites: [], corequisites: ["mecha_power_elec"], level: 4, position: { x: 75, y: 30 }, category: "mechatronics", fallbackName: "Power Electronics Lab", fallbackNameAr: "مختبر إلكترونيات القدرة" },
  
  { id: "mecha_drives", prerequisites: ["mecha_power_elec"], corequisites: ["mecha_drives_lab"], level: 4, position: { x: 75, y: 45 }, category: "mechatronics", fallbackName: "Electric Drives", fallbackNameAr: "القيادة الكهربائية" },
  { id: "mecha_drives_lab", prerequisites: [], corequisites: ["mecha_drives"], level: 4, position: { x: 75, y: 50 }, category: "mechatronics", fallbackName: "Electric Drives Lab", fallbackNameAr: "مختبر القيادة الكهربائية" },
  
  { id: "e_machines1", prerequisites: ["circuit2"], corequisites: ["auto_machines_lab"], level: 3, position: { x: 45, y: 80 }, category: "electrical", fallbackName: "Electric Machines I", fallbackNameAr: "الآلات الكهربائية 1" },
  { id: "e_signals", prerequisites: ["circuit1"], corequisites: [], level: 3, position: { x: 45, y: 70 }, category: "electrical", fallbackName: "Signals & Systems", fallbackNameAr: "أنظمة وإشارات" },
  
  { id: "e_control_lab", prerequisites: [], corequisites: ["auto_control"], level: 3, position: { x: 45, y: 75 }, category: "electrical", fallbackName: "Control Systems Lab", fallbackNameAr: "مختبر أنظمة تحكم" },
  { id: "advanced_control", prerequisites: ["auto_control"], corequisites: [], level: 5, position: { x: 90, y: 70 }, category: "mechatronics", fallbackName: "Advanced Control Systems", fallbackNameAr: "أنظمة التحكم المتقدمة" },
  { id: "electrical_protection", prerequisites: ["e_machines1"], corequisites: [], level: 5, position: { x: 90, y: 75 }, category: "mechatronics", fallbackName: "Electrical Protection & Control Devices", fallbackNameAr: "أجهزة الحماية والتحكم الكهربائية" },
  { id: "scada", prerequisites: ["auto_control"], corequisites: [], level: 5, position: { x: 90, y: 80 }, category: "mechatronics", fallbackName: "SCADA Systems", fallbackNameAr: "التحكم الإشرافي والتقاط البيانات" },
  
  { id: "mecha_industrial_ctrl", prerequisites: ["auto_control"], corequisites: ["mecha_industrial_lab"], level: 4, position: { x: 60, y: 45 }, category: "mechatronics", fallbackName: "Industrial Equipment & Control", fallbackNameAr: "التجهيزات الصناعية والتحكم" },
  { id: "mecha_industrial_lab", prerequisites: [], corequisites: ["mecha_industrial_ctrl"], level: 5, position: { x: 90, y: 50 }, category: "mechatronics", fallbackName: "Industrial Equipment Lab", fallbackNameAr: "مختبر التجهيزات الصناعية" },
  
  { id: "mecha_machine_comp", prerequisites: ["ce_strength"], corequisites: [], level: 3, position: { x: 45, y: 60 }, category: "mechatronics", fallbackName: "Machine Components", fallbackNameAr: "مكونات الآلة" },
  { id: "machine_element_design", prerequisites: ["mecha_machine_comp"], corequisites: [], level: 4, position: { x: 60, y: 60 }, category: "mechatronics", fallbackName: "Machine Element Design & CAD", fallbackNameAr: "تصميم عناصر الآلة والتصميم بالحاسوب" },
  { id: "mecha_applied_materials", prerequisites: ["CHEM101"], corequisites: [], level: 5, position: { x: 90, y: 60 }, category: "mechatronics", fallbackName: "Applied Engineering Materials", fallbackNameAr: "المواد الهندسية التطبيقية" },
  
  { id: "mecha_robotic_drives", prerequisites: ["mech_fluids"], corequisites: ["mecha_robotic_lab"], level: 4, position: { x: 60, y: 65 }, category: "mechatronics", fallbackName: "Robotic & Hydraulic Drives", fallbackNameAr: "القيادة الروبوتية والهيدروليكية" },
  { id: "mecha_robotic_lab", prerequisites: [], corequisites: ["mecha_robotic_drives"], level: 5, position: { x: 90, y: 65 }, category: "mechatronics", fallbackName: "Robotic & Hydraulic Lab", fallbackNameAr: "مختبر القيادة الروبوتية والهيدروليكية" },
  
  { id: "e_communications", prerequisites: ["e_signals", "logic_design"], corequisites: [], level: 3, position: { x: 60, y: 70 }, category: "electrical", fallbackName: "Communications & Data Transmission", fallbackNameAr: "الاتصالات وتراسل البيانات" },
  { id: "mecha_dynamics_vibrations", prerequisites: ["c4", "diff_eq"], corequisites: [], level: 3, position: { x: 60, y: 80 }, category: "mechatronics", fallbackName: "Dynamics & Vibrations", fallbackNameAr: "ديناميكا واهتزازات" },
  
  { id: "mecha_design", prerequisites: ["mecha_plc", "mecha_sensors"], corequisites: [], level: 5, position: { x: 90, y: 45 }, category: "mechatronics", fallbackName: "Mechatronics System Design", fallbackNameAr: "تصميم أنظمة الميكاترونكس" },
  { id: "mecha_plc", prerequisites: ["logic_design"], corequisites: ["mecha_plc_lab"], level: 4, position: { x: 60, y: 45 }, category: "mechatronics", fallbackName: "Programmable Logic Controllers (PLC)", fallbackNameAr: "أجهزة الحاكمات المنطقية المبرمجة" },
  { id: "mecha_plc_lab", prerequisites: [], corequisites: ["mecha_plc"], level: 4, position: { x: 60, y: 50 }, category: "mechatronics", fallbackName: "PLC Lab", fallbackNameAr: "مختبر أجهزة الحاكمات المنطقية" },
  
  { id: "mecha_robot_dynamics", prerequisites: ["mecha_design"], corequisites: ["robotics_lab"], level: 5, position: { x: 90, y: 55 }, category: "mechatronics", fallbackName: "Robot Dynamics & Analysis", fallbackNameAr: "ديناميكا الروبوتات وتحليلها" },
  { id: "robotics_lab", prerequisites: [], corequisites: ["mecha_robot_dynamics"], level: 5, position: { x: 90, y: 60 }, category: "mechatronics", fallbackName: "Robotics Dynamics Lab", fallbackNameAr: "مختبر ديناميكا الروبوتات وتحليلها" },
  { id: "robotics_engineering", prerequisites: ["mecha_robot_dynamics"], corequisites: [], level: 5, position: { x: 90, y: 65 }, category: "mechatronics", fallbackName: "Robotics Engineering", fallbackNameAr: "هندسة الروبوتات" },
  
  { id: "mecha_mems", prerequisites: ["mecha_design"], corequisites: [], level: 5, position: { x: 90, y: 70 }, category: "mechatronics", fallbackName: "Micro-Electro-Mechanical Systems (MEMS)", fallbackNameAr: "الأنظمة الكهروميكانيكية الميكروية" },
  { id: "mecha_cnc", prerequisites: ["mecha_design"], corequisites: [], level: 5, position: { x: 90, y: 75 }, category: "mechatronics", fallbackName: "CNC Machines", fallbackNameAr: "ماكينات المحوسبة الرقمية" },
  { id: "mecha_renewable_energy", prerequisites: ["mecha_mems"], corequisites: [], level: 5, position: { x: 90, y: 80 }, category: "mechatronics", fallbackName: "Mechatronics in Renewable Energy", fallbackNameAr: "تطبيقات الميكاترونكس في الطاقة المتجددة" },
  { id: "mecha_special_topics", prerequisites: [], corequisites: [], level: 5, position: { x: 90, y: 85 }, category: "mechatronics", fallbackName: "Special Topics in Mechatronics", fallbackNameAr: "موضوعات خاصة في هندسة الميكاترونكس" },
  
  { id: "mecha_project1", prerequisites: [], corequisites: [], level: 5, position: { x: 95, y: 85 }, category: "mechatronics", fallbackName: "Graduation Project I", fallbackNameAr: "مشروع تخرج 1" },
  { id: "mecha_project2", prerequisites: ["mecha_project1"], corequisites: [], level: 6, position: { x: 105, y: 85 }, category: "mechatronics", fallbackName: "Graduation Project II", fallbackNameAr: "مشروع تخرج 2" },
  { id: "mecha_training", prerequisites: [], corequisites: [], level: 4, position: { x: 90, y: 95 }, category: "mechatronics", fallbackName: "Field Training", fallbackNameAr: "التدريب الميداني" },


  // --- Mechanical Engineering Track (الميكانيك) ---
  { id: "c5", prerequisites: ["PHYS101", "MATH102"], corequisites: [], level: 2, position: { x: 45, y: 5 }, category: "mechanical", fallbackName: "Thermodynamics", fallbackNameAr: "الديناميكا الحرارية" },
  { id: "auto_thermo_lab", prerequisites: [], corequisites: ["c5"], level: 2, position: { x: 45, y: 10 }, category: "mechanical", fallbackName: "Thermodynamics Lab", fallbackNameAr: "مختبر ديناميكا حرارية" },
  { id: "auto_materials_science", prerequisites: ["chem101"], corequisites: [], level: 2, position: { x: 30, y: 15 }, category: "mechanical", fallbackName: "Materials Science", fallbackNameAr: "علم المواد" },
  { id: "mech_manufacturing", prerequisites: ["auto_materials_science"], corequisites: [], level: 3, position: { x: 45, y: 15 }, category: "mechanical", fallbackName: "Manufacturing Processes 1", fallbackNameAr: "عمليات التصنيع 1" },
  { id: "advanced_manufacturing", prerequisites: ["mech_manufacturing"], corequisites: [], level: 4, position: { x: 60, y: 15 }, category: "mechanical", fallbackName: "Advanced Manufacturing Processes", fallbackNameAr: "عمليات التصنيع المتقدمة" },
  { id: "manufacturing_lab", prerequisites: [], corequisites: ["advanced_manufacturing"], level: 4, position: { x: 60, y: 20 }, category: "mechanical", fallbackName: "Manufacturing Processes Lab", fallbackNameAr: "مختبر عمليات التصنيع" },
  { id: "auto_fem", prerequisites: ["eng_applied_math"], corequisites: [], level: 4, position: { x: 75, y: 15 }, category: "mechanical", fallbackName: "Finite Element Methods", fallbackNameAr: "طرائق العنصر المحدود" },
  { id: "engineering_applications_practical", prerequisites: ["auto_fem"], corequisites: [], level: 5, position: { x: 90, y: 15 }, category: "mechanical", fallbackName: "Practical Engineering Applications", fallbackNameAr: "تطبيقات هندسية عملي" },
  { id: "auto_ice", prerequisites: ["c5"], corequisites: [], level: 3, position: { x: 60, y: 5 }, category: "mechanical", fallbackName: "Internal Combustion Engines", fallbackNameAr: "محركات الاحتراق الداخلي" },
  { id: "auto_ice_lab", prerequisites: [], corequisites: ["auto_ice"], level: 3, position: { x: 60, y: 10 }, category: "mechanical", fallbackName: "Internal Combustion Engines Lab", fallbackNameAr: "مختبر محركات احتراق داخلي" },
  { id: "auto_engineering", prerequisites: ["auto_ice"], corequisites: [], level: 4, position: { x: 75, y: 5 }, category: "mechanical", fallbackName: "Automotive Engineering", fallbackNameAr: "هندسة السيارات" },
  { id: "auto_heat_transfer", prerequisites: ["c5"], corequisites: [], level: 3, position: { x: 60, y: 25 }, category: "mechanical", fallbackName: "Heat Transfer", fallbackNameAr: "انتقال الحرارة" },
  { id: "auto_heat_transfer_lab", prerequisites: [], corequisites: ["auto_heat_transfer"], level: 3, position: { x: 60, y: 30 }, category: "mechanical", fallbackName: "Heat Transfer Lab", fallbackNameAr: "مختبر انتقال الحرارة" },
  { id: "power_plants", prerequisites: ["auto_heat_transfer"], corequisites: [], level: 4, position: { x: 75, y: 25 }, category: "mechanical", fallbackName: "Power Plants Engineering", fallbackNameAr: "محطات توليد الطاقة" },
  { id: "power_plants_lab", prerequisites: [], corequisites: ["power_plants"], level: 4, position: { x: 75, y: 30 }, category: "mechanical", fallbackName: "Power Plants Lab", fallbackNameAr: "مختبر محطات توليد الطاقة" },
  { id: "renewable_energy_tech", prerequisites: ["auto_heat_transfer"], corequisites: [], level: 4, position: { x: 75, y: 35 }, category: "mechanical", fallbackName: "Renewable Energy Technology", fallbackNameAr: "الطاقة المتجددة وتكنولوجيا الطاقة" },
  { id: "hvac_tech", prerequisites: ["auto_heat_transfer"], corequisites: [], level: 4, position: { x: 75, y: 40 }, category: "mechanical", fallbackName: "HVAC Technology", fallbackNameAr: "تكنولوجيا تكييف الهواء" },
  { id: "plumbing_design", prerequisites: ["auto_heat_transfer"], corequisites: [], level: 4, position: { x: 75, y: 45 }, category: "mechanical", fallbackName: "Sanitary Plumbing Design", fallbackNameAr: "تصميم الأنظمة الصحية" },
  { id: "auto_vibrations", prerequisites: ["ce_dynamics", "eng_applied_math"], corequisites: [], level: 4, position: { x: 75, y: 50 }, category: "mechanical", fallbackName: "Mechanical Vibrations", fallbackNameAr: "اهتزازات ميكانيكية" },
  { id: "mech_fluids", prerequisites: ["c4"], corequisites: [], level: 2, position: { x: 45, y: 55 }, category: "mechanical", fallbackName: "Fluid Mechanics", fallbackNameAr: "ميكانيك الموائع" },
  { id: "auto_fluids_lab", prerequisites: [], corequisites: ["mech_fluids"], level: 2, position: { x: 45, y: 60 }, category: "mechanical", fallbackName: "Fluid Mechanics Lab", fallbackNameAr: "مختبر ميكانيكا الموائع" },
  { id: "hydraulic_machines", prerequisites: ["mech_fluids"], corequisites: [], level: 3, position: { x: 60, y: 55 }, category: "mechanical", fallbackName: "Hydraulic Machines", fallbackNameAr: "الآلات الهيدروليكية" },
  { id: "auto_measurements", prerequisites: ["PHYS102"], corequisites: [], level: 2, position: { x: 30, y: 70 }, category: "mechanical", fallbackName: "Engineering Measurements", fallbackNameAr: "القياسات الهندسية" },
  { id: "auto_measurements_lab", prerequisites: [], corequisites: ["auto_measurements"], level: 2, position: { x: 30, y: 75 }, category: "mechanical", fallbackName: "Measurements Lab", fallbackNameAr: "مختبر القياسات الهندسية" },
  { id: "auto_control", prerequisites: ["auto_measurements"], corequisites: [], level: 3, position: { x: 45, y: 70 }, category: "mechanical", fallbackName: "Automatic Control", fallbackNameAr: "التحكم الآلي" },
  { id: "auto_control_vib_lab", prerequisites: [], corequisites: ["auto_control"], level: 3, position: { x: 45, y: 75 }, category: "mechanical", fallbackName: "Control & Vibrations Lab", fallbackNameAr: "مختبر التحكم والاهتزازات" },
  { id: "auto_circuits", prerequisites: ["PHYS102"], corequisites: [], level: 2, position: { x: 30, y: 80 }, category: "mechanical", fallbackName: "Electric & Electronic Circuits", fallbackNameAr: "دوائر كهربائية وإلكترونية" },
  { id: "auto_circuits_lab", prerequisites: [], corequisites: ["auto_circuits"], level: 2, position: { x: 30, y: 85 }, category: "mechanical", fallbackName: "Circuits & Electronics Lab", fallbackNameAr: "مختبر دوائر كهربائية وإلكترونية" },
  { id: "auto_machines", prerequisites: ["auto_circuits"], corequisites: [], level: 3, position: { x: 45, y: 80 }, category: "mechanical", fallbackName: "Electric Machines", fallbackNameAr: "الآلات الكهربائية" },
  { id: "microcontroller_apps", prerequisites: ["auto_control"], corequisites: [], level: 4, position: { x: 60, y: 70 }, category: "mechanical", fallbackName: "Microcontroller Applications", fallbackNameAr: "تطبيقات المتحكمات" },
  { id: "auto_mech_drawing", prerequisites: ["engineering_drawing"], corequisites: [], level: 2, position: { x: 35, y: 90 }, category: "mechanical", fallbackName: "Mechanical Drawing", fallbackNameAr: "رسم ميكانيكي" },
  { id: "auto_machines_theory", prerequisites: ["ce_dynamics"], corequisites: [], level: 3, position: { x: 45, y: 90 }, category: "mechanical", fallbackName: "Theory of Machines", fallbackNameAr: "نظرية الآلات" },
  { id: "auto_machines_lab", prerequisites: [], corequisites: ["auto_machines_theory"], level: 3, position: { x: 45, y: 95 }, category: "mechanical", fallbackName: "Machines Lab", fallbackNameAr: "مختبر نظرية الآلات" },
  { id: "auto_mech_design1", prerequisites: ["auto_mech_drawing", "ce_strength"], corequisites: [], level: 3, position: { x: 45, y: 100 }, category: "mechanical", fallbackName: "Mechanical Design I", fallbackNameAr: "تصميم ميكانيكي 1" },
  { id: "mech_design2", prerequisites: ["auto_mech_design1"], corequisites: [], level: 4, position: { x: 60, y: 100 }, category: "mechanical", fallbackName: "Mechanical Design II", fallbackNameAr: "تصميم ميكانيكي 2" },
  { id: "mech_composites", prerequisites: ["mech_design2"], corequisites: [], level: 5, position: { x: 75, y: 100 }, category: "mechanical", fallbackName: "Composite Materials & Applications", fallbackNameAr: "المواد المركبة وتطبيقاتها" },
  { id: "mech_design_modeling", prerequisites: ["mech_composites"], corequisites: [], level: 6, position: { x: 90, y: 100 }, category: "mechanical", fallbackName: "Design & Modeling", fallbackNameAr: "التصميم والنمذجة" },
  { id: "agriculture_jordan", prerequisites: [], corequisites: [], level: 1, position: { x: 90, y: 90 }, category: "common", fallbackName: "Agriculture in Jordan", fallbackNameAr: "الزراعة في الأردن" },
  { id: "mech_project1", prerequisites: [], corequisites: [], level: 5, position: { x: 105, y: 80 }, category: "mechanical", fallbackName: "Graduation Project I", fallbackNameAr: "مشروع 1" },
  { id: "mech_project2", prerequisites: ["mech_project1"], corequisites: [], level: 6, position: { x: 120, y: 80 }, category: "mechanical", fallbackName: "Graduation Project II", fallbackNameAr: "مشروع 2" },
  { id: "mech_special_topics", prerequisites: [], corequisites: [], level: 4, position: { x: 90, y: 85 }, category: "mechanical", fallbackName: "Special Topics in Mechanical Engineering", fallbackNameAr: "مواضيع خاصة في الهندسة الميكانيكية" },

  // --- Electrical Engineering Track (الكهرباء) ---
  { id: "circuit1", prerequisites: ["p102"], corequisites: [], level: 2, position: { x: 45, y: 25 }, category: "electrical", fallbackName: "Electric Circuits 1", fallbackNameAr: "دوائر كهربائية 1" },
  { id: "circuit2", prerequisites: ["circuit1"], corequisites: ["e_circuits_lab"], level: 3, position: { x: 60, y: 25 }, category: "electrical", fallbackName: "Electric Circuits 2", fallbackNameAr: "دوائر كهربائية 2" },
  { id: "e_circuits_lab", prerequisites: [], corequisites: ["circuit2"], level: 3, position: { x: 60, y: 20 }, category: "electrical", fallbackName: "Electric Circuits Lab", fallbackNameAr: "مختبر دوائر كهربائية" },
  { id: "e_em1", prerequisites: ["p102"], corequisites: [], level: 3, position: { x: 60, y: 35 }, category: "electrical", fallbackName: "Electromagnetics 1", fallbackNameAr: "كهرومغناطيسية 1" },
  { id: "mecha_power_elec", prerequisites: ["electronics"], corequisites: ["mecha_power_elec_lab"], level: 4, position: { x: 75, y: 25 }, category: "mechatronics", fallbackName: "Power Electronics", fallbackNameAr: "إلكترونيات القدرة" },

  // --- Chemical Engineering Track (الكيميائية) ---
  { id: "CHE101", prerequisites: ["CHEM101"], corequisites: [], level: 1, position: { x: 30, y: 65 }, category: "chemical", fallbackName: "Principles of ChE", fallbackNameAr: "مبادئ الهندسة الكيميائية" },
  { id: "CHE201", prerequisites: ["CHE101"], corequisites: [], level: 2, position: { x: 45, y: 65 }, category: "chemical", fallbackName: "Chemical Thermodynamics", fallbackNameAr: "ديناميكا حرارية كيميائية" },
  { id: "CHE302", prerequisites: ["CHE201"], corequisites: [], level: 3, position: { x: 60, y: 65 }, category: "chemical", fallbackName: "Fluid Mechanics (Chem)", fallbackNameAr: "ميكانيكا الموائع للكيميائيين" },
  { id: "CHE401", prerequisites: ["CHE302"], corequisites: [], level: 4, position: { x: 75, y: 65 }, category: "chemical", fallbackName: "Reaction Engineering", fallbackNameAr: "هندسة التفاعلات" },
  { id: "CHE301", prerequisites: ["CHE401"], corequisites: [], level: 5, position: { x: 90, y: 65 }, category: "chemical", fallbackName: "Unit Operations", fallbackNameAr: "عمليات موحدة" },
  { id: "CHE501", prerequisites: ["CHE301"], corequisites: [], level: 6, position: { x: 105, y: 65 }, category: "chemical", fallbackName: "Plant Design", fallbackNameAr: "تصميم مصانع" },

  // --- Test Catalog Integration ---
  { id: "ce_struct1", prerequisites: ["ce_strength"], corequisites: [], level: 4, position: { x: 75, y: 5 }, category: "civil" },
  { id: "ce_soil", prerequisites: ["ce_geotech"], corequisites: [], level: 4, position: { x: 75, y: 15 }, category: "civil" },
  { id: "ce_soil_lab", prerequisites: [], corequisites: ["ce_soil"], level: 4, position: { x: 75, y: 20 }, category: "civil" },
  
  { id: "che_balance", prerequisites: ["m_principles_che"], corequisites: [], level: 4, position: { x: 75, y: 75 }, category: "chemical" },
  { id: "che_react1", prerequisites: ["che_balance"], corequisites: [], level: 5, position: { x: 90, y: 75 }, category: "chemical" },
  { id: "che_unit_lab", prerequisites: [], corequisites: ["che_react1"], level: 5, position: { x: 90, y: 80 }, category: "chemical" },

  { id: "ren_solar", prerequisites: ["p102"], corequisites: [], level: 5, position: { x: 105, y: 5 }, category: "mechanical" },
  { id: "ren_thermo2", prerequisites: ["c5"], corequisites: [], level: 4, position: { x: 90, y: 15 }, category: "mechanical" },
  { id: "ren_pv_lab", prerequisites: [], corequisites: ["ren_solar"], level: 5, position: { x: 105, y: 10 }, category: "mechanical" },

  { id: "ee_circuits1", prerequisites: ["p102"], corequisites: [], level: 4, position: { x: 75, y: 30 }, category: "electrical" },
  { id: "ee_signals", prerequisites: ["circuit1"], corequisites: [], level: 5, position: { x: 90, y: 30 }, category: "electrical" },
  { id: "ee_elec_lab1", prerequisites: [], corequisites: ["circuit1"], level: 4, position: { x: 75, y: 40 }, category: "electrical" },

  { id: "gen_econ", prerequisites: [], corequisites: [], level: 4, position: { x: 120, y: 20 }, category: "common" },
  { id: "gen_eng", prerequisites: ["english101"], corequisites: [], level: 4, position: { x: 120, y: 30 }, category: "common" },
  { id: "gen_nat", prerequisites: [], corequisites: [], level: 4, position: { x: 120, y: 40 }, category: "common" },
  // --- Autotronics Engineering Track (الأوتوترونكس) ---
  { id: "auto_aerodynamics", prerequisites: ["auto_materials_science"], corequisites: [], level: 5, position: { x: 75, y: 15 }, category: "mechatronics", fallbackName: "Vehicle Aerodynamics", fallbackNameAr: "الدينايمكا الهوائية للمركبة" },
  { id: "auto_lubricants_fuels", prerequisites: ["auto_materials_science"], corequisites: [], level: 4, position: { x: 60, y: 15 }, category: "mechatronics", fallbackName: "Automotive Lubricants & Fuels", fallbackNameAr: "مواد تشغيل السيارة" },
  { id: "auto_engineering", prerequisites: ["auto_mech_drawing"], corequisites: [], level: 3, position: { x: 45, y: 90 }, category: "mechatronics", fallbackName: "Automotive Engineering I", fallbackNameAr: "هندسة السيارات 1" },
  { id: "auto_eng_lab", prerequisites: [], corequisites: ["auto_engineering"], level: 3, position: { x: 45, y: 95 }, category: "mechatronics", fallbackName: "Automotive Engineering Lab", fallbackNameAr: "مختبر هندسة السيارات" },
  { id: "auto_engineering2", prerequisites: ["auto_engineering"], corequisites: [], level: 4, position: { x: 60, y: 90 }, category: "mechatronics", fallbackName: "Automotive Engineering II", fallbackNameAr: "هندسة السيارات 2" },
  { id: "auto_workshop_mgmt", prerequisites: ["auto_engineering2"], corequisites: [], level: 5, position: { x: 75, y: 90 }, category: "mechatronics", fallbackName: "Workshop Management & Planning", fallbackNameAr: "إدارة وتخطيط ورش صيانة السيارات" },
  { id: "auto_project1", prerequisites: [], corequisites: [], level: 5, position: { x: 105, y: 80 }, category: "mechatronics", fallbackName: "Graduation Project I", fallbackNameAr: "مشروع 1" },
  { id: "auto_project2", prerequisites: ["auto_project1"], corequisites: [], level: 6, position: { x: 120, y: 80 }, category: "mechatronics", fallbackName: "Graduation Project II", fallbackNameAr: "مشروع 2" },
  { id: "auto_advanced_ice", prerequisites: ["auto_ice"], corequisites: [], level: 4, position: { x: 75, y: 5 }, category: "mechatronics", fallbackName: "Advanced Internal Combustion Engines", fallbackNameAr: "محركات احتراق داخلي متقدمة" },
  { id: "auto_pollution_control", prerequisites: ["auto_ice"], corequisites: [], level: 4, position: { x: 75, y: 10 }, category: "mechatronics", fallbackName: "Automotive Emission Control Systems", fallbackNameAr: "أنظمة التحكم بالتلوث في السيارات" },
  { id: "auto_vehicle_design", prerequisites: ["auto_ice"], corequisites: [], level: 4, position: { x: 75, y: 15 }, category: "mechatronics", fallbackName: "Vehicle Theory & Design", fallbackNameAr: "نظرية وتصميم السيارة" },
  { id: "auto_hybrid_ev", prerequisites: ["auto_circuits"], corequisites: [], level: 3, position: { x: 45, y: 80 }, category: "mechatronics", fallbackName: "Hybrid & Electric Vehicles", fallbackNameAr: "السيارات الهجينة والكهربائية" },
  { id: "auto_hybrid_ev_lab", prerequisites: [], corequisites: ["auto_hybrid_ev"], level: 3, position: { x: 45, y: 85 }, category: "mechatronics", fallbackName: "Hybrid & EV Lab", fallbackNameAr: "مختبر السيارات الهجينة والكهربائية" },
  { id: "auto_fundamentals", prerequisites: ["auto_circuits"], corequisites: [], level: 3, position: { x: 45, y: 70 }, category: "mechatronics", fallbackName: "Autotronics Fundamentals", fallbackNameAr: "أساسيات الأوتوترونكس" },
  { id: "auto_fundamentals_lab", prerequisites: [], corequisites: ["auto_fundamentals"], level: 3, position: { x: 45, y: 75 }, category: "mechatronics", fallbackName: "Autotronics Fundamentals Lab", fallbackNameAr: "مختبر أساسيات الأوتوترونكس" },
  { id: "auto_electronics", prerequisites: ["auto_fundamentals", "auto_circuits"], corequisites: [], level: 4, position: { x: 60, y: 70 }, category: "mechatronics", fallbackName: "Automotive Electric & Electronics", fallbackNameAr: "كهرباء وإلكترونيات السيارات" },
  { id: "auto_electronics_lab", prerequisites: [], corequisites: ["auto_electronics"], level: 4, position: { x: 60, y: 75 }, category: "mechatronics", fallbackName: "Automotive Electronics Lab", fallbackNameAr: "مختبر كهرباء وإلكترونيات السيارات" },
  { id: "auto_diagnosis", prerequisites: ["auto_engineering"], corequisites: [], level: 4, position: { x: 60, y: 60 }, category: "mechatronics", fallbackName: "Vehicle Diagnosis, Maintenance & Repair", fallbackNameAr: "تشخيص صيانة وإصلاح السيارات" },
  { id: "auto_diagnosis_lab", prerequisites: [], corequisites: ["auto_diagnosis"], level: 4, position: { x: 60, y: 65 }, category: "mechatronics", fallbackName: "Diagnosis & Repair Lab", fallbackNameAr: "مختبر تشخيص صيانة وإصلاح السيارات" },
  { id: "auto_special_topics", prerequisites: [], corequisites: [], level: 4, position: { x: 90, y: 85 }, category: "mechatronics", fallbackName: "Special Topics in Autotronics Engineering", fallbackNameAr: "مواضيع خاصة في هندسة الأوتوترونكس" },
  { id: "auto_software_engineering", prerequisites: [], corequisites: [], level: 4, position: { x: 90, y: 90 }, category: "mechatronics", fallbackName: "Automotive Software Engineering", fallbackNameAr: "هندسة برمجيات السيارة" },
  { id: "auto_training", prerequisites: [], corequisites: [], level: 4, position: { x: 90, y: 95 }, category: "mechatronics", fallbackName: "Field Training", fallbackNameAr: "التدريب الميداني" },

  // --- Network Security Engineering Track (أمن الشبكات) ---
  { id: "ns_protocols_lab", prerequisites: [], corequisites: ["ns_protocols"], level: 5, position: { x: 90, y: 65 }, category: "computer", fallbackName: "Network Protocols Lab", fallbackNameAr: "مختبر بروتوكولات الشبكات" },
  
  { id: "ns_crypto", prerequisites: ["comp_cyber_security"], corequisites: ["ns_security_lab"], level: 5, position: { x: 90, y: 75 }, category: "computer", fallbackName: "Cryptography & Network Security", fallbackNameAr: "التشفير وأمن أنظمة الشبكات" },
  { id: "ns_security_lab", prerequisites: [], corequisites: ["ns_crypto"], level: 5, position: { x: 90, y: 80 }, category: "computer", fallbackName: "Network Security Lab", fallbackNameAr: "مختبر أمن أنظمة الشبكات" },
  
  { id: "ns_forensics", prerequisites: ["ns_crypto"], corequisites: ["ns_forensics_lab"], level: 5, position: { x: 90, y: 85 }, category: "computer", fallbackName: "Intrusion & Digital Forensics", fallbackNameAr: "أنظمة التحقيقات والأدلة الرقمية" },
  { id: "ns_forensics_lab", prerequisites: [], corequisites: ["ns_forensics"], level: 5, position: { x: 90, y: 90 }, category: "computer", fallbackName: "Intrusion & Digital Forensics Lab", fallbackNameAr: "مختبر الاقتحام والتحقيقات الرقمية" },
  
  { id: "ns_net_programming", prerequisites: ["comp_data_structures", "ns_networks"], corequisites: [], level: 5, position: { x: 90, y: 95 }, category: "computer", fallbackName: "Network & Internet Programming", fallbackNameAr: "برمجة الشبكات والإنترنت" },
  
  { id: "ns_wireless", prerequisites: ["ns_networks"], corequisites: ["ns_wireless_lab"], level: 5, position: { x: 90, y: 100 }, category: "computer", fallbackName: "Wireless Networks", fallbackNameAr: "الشبكات اللاسلكية" },
  { id: "ns_wireless_lab", prerequisites: [], corequisites: ["ns_wireless"], level: 5, position: { x: 90, y: 105 }, category: "computer", fallbackName: "Wireless Networks Lab", fallbackNameAr: "مختبر الشبكات اللاسلكية" },
  
  { id: "ns_ethical_hacking", prerequisites: ["comp_cyber_security"], corequisites: [], level: 5, position: { x: 90, y: 110 }, category: "computer", fallbackName: "Ethical Hacking", fallbackNameAr: "القرصنة الأخلاقية" },
  
  { id: "ns_project1", prerequisites: [], corequisites: [], level: 5, position: { x: 95, y: 115 }, category: "computer", fallbackName: "Graduation Project I", fallbackNameAr: "مشروع تخرج 1" },
  { id: "ns_project2", prerequisites: ["ns_project1"], corequisites: [], level: 6, position: { x: 105, y: 115 }, category: "computer", fallbackName: "Graduation Project II", fallbackNameAr: "مشروع التخرج 2" },
  { id: "ns_training", prerequisites: [], corequisites: [], level: 4, position: { x: 90, y: 120 }, category: "computer", fallbackName: "Field Training", fallbackNameAr: "التدريب الميداني" },
  
  { id: "ns_iot", prerequisites: ["ns_protocols"], corequisites: [], level: 5, position: { x: 95, y: 125 }, category: "computer", fallbackName: "Internet of Things", fallbackNameAr: "إنترنت الأشياء" },
  { id: "ns_wireless_security", prerequisites: ["ns_wireless"], corequisites: [], level: 5, position: { x: 95, y: 130 }, category: "computer", fallbackName: "Wireless Network Security", fallbackNameAr: "أمن الشبكات اللاسلكية" },
  { id: "ns_modeling_simulation", prerequisites: [], corequisites: [], level: 5, position: { x: 95, y: 135 }, category: "computer", fallbackName: "Modeling & Simulation", fallbackNameAr: "نمذجة ومحاكاة" },
  { id: "ns_special_topics", prerequisites: [], corequisites: [], level: 5, position: { x: 95, y: 140 }, category: "computer", fallbackName: "Special Topics in Network Security", fallbackNameAr: "موضوعات خاصة" },
  { id: "ns_sensor_networks", prerequisites: ["ns_wireless"], corequisites: [], level: 5, position: { x: 95, y: 145 }, category: "computer", fallbackName: "Wireless Sensor Networks", fallbackNameAr: "شبكات الاستشعار اللاسلكية" },
  { id: "ns_linux", prerequisites: [], corequisites: [], level: 5, position: { x: 95, y: 150 }, category: "computer", fallbackName: "Introduction to Linux", fallbackNameAr: "مقدمة إلى لينكس" },

  // --- Telecommunications Engineering Track (الاتصالات) ---
  { id: "tele_analog", prerequisites: ["e_signals", "circuit1"], corequisites: ["tele_analog_lab"], level: 4, position: { x: 75, y: 30 }, category: "electrical", fallbackName: "Analog Communications", fallbackNameAr: "اتصالات تشابهية" },
  { id: "tele_analog_lab", prerequisites: [], corequisites: ["tele_analog"], level: 4, position: { x: 75, y: 35 }, category: "electrical", fallbackName: "Analog Communications Lab", fallbackNameAr: "مختبر اتصالات تشابهية" },
  { id: "tele_digital", prerequisites: ["tele_analog"], corequisites: ["tele_digital_lab"], level: 4, position: { x: 75, y: 40 }, category: "electrical", fallbackName: "Digital Communications", fallbackNameAr: "اتصالات رقمية" },
  { id: "tele_digital_lab", prerequisites: [], corequisites: ["tele_digital"], level: 4, position: { x: 75, y: 45 }, category: "electrical", fallbackName: "Digital Communications Lab", fallbackNameAr: "مختبر اتصالات رقمية" },
  { id: "tele_dsp", prerequisites: ["e_signals"], corequisites: ["tele_dsp_lab"], level: 4, position: { x: 75, y: 50 }, category: "electrical", fallbackName: "Digital Signal Processing", fallbackNameAr: "معالجة الإشارة الرقمية" },
  { id: "tele_dsp_lab", prerequisites: [], corequisites: ["tele_dsp"], level: 4, position: { x: 75, y: 55 }, category: "electrical", fallbackName: "DSP Lab", fallbackNameAr: "مختبر معالجة الإشارة الرقمية" },
  { id: "tele_antennas", prerequisites: ["e_em2"], corequisites: ["tele_ant_mw_lab"], level: 4, position: { x: 75, y: 60 }, category: "electrical", fallbackName: "Antennas & Wave Propagation", fallbackNameAr: "هوائيات وانتشار الأمواج" },
  { id: "tele_ant_mw_lab", prerequisites: [], corequisites: ["tele_antennas"], level: 4, position: { x: 75, y: 65 }, category: "electrical", fallbackName: "Antennas & Microwaves Lab", fallbackNameAr: "مختبر هوائيات وأمواج دقيقة" },
  { id: "tele_microwaves", prerequisites: ["e_em2"], corequisites: ["tele_ant_mw_lab"], level: 4, position: { x: 75, y: 70 }, category: "electrical", fallbackName: "Microwave Communications", fallbackNameAr: "اتصالات الأمواج الدقيقة" },
  { id: "tele_optical", prerequisites: ["e_em2", "tele_analog"], corequisites: ["tele_optical_lab"], level: 4, position: { x: 75, y: 75 }, category: "electrical", fallbackName: "Optical Communications", fallbackNameAr: "اتصالات بصرية" },
  { id: "tele_optical_lab", prerequisites: [], corequisites: ["tele_optical"], level: 4, position: { x: 75, y: 80 }, category: "electrical", fallbackName: "Optical Communications Lab", fallbackNameAr: "مختبر الاتصالات البصرية" },
  { id: "tele_circuits", prerequisites: ["tele_analog", "e_electronics2"], corequisites: [], level: 5, position: { x: 90, y: 30 }, category: "electrical", fallbackName: "Communications Circuits", fallbackNameAr: "دوائر الاتصالات" },
  { id: "tele_mobile", prerequisites: ["tele_digital", "tele_antennas"], corequisites: ["tele_wireless_lab"], level: 5, position: { x: 90, y: 40 }, category: "electrical", fallbackName: "Mobile Wireless Communications", fallbackNameAr: "اتصالات لاسلكية متنقلة" },
  { id: "tele_wireless_lab", prerequisites: [], corequisites: ["tele_mobile"], level: 5, position: { x: 90, y: 45 }, category: "electrical", fallbackName: "Wireless Communications Lab", fallbackNameAr: "مختبر اتصالات لاسلكية" },
  { id: "tele_radar", prerequisites: ["tele_antennas"], corequisites: [], level: 5, position: { x: 90, y: 50 }, category: "electrical", fallbackName: "Radar Engineering", fallbackNameAr: "هندسة الرادار" },
  { id: "tele_ic", prerequisites: ["electronics"], corequisites: [], level: 5, position: { x: 90, y: 55 }, category: "electrical", fallbackName: "Integrated Circuits", fallbackNameAr: "الدوائر المتكاملة" },
  { id: "tele_crypto_info", prerequisites: ["tele_digital"], corequisites: [], level: 5, position: { x: 90, y: 60 }, category: "electrical", fallbackName: "Cryptography & Info Theory", fallbackNameAr: "تشفير ونظرية المعلومات" },
  { id: "tele_satellite", prerequisites: ["tele_antennas"], corequisites: [], level: 5, position: { x: 90, y: 65 }, category: "electrical", fallbackName: "Satellite Communications", fallbackNameAr: "اتصالات الأقمار الصناعية" },
  { id: "tele_wireless_systems", prerequisites: ["tele_mobile"], corequisites: [], level: 5, position: { x: 90, y: 70 }, category: "electrical", fallbackName: "Wireless Communication Systems", fallbackNameAr: "أنظمة الاتصالات اللاسلكية" },
  { id: "tele_simulation", prerequisites: ["tele_digital"], corequisites: [], level: 5, position: { x: 90, y: 75 }, category: "electrical", fallbackName: "Communication Systems Simulation", fallbackNameAr: "محاكاة أنظمة الاتصالات" },
  { id: "tele_special_topics", prerequisites: [], corequisites: [], level: 5, position: { x: 90, y: 80 }, category: "electrical", fallbackName: "Special Topics in Telecom", fallbackNameAr: "مواضيع خاصة" },

  // --- Legacy Aliases ---
  { id: "c1", prerequisites: ["PHYS101", "MATH101"], corequisites: [], level: 1, position: { x: 30, y: 25 }, category: "common", fallbackName: "Statics", fallbackNameAr: "الاستاتيكا" },
  { id: "e1", prerequisites: ["p102"], corequisites: [], level: 2, position: { x: 45, y: 25 }, category: "electrical", fallbackName: "Electric Circuits I", fallbackNameAr: "دوائر كهربائية 1" },
  { id: "e2", prerequisites: ["e1"], corequisites: ["e_circuits_lab"], level: 3, position: { x: 60, y: 25 }, category: "electrical", fallbackName: "Electric Circuits II", fallbackNameAr: "دوائر كهربائية 2" },
  { id: "e3", prerequisites: ["e1"], corequisites: ["e_electronics_lab"], level: 3, position: { x: 60, y: 30 }, category: "electrical", fallbackName: "Electronics I", fallbackNameAr: "الإلكترونيات 1" },

  // --- Thermal & Hydraulic Machines Engineering Track (الحرارية والهيدروليكية) ---
  { id: "therm_gas_dynamics", prerequisites: ["auto_heat_transfer"], corequisites: [], level: 4, position: { x: 75, y: 70 }, category: "mechanical", fallbackName: "Gas Dynamics", fallbackNameAr: "ديناميكا الغازات" },
  { id: "therm_refrigeration", prerequisites: ["auto_heat_transfer"], corequisites: [], level: 4, position: { x: 75, y: 75 }, category: "mechanical", fallbackName: "Refrigeration Systems", fallbackNameAr: "أنظمة التبريد" },
  { id: "therm_applied_heat", prerequisites: ["auto_heat_transfer"], corequisites: [], level: 4, position: { x: 75, y: 80 }, category: "mechanical", fallbackName: "Applied Heat Transfer", fallbackNameAr: "انتقال حرارة تطبيقية" },
  { id: "therm_fluid_systems", prerequisites: ["auto_heat_transfer"], corequisites: [], level: 5, position: { x: 90, y: 80 }, category: "mechanical", fallbackName: "Fluid Systems Design", fallbackNameAr: "تصميم أنظمة الموائع" },
  { id: "therm_boilers", prerequisites: ["power_plants"], corequisites: [], level: 5, position: { x: 90, y: 25 }, category: "mechanical", fallbackName: "Boilers & Steam Generation", fallbackNameAr: "المراجل وتوليد البخار" },
  { id: "therm_piping", prerequisites: ["hydraulic_machines"], corequisites: [], level: 4, position: { x: 75, y: 55 }, category: "mechanical", fallbackName: "Piping Systems Design", fallbackNameAr: "تصميم أنظمة الأنابيب" },
  { id: "therm_pneumatic", prerequisites: ["hydraulic_machines"], corequisites: [], level: 4, position: { x: 75, y: 60 }, category: "mechanical", fallbackName: "Pneumatic Power Systems", fallbackNameAr: "أنظمة القدرة الهوائية" },
  { id: "therm_special_hydraulic", prerequisites: ["diff_eq"], corequisites: [], level: 5, position: { x: 90, y: 15 }, category: "mechanical", fallbackName: "Special Topics in Hydraulic Machines", fallbackNameAr: "مواضيع خاصة في الآلات الهيدروليكية" },
  { id: "therm_special_gas", prerequisites: ["therm_gas_dynamics"], corequisites: [], level: 5, position: { x: 90, y: 70 }, category: "mechanical", fallbackName: "Special Topics in Gas Dynamics", fallbackNameAr: "مواضيع خاصة ديناميكا الغازات" },

  // --- Chemical Industries Engineering Track (هندسة الصناعات الكيميائية) ---
  { id: "m_principles_che", prerequisites: [], corequisites: [], level: 1, position: { x: 15, y: 120 }, category: "chemical", fallbackName: "Principles of Chemical Engineering", fallbackNameAr: "مبادئ الهندسة الكيميائية" },
  { id: "chem_organic", prerequisites: ["chem101"], corequisites: [], level: 2, position: { x: 30, y: 110 }, category: "chemical", fallbackName: "Organic Chemistry", fallbackNameAr: "كيمياء عضوية" },
  { id: "chem_phys_thermo", prerequisites: ["chem_organic"], corequisites: [], level: 2, position: { x: 45, y: 110 }, category: "chemical", fallbackName: "Thermal Physical Chemistry", fallbackNameAr: "الكيمياء الفيزيائية الحرارية" },
  { id: "chem_polymers", prerequisites: ["chem_organic"], corequisites: [], level: 3, position: { x: 60, y: 115 }, category: "chemical", fallbackName: "Polymer Technology", fallbackNameAr: "تكنولوجيا المبلمرات" },
  { id: "m_balances", prerequisites: ["m_principles_che"], corequisites: [], level: 2, position: { x: 30, y: 120 }, category: "chemical", fallbackName: "Material and Energy Balances", fallbackNameAr: "موازنات المادة والطاقة" },
  { id: "m_reaction_eng1", prerequisites: ["m_balances"], corequisites: [], level: 3, position: { x: 45, y: 120 }, category: "chemical", fallbackName: "Chemical Reaction Engineering (1)", fallbackNameAr: "هندسة تفاعلات كيميائية 1" },
  { id: "m_reaction_eng2", prerequisites: ["m_reaction_eng1"], corequisites: [], level: 3, position: { x: 60, y: 120 }, category: "chemical", fallbackName: "Chemical Reaction Engineering (2)", fallbackNameAr: "هندسة تفاعلات كيميائية 2" },
  { id: "m_fluids_che", prerequisites: ["diff_eq"], corequisites: [], level: 2, position: { x: 45, y: 130 }, category: "chemical", fallbackName: "Fluid Mechanics for Chemical Eng", fallbackNameAr: "ميكانيكا الموائع للهندسة الكيميائية" },
  { id: "m_heat_transfer", prerequisites: ["m_fluids_che", "numerical"], corequisites: [], level: 3, position: { x: 60, y: 130 }, category: "chemical", fallbackName: "Heat Transfer Operations", fallbackNameAr: "عمليات انتقال الحرارة" },
  { id: "m_thermo_che", prerequisites: ["chem_phys_thermo"], corequisites: [], level: 3, position: { x: 60, y: 110 }, category: "chemical", fallbackName: "Chemical Engineering Thermodynamics", fallbackNameAr: "ديناميكا حرارية للهندسة الكيميائية" },
  { id: "m_mass_transfer", prerequisites: ["m_thermo_che"], corequisites: [], level: 3, position: { x: 75, y: 110 }, category: "chemical", fallbackName: "Mass Transfer", fallbackNameAr: "انتقال المادة" },
  { id: "m_unit_ops", prerequisites: ["m_heat_transfer", "m_mass_transfer"], corequisites: [], level: 4, position: { x: 75, y: 130 }, category: "chemical", fallbackName: "Unit Operations", fallbackNameAr: "عمليات موحدة" },
  { id: "m_separation", prerequisites: ["m_mass_transfer"], corequisites: [], level: 4, position: { x: 75, y: 140 }, category: "chemical", fallbackName: "Separation Processes", fallbackNameAr: "عمليات الفصل" },
  { id: "m_modeling", prerequisites: ["m_reaction_eng2"], corequisites: [], level: 4, position: { x: 75, y: 120 }, category: "chemical", fallbackName: "Modeling and Simulation", fallbackNameAr: "النمذجة والمحاكاة" },
  { id: "chem_catalysis", prerequisites: ["m_reaction_eng2"], corequisites: [], level: 4, position: { x: 75, y: 125 }, category: "chemical", fallbackName: "Catalysis Engineering", fallbackNameAr: "هندسة المحفزات" },
  { id: "m_bioprocess", prerequisites: ["m_reaction_eng2"], corequisites: [], level: 4, position: { x: 75, y: 115 }, category: "chemical", fallbackName: "Bioprocess Engineering", fallbackNameAr: "هندسة العمليات الحيوية" },
  { id: "m_equip_design", prerequisites: ["m_reaction_eng2"], corequisites: [], level: 5, position: { x: 90, y: 120 }, category: "chemical", fallbackName: "Process Equipment Design", fallbackNameAr: "تصميم المعدات" },
  { id: "chem_pharmaceutical", prerequisites: ["m_bioprocess"], corequisites: [], level: 5, position: { x: 90, y: 115 }, category: "chemical", fallbackName: "Pharmaceutical Industries", fallbackNameAr: "الصناعات الصيدلانية" },
  { id: "chem_membrane_sep", prerequisites: ["m_mass_transfer"], corequisites: [], level: 5, position: { x: 90, y: 110 }, category: "chemical", fallbackName: "Membrane Separation Processes", fallbackNameAr: "عمليات الفصل بالأغشية المنفذة" },
  { id: "chem_electrochemical", prerequisites: ["m_mass_transfer"], corequisites: [], level: 4, position: { x: 75, y: 105 }, category: "chemical", fallbackName: "Electrochemical Engineering", fallbackNameAr: "الهندسة الكهروكيميائية" },
  { id: "m_corrosion", prerequisites: [], corequisites: [], level: 4, position: { x: 75, y: 145 }, category: "chemical", fallbackName: "Materials and Corrosion", fallbackNameAr: "هندسة المواد والتآكل" },
  { id: "chem_nano", prerequisites: ["m_separation", "m_corrosion"], corequisites: [], level: 5, position: { x: 90, y: 140 }, category: "chemical", fallbackName: "Nanotechnology in Chem Eng", fallbackNameAr: "التكنولوجيا النانوية" },
  { id: "m_wastewater", prerequisites: ["m_separation", "m_corrosion"], corequisites: [], level: 5, position: { x: 90, y: 145 }, category: "chemical", fallbackName: "Water and Wastewater Treatment", fallbackNameAr: "معالجة المياه" },
  { id: "m_petroleum", prerequisites: ["m_separation"], corequisites: [], level: 4, position: { x: 75, y: 150 }, category: "chemical", fallbackName: "Petroleum Refining", fallbackNameAr: "تكرير البترول" },
  { id: "chem_mineral_proc", prerequisites: ["m_separation"], corequisites: [], level: 5, position: { x: 90, y: 155 }, category: "chemical", fallbackName: "Mineral Processing", fallbackNameAr: "معالجة الخامات المعدنية" },
  { id: "chem_petrochemicals", prerequisites: ["m_petroleum"], corequisites: [], level: 5, position: { x: 90, y: 150 }, category: "chemical", fallbackName: "Petrochemical Technology", fallbackNameAr: "تكنولوجيا البتروكيماويات" },
  { id: "chem_food", prerequisites: ["m_unit_ops"], corequisites: [], level: 5, position: { x: 90, y: 130 }, category: "chemical", fallbackName: "Food Engineering", fallbackNameAr: "الهندسة الغذائية" },
  { id: "chem_oil_shale", prerequisites: ["m_unit_ops"], corequisites: [], level: 5, position: { x: 90, y: 135 }, category: "chemical", fallbackName: "Oil Shale Technology", fallbackNameAr: "تكنولوجيا الصخر الزيتي" },
  { id: "m_process_control", prerequisites: ["m_modeling"], corequisites: [], level: 5, position: { x: 90, y: 100 }, category: "chemical", fallbackName: "Process Dynamics and Control", fallbackNameAr: "ديناميكا العمليات والتحكم" },
  { id: "m_plant_design", prerequisites: ["m_equip_design", "ee201"], corequisites: [], level: 5, position: { x: 90, y: 125 }, category: "chemical", fallbackName: "Plant Design", fallbackNameAr: "تصميم المصانع" },
]

export const activeRoadmap = roadmapNodes;


