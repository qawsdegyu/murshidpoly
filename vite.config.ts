import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  build: {
    // تقسيم الكود إلى chunks أصغر
    rollupOptions: {
      output: {
        manualChunks: {
          // مكتبات React في chunk منفصل
          'react-vendor': ['react', 'react-dom'],
          // React Router في chunk منفصل
          'router':       ['react-router-dom'],
          // فصل مكتبات الواجهة حتى لا تتجاوز حزمة واحدة حد التحذير
          'icons-vendor':  ['lucide-react'],
          'motion-vendor': ['framer-motion'],
        },
      },
    },
    // ضغط أعلى
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,   // احذف console.log في الإنتاج
        drop_debugger: true,
      },
    },
    // حجم chunk قبل التحذير
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    emptyOutDir: true,
    reportCompressedSize: false,
    sourcemap: false,
  },
  // تحسين الـ resolve
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
