import React, { useState, useRef } from "react";
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadFile } from "@/lib/storage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label: string;
  name: string;
  folder: string;
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  ar?: boolean;
}

export default function FileUpload({ 
  label, 
  name,
  folder, 
  value, 
  onChange, 
  accept = "image/*", 
  ar = false 
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: Add size limit (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(ar ? "حجم الملف كبير جداً (الحد الأقصى 5MB)" : "File is too large (Max 5MB)");
      return;
    }

    setIsUploading(true);
    const url = await uploadFile(file, folder);
    setIsUploading(false);

    if (url) {
      onChange(url);
      toast.success(ar ? "تم رفع الملف بنجاح" : "File uploaded successfully");
    } else {
      toast.error(ar ? "فشل في رفع الملف" : "Failed to upload file");
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold">{label}</label>
      
      <div 
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={cn(
          "relative min-h-[120px] rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-4",
          value ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/50 hover:bg-surface",
          isUploading && "opacity-70 cursor-wait"
        )}
      >
        {/* Hidden input for the actual file path/URL to be captured by the parent form */}
        <input type="hidden" name={name} value={value || ""} />
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="text-sm font-medium">{ar ? "جاري الرفع..." : "Uploading..."}</span>
          </div>
        ) : value ? (
          <div className="w-full flex flex-col items-center gap-3">
            {accept.includes("image") ? (
              <img src={value} alt="Preview" className="h-24 w-auto rounded-lg shadow-sm object-cover" />
            ) : (
              <div className="flex items-center gap-2 text-primary">
                <FileText className="w-8 h-8" />
                <span className="text-xs truncate max-w-[200px]">{value.split('/').pop()}</span>
              </div>
            )}
            
            <button 
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-colors shadow-sm"
            >
              <X className="w-3 h-3" />
            </button>
            <span className="text-xs text-muted-foreground font-medium">
              {ar ? "انقر لتغيير الملف" : "Click to change file"}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            {accept.includes("image") ? <ImageIcon className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
            <div className="text-center">
              <p className="text-sm font-bold">{ar ? "اسحب وأفلت أو انقر للرفع" : "Drag & drop or click to upload"}</p>
              <p className="text-xs uppercase opacity-60">{accept.replace("/*", "")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
