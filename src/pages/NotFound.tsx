import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Settings, ArrowRight, Home } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";

const NotFound = () => {
  const { lang } = usePreferences();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen items-center justify-center bg-background px-6"
    >
      <div className="text-center max-w-md w-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-8"
        >
          <Settings className="h-24 w-24 text-accent/50" />
        </motion.div>
        
        <h1 className="text-8xl font-black text-foreground mb-4 tracking-tighter">404</h1>
        
        <h2 className="text-2xl font-bold text-foreground mb-4 font-['Cairo']">
          {lang === 'ar' ? 'الصفحة اللي تدور عنها ما وجدناها 🔩' : 'The page you are looking for was not found 🔩'}
        </h2>
        
        <p className="text-muted-foreground mb-12 font-bold leading-relaxed">
          {lang === 'ar' 
            ? 'يبدو أن الرابط الذي حاولت الوصول إليه غير موجود أو تم نقله لمكان آخر.' 
            : 'It seems the link you tried to access does not exist or has been moved.'}
        </p>

        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-2xl font-black shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Home className="h-5 w-5" />
          {lang === 'ar' ? 'ارجع للرئيسية' : 'Return Home'}
          <ArrowRight className={lang === 'ar' ? "rotate-180" : ""} />
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFound;
