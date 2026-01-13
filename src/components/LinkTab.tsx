import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Link, Download, Sparkles } from "lucide-react";

export const LinkTab = () => {
  const [url, setUrl] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!url.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedUrl(url);
      setIsGenerating(false);
    }, 800);
  };

  const handleDownload = () => {
    const svg = document.getElementById("qr-code-svg");
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
      downloadLink.download = "qr-code.png";
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
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Link size={18} />
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Please paste your URL..."
          className="w-full rounded-xl border border-border bg-secondary/50 px-12 py-4 text-foreground placeholder:text-muted-foreground backdrop-blur-md focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
        />
      </div>

      <Button
        onClick={handleGenerate}
        disabled={!url.trim() || isGenerating}
        className="w-full"
        size="lg"
      >
        {isGenerating ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles size={18} />
          </motion.div>
        ) : (
          <Sparkles size={18} />
        )}
        {isGenerating ? "Generating..." : "Generate QR"}
      </Button>

      <AnimatePresence>
        {generatedUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center gap-4 rounded-xl border border-border bg-secondary/30 p-6 backdrop-blur-md"
          >
            <div className="rounded-xl bg-foreground p-4">
              <QRCodeSVG
                id="qr-code-svg"
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
              Download PNG
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
