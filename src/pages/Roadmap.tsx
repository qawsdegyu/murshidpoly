import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { 
  Network, BookOpen, GraduationCap, 
  FileText, Brain, Sparkles, X, ChevronRight,
  Layers, Cpu, Globe, Wrench, Settings, FlaskConical, Layout,
  Search, Maximize2, Minimize2, MousePointer2, Move
} from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { courses, resourcesByCourse, Resource } from "@/data/mockData";
import { roadmapNodes, RoadmapNode } from "@/data/roadmapData";
import { usePreferences } from "@/contexts/PreferencesContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const roadmapCategories = [
  { id: "common", nameEn: "Common Subjects", nameAr: "المواد المشتركة", icon: Layout },
  { id: "computer", nameEn: "Computer & Network", nameAr: "هندسة الحاسوب والشبكات", icon: Cpu },
  { id: "civil", nameEn: "Civil Engineering", nameAr: "الهندسة المدنية", icon: Globe },
  { id: "mechatronics", nameEn: "Mechatronics", nameAr: "هندسة الميكاترونكس", icon: Settings },
  { id: "mechanical", nameEn: "Mechanical", nameAr: "الهندسة الميكانيكية", icon: Wrench },
  { id: "chemical", nameEn: "Chemical", nameAr: "الهندسة الكيميائية", icon: FlaskConical },
];

