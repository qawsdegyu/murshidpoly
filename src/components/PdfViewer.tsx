import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Maximize2, Minimize2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

interface PdfViewerProps {
  open: boolean;
  url: string | null;
  title: string;
  onClose: () => void;
}

export default function PdfViewer({ open, url, title, onClose }: PdfViewerProps) {
  const { t } = usePreferences();
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Reset on open
  useEffect(() => {
    if (open) {
      setLoading(true);
      setFullscreen(false);
    }
  }, [open, url]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (fullscreen) setFullscreen(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, fullscreen, onClose]);

  const handleDownload = () => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = title;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <AnimatePresence>
      {open && url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-md grid place-items-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "glass-strong rounded-2xl shadow-elegant border border-border flex flex-col overflow-hidden",
              fullscreen
                ? "fixed inset-2 sm:inset-4 w-auto h-auto"
                : "w-full max-w-5xl h-[85vh]"
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-border bg-card/60">
              <div className="h-9 w-9 rounded-lg gradient-primary grid place-items-center shrink-0">
                <span className="text-accent font-extrabold text-sm">PDF</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate text-sm sm:text-base">{title}</div>
                <div className="text-xs text-muted-foreground">Murshid PDF Reader</div>
              </div>
              <div className="flex items-center gap-1.5">
                <Button size="sm" variant="outline" onClick={handleDownload} className="hidden sm:inline-flex">
                  <Download className="h-4 w-4 ltr:mr-1.5 rtl:ml-1.5" />
                  {t.vault.download}
                </Button>
                <Button size="icon" variant="outline" onClick={handleDownload} className="sm:hidden h-9 w-9" aria-label={t.vault.download}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setFullscreen(f => !f)}
                  className="hidden sm:inline-flex"
                >
                  {fullscreen ? (
                    <><Minimize2 className="h-4 w-4 ltr:mr-1.5 rtl:ml-1.5" />{t.vault.exitFullscreen}</>
                  ) : (
                    <><Maximize2 className="h-4 w-4 ltr:mr-1.5 rtl:ml-1.5" />{t.vault.fullscreen}</>
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setFullscreen(f => !f)}
                  className="sm:hidden h-9 w-9"
                  aria-label={fullscreen ? t.vault.exitFullscreen : t.vault.fullscreen}
                >
                  {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onClose}
                  className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
                  aria-label={t.vault.close}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Viewer */}
            <div className="flex-1 relative bg-muted/30">
              {loading && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
                    Loading PDF...
                  </div>
                </div>
              )}
              <iframe
                key={url}
                src={`${url}#toolbar=1&view=FitH`}
                title={title}
                className="absolute inset-0 w-full h-full"
                onLoad={() => setLoading(false)}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
