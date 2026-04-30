import { motion } from "framer-motion";

export default function BrandedLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full">
      <div className="relative">
        {/* Hardware-accelerated Golden Pulse Effect */}
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ willChange: "opacity" }}
          className="absolute inset-0 rounded-full bg-accent blur-[60px] md:blur-[100px]"
        />
        
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative h-24 w-24 rounded-[2rem] bg-gradient-to-br from-primary via-accent to-primary p-[2px] shadow-[0_0_50px_hsl(var(--accent)/0.3)]"
        >
          <div className="flex h-full w-full items-center justify-center rounded-[calc(2rem-2px)] bg-sidebar">
            <motion.span 
              animate={{ 
                textShadow: [
                  "0 0 10px hsl(var(--accent)/0.5)",
                  "0 0 20px hsl(var(--accent)/0.8)",
                  "0 0 10px hsl(var(--accent)/0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl font-black text-accent"
            >
              M
            </motion.span>
          </div>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 flex flex-col items-center"
      >
        <div className="h-[2px] w-48 overflow-hidden rounded-full bg-white/5">
          <motion.div
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-full w-full bg-gradient-to-r from-transparent via-accent to-transparent"
          />
        </div>
        <p className="mt-6 text-[10px] font-black tracking-[0.3em] text-accent/60 uppercase">
          Initializing Murshid Hub
        </p>
      </motion.div>
    </div>
  );
}

