import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { usePreferences } from "@/contexts/PreferencesContext";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { lang } = usePreferences();
  const isAr = lang === "ar";

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return minLength && hasUpper && hasLower && hasNumber && hasSymbol;
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(isAr ? "كلمات السر غير متطابقة" : "Passwords do not match");
      return;
    }
    if (!validatePassword(password)) {
      toast.error(isAr 
        ? "يجب أن تحتوي كلمة المرور على 8 خانات، تشمل حروفاً كبيرة وصغيرة وأرقاماً ورموزاً." 
        : "Password must be at least 8 characters, including upper, lower, numbers, and symbols.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      setIsSuccess(true);
      toast.success(isAr ? "تم تحديث كلمة المرور بنجاح!" : "Password updated successfully!");
      
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen grid place-items-center bg-background p-4" dir={isAr ? "rtl" : "ltr"}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md"
        >
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-secondary/20 grid place-items-center">
              <CheckCircle2 className="h-12 w-12 text-secondary animate-bounce" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-foreground">
            {isAr ? "تم التحديث بنجاح!" : "Update Successful!"}
          </h1>
          <p className="text-xl text-muted-foreground font-bold">
            {isAr ? "جاري تحويلك إلى لوحة التحكم..." : "Redirecting to dashboard..."}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center bg-background p-4" dir={isAr ? "rtl" : "ltr"}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-accent shadow-[0_0_50px_hsl(var(--accent)/0.15)] bg-card/60 backdrop-blur-2xl overflow-hidden rounded-[2.5rem]">
          <CardHeader className="text-center pt-10 pb-6 border-b border-white/10">
            <CardTitle className="text-3xl font-black text-card-foreground">
              {isAr ? "تعيين كلمة مرور جديدة" : "Set New Password"}
            </CardTitle>
            <CardDescription className="font-bold text-accent mt-3 text-lg opacity-90">
              {isAr ? "يرجى إدخال كلمة المرور الجديدة والقوية لحسابك" : "Please enter a new strong password for your account"}
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handlePasswordUpdate}>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="font-bold text-base text-card-foreground mr-2">
                  {isAr ? "كلمة المرور الجديدة" : "New Password"}
                </Label>
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-base text-card-foreground mr-2">
                  {isAr ? "تأكيد كلمة المرور" : "Confirm New Password"}
                </Label>
                <div className="relative group">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-8 pt-0">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 rounded-2xl bg-gradient-to-r from-accent to-secondary hover:from-secondary hover:to-accent text-white font-black text-xl shadow-xl shadow-accent/20 transition-all duration-500 transform hover:scale-[1.02] active:scale-95"
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  isAr ? "تحديث ودخول" : "Update & Sign In"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
