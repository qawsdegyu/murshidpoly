import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogIn, UserPlus, Mail, Lock, Loader2, GraduationCap, Phone, User, ShieldCheck, Smartphone, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const deviceId = getDeviceId();

      if (isLogin) {
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
        if (password !== confirmPassword) {
          throw new Error("كلمات السر غير متطابقة، يرجى إعادة التأكد.");
        }

        if (!validatePassword(password)) {
          throw new Error("يجب أن تحتوي كلمة المرور على 8 خانات، تشمل حروفاً كبيرة وصغيرة وأرقاماً ورموزاً.");
        }

        let deviceAlreadyUsed = false;
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
    <div className="min-h-screen flex items-center justify-center p-4 py-12 bg-background relative overflow-hidden font-['Cairo'] transition-colors duration-500">
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
                    <span className="text-white opacity-100">{email}</span>
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
                    <span className="text-card-foreground opacity-100">{email}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-card-foreground/60 font-bold">
                    يرجى مراجعة بريدك الإلكتروني والضغط على الرابط لتفعيل حسابك الهندسي. <br/>
                    (قد تجد الرسالة في قسم Junk أو Spam)
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
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
              <Card className="border-2 border-accent shadow-[0_0_50px_hsl(var(--accent)/0.15)] bg-card/60 backdrop-blur-2xl overflow-hidden rounded-[2.5rem]">
                <CardHeader className="text-center pt-10 pb-6 border-b border-white/10">
                  <CardTitle className="text-4xl font-black text-card-foreground">
                    {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
                  </CardTitle>
                  <CardDescription className="font-bold text-accent mt-3 text-lg opacity-90">
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
                            <Label className="font-bold text-base text-card-foreground mr-2">الاسم الكامل</Label>
                            <div className="relative group">
                              <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent transition-colors group-focus-within:text-foreground" />
                              <Input
                                placeholder="الاسم الثلاثي"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="h-14 pr-12 rounded-2xl bg-black border-2 border-accent focus:border-secondary text-white font-bold text-right transition-all"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="font-bold text-base text-card-foreground mr-2">رقم الهاتف</Label>
                            <div className="relative group">
                              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                              <Input
                                type="tel"
                                placeholder="07XXXXXXXX"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="h-14 pr-12 rounded-2xl bg-black border-2 border-accent focus:border-secondary text-white font-bold text-right transition-all"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="font-bold text-base text-card-foreground mr-2">التخصص الهندسي</Label>
                            <Select onValueChange={setMajor} required>
                              <SelectTrigger className="h-14 rounded-2xl bg-black border-2 border-accent focus:border-secondary text-white font-bold text-right transition-all">
                                <SelectValue placeholder="اختر التخصص" />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-2 border-accent text-card-foreground rounded-2xl">
                                {MAJORS.map((m) => (
                                  <SelectItem key={m.id} value={m.id} className="text-right font-bold py-3 hover:bg-accent/10 focus:bg-accent/20">
                                    {m.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label className="font-bold text-base text-card-foreground mr-2">السنة الأكاديمية</Label>
                            <Select onValueChange={setYear} required>
                              <SelectTrigger className="h-14 rounded-2xl bg-black border-2 border-accent focus:border-secondary text-white font-bold text-right transition-all">
                                <SelectValue placeholder="اختر السنة (1-5)" />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-2 border-accent text-card-foreground rounded-2xl">
                                {ACADEMIC_YEARS.map((y) => (
                                  <SelectItem key={y.id} value={y.id} className="text-right font-bold py-3 hover:bg-accent/10 focus:bg-accent/20">
                                    {y.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}

                      <div className={`space-y-2 ${isLogin ? "md:col-span-2" : ""}`}>
                        <Label className="font-bold text-base text-card-foreground mr-2">البريد الإلكتروني</Label>
                        <div className="relative group">
                          <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                          <Input
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-14 pr-12 rounded-2xl bg-black border-2 border-accent focus:border-secondary text-white font-bold text-right ltr:text-left transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="font-bold text-base text-card-foreground mr-2">كلمة المرور</Label>
                        <div className="relative group">
                          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-14 pr-12 rounded-2xl bg-black border-2 border-accent focus:border-secondary text-white font-bold text-right transition-all"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-accent hover:text-secondary transition-colors"
                          >
                            {showPassword ? <EyeOff size={20} className="text-accent" /> : <Eye size={20} className="text-accent" />}
                          </button>
                        </div>
                      </div>

                      {!isLogin && (
                        <div className="space-y-2">
                          <Label className="font-bold text-base text-card-foreground mr-2">تأكيد كلمة المرور</Label>
                          <div className="relative group">
                            <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="h-14 pr-12 rounded-2xl bg-black border-2 border-accent focus:border-secondary text-white font-bold text-right transition-all"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-accent hover:text-secondary transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff size={20} className="text-accent" /> : <Eye size={20} className="text-accent" />}
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
                        className="h-7 w-7 border-2 border-accent data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground rounded-md transition-all shadow-[0_0_15px_hsl(var(--accent)/0.3)]"
                      />
                      <Label htmlFor="remember" className="text-lg font-black text-card-foreground cursor-pointer select-none">
                        تذكرني على هذا الجهاز
                      </Label>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col px-8 md:px-12 pb-12 space-y-6">
                    <Button 
                      type="submit" 
                      className={`w-full h-16 rounded-2xl text-xl font-black transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center bg-secondary text-white shadow-[0_0_30px_hsl(var(--secondary)/0.3)] hover:shadow-[0_0_40px_hsl(var(--secondary)/0.5)]`}
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
                    
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="w-full h-14 text-card-foreground font-bold hover:bg-white/5 rounded-2xl transition-all flex items-center justify-center gap-2 border-2 border-white/5 hover:border-accent/20"
                    >
                      {isLogin ? "لا تملك حساباً؟ انضم للمهندسين" : "لديك حساب؟ عد لمنصة التحكم"}
                    </button>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        
        <p className="text-center mt-8 text-card-foreground/40 font-bold text-xs flex items-center justify-center gap-2">
          <ShieldCheck size={16} className="text-accent" /> 
          جميع البيانات مشفرة وفق معايير AES-256 لحماية خصوصية الطلاب
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
