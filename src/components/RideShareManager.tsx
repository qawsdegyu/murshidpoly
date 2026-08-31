import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Trash2, RefreshCw, Car, Clock, MapPin, Users, Phone, Power } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Ride {
  id: string;
  user_id: string;
  driver_name: string;
  phone: string;
  from_location: string;
  to_location: string;
  departure_time: string;
  available_seats: number;
  price_per_seat: number;
  days: string[];
  notes: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export default function RideShareManager() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [isPageEnabled, setIsPageEnabled] = useState(true);

  useEffect(() => { fetchRides(); fetchPageState(); }, []);

  async function fetchPageState() {
    const { data } = await supabase.from('maintenance_mode').select('is_active').eq('page_id', 'rideshare').maybeSingle();
    setIsPageEnabled(!data?.is_active);
  }

  async function togglePageStatus() {
    const newStatus = !isPageEnabled;
    const { error } = await supabase.from('maintenance_mode').upsert({
      page_id: 'rideshare', is_active: !newStatus, updated_at: new Date().toISOString()
    });
    if (error) toast.error("فشل تحديث الحالة");
    else {
      setIsPageEnabled(newStatus);
      toast.success(newStatus ? "تم تفعيل الصفحة للطلاب" : "تم إخفاء الصفحة عن الطلاب");
    }
  }

  async function fetchRides() {
    setLoading(true);
    const { data, error } = await supabase
      .from("ride_shares")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setRides(data);
    setLoading(false);
  }

  async function updateStatus(id: string, status: "approved" | "rejected") {
    const { error } = await supabase.from("ride_shares").update({ status }).eq("id", id);
    if (error) toast.error("فشل التحديث");
    else {
      toast.success(status === "approved" ? "✅ تم قبول الرحلة ونشرها" : "❌ تم رفض الرحلة");
      fetchRides();
    }
  }

  async function deleteRide(id: string) {
    const { error } = await supabase.from("ride_shares").delete().eq("id", id);
    if (error) toast.error("فشل الحذف");
    else { toast.success("تم الحذف"); fetchRides(); }
  }

  const filtered = filter === "all" ? rides : rides.filter(r => r.status === filter);
  const counts = {
    all: rides.length,
    pending: rides.filter(r => r.status === "pending").length,
    approved: rides.filter(r => r.status === "approved").length,
    rejected: rides.filter(r => r.status === "rejected").length,
  };

  if (loading) return <div className="flex justify-center py-16"><RefreshCw className="animate-spin text-primary w-8 h-8" /></div>;

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-primary" />
          <h3 className="font-black text-lg">إدارة مرشد توصيل</h3>
        </div>
        <button onClick={fetchRides} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border/50 text-xs font-black hover:border-primary/30 transition-all">
          <RefreshCw className="w-3.5 h-3.5" />تحديث
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between bg-surface border border-border/50 p-4 rounded-2xl gap-4">
        <div>
          <h4 className="font-black text-lg">حالة صفحة مرشد توصيل</h4>
          <p className="text-xs text-muted-foreground font-bold">عند الإيقاف، ستختفي الصفحة من القائمة الجانبية للطلاب.</p>
        </div>
        <button onClick={togglePageStatus} className={cn("px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 text-white shrink-0", isPageEnabled ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20" : "bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20")}>
          <Power className="w-4 h-4 shrink-0" />
          {isPageEnabled ? "إيقاف وإخفاء الصفحة" : "تفعيل وإظهار الصفحة"}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["pending", "approved", "rejected", "all"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn("px-4 py-2 rounded-xl text-xs font-black transition-all border",
              filter === f
                ? "bg-primary text-white border-primary"
                : "bg-surface border-border/50 text-muted-foreground hover:border-primary/30"
            )}
          >
            {f === "pending" && `⏳ قيد المراجعة (${counts.pending})`}
            {f === "approved" && `✅ مقبول (${counts.approved})`}
            {f === "rejected" && `❌ مرفوض (${counts.rejected})`}
            {f === "all" && `📋 الكل (${counts.all})`}
          </button>
        ))}
      </div>

      {/* Rides List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Car className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-bold">لا توجد رحلات في هذه الفئة</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(ride => (
            <div key={ride.id} className={cn(
              "bg-card border rounded-2xl p-4 space-y-3 transition-all",
              ride.status === "pending" && "border-amber-500/30 bg-amber-500/5",
              ride.status === "approved" && "border-emerald-500/20",
              ride.status === "rejected" && "border-red-500/20 opacity-70",
            )}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-black text-foreground">{ride.driver_name}</p>
                    <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-lg",
                      ride.status === "pending" && "bg-amber-500/20 text-amber-500",
                      ride.status === "approved" && "bg-emerald-500/20 text-emerald-500",
                      ride.status === "rejected" && "bg-red-500/20 text-red-500",
                    )}>
                      {ride.status === "pending" ? "قيد المراجعة" : ride.status === "approved" ? "مقبول" : "مرفوض"}
                    </span>
                  </div>
                  <a href={`tel:${ride.phone}`} className="flex items-center gap-1 text-xs font-bold text-[#14B8A6]">
                    <Phone className="w-3 h-3" />{ride.phone}
                  </a>
                </div>
                <p className="font-black text-primary shrink-0">{ride.price_per_seat} د.أ</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-primary shrink-0" />
                  <span className="truncate">{ride.from_location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-primary shrink-0" />
                  <span dir="ltr">{ride.departure_time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-primary shrink-0" />
                  <span>{ride.available_seats} مقاعد</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ride.days.map(d => <span key={d} className="bg-surface border border-border/40 px-1.5 py-0.5 rounded text-[10px]">{d}</span>)}
                </div>
              </div>

              {ride.notes && (
                <p className="text-xs font-bold text-muted-foreground bg-surface rounded-xl px-3 py-2">
                  📝 {ride.notes}
                </p>
              )}

              <div className="flex items-center gap-2 pt-1 border-t border-border/30">
                {ride.status !== "approved" && (
                  <button onClick={() => updateStatus(ride.id, "approved")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black text-xs hover:bg-emerald-500/20 transition-all">
                    <CheckCircle className="w-4 h-4" />قبول ونشر
                  </button>
                )}
                {ride.status !== "rejected" && (
                  <button onClick={() => updateStatus(ride.id, "rejected")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-black text-xs hover:bg-red-500/20 transition-all">
                    <XCircle className="w-4 h-4" />رفض
                  </button>
                )}
                <button onClick={() => deleteRide(ride.id)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface border border-border/50 text-muted-foreground hover:text-red-500 hover:border-red-500/30 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
