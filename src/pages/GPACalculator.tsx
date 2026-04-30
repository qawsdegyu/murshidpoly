import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Plus, Trash2, RotateCcw } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calcGpa, gradeOptions, CourseEntry } from "@/lib/gpa";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function GPACalculator() {
  const { t } = usePreferences();
  const [prevGpa, setPrevGpa] = useState<string>("3.20");
  const [prevHours, setPrevHours] = useState<string>("60");
  const [courses, setCourses] = useState<CourseEntry[]>([
    { id: crypto.randomUUID(), name: "", hours: 3, grade: "A" },
    { id: crypto.randomUUID(), name: "", hours: 3, grade: "B+" },
  ]);

  const result = useMemo(
    () => calcGpa(parseFloat(prevGpa) || 0, parseFloat(prevHours) || 0, courses),
    [prevGpa, prevHours, courses]
  );

  const updateCourse = (id: string, patch: Partial<CourseEntry>) => {
    setCourses(cs => cs.map(c => c.id === id ? { ...c, ...patch } : c));
  };
  const addCourse = () => setCourses(cs => [...cs, { id: crypto.randomUUID(), name: "", hours: 3, grade: "A" }]);
  const removeCourse = (id: string) => setCourses(cs => cs.filter(c => c.id !== id));
  const reset = () => {
    setPrevGpa("0"); setPrevHours("0");
    setCourses([{ id: crypto.randomUUID(), name: "", hours: 3, grade: "A" }]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-28">
        <PageHeader
          title={t.gpa.title}
          subtitle={t.gpa.subtitle}
          icon={<Calculator className="h-6 w-6" />}
          actions={
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {t.gpa.reset}
              </Button>
            </motion.div>
          }
        />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Previous record */}
          <motion.section 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            whileHover={{ scale: 1.01 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-lg font-bold mb-4">{t.gpa.previous}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>{t.gpa.prevGpa}</Label>
                <Input type="number" step="0.01" min="0" max="4" value={prevGpa} onChange={e => setPrevGpa(e.target.value)} className="mt-1.5 focus:ring-accent" />
              </div>
              <div>
                <Label>{t.gpa.prevHours}</Label>
                <Input type="number" min="0" value={prevHours} onChange={e => setPrevHours(e.target.value)} className="mt-1.5 focus:ring-accent" />
              </div>
            </div>
          </motion.section>

          {/* Current semester */}
          <motion.section 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.05 }} 
            whileHover={{ scale: 1.01 }}
            className="glass rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{t.gpa.current}</h2>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" onClick={addCourse} className="gradient-primary text-primary-foreground shadow-gold">
                  <Plus className="h-4 w-4 mr-1.5 rtl:ml-1.5 rtl:mr-0" />
                  {t.gpa.addCourse}
                </Button>
              </motion.div>
            </div>

            <div className="space-y-3">
              {courses.map((c, idx) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="grid grid-cols-12 gap-1.5 sm:gap-2 items-end"
                >
                  <div className="col-span-12 sm:col-span-6">
                    {idx === 0 && <Label className="text-xs">{t.gpa.courseName}</Label>}
                    <Input value={c.name} onChange={e => updateCourse(c.id, { name: e.target.value })} placeholder={`${t.gpa.courseName} ${idx + 1}`} className="mt-1 focus:ring-accent" />
                  </div>
                  <div className="col-span-5 sm:col-span-2">
                    {idx === 0 && <Label className="text-xs">{t.gpa.hours}</Label>}
                    <Input type="number" min="1" max="6" value={c.hours} onChange={e => updateCourse(c.id, { hours: parseInt(e.target.value) || 0 })} className="mt-1 focus:ring-accent" />
                  </div>
                  <div className="col-span-5 sm:col-span-3">
                    {idx === 0 && <Label className="text-xs">{t.gpa.grade}</Label>}
                    <Select value={c.grade} onValueChange={v => updateCourse(c.id, { grade: v })}>
                      <SelectTrigger className="mt-1 focus:ring-accent"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {gradeOptions.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button variant="ghost" size="icon" onClick={() => removeCourse(c.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Right: results */}
        <motion.aside 
          initial={{ opacity: 0, x: 12 }} 
          animate={{ opacity: 1, x: 0 }} 
          whileHover={{ scale: 1.02 }}
          className="lg:sticky lg:top-8 self-start"
        >
          <div className="glass-strong rounded-xl p-6 shadow-elegant border-2 border-accent/20 relative overflow-hidden group">
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
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-black">{t.gpa.results}</div>

              <div className="mt-5 space-y-5">
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="text-sm text-muted-foreground font-medium">{t.gpa.semGpa}</div>
                  <div className="text-4xl md:text-6xl font-black text-accent mt-1 tabular-nums drop-shadow-gold">
                    {result.semesterGpa.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 font-bold">
                    {result.semesterPoints.toFixed(2)} pts / {result.semesterHours} hrs
                  </div>
                </motion.div>

                <div className="border-t border-border pt-5">
                  <div className="text-sm text-muted-foreground font-medium">{t.gpa.newCgpa}</div>
                  <div className="text-3xl md:text-5xl font-black text-foreground mt-1 tabular-nums">
                    {result.newCgpa.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 font-bold">
                    Total: {result.totalHours} hrs
                  </div>
                </div>

                <div className="text-[10px] leading-relaxed text-muted-foreground/60 bg-muted/20 rounded-xl p-4 border border-border">
                  BAU 4.0 scale • Grades: A/A+ = 4.0, A- = 3.75, B+ = 3.5, B = 3.0, ...
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  </motion.div>
  );
}
