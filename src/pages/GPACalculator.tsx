import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Plus, Trash2, RotateCcw, ChevronDown } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calcGpa, gradeOptions, CourseEntry } from "@/lib/gpa";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export default function GPACalculator() {
  const { t, lang } = usePreferences();
  const { user, loading } = useAuth();
  const [prevGpa, setPrevGpa] = useState<string>("3.20");
  const [prevHours, setPrevHours] = useState<string>("60");
  const [courses, setCourses] = useState<CourseEntry[]>([
    { id: crypto.randomUUID(), name: "", hours: 3, grade: "A" },
    { id: crypto.randomUUID(), name: "", hours: 3, grade: "B+" },
  ]);

  const [isPrevOpen, setIsPrevOpen] = useState(true);
  const [isCurrentOpen, setIsCurrentOpen] = useState(true);

  const [result, setResult] = useState(() => calcGpa(parseFloat(prevGpa) || 0, parseFloat(prevHours) || 0, courses));

  const handleCalculate = () => {
    setResult(calcGpa(parseFloat(prevGpa) || 0, parseFloat(prevHours) || 0, courses));
  };

  const updateCourse = (id: string, patch: Partial<CourseEntry>) => {
    setCourses(cs => cs.map(c => c.id === id ? { ...c, ...patch } : c));
  };
  const addCourse = () => {
    setCourses(cs => [...cs, { id: crypto.randomUUID(), name: "", hours: 3, grade: "A" }]);
    setIsCurrentOpen(true);
  };
  const removeCourse = (id: string) => setCourses(cs => cs.filter(c => c.id !== id));
  const reset = () => {
    setPrevGpa("0"); setPrevHours("0");
    const initialCourses = [{ id: crypto.randomUUID(), name: "", hours: 3, grade: "A" }];
    setCourses(initialCourses);
    setResult(calcGpa(0, 0, initialCourses));
  };

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-0 pb-64 md:pb-96 animate-pulse">
        <PageHeader
          title={t.gpa.title}
          subtitle={t.gpa.subtitle}
          icon={<Calculator className="h-5 w-5 md:h-6 md:w-6" />}
        />
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-32 bg-white/5 border border-white/10 rounded-2xl" />
            <div className="h-[400px] bg-white/5 border border-white/10 rounded-2xl" />
          </div>
          <div className="h-[400px] bg-white/5 border border-white/10 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="min-h-screen w-full bg-background"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-0 pb-64 md:pb-96">
        <PageHeader
          title={t.gpa.title}
          subtitle={t.gpa.subtitle}
          icon={<Calculator className="h-5 w-5 md:h-6 md:w-6" />}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Previous record */}
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              className="bg-card border border-border/50 rounded-2xl p-4 md:p-6 shadow-sm"
            >
              <button
                onClick={() => setIsPrevOpen(!isPrevOpen)}
                className="w-full flex items-center justify-between font-bold mb-0 focus:outline-none"
              >
                <h2 className="text-lg font-black text-foreground">{t.gpa.previous}</h2>
                <ChevronDown className={cn("w-5 h-5 transition-transform duration-300 text-muted-foreground", isPrevOpen ? "rotate-180" : "rotate-0")} />
              </button>

              <AnimatePresence initial={false}>
                {isPrevOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid sm:grid-cols-2 gap-4 pb-2">
                      <div>
                        <Label className="text-foreground font-bold">{t.gpa.prevGpa}</Label>
                        <Input type="number" step="0.01" min="0" max="4" value={prevGpa} onChange={e => setPrevGpa(e.target.value)} className="mt-1.5 bg-card border-border/50 text-foreground focus:border-primary focus:ring-primary/20 transition-all font-bold" />
                      </div>
                      <div>
                        <Label className="text-foreground font-bold">{t.gpa.prevHours}</Label>
                        <Input type="number" min="0" value={prevHours} onChange={e => setPrevHours(e.target.value)} className="mt-1.5 bg-card border-border/50 text-foreground focus:border-primary focus:ring-primary/20 transition-all font-bold" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>

            {/* Current semester */}
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-card border border-border/50 rounded-2xl p-4 md:p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-0">
                <button
                  onClick={() => setIsCurrentOpen(!isCurrentOpen)}
                  className="flex flex-1 items-center gap-3 font-bold focus:outline-none"
                >
                  <h2 className="text-base md:text-lg font-black text-foreground">{t.gpa.current}</h2>
                  <ChevronDown className={cn("w-5 h-5 transition-transform duration-300 text-muted-foreground", isCurrentOpen ? "rotate-180" : "rotate-0")} />
                </button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="sm" onClick={addCourse} className="bg-primary hover:opacity-90 text-primary-foreground shadow-sm text-xs md:text-sm h-8 md:h-9 px-3">
                    <Plus className="h-3.5 w-3.5 mr-1 rtl:ml-1 rtl:mr-0" />
                    {t.gpa.addCourse}
                  </Button>
                </motion.div>
              </div>

              <AnimatePresence initial={false}>
                {isCurrentOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2.5 md:space-y-3 pb-2">
                      {courses?.map((c, idx) => (
                        <motion.div
                          key={c.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-2 items-end"
                        >
                          <div className="flex-1 min-w-0">
                            {idx === 0 && <Label className="text-[11px] md:text-xs text-muted-foreground font-bold">{t.gpa.hours}</Label>}
                            <Input type="number" min="1" max="6" value={c.hours} onChange={e => updateCourse(c.id, { hours: parseInt(e.target.value) || 0 })} className="mt-1 bg-card border-border/50 text-foreground focus:border-primary focus:ring-primary/20 transition-all h-9 md:h-10 text-center font-bold" />
                          </div>
                          <div className="flex-1 min-w-[75px] md:min-w-[90px]">
                            {idx === 0 && <Label className="text-[11px] md:text-xs text-muted-foreground font-bold">{t.gpa.grade}</Label>}
                            <Select value={c.grade} onValueChange={v => updateCourse(c.id, { grade: v })}>
                              <SelectTrigger className="mt-1 bg-card border-border/50 text-foreground focus:border-primary focus:ring-primary/20 transition-all h-9 md:h-10 px-2 font-bold"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {gradeOptions?.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Course Repeat Controls */}
                          <div className="flex flex-col items-center justify-end shrink-0">
                            {idx === 0 && <Label className="text-[11px] md:text-xs mb-[4px] md:mb-[5px] text-muted-foreground font-bold">{lang === 'ar' ? "تكرار" : "Repeat"}</Label>}
                            <Checkbox
                              id={`repeat-${c.id}`}
                              checked={!!c.isRepeat}
                              onCheckedChange={(checked) => updateCourse(c.id, { isRepeat: checked as boolean, oldGrade: checked ? "F" : undefined })}
                              className="h-9 w-9 md:h-10 md:w-10 mt-1 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground rounded-md shadow-sm transition-all"
                            />
                          </div>
                          {c.isRepeat && (
                            <div className="flex-[1.2] min-w-[70px]">
                              {idx === 0 && <Label className="text-[11px] md:text-xs text-muted-foreground font-bold">{lang === 'ar' ? "السابقة" : "Old"}</Label>}
                              <Select value={c.oldGrade || "F"} onValueChange={v => updateCourse(c.id, { oldGrade: v })}>
                                <SelectTrigger className="mt-1 bg-card border-border/50 text-foreground focus:border-primary focus:ring-primary/20 transition-all h-9 md:h-10 px-2 font-bold"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {gradeOptions?.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          <div className="shrink-0">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button variant="ghost" size="icon" onClick={() => removeCourse(c.id)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9 md:h-10 md:w-10 mt-1 rounded-xl transition-all">
                                <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                              </Button>
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          </div>

          {/* Right: results */}
          <motion.aside
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-8 self-start"
          >
            <div className="bg-card border border-border/50 rounded-2xl p-4 md:p-6 shadow-md relative overflow-hidden group">
              {/* Animated Glow Background */}
              <motion.div
                animate={{
                  opacity: [0.1, 0.2, 0.1],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none"
              />

              <div className="relative z-10">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-black">{t.gpa.results}</div>

                <div className="mt-3 md:mt-5 space-y-4 md:space-y-5">
                  <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="text-xs text-muted-foreground font-medium">{t.gpa.semGpa}</div>
                    <div className="text-3xl md:text-6xl font-black text-accent mt-1 tabular-nums drop-shadow-gold">
                      {result.semesterGpa.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1 font-bold">
                      {result.semesterPoints.toFixed(2)} pts / {result.semesterHours} hrs
                    </div>
                  </motion.div>

                  <div className="border-t border-border pt-4 md:pt-5">
                    <div className="text-xs text-muted-foreground font-medium">{t.gpa.newCgpa}</div>
                    <div className="text-2xl md:text-5xl font-black text-foreground mt-1 tabular-nums">
                      {result.newCgpa.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1 font-bold">
                      Total: {result.totalHours} hrs
                    </div>
                  </div>

                  <Button
                    onClick={handleCalculate}
                    className="w-full mt-4 h-12 md:h-14 bg-primary hover:opacity-90 text-primary-foreground font-black text-lg shadow-md rounded-xl transition-all active:scale-95"
                  >
                    {lang === 'ar' ? 'احسب المعدل' : 'Calculate GPA'}
                  </Button>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </motion.div>
  );
}
