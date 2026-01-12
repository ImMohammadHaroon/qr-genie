import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, Image } from "lucide-react";
import { TabButton } from "./TabButton";
import { LinkTab } from "./LinkTab";
import { ImageTab } from "./ImageTab";

type TabType = "link" | "image";

export const QRGenerator = () => {
  const [activeTab, setActiveTab] = useState<TabType>("link");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full max-w-md mx-auto"
    >
      {/* Glow effect behind card */}
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-2xl opacity-50" />
      
      {/* Main Glass Card */}
      <div className="relative rounded-2xl border border-border bg-card backdrop-blur-xl p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-foreground"
          >
            QR Code Generator
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-1 text-sm text-muted-foreground"
          >
            Generate QR codes for URLs or images
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex justify-center border-b border-border">
          <TabButton
            label="Link"
            isActive={activeTab === "link"}
            onClick={() => setActiveTab("link")}
            icon={<Link size={16} />}
          />
          <TabButton
            label="Image"
            isActive={activeTab === "image"}
            onClick={() => setActiveTab("image")}
            icon={<Image size={16} />}
          />
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "link" ? (
            <LinkTab key="link" />
          ) : (
            <ImageTab key="image" />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
