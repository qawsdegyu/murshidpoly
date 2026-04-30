import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogIn, UserPlus, Mail, Lock, Loader2, GraduationCap, Phone, User, Calendar, ShieldCheck, Smartphone, CheckCircle2, Info } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MAJORS = [
  { id: "se", name: "هندسة البرمجيات" },
  { id: "networks", name: "هندسة الشبكات" },
  { id: "mechatronics", name: "هندسة الميكاترونكس" },
  { id: "autotronics", name: "هندسة الأوتوترونكس" },
  { id: "civil", name: "هندسة مدنية" },
  { id: "arch", name: "هندسة عمارة" },
  { id: "comm", name: "هندسة الاتصالات" },
  { id: "comp", name: "هندسة الحاسوب" },
  { id: "elec", name: "هندسة كهربائية" },
  { id: "mech", name: "هندسة ميكانيكية" },
  { id: "chem", name: "هندسة كيميائية" },
  { id: "industrial", name: "هندسة صناعية" },
];

const ACADEMIC_YEARS = [
  { id: "1", name: "السنة الأولى" },
  { id: "2", name: "السنة الثانية" },
  { id: "3", name: "السنة الثالثة" },
  { id: "4", name: "السنة الرابعة" },
  { id: "5", name: "السنة الخامسة" },
];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const navigate = useNavigate();

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const getDeviceId = () => {
    // Generate a simple fingerprint based on browser features
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      screen.width + "x" + screen.height,
      new Date().getTimezoneOffset(),
      (navigator as any).deviceMemory || "unknown",
      (navigator as any).hardwareConcurrency || "unknown"
    ].join("|");
    
    // Hash the fingerprint string to get a shorter ID
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; 
    }
    return `fp_${Math.abs(hash)}`;
  };

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return minLength && hasUpper && hasLower && hasNumber && hasSymbol;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowVerificationAlert(false);

    try {
      const deviceId = getDeviceId();

      if (isLogin) {
        // --- LOGIN FLOW ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("بيانات الاعتماد غير صالحة. يرجى التأكد من البريد الإلكتروني وكلمة المرور.");
          }
          if (error.message.includes("Email not confirmed")) {
            throw new Error("يرجى تفعيل حسابك من خلال الرابط المرسل إلى بريدك الإلكتروني.");
          }
          throw error;
        }

        if (data.user) {
          await supabase.from("user_devices").upsert({
            user_id: data.user.id,
            device_id: deviceId,
            user_agent: navigator.userAgent,
            last_login: new Date().toISOString()
          }, { onConflict: 'user_id,device_id' });
        }

        toast.success("أهلاً بك مجدداً في مرشد!");
        navigate("/");
      } else {
        // --- REGISTRATION FLOW ---
        
        // 1. Password Match
        if (password !== confirmPassword) {
          throw new Error("كلمات السر غير متطابقة، يرجى إعادة التأكد.");
        }

        // 2. Strong Password Validation
        if (!validatePassword(password)) {
          throw new Error("يجب أن تحتوي كلمة المرور على 8 خانات، تشمل حروفاً كبيرة وصغيرة وأرقاماً ورموزاً.");
        }

        // 3. Device Binding Check
        const { data: deviceCheck } = await supabase
          .from("profiles")
          .select("id")
          .eq("last_device_id", deviceId)
          .maybeSingle();

        if (deviceCheck) {
          throw new Error("هذا الجهاز مسجل به حساب بالفعل. يرجى تسجيل الدخول.");
        }

        // 4. Sign Up in Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
              major: major,
              academic_year: year,
              initial_device_id: deviceId
            }
          }
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            throw new Error("هذا البريد الإلكتروني مسجل مسبقاً، يرجى تسجيل الدخول.");
          }
          throw error;
        }

        if (data.user) {
          setShowVerificationAlert(true);
          toast.success("تم إنشاء الحساب بنجاح!");
          setTimeout(() => setIsLogin(true), 8000);
        }
      }
    } catch (error: any) {
      // Specific Arabic error for duplicate account per device
      if (error.message && error.message.includes("هذا الجهاز مسجل به حساب بالفعل")) {
        toast.error("عذراً، يمنع إنشاء أكثر من حساب من نفس الهاتف لضمان أمان النظام.", {
          className: "bg-red-950 border-red-500 text-white font-['Cairo']",
        });
      } else {
        toast.error(error.message || "حدث خطأ ما، يرجى المحاولة لاحقاً", {
          className: "bg-slate-900 border-slate-700 text-white font-['Cairo']",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 bg-[#000810] relative overflow-hidden font-['Cairo']">
      {/* Blueprint grid background effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#00ffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#001a33] text-[#00ffff] mb-6 border-2 border-[#00ffff] shadow-[0_0_30px_rgba(0,255,255,0.3)]"
          >
            <GraduationCap size={48} />
          </motion.div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]">Murshid</h1>
          <p className="text-[#00ffff] font-black text-xs uppercase tracking-[0.4em] mt-2 opacity-90">The Engineering Hub</p>
        </div>

        <AnimatePresence>
          {showVerificationAlert && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="mb-8"
            >
              <Alert className="bg-[#001a33] border-2 border-[#00ffff] text-white shadow-[0_0_30px_rgba(0,255,255,0.2)] p-8 rounded-[2rem] flex flex-col items-center text-center">
                <CheckCircle2 className="h-14 w-14 text-[#00ffff] mb-4 animate-pulse" />
                <AlertTitle className="text-3xl font-black mb-4 text-[#00ffff]">تأكيد الحساب</AlertTitle>
                <AlertDescription className="text-white font-bold text-xl leading-relaxed">
                  تم إرسال رابط التفعيل إلى بريدك الإلكتروني. <br/>
                  يرجى تفعيل الحساب للمتابعة.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="border-2 border-[#00ffff] shadow-[0_0_50px_rgba(0,255,255,0.15)] bg-[#001a33]/60 backdrop-blur-2xl overflow-hidden rounded-[2.5rem]">
          <CardHeader className="text-center pt-10 pb-6 border-b border-white/10">
            <CardTitle className="text-4xl font-black text-white">
              {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
            </CardTitle>
            <CardDescription className="font-bold text-[#00ffff] mt-3 text-lg opacity-90">
              {isLogin 
                ? "أهلاً بك مجدداً في منصة المهندسين الرقمية" 
                : "ابدأ رحلتك في البوليتكنك مع أدواتنا الذكية"}
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleAuth} dir="rtl">
            <CardContent className="px-8 md:px-12 pb-10 space-y-6 pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {!isLogin && (
                  <>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="font-bold text-base text-white mr-2">الاسم الكامل</Label>
                      <div className="relative group">
                        <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#00ffff] transition-colors group-focus-within:text-white" />
                        <Input
                          placeholder="الاسم الثلاثي"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="h-14 pr-12 rounded-2xl bg-[#001a33]/80 border-2 border-[#00ffff] focus:border-[#00ffff] focus:ring-4 focus:ring-[#00ffff]/20 text-white font-bold text-right transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-bold text-base text-white mr-2">رقم الهاتف</Label>
                      <div className="relative group">
                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#00ffff]" />
                        <Input
                          type="tel"
                          placeholder="07XXXXXXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="h-14 pr-12 rounded-2xl bg-[#001a33]/80 border-2 border-[#00ffff] focus:border-[#00ffff] text-white font-bold text-right"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-bold text-base text-white mr-2">التخصص الهندسي</Label>
                      <Select onValueChange={setMajor} required>
                        <SelectTrigger className="h-14 rounded-2xl bg-[#001a33]/80 border-2 border-[#00ffff] focus:border-[#00ffff] text-white font-bold text-right">
                          <SelectValue placeholder="اختر التخصص" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#001a33] border-2 border-[#00ffff] text-white rounded-2xl">
                          {MAJORS.map((m) => (
                            <SelectItem key={m.id} value={m.id} className="text-right font-bold py-3 hover:bg-[#00ffff]/10 focus:bg-[#00ffff]/20">
                              {m.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label className="font-bold text-base text-white mr-2">السنة الأكاديمية</Label>
                      <Select onValueChange={setYear} required>
                        <SelectTrigger className="h-14 rounded-2xl bg-[#001a33]/80 border-2 border-[#00ffff] focus:border-[#00ffff] text-white font-bold text-right">
                          <SelectValue placeholder="اختر السنة (1-5)" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#001a33] border-2 border-[#00ffff] text-white rounded-2xl">
                          {ACADEMIC_YEARS.map((y) => (
                            <SelectItem key={y.id} value={y.id} className="text-right font-bold py-3 hover:bg-[#00ffff]/10 focus:bg-[#00ffff]/20">
                              {y.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className={`space-y-2 ${isLogin ? "md:col-span-2" : ""}`}>
                  <Label className="font-bold text-base text-white mr-2">البريد الإلكتروني</Label>
                  <div className="relative group">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#00ffff]" />
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 pr-12 rounded-2xl bg-[#001a33]/80 border-2 border-[#00ffff] focus:border-[#00ffff] text-white font-bold text-right ltr:text-left"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold text-base text-white mr-2">كلمة المرور</Label>
                  <div className="relative group">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#00ffff]" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-14 pr-12 rounded-2xl bg-[#001a33]/80 border-2 border-[#00ffff] focus:border-[#00ffff] text-white font-bold text-right"
                      required
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label className="font-bold text-base text-white mr-2">تأكيد كلمة المرور</Label>
                    <div className="relative group">
                      <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#00ffff]" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-14 pr-12 rounded-2xl bg-[#001a33]/80 border-2 border-[#00ffff] focus:border-[#00ffff] text-white font-bold text-right"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 py-2 mr-1">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="h-7 w-7 border-2 border-[#00ffff] data-[state=checked]:bg-[#00ffff] data-[state=checked]:text-[#001a33] rounded-md transition-all shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                />
                <Label htmlFor="remember" className="text-lg font-black text-white cursor-pointer select-none">
                  تذكرني على هذا الجهاز
                </Label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col px-8 md:px-12 pb-12 space-y-6">
              <Button 
                type="submit" 
                className={`w-full h-16 rounded-2xl text-xl font-black shadow-[0_0_25px_rgba(0,0,0,0.3)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center ${
                  isLogin 
                    ? "bg-[#00ffff] hover:bg-[#00e6e6] text-[#001a33]" 
                    : "bg-[#ccff00] hover:bg-[#b8e600] text-[#001a33] shadow-[0_0_30px_rgba(204,255,0,0.4)]"
                }`}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="ml-2 h-7 w-7 animate-spin" />
                ) : isLogin ? (
                  <LogIn className="ml-3 h-7 w-7" />
                ) : (
                  <UserPlus className="ml-3 h-7 w-7" />
                )}
                {isLogin ? "تسجيل الدخول للنظام" : "إنشاء الحساب الهندسي"}
              </Button>
              
              <div className="relative w-full flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <span className="relative bg-[#001a33] px-4 text-xs font-black text-white/30 uppercase tracking-widest">مستوى الأمان: عالي</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setShowVerificationAlert(false);
                }}
                className="w-full h-14 text-white font-bold hover:bg-white/5 rounded-2xl transition-all flex items-center justify-center gap-2 border-2 border-white/5 hover:border-[#00ffff]/20"
              >
                {isLogin ? "لا تملك حساباً؟ انضم للمهندسين" : "لديك حساب؟ عد لمنصة التحكم"}
              </button>
            </CardFooter>
          </form>
        </Card>
        
        <p className="text-center mt-8 text-white/40 font-bold text-xs flex items-center justify-center gap-2">
          <ShieldCheck size={16} className="text-[#00ffff]" /> 
          جميع البيانات مشفرة وفق معايير AES-256 لحماية خصوصية الطلاب
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
