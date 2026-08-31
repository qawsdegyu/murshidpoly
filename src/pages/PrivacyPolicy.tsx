import React from "react";
import { m } from "framer-motion";
import { usePreferences } from "@/contexts/PreferencesContext";
import PageHeader from "@/components/PageHeader";

export default function PrivacyPolicy() {
  const { lang } = usePreferences();

  return (
    <div className="w-full min-h-screen py-10 px-4 md:px-8 max-w-4xl mx-auto" dir={lang === "ar" ? "rtl" : "ltr"}>
      <PageHeader 
        title={lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"} 
        description={lang === "ar" ? "كيفية تعاملنا مع بياناتك" : "How we handle your data"} 
      />
      
      <m.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-gray-300 font-['Cairo'] leading-relaxed space-y-6"
      >
        <section>
          <h2 className="text-xl font-bold text-white mb-3">1. جمع البيانات</h2>
          <p>
            نحن في منصة مرشد نقوم بجمع معلوماتك الأساسية التي تقدمها طواعية عند إنشاء حساب، مثل اسمك وتخصصك، بهدف تقديم تجربة مخصصة لك وعرض المواد والإعلانات التي تهمك.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">2. استخدام البيانات</h2>
          <p>
            يتم استخدام بياناتك حصرياً لتحسين خدمات المنصة، ولتسهيل تفاعلك مع الخزانة والخدمات الأكاديمية الأخرى. لا يتم بيع أو مشاركة بياناتك الشخصية مع أي طرف ثالث تحت أي ظرف.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">3. حماية البيانات</h2>
          <p>
            نحن نتخذ كافة الإجراءات التقنية اللازمة لحماية بياناتك من الوصول غير المصرح به، ونعتمد على خدمات سحابية آمنة وموثوقة (Supabase) لتخزين قواعد البيانات الخاصة بالمنصة.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">4. ملفات الارتباط (Cookies)</h2>
          <p>
            نستخدم تقنيات التخزين المحلي (Local Storage) لحفظ تفضيلاتك (مثل اللغة والمظهر الداكن)، ولتوفير تجربة سلسة عند تسجيل الدخول مجدداً.
          </p>
        </section>
      </m.div>
    </div>
  );
}
