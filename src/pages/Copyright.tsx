import React from "react";
import { m } from "framer-motion";
import { usePreferences } from "@/contexts/PreferencesContext";
import PageHeader from "@/components/PageHeader";

export default function Copyright() {
  const { lang } = usePreferences();

  return (
    <div className="w-full min-h-screen py-10 px-4 md:px-8 max-w-4xl mx-auto" dir={lang === "ar" ? "rtl" : "ltr"}>
      <PageHeader 
        title={lang === "ar" ? "حقوق النشر والملكية" : "Copyrights"} 
        description={lang === "ar" ? "سياسة الاستخدام وحقوق النشر في منصة مرشد" : "Usage policy and copyrights"} 
      />
      
      <m.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-gray-300 font-['Cairo'] leading-relaxed space-y-6"
      >
        <section>
          <h2 className="text-xl font-bold text-white mb-3">ملكية المحتوى</h2>
          <p>
            المحتوى التعليمي المرفوع على منصة مرشد (ملخصات، دوسيات، أسئلة سنوات) هو جهد للطلاب والمدرسين، ويخضع لحقوق الملكية الفكرية الخاصة بأصحابها. المنصة تعمل كوسيط غير ربحي لتسهيل الوصول لهذه المواد وليست مالكة لها.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">الاستخدام المسموح</h2>
          <p>
            يسمح للطلاب بتحميل ومشاركة المواد التعليمية المتاحة على المنصة لأغراض تعليمية بحتة. يمنع منعاً باتاً استخدام هذه المواد لأغراض تجارية أو بيعها لأي جهة.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">الإبلاغ عن انتهاك</h2>
          <p>
            إذا كنت صاحب محتوى (مدرس أو طالب) وتجد أن مادة معينة تم رفعها دون إذنك، يمكنك التواصل معنا لإزالتها فوراً، ونحن نحترم وندعم حقوق جميع منشئي المحتوى التعليمي.
          </p>
        </section>
      </m.div>
    </div>
  );
}
