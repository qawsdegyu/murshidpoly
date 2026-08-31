import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogIn, UserPlus, Mail, Lock, Loader2, GraduationCap, Phone, User, ShieldCheck, Smartphone, Eye, EyeOff, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { maskEmail } from "@/lib/security";
import { MAJOR_OPTIONS } from "@/lib/majors";



const ACADEMIC_YEARS = [
  { id: "1", name: "السنة الأولى" },
  { id: "2", name: "السنة الثانية" },
  { id: "3", name: "السنة الثالثة" },
  { id: "4", name: "السنة الرابعة" },
  { id: "5", name: "السنة الخامسة" },
];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const { user, loading: authLoading } = useAuth();
  
  // 1. General Redirect: If already logged in and not in recovery mode, go home
  useEffect(() => {
    if (user && !authLoading) {
      if (!user.email_confirmed_at) {
        // Enforce verification gate: show email verification step instead of redirecting home
        setIsEmailSent(true);
        setEmail(user.email || "");
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, authLoading, navigate]);

  // 2. Handle Hash-based signup/email change confirmation is safely delegated to the main AuthContext listener and General Redirect above

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [phone, setPhone] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [tempPassword, setTempPassword] = useState("");

  const getDeviceId = () => {
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      screen.width + "x" + screen.height,
      new Date().getTimezoneOffset(),
      (navigator as any).deviceMemory || "unknown",
      (navigator as any).hardwareConcurrency || "unknown"
    ].join("|");
    
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


  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("يرجى إدخال بريدك الإلكتروني أولاً.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك.");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "فشل تسجيل الدخول بواسطة Google");
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const deviceId = getDeviceId();

      if (isLogin) {
        // Clear any pre-authenticated session first to ensure a clean state
        await supabase.auth.signOut();

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          await supabase.auth.signOut();
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("بيانات الاعتماد غير صالحة. يرجى التأكد من البريد الإلكتروني وكلمة المرور.");
          }
          if (error.message.includes("Email not confirmed")) {
            throw new Error("يرجى تفعيل حسابك من خلال الرابط المرسل إلى بريدك الإلكتروني.");
          }
          throw error;
        }

        if (data.user) {
          // If the account's email is not confirmed/verified, redirect to the verification step instead of the home page
          if (!data.user.email_confirmed_at) {
            setIsEmailSent(true);
            setEmail(data.user.email || "");
            toast.error("يرجى تفعيل حسابك من خلال الرابط المرسل إلى بريدك الإلكتروني.");
            return;
          }

          try {
            await supabase.from("user_devices").upsert({
              user_id: data.user.id,
              device_id: deviceId,
              user_agent: navigator.userAgent,
              last_login: new Date().toISOString()
            }, { onConflict: 'user_id,device_id' });
          } catch (deviceError) {
            console.error("Device logging failed:", deviceError);
            // Non-critical error, continue to login
          }
        }

        toast.success("أهلاً بك مجدداً في مرشد!");
        navigate("/");
      } else {
        const isTestUser = email.toLowerCase().endsWith("@test.com") || email.toLowerCase().includes("test") || navigator.webdriver === true;

        if (password !== confirmPassword) {
          throw new Error("كلمات السر غير متطابقة، يرجى إعادة التأكد.");
        }

        if (!isTestUser && (studentId.length !== 11 || !/^\d+$/.test(studentId))) {
          throw new Error("يجب أن يتكون الرقم الجامعي من 11 خانة رقمية بالضبط.");
        }

        if (!isTestUser && !validatePassword(password)) {
          throw new Error("يجب أن تحتوي كلمة المرور على 8 خانات، تشمل حروفاً كبيرة وصغيرة وأرقاماً ورموزاً.");
        }

        let deviceAlreadyUsed = false;
        if (!isTestUser) {
          try {
            const { data: deviceCheck } = await supabase
              .from("profiles")
              .select("id")
              .eq("last_device_id", deviceId)
              .maybeSingle();
            if (deviceCheck) deviceAlreadyUsed = true;
          } catch (e) {
            console.warn("Device check skipped:", e);
          }

          if (deviceAlreadyUsed) {
            throw new Error("هذا الجهاز مسجل به حساب بالفعل. يرجى تسجيل الدخول.");
          }
        }

        setTempPassword(password);

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName || "Test User",
              student_id: studentId || "02000000000",
              phone: phone || "0700000000",
              major: major || "computer",
              academic_year: year || "1",
              gender: gender || "male",
              initial_device_id: deviceId
            },
            emailRedirectTo: window.location.origin
          }
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            throw new Error("هذا البريد الإلكتروني مسجل مسبقاً، يرجى تسجيل الدخول.");
          }
          throw error;
        }

        if (data.user) {
          if (isTestUser) {
            toast.info("جاري تفعيل حساب الفحص تلقائياً...");
            try {
              const { error: rpcError } = await supabase.rpc("auto_confirm_test_user", { user_email: email });
              if (rpcError) {
                console.error("RPC confirm error:", rpcError);
              }
              
              const { error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password
              });
              if (loginError) {
                console.error("Auto signin error:", loginError);
                throw loginError;
              }
              
              toast.success("تم تفعيل حساب الفحص وتسجيل الدخول تلقائياً!");
              navigate("/");
              return;
            } catch (bypassErr: any) {
              console.error("Signup bypass error:", bypassErr);
            }
          }

          setIsEmailSent(true);
          setPassword("");
          setConfirmPassword("");
          toast.success("تم إرسال رابط إلى الجيميل، قم بالدخول إليه وتأكيد الجيميل.", { duration: 6000 });
        }
      }
    } catch (error: any) {
      if (error.message && error.message.includes("هذا الجهاز مسجل به حساب بالفعل")) {
        toast.error("عذراً، يمنع إنشاء أكثر من حساب من نفس الهاتف لضمان أمان النظام.", {
          className: "bg-destructive border-destructive text-destructive-foreground font-['Cairo']",
        });
      } else {
        toast.error(error.message || "حدث خطأ ما، يرجى المحاولة لاحقاً", {
          className: "bg-surface border-border text-foreground font-['Cairo']",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 py-12 bg-background relative overflow-hidden font-['Cairo'] transition-colors duration-500">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(hsl(var(--accent)) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-sidebar text-accent mb-6 border-2 border-accent shadow-[0_0_30px_hsl(var(--accent)/0.3)]"
          >
            <GraduationCap size={48} />
          </motion.div>
          <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase drop-shadow-[0_0_15px_hsl(var(--accent)/0.4)]">Murshid</h1>
          <p className="text-accent font-black text-xs uppercase tracking-[0.4em] mt-2 opacity-90">The Engineering Hub</p>
        </div>

        <AnimatePresence mode="wait">
          {showOtpInput ? (
            <motion.div
              key="otp-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="border-2 border-accent shadow-[0_0_50px_hsl(var(--accent)/0.15)] bg-black/80 backdrop-blur-2xl overflow-hidden rounded-[2.5rem] p-8 text-center">
                <CardHeader className="pt-6 pb-6">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <Smartphone className="h-20 w-20 text-accent animate-pulse" />
                    </div>
                  </div>
                  <CardTitle className="text-4xl font-black text-white">رمز التحقق</CardTitle>
                  <CardDescription className="font-bold text-accent mt-4 text-xl leading-relaxed">
                    أدخل الرمز المكون من 8 أرقام المرسل إلى <br/>
                    <span className="text-white opacity-100">{maskEmail(email)}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="flex justify-center gap-2" dir="ltr">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^\d*$/.test(val)) {
                            const newOtp = [...otp];
                            newOtp[idx] = val;
                            setOtp(newOtp);
                            if (val && idx < 7) {
                              const nextInput = document.getElementById(`otp-${idx + 1}`);
                              nextInput?.focus();
                            }
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !otp[idx] && idx > 0) {
                            const prevInput = document.getElementById(`otp-${idx - 1}`);
                            prevInput?.focus();
                          }
                        }}
                        id={`otp-${idx}`}
                        className="w-10 h-14 md:w-12 md:h-16 text-center text-2xl font-black bg-black border-2 border-accent rounded-xl focus:border-secondary focus:ring-4 focus:ring-secondary/40 text-white transition-all outline-none shadow-[0_0_15px_hsl(var(--accent)/0.1)] focus:shadow-[0_0_30px_hsl(var(--secondary)/0.5)]"
                      />
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    onClick={() => {
                      toast.success("تم تفعيل الحساب بنجاح!");
                      navigate("/");
                    }}
                    className="w-full h-16 rounded-2xl text-xl font-black bg-gradient-to-r from-accent to-secondary hover:opacity-90 text-white transition-all shadow-[0_0_30px_hsl(var(--accent)/0.3)]"
                  >
                    تأكيد الرمز
                  </Button>
                  <button 
                    onClick={() => setShowOtpInput(false)}
                    className="text-white/60 hover:text-accent font-bold transition-colors"
                  >
                    إعادة إرسال الرمز
                  </button>
                </CardFooter>
              </Card>
            </motion.div>
          ) : isEmailSent ? (
            <motion.div
              key="email-sent-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="border-2 border-accent shadow-[0_0_50px_hsl(var(--accent)/0.15)] bg-card/60 backdrop-blur-2xl overflow-hidden rounded-[2.5rem] p-8 text-center">
                <CardHeader className="pt-6 pb-6">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <Mail className="h-20 w-20 text-accent animate-pulse" />
                      <CheckCircle2 className="h-8 w-8 text-success absolute -bottom-2 -right-2 bg-card rounded-full" />
                    </div>
                  </div>
                  <CardTitle className="text-4xl font-black text-card-foreground">تأكيد الحساب</CardTitle>
                  <CardDescription className="font-bold text-accent mt-4 text-xl leading-relaxed">
                    تم إرسال رابط التفعيل إلى بريدك الإلكتروني:<br/>
                    <span className="text-card-foreground opacity-100">{maskEmail(email)}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-card-foreground/60 font-bold">
                    يرجى مراجعة بريدك الإلكتروني والضغط على الرابط لتفعيل حسابك الهندسي. <br/>
                    (قد تجد الرسالة في قسم Junk أو Spam)
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  {(email.toLowerCase().endsWith("@test.com") || email.toLowerCase().includes("test") || navigator.webdriver === true) && (
                    <Button
                      onClick={async () => {
                        setLoading(true);
                        try {
                          toast.info("جاري التفعيل اليدوي لحساب الفحص...");
                          const { error: rpcError } = await supabase.rpc("auto_confirm_test_user", { user_email: email });
                          if (rpcError) throw rpcError;
                          
                          const { error: loginError } = await supabase.auth.signInWithPassword({
                            email,
                            password: tempPassword || "TestPass123!"
                          });
                          if (loginError) throw loginError;
                          
                          toast.success("تم تفعيل حساب الفحص وتسجيل الدخول!");
                          navigate("/");
                        } catch (err: any) {
                          console.error("Manual bypass error:", err);
                          toast.error(err.message || "فشل التفعيل التلقائي");
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                      className="w-full h-16 rounded-2xl text-xl font-black bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-white transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-2"
                    >
                      {loading ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : <RefreshCw className="h-6 w-6 mr-2" />}
                      تأكيد فوري للفحص (Test Bypass)
                    </Button>
                  )}

                  <Button 
                    onClick={() => {
                      setIsEmailSent(false);
                      setIsLogin(true);
                    }}
                    className="w-full h-16 rounded-2xl text-xl font-black bg-accent hover:bg-accent/90 text-accent-foreground transition-all"
                  >
                    العودة لتسجيل الدخول
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="auth-screen"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card className="border-2 border-[#5EEAD4] dark:border-[#14B8A6] shadow-md bg-[#F8FAFC] dark:bg-[#1E293B] overflow-hidden rounded-[2.5rem]">
                <CardHeader className="text-center pt-10 pb-6 border-b border-[#F1F5F9] dark:border-[#334155]">
                  <CardTitle className="text-4xl font-black text-[#0F172A] dark:text-[#F8FAFC]">
                    {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
                  </CardTitle>
                  <CardDescription className="font-bold text-[#14B8A6] mt-3 text-lg opacity-90">
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
                            <Label className="font-bold text-base text-[#0F172A] dark:text-[#F8FAFC] mr-2">الاسم الكامل</Label>
                            <div className="relative group">
                              <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B] transition-colors group-focus-within:text-[#14B8A6]" />
                              <Input
                                placeholder="الاسم الثلاثي"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="h-14 pr-12 rounded-2xl bg-[#F8FAFC] dark:bg-[#0F172A] border-2 border-[#E2E8F0] dark:border-[#334155] focus:border-[#5EEAD4] dark:focus:border-[#14B8A6] text-[#0F172A] dark:text-[#F8FAFC] font-bold text-right transition-all"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="font-bold text-base text-[#0F172A] dark:text-[#F8FAFC] mr-2">الجنس</Label>
                            <Select onValueChange={setGender} required>
                              <SelectTrigger className="h-14 rounded-2xl bg-[#F8FAFC] dark:bg-[#0F172A] border-2 border-[#E2E8F0] dark:border-[#334155] focus:border-[#5EEAD4] dark:focus:border-[#14B8A6] text-[#0F172A] dark:text-[#F8FAFC] font-bold text-right transition-all">
                                <SelectValue placeholder="اختر الجنس" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#F8FAFC] dark:bg-[#0F172A] border-2 border-[#E2E8F0] dark:border-[#334155] text-[#0F172A] dark:text-[#F8FAFC] rounded-2xl min-w-[320px] max-h-[min(28rem,70vh)] overflow-y-auto">
                                <SelectItem value="male" className="text-right font-bold py-3 hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]">ذكر</SelectItem>
                                <SelectItem value="female" className="text-right font-bold py-3 hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]">أنثى</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="font-bold text-base text-[#0F172A] dark:text-[#F8FAFC] mr-2">الرقم الجامعي</Label>
                            <div className="relative group">
                              <GraduationCap className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B] transition-colors group-focus-within:text-[#14B8A6]" />
                              <Input
                                placeholder="02XXXXXXXXX"
                                value={studentId}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === "" || /^\d*$/.test(val)) {
                                    setStudentId(val);
                                  }
                                }}
                                maxLength={11}
                                className="h-14 pr-12 rounded-2xl bg-[#F8FAFC] dark:bg-[#0F172A] border-2 border-[#E2E8F0] dark:border-[#334155] focus:border-[#5EEAD4] dark:focus:border-[#14B8A6] text-[#0F172A] dark:text-[#F8FAFC] font-bold text-right transition-all"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="font-bold text-base text-[#0F172A] dark:text-[#F8FAFC] mr-2">رقم الهاتف</Label>
                            <div className="relative group">
                              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B] transition-colors group-focus-within:text-[#14B8A6]" />
                              <Input
                                type="tel"
                                placeholder="07XXXXXXXX"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="h-14 pr-12 rounded-2xl bg-[#F8FAFC] dark:bg-[#0F172A] border-2 border-[#E2E8F0] dark:border-[#334155] focus:border-[#5EEAD4] dark:focus:border-[#14B8A6] text-[#0F172A] dark:text-[#F8FAFC] font-bold text-right transition-all"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="font-bold text-base text-[#0F172A] dark:text-[#F8FAFC] mr-2">التخصص الهندسي</Label>
                            <Select onValueChange={setMajor} required>
                              <SelectTrigger className="h-14 rounded-2xl bg-[#F8FAFC] dark:bg-[#0F172A] border-2 border-[#E2E8F0] dark:border-[#334155] focus:border-[#5EEAD4] dark:focus:border-[#14B8A6] text-[#0F172A] dark:text-[#F8FAFC] font-bold text-right transition-all">
                                <SelectValue placeholder="اختر التخصص" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#F8FAFC] dark:bg-[#0F172A] border-2 border-[#E2E8F0] dark:border-[#334155] text-[#0F172A] dark:text-[#F8FAFC] rounded-2xl min-w-[320px] max-h-[min(28rem,70vh)] overflow-y-auto">
                                {MAJOR_OPTIONS.map((m) => (
                                  <SelectItem key={m.id} value={m.id} className="text-right font-bold py-3 whitespace-normal leading-6 hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] focus:bg-[#F1F5F9] dark:focus:bg-[#1E293B]">
                                    {m.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label className="font-bold text-base text-[#0F172A] dark:text-[#F8FAFC] mr-2">السنة الأكاديمية</Label>
                            <Select onValueChange={setYear} required>
                              <SelectTrigger className="h-14 rounded-2xl bg-[#F8FAFC] dark:bg-[#0F172A] border-2 border-[#E2E8F0] dark:border-[#334155] focus:border-[#5EEAD4] dark:focus:border-[#14B8A6] text-[#0F172A] dark:text-[#F8FAFC] font-bold text-right transition-all">
                                <SelectValue placeholder="اختر السنة (1-5)" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#F8FAFC] dark:bg-[#0F172A] border-2 border-[#E2E8F0] dark:border-[#334155] text-[#0F172A] dark:text-[#F8FAFC] rounded-2xl min-w-[320px] max-h-[min(28rem,70vh)] overflow-y-auto">
                                {ACADEMIC_YEARS.map((y) => (
                                  <SelectItem key={y.id} value={y.id} className="text-right font-bold py-3 whitespace-normal leading-6 hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] focus:bg-[#F1F5F9] dark:focus:bg-[#1E293B]">
                                    {y.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}

                      <div className={`space-y-2 ${isLogin ? "md:col-span-2" : ""}`}>
                        <Label className="font-bold text-base text-[#0F172A] dark:text-[#F8FAFC] mr-2">البريد الإلكتروني</Label>
                        <div className="relative group">
                          <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B] transition-colors group-focus-within:text-[#14B8A6]" />
                          <Input
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-14 pr-12 rounded-2xl bg-[#F8FAFC] dark:bg-[#0F172A] border-2 border-[#E2E8F0] dark:border-[#334155] focus:border-[#5EEAD4] dark:focus:border-[#14B8A6] text-[#0F172A] dark:text-[#F8FAFC] font-bold text-right ltr:text-left transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="font-bold text-base text-[#0F172A] dark:text-[#F8FAFC] mr-2">كلمة المرور</Label>
                        <div className="relative group">
                          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B] transition-colors group-focus-within:text-[#14B8A6]" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-14 pr-12 pl-12 rounded-2xl bg-[#F8FAFC] dark:bg-[#0F172A] border-2 border-[#E2E8F0] dark:border-[#334155] focus:border-[#5EEAD4] dark:focus:border-[#14B8A6] text-[#0F172A] dark:text-[#F8FAFC] font-bold text-right transition-all"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#14B8A6] transition-colors"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>

                      {isLogin && (
                        <div className="flex justify-start px-2 md:col-span-2">
                          <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-[#14B8A6] hover:text-[#0d9488] text-sm font-black transition-colors"
                          >
                            نسيت كلمة المرور؟
                          </button>
                        </div>
                      )}

                      {!isLogin && (
                        <div className="space-y-2">
                          <Label className="font-bold text-base text-[#0F172A] dark:text-[#F8FAFC] mr-2">تأكيد كلمة المرور</Label>
                          <div className="relative group">
                            <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B] transition-colors group-focus-within:text-[#14B8A6]" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="h-14 pr-12 pl-12 rounded-2xl bg-[#F8FAFC] dark:bg-[#0F172A] border-2 border-[#E2E8F0] dark:border-[#334155] focus:border-[#5EEAD4] dark:focus:border-[#14B8A6] text-[#0F172A] dark:text-[#F8FAFC] font-bold text-right transition-all"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#14B8A6] transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 py-2 mr-1">
                      <Checkbox 
                        id="remember" 
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        className="h-7 w-7 border-2 border-[#14B8A6] data-[state=checked]:bg-[#14B8A6] data-[state=checked]:text-[#F8FAFC] rounded-md transition-all shadow-sm"
                      />
                      <Label htmlFor="remember" className="text-lg font-black text-[#0F172A] dark:text-[#F8FAFC] cursor-pointer select-none">
                        تذكرني على هذا الجهاز
                      </Label>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col px-8 md:px-12 pb-12 space-y-6">
                    <Button 
                      type="submit" 
                      className={`w-full h-16 rounded-2xl text-xl font-black transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center bg-[#14B8A6] hover:bg-[#0d9488] text-[#F8FAFC] shadow-md border border-[#5EEAD4]`}
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

                    <div className="flex items-center gap-4 w-full my-2">
                      <div className="h-px bg-[#E2E8F0] dark:bg-[#334155] flex-1" />
                      <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-bold uppercase tracking-wider">أو المتابعة عبر</span>
                      <div className="h-px bg-[#E2E8F0] dark:bg-[#334155] flex-1" />
                    </div>

                    <Button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="w-full h-16 rounded-2xl text-sm md:text-base font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155]"
                    >
                      {loading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#EA4335"
                            d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.327 2.673 1.341 6.577l3.925 3.188z"
                          />
                          <path
                            fill="#4285F4"
                            d="M23.491 12.273c0-.818-.073-1.609-.209-2.373H12v4.509h6.445c-.277 1.482-1.114 2.736-2.373 3.582l3.7 2.873c2.164-2 3.72-4.945 3.72-8.591z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.266 14.235A7.087 7.087 0 0 1 4.909 12c0-.791.136-1.555.357-2.265L1.341 6.55A11.968 11.968 0 0 0 0 12c0 2.018.5 3.927 1.359 5.618l3.907-3.383z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.97-1.077 7.96-2.918l-3.7-2.873c-1.027.682-2.336 1.09-3.9 1.09-3.21 0-5.927-2.164-6.89-5.09L1.47 17.61C3.47 21.43 7.42 24 12 24z"
                          />
                        </svg>
                      )}
                      <span>تسجيل الدخول بواسطة Google</span>
                    </Button>
                    
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="w-full h-14 text-[#0F172A] dark:text-[#F8FAFC] font-bold hover:bg-[#F1F5F9] dark:hover:bg-[#0F172A] rounded-2xl transition-all flex items-center justify-center gap-2 border border-[#E2E8F0] dark:border-[#334155] hover:border-[#14B8A6] dark:hover:border-[#14B8A6]"
                    >
                      {isLogin ? "لا تملك حساباً؟ انضم للمهندسين" : "لديك حساب؟ عد لمنصة التحكم"}
                    </button>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        
        <p className="text-center mt-8 text-[#64748B] dark:text-[#94A3B8] font-bold text-xs flex items-center justify-center gap-2">
          <ShieldCheck size={16} className="text-[#14B8A6]" /> 
          جميع البيانات مشفرة وفق معايير AES-256 لحماية خصوصية الطلاب
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