export default function Roadmap() {
  const { lang, dir } = usePreferences();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "common";
  
  const [activeTab, setActiveTab] = useState(initialCategory);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const constraintsRef = useRef(null);

  // Sync activeTab with URL param if it changes
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && cat !== activeTab) {
      setActiveTab(cat);
    }
  }, [searchParams]);

  // Pan & Zoom Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const activeRoadmap = useMemo(() => {
    return roadmapNodes.filter(node => {
      // Rule: Always show common nodes, plus the specific category nodes
      const matchesCategory = node.category === "common" || node.category === activeTab;
      return matchesCategory;
    });
  }, [activeTab]);

  const getDependents = (courseId: string) => {
    const dependents: string[] = [];
    const visited = new Set<string>();
    const check = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);
      activeRoadmap.forEach(node => {
        if (node.prerequisites?.includes(id) && !dependents.includes(node.id)) {
          dependents.push(node.id);
          check(node.id);
        }
      });
    };
    check(courseId);
    return dependents;
  };

  const highlightedNodes = useMemo(() => {
    if (hoveredNode) return [hoveredNode, ...getDependents(hoveredNode)];
    if (selectedNode) return [selectedNode, ...getDependents(selectedNode)];
    return [];
  }, [hoveredNode, selectedNode, activeRoadmap]);

  const courseData = useMemo(() => courses.find(c => c.id === selectedNode), [selectedNode]);
  const resources = useMemo(() => (selectedNode ? resourcesByCourse[selectedNode] || [] : []), [selectedNode]);
  
  const handleZoom = (delta: number) => {
    setScale(prev => Math.min(Math.max(prev + delta, 0.1), 3));
  };

  const fitView = () => {
    if (!activeRoadmap || activeRoadmap.length === 0) return;
    
    let minX = 100, maxX = 0, minY = 100, maxY = 0;
    activeRoadmap.forEach(node => {
      if (node.position.x < minX) minX = node.position.x;
      if (node.position.x > maxX) maxX = node.position.x;
      if (node.position.y < minY) minY = node.position.y;
      if (node.position.y > maxY) maxY = node.position.y;
    });

    minX = Math.max(0, minX - 5);
    maxX = Math.min(100, maxX + 5);
    minY = Math.max(0, minY - 5);
    maxY = Math.min(100, maxY + 5);

    const CANVAS_W = 4000;
    const CANVAS_H = 3000;
    const VIEWPORT_W = window.innerWidth || 1200;
    const VIEWPORT_H = window.innerHeight ? window.innerHeight - 250 : 800;

    const targetW = ((maxX - minX) / 100) * CANVAS_W;
    const targetH = ((maxY - minY) / 100) * CANVAS_H;
    
    const scaleX = VIEWPORT_W / (targetW || CANVAS_W);
    const scaleY = VIEWPORT_H / (targetH || CANVAS_H);
    const newScale = Math.min(scaleX, scaleY, 1.5) * 0.85; 

    setScale(newScale);

    const centerX = ((minX + maxX) / 2 / 100) * CANVAS_W;
    const centerY = ((minY + maxY) / 2 / 100) * CANVAS_H;
    
    x.set(VIEWPORT_W / 2 - centerX * newScale);
    y.set(VIEWPORT_H / 2 - centerY * newScale);
  };

  useEffect(() => {
    // Small timeout ensures container dimensions are fully calculated
    const t = setTimeout(() => fitView(), 50);
    return () => clearTimeout(t);
  }, [activeRoadmap]);

  const resetView = () => {
    fitView();
  };

  return (
    <div className="min-h-screen pb-20 overflow-hidden bg-slate-50 dark:bg-slate-950 selection:bg-cyan-500/30 transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-0 opacity-10 dark:opacity-20" 
          style={{ backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`, backgroundSize: '100px 100px' }} 
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8 pt-28">
        <PageHeader 
          title={lang === "ar" ? "خريطة المسار الأكاديمي" : "Academic Roadmap"} 
          subtitle={lang === "ar" ? "نظام تتبع المتطلبات الهندسي المتطور" : "Advanced Engineering Prerequisite Tracking System"} 
          icon={<Network className="h-6 w-6 text-cyan-400" />} 
        />

        {/* Global Navigation Tabs */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8 overflow-x-auto pb-4 scrollbar-hide">
          {roadmapCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <motion.button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-2 md:gap-3 px-3 py-2.5 md:px-6 md:py-4 rounded-xl md:rounded-2xl whitespace-nowrap transition-all border relative overflow-hidden group text-xs md:text-sm",
                  isActive 
                    ? "bg-cyan-500/10 border-cyan-400/50 text-cyan-600 dark:text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]" 
                    : "bg-white/80 border-slate-200 shadow-sm backdrop-blur-xl dark:bg-white/[0.03] dark:border-white/[0.08] dark:backdrop-blur-2xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-cyan-400/10 blur-xl -z-10"
                  />
                )}
                <Icon className={cn("h-4 w-4 md:h-5 md:w-5", isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-cyan-300")} />
                <span className="font-bold tracking-wide">{lang === "ar" ? cat.nameAr : cat.nameEn}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Roadmap Canvas Interface */}
        <div className="relative h-[60vh] md:h-[calc(100vh-250px)] min-h-[400px] md:min-h-[750px] w-full rounded-2xl md:rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-3xl overflow-hidden shadow-2xl transition-colors duration-300">
          {/* Controls HUD */}
          <div className="absolute top-6 right-6 z-40 flex flex-col gap-2">
            <ControlButton onClick={() => handleZoom(0.1)} icon={<Maximize2 className="h-4 w-4" />} label="Zoom In" />
            <ControlButton onClick={() => handleZoom(-0.1)} icon={<Minimize2 className="h-4 w-4" />} label="Zoom Out" />
            <ControlButton onClick={resetView} icon={<Move className="h-4 w-4" />} label="Reset View" />
          </div>

          <div className="absolute bottom-6 right-6 z-40 flex items-center gap-4 bg-white/80 dark:bg-white/10 border border-slate-200 dark:border-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-tighter">{lang === "ar" ? "متطلب سابق" : "Prerequisite"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
              <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-tighter">{lang === "ar" ? "متطلب متزامن" : "Co-requisite"}</span>
            </div>
          </div>

          {/* Interactive World */}
          <motion.div 
            ref={constraintsRef}
            drag
            dragElastic={0}
            dragMomentum={false}
            style={{ x, y, scale, willChange: "transform" }}
            className="w-[4000px] h-[3000px] relative origin-top-left cursor-grab active:cursor-grabbing p-20"
          >
            {/* Year Markers */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
              {[1, 2, 3, 4, 5].map(year => (
                <div 
                  key={year}
                  className="absolute h-full border-l border-slate-200 dark:border-white/10"
                  style={{ left: `${year * 800}px` }}
                >
                  <div className="absolute top-4 left-4 text-4xl font-black text-white/20 whitespace-nowrap uppercase tracking-[1em]">
                    YEAR 0{year}
                  </div>
                </div>
              ))}
            </div>

            {/* SVG Connections Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              <defs>
                <linearGradient id="gradient-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="gradient-rose" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.2" />
                </linearGradient>
                <marker id="arrow-cyan" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#22d3ee" />
                </marker>
                <marker id="arrow-rose" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                </marker>
              </defs>
              <AnimatePresence>
                {activeRoadmap.map(node => (
                  <motion.g key={`connections-${node.id}`}>
                    {node.prerequisites?.map(prereqId => (
                      <ConnectionPath 
                        key={`prereq-${node.id}-${prereqId}`}
                        start={activeRoadmap.find(n => n.id === prereqId)} 
                        end={node} 
                        type="prerequisite"
                        isHighlighted={highlightedNodes.includes(node.id) && highlightedNodes.includes(prereqId)}
                      />
                    ))}
                    {node.corequisites?.map(coreqId => (
                      <ConnectionPath 
                        key={`coreq-${node.id}-${coreqId}`}
                        start={activeRoadmap.find(n => n.id === coreqId)} 
                        end={node} 
                        type="corequisite"
                        isHighlighted={highlightedNodes.includes(node.id) && highlightedNodes.includes(coreqId)}
                      />
                    ))}
                  </motion.g>
                ))}
              </AnimatePresence>
            </svg>

            {/* Nodes Layer */}
            {activeRoadmap.map((node) => {
              const course = courses.find(c => c.id === node.id);
              
              const isDummy = !course;
              
              const isActive = selectedNode === node.id;
              const isHighlighted = highlightedNodes.includes(node.id);
              const isDimmed = highlightedNodes.length > 0 && !isHighlighted;

              return (
                <RoadmapNodeElement 
                  key={node.id}
                  node={node}
                  course={course}
                  isDummy={isDummy}
                  isActive={isActive}
                  isHighlighted={isHighlighted}
                  isDimmed={isDimmed}
                  lang={lang}
                  onClick={isDummy ? undefined : () => setSelectedNode(node.id)}
                  onMouseEnter={isDummy ? undefined : () => setHoveredNode(node.id)}
                  onMouseLeave={isDummy ? undefined : () => setHoveredNode(null)}
                />
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Futuristic Glass Modal */}
      <AnimatePresence>
        {selectedNode && courseData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedNode(null)} 
              className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              className="relative w-full max-w-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/20 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-2xl"
            >
              <div className="bg-gradient-to-br from-cyan-600/30 to-blue-900/40 p-10 relative">
                <button 
                  onClick={() => setSelectedNode(null)} 
                  className="absolute top-6 right-6 h-10 w-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-all border border-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-[10px] font-black text-cyan-300 tracking-widest uppercase">
                    {courseData.code}
                  </div>
                  <div className="h-1 w-1 rounded-full bg-slate-500/20" />
                  <div className="text-[10px] font-bold text-slate-500 dark:text-white/60 tracking-widest uppercase">{courseData.hours} CREDIT HOURS</div>
                </div>
                <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-tight mb-2">
                  {lang === "ar" ? courseData.nameAr : courseData.name}
                </h3>
              </div>

              <div className="p-10 space-y-6 bg-black/60">
                <div className="grid grid-cols-2 gap-4">
                  <GlassModalLink 
                    icon={<FileText className="text-cyan-400" />} 
                    label={lang === "ar" ? "الملخصات" : "Summaries"} 
                    count={resources.filter(r => r.type === "summary").length} 
                    to={`/vault/${selectedNode}`} 
                  />
                  <GlassModalLink 
                    icon={<GraduationCap className="text-emerald-400" />} 
                    label={lang === "ar" ? "الكويزات" : "Quizzes"} 
                    count={resources.filter(r => r.type === "exam").length} 
                    to={`/vault/${selectedNode}`} 
                  />
                </div>
                
                <Button 
                  className="w-full h-16 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 rounded-2xl font-black text-lg tracking-wider shadow-xl shadow-cyan-900/20 transition-all active:scale-95 group" 
                  asChild
                >
                  <Link to={`/vault/${selectedNode}`} className="flex items-center justify-center gap-3">
                    {lang === "ar" ? "خزانة المواد" : "SUBJECT VAULT"}
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ConnectionPath({ start, end, type, isHighlighted }: any) {
  if (!start || !end) return null;
  
  // Convert percentage positions to canvas coordinates (4000x3000)
  const x1 = (start.position.x / 100) * 4000;
  const y1 = (start.position.y / 100) * 3000;
  const x2 = (end.position.x / 100) * 4000;
  const y2 = (end.position.y / 100) * 3000;
  
  // Curve Path Logic (Smooth S-curve)
  const dx = x2 - x1;
  const dy = y2 - y1;
  const path = `M ${x1} ${y1} C ${x1} ${y1 + dy/2}, ${x2} ${y2 - dy/2}, ${x2} ${y2}`;

  const color = type === "prerequisite" ? "#22d3ee" : "#f43f5e";
  
  return (
    <g>
      {/* Background Dimmed Path */}
      <path 
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={isHighlighted ? 4 : 2}
        markerEnd={`url(#arrow-${type === "prerequisite" ? "cyan" : "rose"})`}
        className={cn(
          "transition-all duration-700",
          isHighlighted ? "opacity-100" : "opacity-5"
        )}
      />
      
      {/* Flowing Light Animation */}
      {isHighlighted && (
        <motion.path 
          d={path}
          fill="none"
          stroke={`url(#gradient-${type === "prerequisite" ? "cyan" : "rose"})`}
          strokeWidth={4}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "loop", ease: "linear" }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      )}
    </g>
  );
}

function RoadmapNodeElement({ node, course, isDummy, isActive, isHighlighted, isDimmed, lang, onClick, onMouseEnter, onMouseLeave }: any) {
  // Convert percentage positions to canvas coordinates (4000x3000)
  const xPos = (node.position.x / 100) * 4000;
  const yPos = (node.position.y / 100) * 3000;

  const Component = isDummy ? motion.div : motion.button;

  return (
    <Component
      layout="position"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isDimmed ? (isDummy ? 0.2 : 0.3) : (isDummy ? 0.6 : 1), 
        scale: isActive ? 1.1 : isHighlighted ? 1.05 : 1,
      }}
      whileHover={isDummy ? undefined : { scale: 1.1, y: -5, zIndex: 50 }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 w-64 p-6 rounded-[2.5rem] border transition-all duration-500 backdrop-blur-2xl overflow-hidden",
        isDummy ? "pointer-events-none" : "group",
        isActive || isHighlighted
          ? "bg-cyan-500/10 border-cyan-400/50 shadow-[0_0_40px_rgba(34,211,238,0.25)]" 
          : "bg-white/80 border-slate-200 dark:bg-white/5 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-xl"
      )}
      style={{ 
        left: `${xPos}px`, 
        top: `${yPos}px`,
        boxShadow: isHighlighted ? `0 0 30px rgba(34, 211, 238, 0.15)` : '',
        willChange: "transform, opacity"
      }}
    >
      {/* Background Glow when highlighted */}
      {isHighlighted && (
        <motion.div 
          layoutId={`bgGlow-${node.id}`}
          className="absolute inset-0 bg-cyan-400/5 blur-3xl -z-10"
        />
      )}
      
      <div className="flex flex-col items-center gap-3 text-center relative z-10">
        {!isDummy && course && (
          <div className="px-3 py-1 rounded-lg bg-black/40 border border-white/5 text-[9px] font-black font-mono text-cyan-400 group-hover:text-cyan-300 transition-colors tracking-[0.2em] uppercase">
            {course.code}
          </div>
        )}
        <div className="text-base md:text-lg font-black text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-50 group-hover:scale-[1.02] transition-all leading-tight">
          {lang === "ar" ? (course?.nameAr || node.fallbackNameAr) : (course?.name || node.fallbackName)}
        </div>
        {!isDummy && course && (
          <div className="flex items-center gap-3">
            <div className="text-[10px] font-bold text-slate-400 dark:text-white/30 tracking-widest uppercase">
              {course.hours} HRS
            </div>
            {isHighlighted && (
              <motion.div 
                layoutId={`activePoint-${node.id}`}
                className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]" 
              />
            )}
          </div>
        )}
      </div>
      
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 group-hover:border-cyan-400/40 rounded-tr-[2.5rem] transition-colors" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/10 group-hover:border-cyan-400/40 rounded-bl-[2.5rem] transition-colors" />
    </Component>
  );
}

function GlassModalLink({ icon, label, count, to }: any) {
  return (
    <Link to={to} className="flex flex-col gap-3 p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-all group overflow-hidden relative">
      <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-20 transition-opacity">
        {icon}
      </div>
      <div className="h-10 w-10 rounded-2xl bg-slate-200 dark:bg-black/40 flex items-center justify-center text-xl">
        {icon}
      </div>
      <div>
        <div className="font-black text-sm text-slate-900 dark:text-white mb-1">{label}</div>
        <div className="text-[10px] font-bold text-slate-400 dark:text-white/30 tracking-widest">{count} DOCUMENTS</div>
      </div>
    </Link>
  );
}

function ControlButton({ onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className="p-3 rounded-xl bg-white/80 dark:bg-white/10 border border-slate-200 dark:border-white/10 backdrop-blur-xl hover:bg-white dark:hover:bg-white/20 transition-all text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white group relative shadow-sm"
      title={label}
    >
      {icon}
      <span className="absolute right-full mr-3 px-2 py-1 rounded bg-slate-800 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {label}
      </span>
    </button>
  );
}

