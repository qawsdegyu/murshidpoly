export interface MajorInfo {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  longDescription: string;
  longDescriptionAr: string;
  imageUrl: string;
  icon: string;
  color: string;
  accentColor: string;
  studyPlanUrl: string | null;
  // New fields
  hourPriceCompetitive: number;
  hourPriceParallel: number;
  expectedSalary: string;
  expectedSalaryAr: string;
  careerFieldsAr: string[];
  totalHours?: number;
  committeeNameAr?: string;
}

export const majorsData: MajorInfo[] = [
  {
    id: "network-security",
    name: "Network Security Engineering",
    nameAr: "هندسة أمن الشبكات والسيبراني",
    description: "Protecting systems, data, and networks from cyber threats.",
    descriptionAr: "التركيز على حماية الأنظمة والبيانات والشبكات من الاختراقات والتهديدات السيبرانية.",
    longDescription: "Network security is one of the fastest-growing specializations in the global labor market. Students learn how to design and secure digital infrastructure, discover vulnerabilities, and build advanced protection systems. The program covers cryptography, ethical hacking, digital forensics, incident management, and Security Operations Centers (SOC). The program produces engineers capable of protecting organizations from increasing cyber threats.",
    longDescriptionAr: "يُعدّ تخصص أمن الشبكات من أسرع التخصصات نمواً في سوق العمل العالمي. يتعلم الطالب كيفية تصميم وتأمين البنى التحتية الرقمية، واكتشاف الثغرات الأمنية، وبناء أنظمة الحماية المتقدمة. يغطي البرنامج التشفير، الاختراق الأخلاقي (Ethical Hacking)، الجنائيات الرقمية، إدارة الحوادث الأمنية، ومراكز العمليات الأمنية (SOC). يُخرّج البرنامج مهندسين قادرين على حماية المؤسسات من التهديدات السيبرانية المتزايدة.",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    icon: "Shield",
    color: "from-cyan-700 to-blue-700",
    accentColor: "#06b6d4",
    studyPlanUrl: "https://drive.google.com/uc?export=download&id=1AsQlQK3v2O0mvHJlf54DwldxY9llSVzi",
    hourPriceCompetitive: 30,
    hourPriceParallel: 60,
    expectedSalary: "600 – 1,500 JOD (Jordan) | 3,500 – 10,000 USD (Gulf)",
    expectedSalaryAr: "600 – 1,500 دينار (الأردن) | 3,500 – 10,000 دولار (الخليج)",
    careerFieldsAr: ["محلل أمن سيبراني", "مختبر اختراق (Pen Tester)", "مهندس SOC", "مستشار أمن المعلومات", "شركات Telecom والبنوك"],
  },
  {
    id: "mechanical",
    name: "General Mechanical Engineering",
    nameAr: "هندسة الميكانيك العام",
    description: "Study of thermal and mechanical systems, design, and manufacturing.",
    descriptionAr: "دراسة الأنظمة الحرارية والميكانيكية والتصميم والإنتاج.",
    longDescription: "General Mechanical Engineering is the most comprehensive field in engineering, covering everything that moves in our environment. Students study fluid mechanics, thermodynamics, machine design, and manufacturing systems. The program focuses on Computer-Aided Design (CAD/CAM), Heating, Ventilation, and Air Conditioning (HVAC) systems, and maintenance of electric and hybrid vehicles. This specialization prepares graduates to lead infrastructure and energy projects.",
    longDescriptionAr: "هندسة الميكانيك العام هي التخصص الأشمل في عالم الهندسة، إذ تغطي كل ما يتحرك في محيطنا. يدرس الطالب ميكانيكا الموائع، الديناميكا الحرارية، تصميم الآلات، وأنظمة التصنيع. يُركّز البرنامج على التصميم بمساعدة الحاسوب (CAD/CAM)، أنظمة التكييف والتبريد (HVAC)، وصيانة المركبات الكهربائية والهجينة. يُعدّ خريج هذا التخصص لقيادة مشاريع البنية التحتية والطاقة.",
    imageUrl: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=1200",
    icon: "Cog",
    color: "from-stone-700 to-zinc-600",
    accentColor: "#78716c",
    studyPlanUrl: "https://drive.google.com/uc?export=download&id=1IhYchLAQOo-ctFjUawCLW8u6nS4zKsvX",
    hourPriceCompetitive: 30,
    hourPriceParallel: 60,
    expectedSalary: "500 – 1,300 JOD (Jordan) | 2,200 – 7,000 USD (Gulf)",
    expectedSalaryAr: "500 – 1,300 دينار (الأردن) | 2,200 – 7,000 دولار (الخليج)",
    careerFieldsAr: ["مهندس إنتاج وتصنيع", "مهندس تكييف وتبريد (HVAC)", "مهندس طاقة متجددة", "صيانة الطائرات", "شركات السيارات الكهربائية"],
  },
  {
    id: "autotronics",
    name: "Electric & Hybrid Vehicle Service Technology",
    nameAr: "تكنولوجيا خدمة المركبات الكهربائية والهجينة",
    description: "Technical preparation for the service, diagnosis, and maintenance of modern electric and hybrid vehicles.",
    descriptionAr: "إعداد تقنيين لخدمة وتشخيص وصيانة المركبات الكهربائية والهجينة الحديثة.",
    longDescription: "This specialization focuses on modern vehicle engineering, vehicle electrical systems, and automotive technology. The program prepares qualified technicians to diagnose, service, and maintain electric and hybrid vehicles in response to the growing needs of the local automotive market.",
    longDescriptionAr: "يهتم التخصص بهندسة السيارات الحديثة وكهربائها والجانب التكنولوجي لها، ويهدف البرنامج إلى إعداد تقنيين في خدمة المركبات الكهربائية والهجينة وتشخيصها وصيانتها وفق احتياجات سوق العمل.",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1200",
    icon: "Car",
    color: "from-blue-700 to-cyan-600",
    accentColor: "#3b82f6",
    studyPlanUrl: "https://drive.google.com/uc?export=download&id=1HJAUfv_h-PO90q_TCRop8zv3tvJybEFQ",
    hourPriceCompetitive: 45,
    hourPriceParallel: 60,
    totalHours: 132,
    committeeNameAr: "لجنة ميكانيك",
    expectedSalary: "450 – 1,100 JOD (Jordan) | 2,000 – 6,000 USD (Gulf)",
    expectedSalaryAr: "450 – 1,100 دينار (الأردن) | 2,000 – 6,000 دولار (الخليج)",
    careerFieldsAr: ["وكالات المركبات ومؤسسات صيانة المركبات الكهربائية", "تصميم وتصنيع قطع السيارات الكهربائية", "تشخيص وصيانة المركبات الكهربائية"],
  },
  {
    id: "civil",
    name: "Roads & Bridges Engineering",
    nameAr: "هندسة الطرق والجسور",
    description: "Design, construction, and maintenance of roads, bridges, and transport systems.",
    descriptionAr: "تصميم وتنفيذ وصيانة البنية التحتية من طرق وجسور وأنظمة نقل.",
    longDescription: "Roads and Bridges Engineering is the backbone of any modern city. Students study the design of structural bridges, highway networks, urban transport planning, and traffic engineering. The program focuses on Building Information Modeling (BIM), geotechnical engineering (soil and foundations), and large infrastructure project management. Graduates of this specialization work on major reconstruction projects in Jordan and the Gulf.",
    longDescriptionAr: "هندسة الطرق والجسور هي العمود الفقري لأي مدينة حديثة. يدرس الطالب تصميم الجسور الإنشائية، شبكات الطرق السريعة، تخطيط النقل الحضري، وهندسة المرور. يُركّز البرنامج على نمذجة المباني والمعلومات (BIM)، الهندسة الجيوتقنية (التربة والأساسات)، وإدارة مشاريع البنية التحتية الضخمة. يعمل خريجو هذا التخصص في مشاريع الإعمار الكبرى في الأردن والخليج.",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200",
    icon: "Building2",
    color: "from-emerald-700 to-teal-600",
    accentColor: "#10b981",
    studyPlanUrl: "https://drive.google.com/uc?export=download&id=1EqRyk0m6DX9fk4OuaiDzOSp4i1GYg-Fb",
    hourPriceCompetitive: 30,
    hourPriceParallel: 60,
    expectedSalary: "450 – 1,000 JOD (Jordan) | 1,800 – 6,000 USD (Gulf)",
    expectedSalaryAr: "450 – 1,000 دينار (الأردن) | 1,800 – 6,000 دولار (الخليج)",
    careerFieldsAr: ["مدير موقع إنشائي", "مهندس تصميم إنشائي", "مساح طرق وكميات", "استشاري إدارة مشاريع PMP", "شركات المقاولات الكبرى"],
  },
  {
    id: "mechatronics",
    name: "Mechatronics Engineering",
    nameAr: "هندسة الميكاترونكس",
    description: "Combining mechanics, electronics, and smart control systems.",
    descriptionAr: "تخصص يجمع بين الميكانيك والإلكترونيات وأنظمة التحكم الذكية.",
    longDescription: "Mechatronics is the specialization of the Fourth Industrial Revolution (Industry 4.0). This field integrates mechanical and electrical engineering and computer science to design robots, smart factories, and autonomous vehicles. Students learn Programmable Logic Controller (PLC) programming, automatic control system design, and the development of integrated mechatronic systems. Demand for this specialization is constantly rising with the global expansion of industrial automation.",
    longDescriptionAr: "الميكاترونكس هو تخصص الثورة الصناعية الرابعة (Industry 4.0). يدمج هذا التخصص الهندسة الميكانيكية والكهربائية وعلوم الحاسوب لتصميم الروبوتات، المصانع الذكية، والسيارات ذاتية القيادة. يتعلم الطالب برمجة المتحكمات المنطقية (PLC)، تصميم أنظمة التحكم التلقائي، وتطوير الأنظمة الميكاترونية المتكاملة. الطلب على هذا التخصص في تصاعد مستمر مع توسع الأتمتة الصناعية عالمياً.",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200",
    icon: "Cpu",
    color: "from-indigo-600 to-blue-500",
    accentColor: "#6366f1",
    studyPlanUrl: "https://drive.google.com/uc?export=download&id=1Q822mseZERcWjQPcJ6OfeieJxYS3fmbb",
    hourPriceCompetitive: 30,
    hourPriceParallel: 60,
    expectedSalary: "500 – 1,200 JOD (Jordan) | 2,500 – 7,500 USD (Gulf)",
    expectedSalaryAr: "500 – 1,200 دينار (الأردن) | 2,500 – 7,500 دولار (الخليج)",
    careerFieldsAr: ["مهندس أتمتة وروبوتات", "مصمم أنظمة تحكم صناعية", "مهندس مصانع ذكية", "صيانة الأجهزة الطبية المتقدمة", "شركات التصنيع والبترول"],
  },
  {
    id: "computer",
    name: "Computer Engineering",
    nameAr: "هندسة الحاسوب",
    description: "Design and development of integrated computer systems and software.",
    descriptionAr: "تصميم وتطوير أنظمة الحاسوب والبرمجيات المتكاملة.",
    longDescription: "Computer Engineering combines hardware and software in an integrated specialization. Students study the design of processors and digital circuits, operating systems, embedded systems, and network engineering. With comprehensive digital transformation, the computer engineer becomes the mastermind behind all technical infrastructure for companies and governments, whether in cloud computing or the Internet of Things (IoT).",
    longDescriptionAr: "هندسة الحاسوب تجمع بين العتاد (Hardware) والبرمجيات (Software) في تخصص متكامل. يدرس الطالب تصميم المعالجات والدوائر الرقمية، أنظمة التشغيل، الأنظمة المدمجة (Embedded Systems)، وهندسة الشبكات. مع التحول الرقمي الشامل، يُصبح مهندس الحاسوب العقل المدبّر خلف كل البنية التقنية للشركات والحكومات، سواء في الحوسبة السحابية أو إنترنت الأشياء.",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
    icon: "Monitor",
    color: "from-violet-700 to-purple-600",
    accentColor: "#7c3aed",
    studyPlanUrl: "https://drive.google.com/uc?export=download&id=1TWhF4v_AhRAzE1zv9cnMFg7ZhcMYWEFB",
    hourPriceCompetitive: 30,
    hourPriceParallel: 60,
    expectedSalary: "600 – 1,400 JOD (Jordan) | 3,000 – 8,500 USD (Gulf)",
    expectedSalaryAr: "600 – 1,400 دينار (الأردن) | 3,000 – 8,500 دولار (الخليج)",
    careerFieldsAr: ["مطور أنظمة مدمجة", "مهندس سحابة Cloud", "مصمم شرائح VLSI", "مهندس IoT", "شركات التقنية والاتصالات"],
  },
  {
    id: "chemical",
    name: "Chemical Industries Engineering",
    nameAr: "هندسة الصناعات الكيميائية",
    description: "Transforming raw materials into useful products through chemical processes.",
    descriptionAr: "تحويل المواد الخام إلى منتجات مفيدة من خلال العمليات الكيميائية.",
    longDescription: "Chemical Industries Engineering transforms raw materials into high-value products through precise chemical and physical processes. Students study transport processes (heat and mass transfer), chemical reactor design, process engineering, and quality control. Graduates of this specialization work in oil refineries, pharmaceutical industries, food industries, and water treatment. The program recently focuses on green engineering and clean energy.",
    longDescriptionAr: "هندسة الصناعات الكيميائية تُحوّل المواد الخام إلى منتجات ذات قيمة عالية عبر عمليات كيميائية وفيزيائية دقيقة. يدرس الطالب عمليات الانتقال (نقل الحرارة والمادة)، تصميم المفاعلات الكيميائية، هندسة العمليات، والتحكم في الجودة. يعمل خريجو هذا التخصص في مصافي النفط، الصناعات الدوائية، صناعات الأغذية، ومعالجة المياه. يُركّز البرنامج حديثاً على الهندسة الخضراء والطاقة النظيفة.",
    imageUrl: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=1200",
    icon: "FlaskConical",
    color: "from-rose-700 to-orange-600",
    accentColor: "#f43f5e",
    studyPlanUrl: "https://drive.google.com/uc?export=download&id=1levcmp9TvhT8UC4pSOr1Cj4JRT1MKRVb",
    hourPriceCompetitive: 30,
    hourPriceParallel: 60,
    expectedSalary: "450 – 1,100 JOD (Jordan) | 2,000 – 6,500 USD (Gulf)",
    expectedSalaryAr: "450 – 1,100 دينار (الأردن) | 2,000 – 6,500 دولار (الخليج)",
    careerFieldsAr: ["مهندس عمليات في مصافي النفط", "مهندس جودة في مصانع الأدوية", "مهندس معالجة مياه", "مهندس صناعات غذائية", "شركات البتروكيماويات"],
  },
  {
    id: "thermal",
    name: "Hydraulic Systems Technology in Heavy Machinery",
    nameAr: "تكنولوجيا الأنظمة الهيدروليكية في الآلات الثقيلة",
    description: "Technical preparation for servicing diesel engines and hydraulic systems in heavy machinery.",
    descriptionAr: "إعداد تقنيين لخدمة وصيانة محركات الديزل والأنظمة الهيدروليكية في الآليات الثقيلة.",
    longDescription: "The program prepares technicians to service and maintain diesel engines and hydraulic systems in heavy machinery according to local labor-market needs. It combines practical maintenance, fluid-power systems, heavy equipment diagnostics, and renewable-energy applications.",
    longDescriptionAr: "يهدف البرنامج إلى إعداد تقنيين في مجال خدمة وصيانة محركات الديزل والأنظمة الهيدروليكية في الآليات الثقيلة وفق متطلبات واحتياجات سوق العمل المحلي، مع التركيز على التشخيص والصيانة العملية وتكنولوجيا القدرة الهيدروليكية.",
    imageUrl: "https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&q=80&w=1200",
    icon: "Flame",
    color: "from-orange-700 to-red-600",
    accentColor: "#f97316",
    studyPlanUrl: "https://drive.google.com/uc?export=download&id=1pLsbPPffaT6KmmVXrpraLwHO8NI1KhYR",
    hourPriceCompetitive: 45,
    hourPriceParallel: 60,
    totalHours: 132,
    committeeNameAr: "لجنة ميكانيك",
    expectedSalary: "500 – 1,200 JOD (Jordan) | 2,500 – 7,000 USD (Gulf)",
    expectedSalaryAr: "500 – 1,200 دينار (الأردن) | 2,500 – 7,000 دولار (الخليج)",
    careerFieldsAr: ["الوكالات والورش المتخصصة باستخدام آليات الإنشاء والشاحنات", "مجال الأنظمة الهيدروليكية في الآليات الثقيلة", "مجال الطاقة المتجددة ومحطات توليد الطاقة"],
  },
  {
    id: "telecom",
    name: "Telecommunications Engineering",
    nameAr: "هندسة الاتصالات",
    description: "Designing wireless and wired data transmission systems and global networks.",
    descriptionAr: "تصميم أنظمة نقل البيانات اللاسلكية والسلكية والشبكات العالمية.",
    longDescription: "Telecommunications Engineering is the digital fabric that connects the world. Students study digital signal processing, antenna design, wireless communication protocols (4G/5G), fiber optics, and satellite systems. With the massive expansion of 5G networks and the Internet of Things (IoT), the telecommunications engineer becomes at the forefront of the most in-demand professions in the digital world.",
    longDescriptionAr: "هندسة الاتصالات هي النسيج الرقمي الذي يربط العالم. يدرس الطالب معالجة الإشارات الرقمية، تصميم الهوائيات، بروتوكولات الاتصالات اللاسلكية (4G/5G)، الألياف الضوئية، وأنظمة الأقمار الصناعية. مع التوسع الهائل في شبكات الجيل الخامس وإنترنت الأشياء، يُصبح مهندس الاتصالات في طليعة المهن الأكثر طلباً في العالم الرقمي.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    icon: "Radio",
    color: "from-sky-700 to-blue-600",
    accentColor: "#0ea5e9",
    studyPlanUrl: "https://drive.google.com/uc?export=download&id=1xuscuCeQXnRvlKl6hXrz8N_fNFH2do4l",
    hourPriceCompetitive: 30,
    hourPriceParallel: 60,
    expectedSalary: "550 – 1,300 JOD (Jordan) | 2,800 – 8,000 USD (Gulf)",
    expectedSalaryAr: "550 – 1,300 دينار (الأردن) | 2,800 – 8,000 دولار (الخليج)",
    careerFieldsAr: ["مهندس شبكات 5G", "متخصص اتصالات فضائية", "مهندس تردد راديوي RF", "مهندس ألياف ضوئية", "شركات الاتصالات الكبرى (Zain, Orange, Umniah)"],
  },
  {
    id: "electrical",
    name: "Electrical Power Technology",
    nameAr: "تكنولوجيا الطاقة الكهربائية",
    description: "Technical preparation for power generation, transmission, distribution, maintenance, and measurement.",
    descriptionAr: "إعداد تقنيين في توليد ونقل وتوزيع وصيانة وقياس الطاقة الكهربائية.",
    longDescription: "The program prepares technicians in the field of electrical-power technology. Students learn to maintain generation stations and electrical networks, install and operate electrical systems, service motors and converters, perform measurements, and monitor equipment performance. The curriculum also supports work in renewable-energy and power-distribution environments.",
    longDescriptionAr: "يهدف البرنامج إلى إعداد فنيين في مجال تكنولوجيا الطاقة الكهربائية، بما يشمل صيانة محطات التوليد وشبكات النقل والتوزيع، وصيانة المحركات والمحولات، وتنفيذ عمليات القياس المختلفة ومراقبة أداء المعدات، مع تأهيل للعمل في مجالات الطاقة المتجددة.",
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200",
    icon: "Zap",
    color: "from-amber-600 to-yellow-500",
    accentColor: "#f59e0b",
    studyPlanUrl: "https://lagnetalsanafer.com/majors/electric-power-technology/",
    hourPriceCompetitive: 55,
    hourPriceParallel: 70,
    totalHours: 132,
    committeeNameAr: "Zero One Team — حاسوب وشبكات",
    expectedSalary: "450 – 1,200 JOD (Jordan) | 2,200 – 7,500 USD (Gulf)",
    expectedSalaryAr: "450 – 1,200 دينار (الأردن) | 2,200 – 7,500 دولار (الخليج)",
    careerFieldsAr: ["صيانة محطات التوليد وشبكات النقل والتوزيع", "صيانة المحركات والمحولات الكهربائية", "عمليات القياس ومراقبة أداء المعدات"],
  },
  {
    id: "industrial",
    name: "Facilities Evaluation & Maintenance Technology",
    nameAr: "تكنولوجيا تقييم المنشآت وصيانتها",
    description: "Technical preparation for evaluating, maintaining, and protecting buildings and facilities.",
    descriptionAr: "إعداد تقنيين لتقييم المنشآت والمباني وصيانتها وحمايتها.",
    longDescription: "The specialization focuses on evaluating the condition and safety of existing buildings and facilities, diagnosing defects, and planning modern maintenance solutions. Students develop practical skills in non-destructive testing, structural evaluation, building services, quantities, contracts, and real-estate assessment.",
    longDescriptionAr: "يهتم التخصص بتقييم حالة المباني والمنشآت القائمة وسلامتها، وتشخيص العيوب والمشاكل الإنشائية، وتقديم حلول مبتكرة للصيانة والترميم، مع تطبيق الفحوصات اللازمة، وتقييم العقارات، وحساب الكميات والعقود.",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
    icon: "BarChart3",
    color: "from-emerald-600 to-green-500",
    accentColor: "#10b981",
    studyPlanUrl: "https://lagnetalsanafer.com/majors/evaluation-of-facilities/",
    hourPriceCompetitive: 60,
    hourPriceParallel: 70,
    totalHours: 132,
    committeeNameAr: "CIVIL Team",
    expectedSalary: "450 – 1,100 JOD (Jordan) | 2,200 – 6,500 USD (Gulf)",
    expectedSalaryAr: "450 – 1,100 دينار (الأردن) | 2,200 – 6,500 دولار (الخليج)",
    careerFieldsAr: ["متابعة ومراقبة الإنجازات الفعلية في صيانة وتأهيل المنشآت", "تنفيذ الاختبارات اللازمة في صيانة وتقييم المنشآت", "تنفيذ أعمال الصيانة وحماية المنشآت", "تقييم العقارات وحساب الكميات وفق الأسس العلمية"],
  },
  {
    id: "architecture",
    name: "Architectural Engineering",
    nameAr: "الهندسة المعمارية",
    description: "Integrating building design with structural and environmental engineering.",
    descriptionAr: "دمج تصميم المباني مع الهندسة الإنشائية والبيئية.",
    longDescription: "Architectural Engineering combines art and technology to design functional, aesthetic, and sustainable buildings. Students study architectural design, architectural history, building technology, and environmental systems in buildings. The program focuses on using advanced modeling software (BIM) and designing energy-efficient buildings. Graduates work in engineering offices, real estate development companies, and architectural project management.",
    longDescriptionAr: "تجمع الهندسة المعمارية بين الفن والتقنية لتصميم مبانٍ وظيفية وجمالية ومستدامة. يدرس الطالب التصميم المعماري، تاريخ العمارة، تكنولوجيا البناء، والأنظمة البيئية في المباني. يُركز البرنامج على استخدام برمجيات النمذجة المتقدمة (BIM) وتصميم المباني الموفرة للطاقة. يعمل الخريجون في المكاتب الهندسية، شركات التطوير العقاري، وإدارة المشاريع المعمارية.",
    imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=1200",
    icon: "Compass",
    color: "from-orange-600 to-amber-500",
    accentColor: "#f59e0b",
    studyPlanUrl: null,
    hourPriceCompetitive: 35,
    hourPriceParallel: 75,
    expectedSalary: "450 – 1,200 JOD (Jordan) | 2,000 – 7,500 USD (Gulf)",
    expectedSalaryAr: "450 – 1,200 دينار (الأردن) | 2,000 – 7,500 دولار (الخليج)",
    careerFieldsAr: ["مهندس مصمم", "مهندس إشراف معماري", "مخطط حضري", "مصمم داخلي", "مدير مشاريع معمارية"],
  },
];

