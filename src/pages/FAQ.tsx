import React from "react";
import { m } from "framer-motion";
import { usePreferences } from "@/contexts/PreferencesContext";
import PageHeader from "@/components/PageHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  const { lang } = usePreferences();

  const faqs = [
    {
      q: "ما هي منصة مرشد؟",
      a: "منصة مرشد هي المنصة الهندسية الأولى لطلاب جامعة البلقاء التطبيقية، تهدف إلى تسهيل حياة الطالب الأكاديمية وتوفير جميع الموارد والخدمات في مكان واحد."
    },
    {
      q: "كيف يمكنني الوصول إلى ملخصات المواد؟",
      a: "يمكنك الوصول لجميع الملخصات والسنوات السابقة من خلال قسم 'خزانة المواد' في الصفحة الرئيسية أو من خلال القائمة الجانبية."
    },
    {
      q: "هل حساب المعدل في المنصة دقيق؟",
      a: "نعم، حاسبة المعدل مصممة بناءً على نظام جامعة البلقاء التطبيقية لحساب المعدل الفصلي والتراكمي بدقة عالية."
    },
    {
      q: "كيف يمكنني إضافة مواد إلى جدولي؟",
      a: "من خلال قسم 'جدولي'، يمكنك استعراض المواد المتاحة وإضافتها لبناء جدولك الدراسي الخاص ومعرفة أوقات المحاضرات."
    },
    {
      q: "هل المنصة مجانية؟",
      a: "نعم، منصة مرشد هي مبادرة طلابية تطوعية وجميع خدماتها مجانية بالكامل للطلاب."
    }
  ];

  return (
    <div className="w-full min-h-screen py-10 px-4 md:px-8 max-w-4xl mx-auto" dir={lang === "ar" ? "rtl" : "ltr"}>
      <PageHeader 
        title={lang === "ar" ? "الأسئلة الشائعة" : "FAQ"} 
        description={lang === "ar" ? "إجابات لأكثر الأسئلة تكراراً حول منصة مرشد" : "Answers to frequently asked questions"} 
      />
      
      <m.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
              <AccordionTrigger className="text-right text-lg font-bold font-['Cairo']">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-300 font-['Cairo'] leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </m.div>
    </div>
  );
}
