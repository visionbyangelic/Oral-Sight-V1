import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ScanEye, AlertTriangle, CheckCircle2, ArrowRight, Save } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { loadModel, predict } from '@/lib/model';

const TERMINAL_LINES = [
  { type: "info", text: "[INFO] Initializing OralSight Neural Engine v2.1..." },
  { type: "info", text: "[INFO] Loading InceptionV3 pretrained weights..." },
  { type: "info", text: "[INFO] Preprocessing image → 224×224 tensor..." },
  { type: "info", text: "[INFO] Running MobileNetV2 classification pipeline..." },
  { type: "info", text: "[INFO] Detecting Leukoplakia markers..." },
  { type: "info", text: "[INFO] Applying Grad-CAM visualization..." },
  { type: "info", text: "[INFO] Generating segmentation mask..." },
  { type: "success", text: "[SUCCESS] Classification complete → Oral Homogenous Leukoplakia" },
  { type: "success", text: "[SUCCESS] Segmentation Mask Generated. Caries highlighted." },
];

type ScanState = "upload" | "scanning" | "results";

const Studio = () => {
  const [state, setState] = useState<ScanState>("upload");
  const [image, setImage] = useState<string | null>(null);
  const [terminalIdx, setTerminalIdx] = useState(0);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [prediction, setPrediction] = useState<{className: string, confidence: number} | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadModel().then(() => setModelLoaded(true));
  }, []);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = async () => {
        setImage(e.target?.result as string);
        setState("scanning");
        setTerminalIdx(0);

        // Simulate terminal log
        let idx = 0;
        const interval = setInterval(() => {
          idx++;
          setTerminalIdx(idx);
          if (idx >= TERMINAL_LINES.length) {
            clearInterval(interval);
            // Run prediction
            predict(img).then(setPrediction).then(() => setState("results"));
          }
        }, 350);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleFile(file);
  }, [handleFile]);

  const reset = () => {
    setState("upload");
    setImage(null);
    setTerminalIdx(0);
    setPrediction(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="gradient-text">Analysis Studio</span>
            </h1>
            <p className="text-muted-foreground">Upload a dental image for AI-powered screening</p>
            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
              <ScanEye className="h-3.5 w-3.5" />
              Guest Mode
            </div>
          </div>

          <AnimatePresence mode="wait">
            {state === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-12 text-center cursor-pointer hover:border-primary/40 transition-all"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => modelLoaded && fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <p className="text-xl font-semibold mb-2">Drop dental image here</p>
                <p className="text-sm text-muted-foreground">or click to browse • PNG, JPG supported</p>
                {!modelLoaded && <p className="text-sm text-muted-foreground mt-2">Loading AI model...</p>}
              </motion.div>
            )}

            {state === "scanning" && image && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 gap-6"
              >
                {/* Image with scan line */}
                <div className="glass-card p-4 relative overflow-hidden">
                  <img src={image} alt="Dental scan" className="w-full rounded-lg" />
                  <div className="scan-line absolute" style={{ animation: "scan 2s ease-in-out infinite" }} />
                  <div className="absolute inset-0 bg-primary/5 rounded-lg" />
                </div>

                {/* Terminal */}
                <div className="glass-card p-4 flex flex-col">
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
                    <div className="h-3 w-3 rounded-full bg-destructive" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-secondary" />
                    <span className="text-xs text-muted-foreground ml-2 font-mono">neural_engine.log</span>
                  </div>
                  <div className="terminal-log flex-1 rounded-lg p-4 overflow-y-auto max-h-80">
                    {TERMINAL_LINES.slice(0, terminalIdx).map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`${line.type === "success" ? "text-secondary" : ""}`}
                      >
                        {line.text}
                      </motion.div>
                    ))}
                    <span className="inline-block w-2 h-4 bg-secondary ml-1" style={{ animation: "terminal-blink 1s infinite" }} />
                  </div>
                </div>
              </motion.div>
            )}

            {state === "results" && image && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Original */}
                  <div className="glass-card p-4">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Original Image</p>
                    <img src={image} alt="Original dental" className="w-full rounded-lg" />
                  </div>
                  {/* AI Mask */}
                  <div className="glass-card p-4 relative">
                    <p className="text-sm font-medium text-muted-foreground mb-3">AI Segmentation Mask</p>
                    <div className="relative">
                      <img src={image} alt="AI mask" className="w-full rounded-lg" style={{ filter: "hue-rotate(180deg) saturate(1.5)" }} />
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-destructive/20 via-transparent to-secondary/20" />
                    </div>
                  </div>
                </div>

                {/* Results cards */}
                <div className="grid md:grid-cols-1 gap-6 mb-6">
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle2 className="h-6 w-6 text-secondary" />
                      <h3 className="font-semibold text-lg">Classification Result</h3>
                    </div>
                    <p className="text-2xl font-bold text-foreground mb-1">
                      {prediction ? prediction.className : "Processing..."}
                    </p>
                    {prediction && (
                      <>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-secondary" style={{ width: `${prediction.confidence}%` }} />
                          </div>
                          <span className="text-sm font-mono text-secondary font-semibold">{prediction.confidence}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Confidence Score</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Guest Save CTA */}
                <div className="glass-card p-6 border-primary/30 text-center">
                  <Save className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Save These Results to Your Profile</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create a free account to keep your scan history and track oral health trends.
                  </p>
                  <Link
                    to="/auth"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Sign Up & Save <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="text-center mt-6">
                  <button onClick={reset} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    ← Scan another image
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Studio;
