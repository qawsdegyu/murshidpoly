import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Mail, Phone, MapPin, Copy, MessageCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { faculty, departments } from "@/data/mockData";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

export default function Faculty() {
  const { t, lang } = usePreferences();
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState<string>("all");

  const filtered = useMemo(() => {
    return faculty.filter(f => {
      const matchesQ = !query ||
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.nameAr.includes(query) ||
        f.specialization.toLowerCase().includes(query.toLowerCase()) ||
        f.specializationAr.includes(query);
      const matchesD = dept === "all" || f.department === dept;
      return matchesQ && matchesD;
    });
  }, [query, dept]);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t.faculty.copied);
  };

  const initials = (name: string) =>
    name.replace(/^Dr\.?\s*/i, "").split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div>
      <PageHeader title={t.faculty.title} subtitle={t.faculty.subtitle} icon={<Users className="h-6 w-6" />} />

      {/* Search + filters */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t.faculty.search}
            className="ltr:pl-10 rtl:pr-10 h-12 glass"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDept("all")}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
              dept === "all" ? "bg-primary text-primary-foreground shadow-elegant" : "glass hover:bg-secondary"
            )}
          >
            {t.faculty.all}
          </button>
          {departments.map(d => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                dept === d ? "bg-primary text-primary-foreground shadow-elegant" : "glass hover:bg-secondary"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((f, i) => (
          <motion.article
            key={f.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass rounded-2xl p-6 hover:shadow-elegant hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl gradient-primary grid place-items-center text-accent font-extrabold text-lg shadow-gold">
                {initials(f.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold truncate">{lang === "ar" ? f.nameAr : f.name}</div>
                <div className="text-xs text-muted-foreground">{lang === "ar" ? f.titleAr : f.title}</div>
              </div>
            </div>

            <div className="mt-4 space-y-1.5 text-sm">
              <div className="text-foreground font-medium">{lang === "ar" ? f.specializationAr : f.specialization}</div>
              <div className="text-muted-foreground">{f.department}</div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{t.faculty.office}: <span className="font-mono text-foreground">{f.office}</span></span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => copy(f.email)} className="text-xs">
                <Mail className="h-3.5 w-3.5 ltr:mr-1.5 rtl:ml-1.5" />
                <span className="truncate">Email</span>
                <Copy className="h-3 w-3 ltr:ml-auto rtl:mr-auto opacity-50" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
                if (f.teamsLink) {
                  window.open(f.teamsLink, "_blank");
                } else if (f.phone) {
                  copy(f.phone);
                }
              }} className="text-xs">
                <MessageCircle className="h-3.5 w-3.5 ltr:mr-1.5 rtl:ml-1.5" />
                <span className="truncate">Teams</span>
                <ExternalLink className="h-3 w-3 ltr:ml-auto rtl:mr-auto opacity-50" />
              </Button>
            </div>
          </motion.article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">No professors found.</div>
      )}
    </div>
  );
}
