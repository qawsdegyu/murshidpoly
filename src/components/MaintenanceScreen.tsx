import React from 'react';
import { motion } from 'framer-motion';
import { Hammer, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePreferences } from '../contexts/PreferencesContext';

interface MaintenanceScreenProps {
  messageAr?: string;
  messageEn?: string;
  expectedReturn?: string;
}

export default function MaintenanceScreen({ 
  messageAr = "هذه الصفحة قيد الصيانة حالياً. سنعود قريباً.", 
  messageEn = "This page is currently under maintenance. We will be back soon.",
  expectedReturn 
}: MaintenanceScreenProps) {
  const { lang, dir } = usePreferences();
  const navigate = useNavigate();
  const isAr = lang === 'ar';

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center" dir={dir}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
        <div className="relative bg-surface border border-primary/20 p-8 rounded-[3rem] shadow-2xl shadow-primary/10">
          <Hammer className="w-20 h-20 text-primary animate-bounce" />
          <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-2 rounded-full shadow-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </motion.div>

      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-black mb-4 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent"
      >
        {isAr ? "تحت الصيانة" : "Under Maintenance"}
      </motion.h2>

      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl text-muted-foreground font-bold max-w-lg mb-8"
      >
        {isAr ? messageAr : messageEn}
      </motion.p>

      {expectedReturn && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 px-6 py-3 bg-accent/5 border border-accent/20 rounded-2xl mb-8"
        >
          <Clock className="w-5 h-5 text-accent" />
          <span className="font-black text-accent">
            {isAr ? "العودة المتوقعة:" : "Expected Return:"} {expectedReturn}
          </span>
        </motion.div>
      )}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={() => navigate('/')}
        className="flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-2xl font-black hover:opacity-90 transition-all shadow-xl active:scale-95"
      >
        <ArrowLeft className={isAr ? "rotate-180" : ""} />
        {isAr ? "العودة للرئيسية" : "Back to Home"}
      </motion.button>
    </div>
  );
}
