import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Bell, Plus, Trash2, Save, MapPin, Clock, User, Download, RefreshCcw, Brain } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { usePreferences } from '../contexts/PreferencesContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface ScheduleItem {
  id: string;
  courseName: string;
  courseNameAr: string;
  instructor: string;
  instructorAr: string;
  room: string;
  startTime: string;
  endTime: string;
  days: number[]; // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu
}

const WEEKDAYS_AR = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];
const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu"];

export default function MySchedule() {
  const { lang } = usePreferences();
  const { user, loading } = useAuth();
  const siteSettings = useSiteSettings();
  const isAr = lang === 'ar';

  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [reminderMinutes, setReminderMinutes] = useState<number>(15);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form states for manual addition
  const [isAdding, setIsAdding] = useState(false);
  const [newCourse, setNewCourse] = useState({
    courseNameAr: '',
    courseNameEn: '',
    instructorAr: '',
    instructorEn: '',
    room: '',
    startTime: '08:00',
    endTime: '09:00',
    days: [] as number[]
  });

  // Load schedule
  useEffect(() => {
    loadSchedule();
  }, [user]);

  const loadSchedule = async () => {
    setIsLoading(true);

    // 1. First, load from localStorage for immediate UI feedback
    const localData = localStorage.getItem('my_schedule_data');
    let currentSchedule: ScheduleItem[] = [];
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed)) {
          currentSchedule = parsed;
          setSchedule(currentSchedule);
        }
      } catch (e) { }
    }

    // 2. Then, handle Supabase sync if user is logged in
    if (user) {
      try {
        const { data, error } = await supabase
          .from('user_schedules')
          .select('schedule_data, updated_at')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data && data.schedule_data && Array.isArray(data.schedule_data)) {
          const remoteSchedule = data.schedule_data as ScheduleItem[];
          const localUpdated = localStorage.getItem('my_schedule_last_updated');
          const remoteUpdated = data.updated_at;

          // Only overwrite local if remote is strictly newer
          if (!localUpdated || new Date(remoteUpdated) > new Date(localUpdated)) {
            setSchedule(remoteSchedule);
            localStorage.setItem('my_schedule_data', JSON.stringify(remoteSchedule));
            if (remoteUpdated) localStorage.setItem('my_schedule_last_updated', remoteUpdated);
          } else if (localUpdated && new Date(localUpdated) > new Date(remoteUpdated)) {
            // Local is newer, push to remote
            await saveSchedule(currentSchedule);
          } else {
            setSchedule(remoteSchedule);
          }
        } else if (currentSchedule.length > 0) {
          // Supabase is empty but we have local data - Push local to remote
          await saveSchedule(currentSchedule);
        }
      } catch (e) {
        console.error("Supabase sync error", e);
      }
    }

    setIsLoading(false);
  };

  const saveSchedule = async (newSchedule: ScheduleItem[]) => {
    setSchedule(newSchedule);
    localStorage.setItem('my_schedule_data', JSON.stringify(newSchedule));
    localStorage.setItem('my_schedule_last_updated', new Date().toISOString());

    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_schedules')
        .upsert({
          user_id: user.id,
          student_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown',
          student_email: user.email,
          schedule_data: newSchedule,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (!error) {
        toast.success(isAr ? "تم حفظ التغييرات في السحابة" : "Changes saved to cloud");
      } else {
        console.error("Supabase upsert error", error);
        toast.error(isAr 
          ? `فشل الحفظ في السحابة: ${error.message}` 
          : `Failed to save to cloud: ${error.message}`
        );
      }
    } catch (e) {
      console.error("Supabase save error", e);
    }
  };

  // Reminder Logic
  useEffect(() => {
    if (!notificationsEnabled || schedule.length === 0) return;

    // Check permissions
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') setNotificationsEnabled(true);
        else setNotificationsEnabled(false);
      });
      return;
    }

    const checkReminders = () => {
      const now = new Date();
      const currentDayIndex = now.getDay(); // 0 is Sunday
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      schedule.forEach(item => {
        if (!(item.days || []).includes(currentDayIndex)) return;

        const [startH, startM] = item.startTime.split(':').map(Number);

        // Calculate diff in minutes
        const nowTotalMins = currentHours * 60 + currentMinutes;
        const startTotalMins = startH * 60 + startM;

        const diff = startTotalMins - nowTotalMins;

        if (diff === reminderMinutes) {
          new Notification(isAr ? "تذكير بمحاضرة قادمة!" : "Upcoming Class Reminder!", {
            body: `${isAr ? item.courseNameAr : item.courseName} - ${isAr ? "تبدأ خلال" : "Starts in"} ${reminderMinutes} ${isAr ? "دقيقة في" : "minutes in"} ${item.room}`,
            icon: '/favicon.ico' // Or your app logo
          });
        }
      });
    };

    // Run every minute
    const interval = setInterval(checkReminders, 60000);
    // Run immediately once
    checkReminders();

    return () => clearInterval(interval);
  }, [schedule, reminderMinutes, notificationsEnabled]);

  const handleAddCourse = async () => {
    if (!newCourse.courseNameAr || newCourse.days.length === 0) {
      toast.error(isAr ? "يرجى تعبئة اسم المادة واختيار الأيام" : "Please fill course name and select days");
      return;
    }

    const newItem: ScheduleItem = {
      id: Math.random().toString(36).substr(2, 9),
      courseName: newCourse.courseNameEn || newCourse.courseNameAr,
      courseNameAr: newCourse.courseNameAr,
      instructor: newCourse.instructorEn || newCourse.instructorAr,
      instructorAr: newCourse.instructorAr,
      room: newCourse.room,
      startTime: newCourse.startTime,
      endTime: newCourse.endTime,
      days: newCourse.days
    };

    const updated = [...schedule, newItem];
    await saveSchedule(updated);
    setIsAdding(false);
    toast.success(isAr ? "تم إضافة المادة" : "Course added");
  };

  const removeCourse = async (id: string) => {
    const updated = schedule.filter(s => s.id !== id);
    await saveSchedule(updated);
    toast.success(isAr ? "تم الحذف" : "Removed");
  };

  const toggleNotification = async () => {
    if (!notificationsEnabled) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setNotificationsEnabled(true);
        toast.success(isAr ? "تم تفعيل الإشعارات" : "Notifications enabled");
      } else {
        toast.error(isAr ? "يرجى السماح بالإشعارات من المتصفح" : "Please allow notifications in browser");
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-[1200px] animate-pulse">
        <PageHeader
          title={isAr ? "جدولي" : "My Schedule"}
          subtitle={isAr ? "جدولك الدراسي المعتمد مع خاصية التذكير بالمحاضرات" : "Your finalized schedule with lecture reminders"}
          icon={<Calendar className="w-8 h-8" />}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="space-y-6">
            <div className="h-48 bg-white/5 border border-white/10 rounded-[2rem]" />
            <div className="h-14 bg-white/5 border border-white/10 rounded-2xl" />
          </div>
          <div className="lg:col-span-2 h-96 bg-white/5 border border-white/10 rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#F8FAFC] dark:from-[#0B1220] via-[#F8FAFC] dark:via-[#111827] to-[#F1F5F9] dark:to-[#0F172A]">
      <div className="container mx-auto px-4 pt-2 md:pt-6 pb-6 max-w-[1200px]">
      <PageHeader
        title={isAr ? "جدولي" : "My Schedule"}
        subtitle={isAr ? "جدولك الدراسي المعتمد مع خاصية التذكير بالمحاضرات" : "Your finalized schedule with lecture reminders"}
        icon={<Calendar className="w-8 h-8" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">

        {/* Settings Sidebar */}
        <div className="space-y-6 order-2 lg:order-1">
          <div className="p-6 rounded-[2rem] bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-sm">
            <h3 className="text-sm font-black mb-6 flex items-center gap-2 text-[#0F172A] dark:text-[#F8FAFC]">
              <Bell className="w-5 h-5 text-[#14B8A6]" />
              {isAr ? "إعدادات التذكير" : "Reminder Settings"}
            </h3>

            <div className="space-y-4">
              <button
                onClick={toggleNotification}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${notificationsEnabled ? 'bg-[#2563EB] text-[#F8FAFC]' : 'bg-[#F1F5F9] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-[#0F172A] dark:text-[#94A3B8]'}`}
              >
                <Bell className="w-4 h-4" />
                {notificationsEnabled ? (isAr ? "الإشعارات مفعلة" : "Notifications On") : (isAr ? "تفعيل الإشعارات" : "Enable Notifications")}
              </button>

              {notificationsEnabled && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <label className="text-xs font-bold text-[#64748B]">{isAr ? "ذكرني قبل:" : "Remind me before:"}</label>
                  <select
                    value={reminderMinutes}
                    onChange={(e) => setReminderMinutes(Number(e.target.value))}
                    className="w-full bg-transparent border border-[#CBD5E1] rounded-xl px-4 py-3 text-sm font-bold appearance-none outline-none text-[#0F172A] focus:border-[#5EEAD4]"
                  >
                    {[5, 10, 15, 30, 60].map(m => (
                      <option className="bg-background text-foreground" key={m} value={m}>
                        {m} {isAr ? "دقيقة" : "minutes"}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <Link to="/schedule" className="w-full relative overflow-hidden p-4 rounded-2xl bg-[#E8FCF9] dark:bg-[#0F172A] border border-[#5EEAD4] dark:border-[#14B8A6] text-[#14B8A6] dark:text-[#14B8A6] font-black text-sm flex items-center justify-center gap-3 hover:bg-[#5EEAD4]/20 dark:hover:bg-[#14B8A6]/20 transition-all shadow-sm group">
              <Brain className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
              <span>{isAr ? "إنشاء جدول باستخدام الذكاء الاصطناعي" : "Create Schedule using AI"}</span>
            </Link>
            {siteSettings.exam_study_planner_enabled !== 'false' && <Link to="/schedule?planner=exams" className="w-full relative overflow-hidden p-4 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/10 border border-indigo-400/50 text-indigo-600 dark:text-indigo-200 font-black text-sm flex items-center justify-center gap-3 hover:bg-indigo-500/20 transition-all shadow-sm group">
              <Calendar className="w-5 h-5 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300" />
              <span>{isAr ? "إنشاء جدول الامتحانات باستخدام الذكاء الاصطناعي" : "Create Exam Schedule using AI"}</span>
            </Link>}
          </div>
          
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="w-full p-4 rounded-2xl border-2 border-dashed border-[#CBD5E1] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] bg-transparent font-black text-sm flex items-center justify-center gap-2 hover:bg-[#E2E8F0] dark:hover:bg-[#0F172A] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-all"
          >
            <Plus className="w-5 h-5" />
            {isAr ? "إضافة مادة يدوياً" : "Add Course Manually"}
          </button>
        </div>

        {/* Main Schedule Area */}
        <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">

          {/* Add Course Form */}
          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 rounded-[2rem] bg-surface/80 backdrop-blur-xl border border-accent/30 shadow-lg mb-6">
                  <h3 className="text-sm font-black mb-4">{isAr ? "إضافة مادة جديدة" : "Add New Course"}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input type="text" placeholder={isAr ? "اسم المادة" : "Course Name"} value={newCourse.courseNameAr} onChange={e => setNewCourse({ ...newCourse, courseNameAr: e.target.value, courseNameEn: e.target.value })} className="col-span-2 bg-background border border-border/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" />
                    <input type="text" placeholder={isAr ? "المدرس" : "Instructor"} value={newCourse.instructorAr} onChange={e => setNewCourse({ ...newCourse, instructorAr: e.target.value, instructorEn: e.target.value })} className="bg-background border border-border/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" />
                    <input type="text" placeholder={isAr ? "القاعة" : "Room"} value={newCourse.room} onChange={e => setNewCourse({ ...newCourse, room: e.target.value })} className="bg-background border border-border/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" />
                    <input type="time" value={newCourse.startTime} onChange={e => setNewCourse({ ...newCourse, startTime: e.target.value })} className="bg-background border border-border/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" />
                    <input type="time" value={newCourse.endTime} onChange={e => setNewCourse({ ...newCourse, endTime: e.target.value })} className="bg-background border border-border/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" />
                  </div>
                  <div className="flex gap-2 mb-6 flex-wrap">
                    {WEEKDAYS_AR.map((day, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const days = newCourse.days.includes(idx) ? newCourse.days.filter(d => d !== idx) : [...newCourse.days, idx];
                          setNewCourse({ ...newCourse, days });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${newCourse.days.includes(idx) ? 'bg-accent text-accent-foreground' : 'bg-background border border-border/20'}`}
                      >
                        {isAr ? day : WEEKDAYS_EN[idx]}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setIsAdding(false)} className="px-5 py-2 rounded-xl text-xs font-bold hover:bg-surface">{isAr ? "إلغاء" : "Cancel"}</button>
                    <button onClick={handleAddCourse} className="px-5 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-black shadow-md hover:opacity-90">{isAr ? "حفظ المادة" : "Save Course"}</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Schedule List */}
          <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-[2.5rem] shadow-sm overflow-hidden p-6 md:p-8">
            {schedule.length === 0 && !isLoading ? (
              <div className="text-center py-20 opacity-50">
                <Calendar className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-black mb-2">{isAr ? "جدولك فارغ" : "Your schedule is empty"}</h3>
                <p className="text-sm font-bold">{isAr ? "قم بتصدير جدول من المخطط الذكي أو أضف مواد يدوياً" : "Export a schedule from the Planner or add manually"}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black text-[#0F172A] dark:text-[#F8FAFC]">{isAr ? "المواد المسجلة" : "Registered Courses"}</h3>
                    <button 
                      onClick={() => loadSchedule()}
                      className="p-1.5 hover:bg-surface rounded-lg text-muted-foreground transition-all"
                      title={isAr ? "تحديث" : "Refresh"}
                    >
                      <RefreshCcw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                    </button>
                  </div>
                  <span className="text-base font-bold text-[#14B8A6]">{schedule.length} {isAr ? "مواد" : "Courses"}</span>
                </div>

                {schedule.map((item) => (
                  <div key={item.id} className="group p-4 rounded-2xl bg-transparent border-b border-[#F1F5F9] dark:border-[#334155] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#F1F5F9] dark:hover:bg-[#0F172A] transition-all">
                    <div>
                      <h4 className="font-black text-base mb-1.5 text-[#0F172A] dark:text-[#F8FAFC]">{isAr ? item.courseNameAr : item.courseName}</h4>
                      <div className="flex flex-wrap gap-4 text-sm text-[#64748B] dark:text-[#94A3B8] font-bold">
                        <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{isAr ? item.instructorAr : item.instructor}</span>
                        <span className="flex items-center gap-1.5 text-[#14B8A6]"><MapPin className="w-4 h-4" />{item.room}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{item.startTime} - {item.endTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        {(item.days || []).map(d => (
                          <span key={d} className="px-2.5 py-1 bg-[#F1F5F9] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] rounded text-xs font-black border border-[#E2E8F0] dark:border-[#334155]">
                            {isAr ? WEEKDAYS_AR[d] : WEEKDAYS_EN[d]}
                          </span>
                        ))}
                      </div>
                      <button onClick={() => removeCourse(item.id)} className="p-2 text-[#CBD5E1] hover:text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded-xl transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
