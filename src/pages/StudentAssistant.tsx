import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, History, MessageSquarePlus, ShieldCheck, Sparkles } from "lucide-react";
import KnowledgeAssistant from "@/components/KnowledgeAssistant";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { hasFeatureAccess } from "@/components/FeatureGate";

export default function StudentAssistant() {
  const { lang, dir } = usePreferences();
  const { user } = useAuth();
  const settings = useSiteSettings();
  const navigate = useNavigate();
  const [conversationKey, setConversationKey] = useState(0);
  const ar = lang === "ar";
  const allowed = hasFeatureAccess(settings, "ai_assistant", user);

  useEffect(() => {
    if (!allowed) navigate("/", { replace: true });
  }, [allowed, navigate]);

  if (!allowed) return null;

  return (
    <main dir={dir} className="min-h-screen bg-background px-3 pb-6 pt-20 sm:px-5 md:pt-24">
      <div className="mx-auto grid min-h-[calc(100vh-7rem)] w-full max-w-7xl gap-4 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="hidden rounded-3xl border border-border/60 bg-card/80 p-4 shadow-xl lg:flex lg:flex-col">
          <div className="flex items-center gap-3 border-b border-border/60 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 text-white shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black text-foreground">{ar ? "مُرشد الذكي" : "Murshid AI"}</p>
              <p className="text-[11px] font-bold text-muted-foreground">{ar ? "مساعدك الأكاديمي" : "Your academic assistant"}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setConversationKey((key) => key + 1)}
            className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-3 text-xs font-black text-cyan-700 transition hover:-translate-y-0.5 hover:bg-cyan-500/15 dark:text-cyan-200"
          >
            <MessageSquarePlus className="h-4 w-4" />
            {ar ? "محادثة جديدة" : "New conversation"}
          </button>

          <div className="mt-8 space-y-3 text-xs font-bold text-muted-foreground">
            <div className="flex items-center gap-2 rounded-2xl bg-muted/40 px-3 py-3 text-foreground">
              <History className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
              {ar ? "هذه المحادثة" : "This conversation"}
            </div>
            <div className="flex items-start gap-2 px-3 py-2 leading-6">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{ar ? "يبحث في مصادر المواد المعتمدة فقط." : "Searches approved course sources only."}</span>
            </div>
          </div>

          <div className="mt-auto rounded-2xl border border-border/60 bg-muted/30 p-3 text-[11px] font-bold leading-5 text-muted-foreground">
            {ar ? "واجهة مُرشد الذكي مستقلة عن الشات العائم القديم." : "Murshid AI is separate from the legacy floating chat."}
          </div>
        </aside>

        <section className="flex min-h-[calc(100vh-7rem)] min-w-0 flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/70 shadow-2xl">
          <header className="flex items-center justify-between gap-3 border-b border-border/60 bg-card/90 px-4 py-4 backdrop-blur-xl sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 text-white shadow-lg">
                <Bot className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-base font-black text-foreground sm:text-lg">{ar ? "مُرشد الذكي" : "Murshid AI Assistant"}</h1>
                <p className="truncate text-[11px] font-bold text-muted-foreground sm:text-xs">{ar ? "اسأل عن المواد والأنظمة والمصادر الأكاديمية" : "Ask about courses, regulations, and academic sources"}</p>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black text-emerald-700 dark:text-emerald-300 sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              {ar ? "متصل" : "Online"}
            </div>
          </header>

          <div className="min-h-0 flex-1 p-2 sm:p-4">
            <KnowledgeAssistant key={conversationKey} embedded />
          </div>
        </section>
      </div>
    </main>
  );
}
