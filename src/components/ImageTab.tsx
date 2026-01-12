import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Upload, Download, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ImageTab = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG or PNG image.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("qr-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("qr-images")
        .getPublicUrl(data.path);

      setUploadedImage(publicUrlData.publicUrl);
      setGeneratedUrl(publicUrlData.publicUrl);
      
      toast({
        title: "Success!",
        description: "Image uploaded and QR code generated.",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleClear = () => {
    setUploadedImage(null);
    setGeneratedUrl("");
    setPreviewUrl(null);
  };

  const handleDownload = () => {
    const svg = document.getElementById("qr-code-image-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "qr-code-image.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {!generatedUrl && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex min-h-[180px] flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed transition-all duration-300 ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border bg-secondary/30 hover:border-primary/50 hover:bg-secondary/50"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 size={32} className="text-primary" />
              </motion.div>
              <p className="text-sm text-muted-foreground">Uploading image...</p>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mt-2 h-16 w-16 rounded-lg object-cover opacity-50"
                />
              )}
            </div>
          ) : (
            <>
              <div className="rounded-full bg-secondary p-4">
                <Upload size={24} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">
                  Drag & drop image here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse (JPEG, PNG)
                </p>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileSelect}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </>
          )}
        </div>
      )}

      <AnimatePresence>
        {generatedUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-lg">
                  <img
                    src={uploadedImage || ""}
                    alt="Uploaded"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ImageIcon size={14} />
                  <span>Image uploaded</span>
                </div>
              </div>
              <button
                onClick={handleClear}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-secondary/30 p-6 backdrop-blur-md">
              <div className="rounded-xl bg-foreground p-4">
                <QRCodeSVG
                  id="qr-code-image-svg"
                  value={generatedUrl}
                  size={180}
                  level="H"
                  includeMargin
                  bgColor="#fafafa"
                  fgColor="#1a1a1a"
                />
              </div>
              <Button onClick={handleDownload} variant="glass" className="gap-2">
                <Download size={16} />
                Download QR
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
