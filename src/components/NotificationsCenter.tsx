import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, ExternalLink, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { supabase } from "@/lib/supabase";

type NotificationRow = {
  id: string;
  title_ar: string;
  title_en: string;
  body_ar: string;
  body_en: string;
  link?: string | null;
  payload?: Record<string, any> | null;
  read_at?: string | null;
  created_at: string;
};

export default function NotificationsCenter() {
  const { user } = useAuth();
  const { lang, dir, t } = usePreferences();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isAr = lang === "ar";
  const unreadCount = items.filter(item => !item.read_at).length;

  const load = async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select("id,title_ar,title_en,body_ar,body_en,type,link,payload,read_at,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    setItems((data || []) as NotificationRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    if (!user) return;
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (open && wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const getNotificationLink = (item: NotificationRow) => {
    const payload = item.payload || {};
    const isSectionUpdate = ["section_opened", "new_section", "course_alert"].includes(item.type) || ["section_opened", "new_section", "course_alert"].includes(String(payload.event || payload.kind || ""));
    if (isSectionUpdate) {
      const courseId = payload.course_id || payload.courseId || payload.course_code || payload.courseCode;
      return courseId ? `/schedule?planner=course&auto=1&course=${encodeURIComponent(String(courseId))}` : "/schedule";
    }
    return item.link || "/course-newspaper";
  };

  const markRead = async (item: NotificationRow) => {
    if (item.read_at) return;
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", item.id).eq("user_id", user?.id);
    setItems(prev => prev.map(row => row.id === item.id ? { ...row, read_at: new Date().toISOString() } : row));
  };

  const markAllRead = async () => {
    if (!user || unreadCount === 0) return;
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", user.id).is("read_at", null);
    setItems(prev => prev.map(item => ({ ...item, read_at: item.read_at || new Date().toISOString() })));
  };

  const toggleOpen = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) void markAllRead();
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button type="button" onClick={() => user ? toggleOpen() : navigate("/auth")} className="relative block rounded-full p-2 transition-colors hover:bg-slate-200/50 hover:text-[#14B8A6] focus:outline-none dark:hover:bg-[#1E293B]" aria-label={isAr ? "الإشعارات" : "Notifications"}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}
      </button>
      {open && (
        <div className="absolute left-0 top-full z-[80] mt-2 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] shadow-2xl dark:border-[#334155] dark:bg-[#1E293B]" dir={dir}>
          <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-white/10"><div><h4 className="text-sm font-black">{isAr ? "الإشعارات" : "Notifications"}</h4><p className="mt-1 text-[10px] font-bold text-muted-foreground">{isAr ? "آخر التحديثات والتنبيهات المهمة لك" : "Your latest important updates and alerts"}</p></div><button type="button" onClick={markAllRead} disabled={!unreadCount} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-black text-[#14B8A6] hover:bg-[#14B8A6]/10 disabled:opacity-40"><CheckCheck className="h-3.5 w-3.5" />{isAr ? "قراءة الكل" : "Mark all read"}</button></div>
          <div className="max-h-[360px] overflow-y-auto p-2">
            {loading ? <div className="flex items-center justify-center gap-2 p-8 text-xs font-bold text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />{isAr ? "جاري التحميل..." : "Loading..."}</div> : items.length === 0 ? <div className="flex flex-col items-center gap-3 p-8 text-center"><Bell className="h-7 w-7 text-muted-foreground opacity-40" /><p className="text-sm font-bold">{t.nav.noNotifications}</p><p className="text-[11px] font-bold text-muted-foreground">{isAr ? "تابع مادة أو شعبة من جريدة المواد لتصل تحديثاتها هنا." : "Follow a course or section to receive updates here."}</p></div> : items.map(item => {
              const title = isAr ? item.title_ar : item.title_en;
              const body = isAr ? item.body_ar : item.body_en;
              const content = <div onClick={() => markRead(item)} className={`rounded-xl p-3 transition-colors hover:bg-slate-200/60 dark:hover:bg-white/5 ${!item.read_at ? "bg-[#14B8A6]/10" : ""}`}><div className="flex items-start justify-between gap-3"><p className="text-xs font-black">{title}</p>{!item.read_at && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#14B8A6]" />}</div><p className="mt-1 text-[11px] font-bold leading-5 text-muted-foreground">{body}</p><p className="mt-2 text-[9px] font-bold text-muted-foreground">{new Date(item.created_at).toLocaleString(isAr ? "ar-JO" : "en-US")}</p></div>;
              const targetLink = getNotificationLink(item);
              return <Link key={item.id} to={targetLink} onClick={() => { void markRead(item); setOpen(false); }}>{content}</Link>;
            })}
          </div>
          {items.length > 0 && <Link to="/course-newspaper" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 border-t border-slate-200 p-3 text-xs font-black text-[#14B8A6] dark:border-white/10">{isAr ? "فتح جريدة المواد" : "Open course newspaper"}<ExternalLink className="h-3.5 w-3.5" /></Link>}
        </div>
      )}
    </div>
  );
}
