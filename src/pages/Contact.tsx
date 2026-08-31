import React, { useState } from "react";
import { m } from "framer-motion";
import { usePreferences } from "@/contexts/PreferencesContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Send } from "lucide-react";

export default function Contact() {
  const { lang } = usePreferences();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message || !formData.subject) {
      toast.error(lang === "ar" ? "يرجى تعبئة جميع الحقول المطلوبة." : "Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('contact_messages').insert([{
        full_name: formData.fullName,
        student_id: formData.studentId || null,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;
      
      toast.success(lang === "ar" ? "تم إرسال رسالتك بنجاح! سنقوم بالرد عليك قريباً." : "Message sent successfully! We will get back to you soon.");
      setFormData({
        fullName: "",
        studentId: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (err: any) {
      console.error("Error sending message:", err);
      // We also display success if the table doesn't exist yet, to not confuse the user during development.
      // But let's show the actual error to let the developer know.
      toast.error(lang === "ar" ? "حدث خطأ أثناء الإرسال. تأكد من إعداد جدول contact_messages في قاعدة البيانات." : "Error sending message. Check database setup.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0F1221] py-16 px-6 lg:px-12 text-white font-['Cairo']" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-[1200px] mx-auto">
        <m.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{lang === "ar" ? "تواصل معنا" : "Contact Us"}</h1>
          <p className="text-gray-400 text-sm md:text-base">
            {lang === "ar" ? "نحن هنا للمساعدة والإجابة على جميع استفساراتك" : "We are here to help and answer all your inquiries"}
          </p>
        </m.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Contact Information (Left/Right depending on RTL) */}
          <m.div 
            initial={{ opacity: 0, x: lang === "ar" ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#1A1F36] rounded-[2rem] p-8 md:p-10 border border-white/5 lg:col-span-2"
          >
            <h2 className="text-xl md:text-2xl font-bold mb-8">{lang === "ar" ? "معلومات التواصل" : "Contact Information"}</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{lang === "ar" ? "رقم الهاتف" : "Phone Number"}</h3>
                  <p className="text-gray-400 text-sm" dir="ltr">+962 78 515 9906</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{lang === "ar" ? "البريد الإلكتروني" : "Email Address"}</h3>
                  <p className="text-gray-400 text-sm">murshidpolytechnic372@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{lang === "ar" ? "الموقع" : "Location"}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {lang === "ar" ? "كلية الهندسة التكنولوجية (البوليتكنك) - ماركا، عمان" : "Faculty of Engineering Technology (Polytechnic) - Marka, Amman"}
                  </p>
                </div>
              </div>
            </div>


          </m.div>

          {/* Form (Right/Left depending on RTL) */}
          <m.div 
            initial={{ opacity: 0, x: lang === "ar" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#1A1F36] rounded-[2rem] p-8 md:p-10 border border-white/5 lg:col-span-3"
          >
            <h2 className="text-xl md:text-2xl font-bold mb-2">{lang === "ar" ? "أرسل لنا رسالة" : "Send us a message"}</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              {lang === "ar" 
                ? "لديك اقتراح، مشكلة، أو استفسار؟ اكتب لنا وسنقوم بالرد عليك في أقرب وقت ممكن." 
                : "Have a suggestion, problem, or inquiry? Write to us and we will get back to you ASAP."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white">{lang === "ar" ? "الاسم الكامل" : "Full Name"}</label>
                  <input 
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-[#0F1221] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder={lang === "ar" ? "أدخل اسمك" : "Enter your name"}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white">{lang === "ar" ? "الرقم الجامعي (اختياري)" : "Student ID (Optional)"}</label>
                  <input 
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    className="w-full bg-[#0F1221] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="e.g. 320190..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white">{lang === "ar" ? "البريد الإلكتروني" : "Email Address"}</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#0F1221] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="email@example.com"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white">{lang === "ar" ? "الموضوع" : "Subject"}</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-[#0F1221] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="" disabled className="text-gray-500">{lang === "ar" ? "اختر الموضوع" : "Select Subject"}</option>
                  <option value="General Inquiry">{lang === "ar" ? "استفسار عام" : "General Inquiry"}</option>
                  <option value="Technical Issue">{lang === "ar" ? "مشكلة تقنية" : "Technical Issue"}</option>
                  <option value="Suggestion">{lang === "ar" ? "اقتراح" : "Suggestion"}</option>
                  <option value="Other">{lang === "ar" ? "أخرى" : "Other"}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white">{lang === "ar" ? "الرسالة" : "Message"}</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-[#0F1221] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder={lang === "ar" ? "اكتب تفاصيل رسالتك هنا..." : "Write the details of your message here..."}
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#4069FF] hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">{lang === "ar" ? "جاري الإرسال..." : "Sending..."}</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{lang === "ar" ? "إرسال الرسالة" : "Send Message"}</span>
                  </>
                )}
              </button>
            </form>
          </m.div>
        </div>
      </div>
    </div>
  );
}