export interface SemesterCourses {
  semester: 1 | 2;
  labelAr: string;
  labelEn: string;
  courseIds: string[];
}

export interface YearCurriculum {
  year: number;
  labelAr: string;
  labelEn: string;
  semesters: SemesterCourses[];
}

const STANDARD_YEAR_1: SemesterCourses[] = [
  {
    semester: 1,
    labelAr: "الفصل الأول",
    labelEn: "Semester 1",
    courseIds: ["c6", "p101", "english101", "applied_arabic", "national_studies"],
  },
  {
    semester: 2,
    labelAr: "الفصل الثاني",
    labelEn: "Semester 2",
    courseIds: ["c2", "p102", "programming_cpp", "engineering_drawing", "english102"],
  },
];

export const majorCurriculum: Record<string, YearCurriculum[]> = {
  "common": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["plab102", "stat101"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["islamic_culture", "diff_eq"] },
      ],
    },
  ],
  "network-security": [
    {
      year: 1, labelAr: "السنة الأولى", labelEn: "Year 1",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["applied_arabic", "english101", "c6", "p101", "chem101", "cs101", "chemlab101"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["national_studies", "english102", "c2", "p102", "programming_cpp", "entrepreneurship"] },
      ],
    },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["diff_eq", "math_linear_algebra", "logic_design", "comp_oop", "e1", "engineering_drawing"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["e2", "comp_data_structures", "e3", "comp_microprocessors", "e_circuits_lab", "comp_digital_lab", "comp_data_struct_lab"] },
      ],
    },
    {
      year: 3, labelAr: "السنة الثالثة", labelEn: "Year 3",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["comp_architecture", "technical_writing", "e_signals", "stat101", "e_machines1", "e_electronics_lab", "comp_arch_lab"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["e_communications", "numerical", "auto_control", "comp_os", "comp_db", "comp_micro_lab", "engineering_workshop"] },
      ],
    },
    {
      year: 4, labelAr: "السنة الرابعة", labelEn: "Year 4",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["ns_elective_1", "comp_ai", "ns_networks", "ee201", "comp_cloud", "comp_db_lab", "ns_networks_lab", "e_control_lab"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["ns_training", "ns_wireless", "ns_protocols", "ns_net_programming"] },
      ],
    },
    {
      year: 5, labelAr: "السنة الخامسة", labelEn: "Year 5",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["ns_elective_2", "univ_elective_1", "military_science", "ns_ethical_hacking", "ns_project1", "ns_protocols_lab", "ns_wireless_lab"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["univ_elective_2", "ns_elective_3", "ns_crypto", "ns_project2", "ns_security_lab", "ns_forensics_lab"] },
      ],
    },
  ],
  "mechanical": [
    {
      year: 1, labelAr: "السنة الأولى", labelEn: "Year 1",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["applied_arabic", "english101", "c6", "p101", "chem101", "cs101"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["programming_cpp", "english102", "c2", "p102", "entrepreneurship", "chemlab101", "plab101"] },
      ],
    },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["diff_eq", "technical_writing", "auto_materials_science", "ce_statics", "c5", "engineering_drawing"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["national_studies", "stat101", "ce_strength", "ce_dynamics", "auto_mech_drawing", "auto_thermo_lab"] },
      ],
    },
    {
      year: 3, labelAr: "السنة الثالثة", labelEn: "Year 3",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["auto_machines_theory", "ce_fluids", "eng_applied_math", "auto_circuits", "auto_mech_design1", "engineering_workshop", "auto_strength_lab"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["auto_measurements", "numerical", "auto_heat_transfer", "ee201", "auto_circuits_lab", "auto_machines_lab", "auto_fluids_lab"] },
      ],
    },
    {
      year: 4, labelAr: "السنة الرابعة", labelEn: "Year 4",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["auto_vibrations", "auto_control", "auto_ice", "mech_manufacturing", "mech_design2", "auto_heat_transfer_lab", "mech_apps_lab"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["univ_elective_1", "mech_hvac", "mech_power_plants", "e_machines1", "mech_adv_manufacturing", "auto_control_vib_lab", "mech_manufacturing_lab", "auto_ice_lab"] },
      ],
    },
    {
      year: 5, labelAr: "السنة الخامسة", labelEn: "Year 5",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["mech_elective_1", "mech_renewable_energy", "auto_fem", "military_science", "mech_project1", "mech_power_plants_lab"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["univ_elective_2", "mech_elective_2", "mech_hydraulic_machinery", "mech_project2", "mech_training"] },
      ],
    },
  ],
  "civil": [
    {
      year: 1, labelAr: "السنة الأولى", labelEn: "Year 1",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["applied_arabic", "english101", "c6", "p101", "cs101", "plab101", "chemlab101"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["chem101", "english102", "c2", "p102", "engineering_workshop", "plab102"] },
      ],
    },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["diff_eq", "technical_writing", "programming_cpp", "c4", "ce_surveying", "ce_surveying_lab"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["national_studies", "stat101", "ce_strength", "ce_dynamics", "ce_geology", "engineering_drawing", "ce_geology_lab"] },
      ],
    },
    {
      year: 3, labelAr: "السنة الثالثة", labelEn: "Year 3",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["ce_fluids", "ce_structural1", "ce_concrete_props", "ce_geotechnical", "univ_elective_1", "ce_geotechnical_lab", "ce_concrete_lab"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["eng_applied_math", "ce_structural2", "ce_hydraulics", "ce_water_treatment", "numerical", "ce_hydraulics_lab"] },
      ],
    },
    {
      year: 4, labelAr: "السنة الرابعة", labelEn: "Year 4",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["ce_concrete1", "ce_roads", "ce_hydrology", "ee201", "ce_elective_1", "ce_environment", "ce_environment_lab"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["ce_concrete2", "ce_specs", "ce_steel", "ce_pavements", "ce_traffic", "ce_civil_drawing", "ce_pavement_lab"] },
      ],
    },
    {
      year: 5, labelAr: "السنة الخامسة", labelEn: "Year 5",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["ce_construction_mgmt", "ce_project_mgmt", "ce_foundations", "ce_elective_2", "ce_project1", "ce_training"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["ce_comp_apps", "military_science", "ce_elective_3", "entrepreneurship", "ce_project2"] },
      ],
    },
  ],
  "mechatronics": [
    {
      year: 1, labelAr: "السنة الأولى", labelEn: "Year 1",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["applied_arabic", "english101", "c6", "p101", "chem101", "cs101"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["programming_cpp", "english102", "c2", "p102", "chemlab101", "plab101", "engineering_workshop"] },
      ],
    },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["diff_eq", "technical_writing", "c1", "e1", "math_linear_algebra", "engineering_drawing"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["e3", "stat101", "c4", "e2", "comp_microprocessors", "e_circuits_lab"] },
      ],
    },
    {
      year: 3, labelAr: "السنة الثالثة", labelEn: "Year 3",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["e_signals", "e_machines1", "mecha_sensors", "mecha_power_elec", "mecha_machine_comp", "e_electronics_lab", "comp_micro_lab"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["e_communications", "auto_control", "numerical", "ce_dynamics", "auto_machines_lab", "mecha_power_elec_lab", "mecha_sensors_lab"] },
      ],
    },
    {
      year: 4, labelAr: "السنة الرابعة", labelEn: "Year 4",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["mecha_drives", "mecha_plc", "mecha_industrial_ctrl", "ee201", "mecha_elective_1", "e_control_lab"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["national_studies", "military_science", "mecha_robotic_drives", "mecha_training", "mecha_elective_2", "mecha_drives_lab", "mecha_plc_lab"] },
      ],
    },
    {
      year: 5, labelAr: "السنة الخامسة", labelEn: "Year 5",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["mecha_special_topics", "mecha_design", "mecha_robot_dynamics", "univ_elective_1", "entrepreneurship", "mecha_robotic_lab", "mecha_industrial_lab", "mecha_project1"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["univ_elective_2", "mecha_elective_3", "mecha_applied_materials", "mecha_cnc", "mecha_mems", "mecha_project2"] },
      ],
    },
  ],
  "chemical": [
    {
      year: 1, labelAr: "السنة الأولى", labelEn: "Year 1",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["c6", "p101", "chem101", "m_comp_skills", "english101", "applied_arabic"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["c2", "p102", "m_principles_che", "national_studies", "english102", "chemlab101", "plab101", "engineering_workshop"] },
      ],
    },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["m_balances", "chem_organic", "chem_analytical", "diff_eq", "programming_cpp", "engineering_drawing"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["m_fluids_che", "chem_phys_thermo", "m_digital_culture", "numerical", "military_science", "m_organic_lab", "m_analytical_lab"] },
      ],
    },
    {
      year: 3, labelAr: "السنة الثالثة", labelEn: "Year 3",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["m_heat_transfer", "m_thermo_che", "m_reaction_eng1", "isl101", "technical_writing", "m_fluids_lab_che", "m_heat_transfer_lab"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["m_mass_transfer", "m_thermo_lab_che", "m_reaction_eng2", "m_unit_ops", "ee201", "entrepreneurship", "m_reaction_lab"] },
      ],
    },
    {
      year: 4, labelAr: "السنة الرابعة", labelEn: "Year 4",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["m_separation", "m_unit_ops_lab", "m_modeling", "m_bioprocess", "m_corrosion", "m_separation_lab"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["m_simulation_lab", "m_plant_mgmt", "m_petroleum", "m_chem_ind1", "univ_elective_1", "m_petroleum_lab"] },
      ],
    },
    {
      year: 5, labelAr: "السنة الخامسة", labelEn: "Year 5",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["m_process_control", "m_equip_design", "m_chem_ind2", "m_wastewater", "m_control_lab", "ce_project1"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["m_plant_design", "m_process_safety", "m_tech_lab", "univ_elective_2", "ce_project2"] },
      ],
    },
  ],
  "computer": [
    {
      year: 1, labelAr: "السنة الأولى", labelEn: "Year 1",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["applied_arabic", "english101", "c6", "p101", "chem101", "national_studies"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["programming_cpp", "english102", "c2", "p102", "entrepreneurship", "chemlab101", "plab101"] },
      ],
    },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["diff_eq", "math_linear_algebra", "logic_design", "comp_oop", "e1", "engineering_drawing"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["e2", "comp_data_structures", "e3", "comp_microprocessors", "e_circuits_lab", "comp_digital_lab", "comp_data_struct_lab"] },
      ],
    },
    {
      year: 3, labelAr: "السنة الثالثة", labelEn: "Year 3",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["comp_architecture", "e_electronics_lab", "e_signals", "comp_arch_lab", "e_machines1", "engineering_workshop", "stat101", "technical_writing"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["e_communications", "numerical", "auto_control", "comp_db", "comp_os", "comp_micro_lab"] },
      ],
    },
    {
      year: 4, labelAr: "السنة الرابعة", labelEn: "Year 4",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["comp_embedded", "comp_ai", "comp_adv_architecture", "e_digital_electronics", "ns_networks", "comp_db_lab", "e_control_lab"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["comp_training", "ee201", "comp_cyber_security", "ns_protocols", "comp_parallel", "comp_ai_lab", "ns_networks_lab", "comp_embedded_lab"] },
      ],
    },
    {
      year: 5, labelAr: "السنة الخامسة", labelEn: "Year 5",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["comp_elective_1", "comp_elective_2", "univ_elective_1", "comp_adv_programming", "comp_parallel_lab", "comp_project1"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["comp_elective_3", "comp_elective_4", "military_science", "comp_project2"] },
      ],
    },
  ],
  "autotronics": [
    {
      year: 1, labelAr: "السنة الأولى", labelEn: "Year 1",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["applied_arabic", "english101", "c6", "p101", "chem101", "cs101", "chemlab101"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["programming_cpp", "english102", "c2", "p102", "engineering_workshop", "plab101"] },
      ],
    },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["diff_eq", "technical_writing", "auto_materials_science", "c4", "c5", "engineering_drawing"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["national_studies", "stat101", "ce_strength", "ce_dynamics", "auto_mech_drawing", "auto_thermo_lab"] },
      ],
    },
    {
      year: 3, labelAr: "السنة الثالثة", labelEn: "Year 3",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["auto_machines_theory", "ce_fluids", "eng_applied_math", "auto_mech_design1", "auto_circuits", "auto_machines_lab", "auto_strength_lab", "auto_fluids_lab", "auto_circuits_lab"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["auto_measurements", "numerical", "auto_heat_transfer", "ee201", "auto_fundamentals", "entrepreneurship"] },
      ],
    },
    {
      year: 4, labelAr: "السنة الرابعة", labelEn: "Year 4",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["auto_vibrations", "auto_control", "auto_engineering", "auto_ice", "auto_heat_transfer_lab", "auto_control_vib_lab", "auto_measurements_lab", "auto_eng_lab"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["univ_elective_1", "auto_vehicle_design", "auto_electronics", "military_science", "auto_hybrid_ev", "auto_ice_lab", "auto_fundamentals_lab"] },
      ],
    },
    {
      year: 5, labelAr: "السنة الخامسة", labelEn: "Year 5",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["auto_elective_1", "auto_elective_2", "auto_fem", "auto_diagnosis", "auto_project1", "auto_electronics_lab", "auto_hybrid_ev_lab"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["univ_elective_2", "auto_elective_3", "auto_training", "auto_project2", "auto_workshop_mgmt", "auto_diagnosis_lab"] },
      ],
    },
  ],
  "thermal": [
    {
      year: 1, labelAr: "السنة الأولى", labelEn: "Year 1",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["applied_arabic", "english101", "c6", "p101", "chem101", "cs101"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["programming_cpp", "english102", "c2", "p102", "plab101", "chemlab101", "engineering_workshop"] },
      ],
    },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["diff_eq", "auto_materials_science", "technical_writing", "c4", "c5", "engineering_drawing"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["ce_dynamics", "auto_mech_drawing", "military_science", "ce_strength", "stat101", "national_studies", "auto_thermo_lab"] },
      ],
    },
    {
      year: 3, labelAr: "السنة الثالثة", labelEn: "Year 3",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["auto_machines_theory", "ce_fluids", "eng_applied_math", "auto_circuits", "auto_mech_design1", "auto_strength_lab"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["auto_measurements", "numerical", "auto_heat_transfer", "auto_fluids_lab", "ee201", "entrepreneurship", "auto_circuits_lab"] },
      ],
    },
    {
      year: 4, labelAr: "السنة الرابعة", labelEn: "Year 4",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["auto_ice", "auto_control", "univ_elective_1", "auto_heat_transfer_lab", "auto_control_vib_lab"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["mecha_industrial_ctrl", "mecha_robotic_drives", "auto_elective_1", "auto_measurements_lab", "auto_eng_lab"] },
      ],
    },
    {
      year: 5, labelAr: "السنة الخامسة", labelEn: "Year 5",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["auto_project1", "auto_elective_2", "univ_elective_2", "auto_training"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["auto_project2", "auto_elective_3", "auto_workshop_mgmt", "auto_diagnosis_lab"] },
      ],
    },
  ],
  "telecom": [
    {
      year: 1, labelAr: "السنة الأولى", labelEn: "Year 1",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["applied_arabic", "english101", "c6", "p101", "chem101", "cs101", "plab101"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["programming_cpp", "english102", "c2", "p102", "entrepreneurship", "engineering_workshop"] },
      ],
    },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["e1", "diff_eq", "math_linear_algebra", "c1", "math_vector_analysis", "chemlab101", "e_circuits_lab"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["e2", "comp_microprocessors", "e_em1", "e3", "technical_writing", "comp_digital_lab"] },
      ],
    },
    {
      year: 3, labelAr: "السنة الثالثة", labelEn: "Year 3",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["e_signals", "e_machines1", "e_em2", "stat101", "e_electronics2", "e_electronics_lab"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["e_communications", "auto_control", "numerical", "e_digital_electronics", "tele_analog", "comp_micro_ctrl_lab", "e_electronics2_lab"] },
      ],
    },
    {
      year: 4, labelAr: "السنة الرابعة", labelEn: "Year 4",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["tele_digital", "tele_microwaves", "tele_dsp", "ns_networks", "univ_elective_1", "tele_analog_lab", "e_control_lab", "tele_digital_lab"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["tele_antennas", "tele_optical", "national_studies", "tele_elective_1", "engineering_drawing", "tele_ant_mw_lab", "tele_dsp_lab"] },
      ],
    },
    {
      year: 5, labelAr: "السنة الخامسة", labelEn: "Year 5",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["tele_circuits", "tele_mobile", "ee201", "tele_elective_2", "military_science", "tele_project1"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["tele_project2", "tele_elective_3", "univ_elective_2", "tele_training", "tele_optical_lab", "ns_networks_lab"] },
      ],
    },
  ],
  "electrical": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
  ],
  "industrial": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
  ],
  "architecture": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
  ],
};

export function getMajorById(id: string): MajorInfo | undefined {
  return majorsData.find((m) => m.id === id);
}
