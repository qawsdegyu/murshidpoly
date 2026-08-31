import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { PreferencesProvider } from "@/contexts/PreferencesContext";
import App from "./App.tsx";
import "./index.css";
import ErrorBoundary from "@/components/ErrorBoundary";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const handleError = (message: string, error?: any) => {
  console.error("Global Error:", message, error);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding: 40px; color: #ef4444; background: #020617; font-family: 'Cairo', sans-serif; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
      <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 1rem;">System Error</h1>
      <p style="color: #94a3b8; max-width: 600px; margin-bottom: 2rem;">The application failed to load. This usually happens due to missing environment variables or network issues.</p>
      <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; text-align: left; width: 100%; max-width: 800px; border: 1px solid rgba(239, 68, 68, 0.2);">
        <p style="margin: 0 0 10px 0; font-weight: bold;">Error Detail:</p>
        <pre style="white-space: pre-wrap; font-size: 0.8rem; color: #f87171; margin: 0;">${message}</pre>
        ${error?.stack ? `<pre style="white-space: pre-wrap; font-size: 0.7rem; color: #64748b; margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">${error.stack}</pre>` : ''}
      </div>
      <button onclick="window.location.reload()" style="margin-top: 2rem; padding: 12px 24px; background: white; color: black; border: none; border-radius: 8px; font-weight: 800; cursor: pointer;">Try Reloading</button>
    </div>`;
  }
};

window.addEventListener('error', (event) => {
  const message = event.message || "";
  const isChunkError = 
    message.includes("ChunkLoadError") || 
    message.includes("Failed to fetch dynamically imported module") ||
    message.includes("load chunk") ||
    message.includes("Script error");

  if (isChunkError) {
    const lastReload = sessionStorage.getItem("murshid_chunk_reload_time");
    const now = Date.now();
    if (!lastReload || now - parseInt(lastReload) > 10000) {
      sessionStorage.setItem("murshid_chunk_reload_time", now.toString());
      console.warn("Script load failure caught by global error listener. Auto-reloading page...");
      window.location.reload();
      return;
    }
  }

  if (message.includes('ReferenceError') || message.includes('initialization')) {
    handleError(message, event.error);
  }
});

window.addEventListener('unhandledrejection', (event) => {
  const message = event.reason?.message || "";
  const isChunkError = 
    message.includes("ChunkLoadError") || 
    message.includes("Failed to fetch dynamically imported module") ||
    message.includes("load chunk");

  if (isChunkError) {
    const lastReload = sessionStorage.getItem("murshid_chunk_reload_time");
    const now = Date.now();
    if (!lastReload || now - parseInt(lastReload) > 10000) {
      sessionStorage.setItem("murshid_chunk_reload_time", now.toString());
      console.warn("Chunk load failure caught by unhandled rejection listener. Auto-reloading page...");
      window.location.reload();
      return;
    }
  }

  if (message.includes('initialization')) {
    handleError(message, event.reason);
  }
});



createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PreferencesProvider>
            <App />
          </PreferencesProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Register Service Worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then((reg) => console.log('[SW] مسجّل بنجاح:', reg.scope))
      .catch((err) => console.warn('[SW] فشل التسجيل:', err));
  });
}
