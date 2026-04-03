import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ScanEye, Brain, Shield, Activity, ArrowRight, Zap, Layers, BarChart3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  {
    icon: Brain,
    title: "Dual-Pipeline Architecture",
    desc: "Combines image segmentation and classification for comprehensive oral condition screening.",
  },
  {
    icon: Layers,
    title: "MobileNetV2 Backbone",
    desc: "Leverages transfer learning from MobileNetV2 pretrained on ImageNet for effective feature extraction on oral lesion imagery.",
  },
  {
    icon: Zap,
    title: "MobileNetV2 Optimized",
    desc: "Lightweight model achieving highest F1-score, designed for low-resource deployment in Nigeria.",
  },
  {
    icon: Shield,
    title: "Privacy-First",
    desc: "All analysis runs client-side. Your dental images never leave your device.",
  },
];

const stats = [
  { label: "Baseline CNN F1", value: "0.35", color: "text-muted-foreground" },
  { label: "MobileNetV2 F1", value: "0.63", color: "text-secondary" },
  { label: "Dataset Size", value: "261", color: "text-primary" },
  { label: "Architecture", value: "MobileNetV2", color: "text-primary" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(217_91%_60%/0.08),transparent_60%)]" />
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 mb-8">
              <Activity className="h-4 w-4 text-secondary" />
              <span className="text-xs font-medium text-muted-foreground">AI-Powered Dental Screening Research</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Screen Oral Conditions
              <br />
              <span className="gradient-text">With AI Precision</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              A research prototype evaluating lightweight CNN architectures for early detection of oral white lesions — 
              Homogenous Leukoplakia, Non-Homogenous Leukoplakia, and Other Oral White Lesions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all animate-pulse-glow"
              >
                Sign In / Register
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/studio"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-secondary text-secondary font-semibold text-lg hover:bg-secondary/10 transition-all"
              >
                <ScanEye className="h-5 w-5" />
                Quick Scan (Guest)
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            How <span className="gradient-text">OralSight</span> Works
          </motion.h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16">
            A dual-pipeline approach combining segmentation and classification for comprehensive screening.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="glass-card p-6 hover:border-primary/40 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scientific Stats */}
      <section className="py-20 px-4 border-t border-border">
        <div className="container mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Research <span className="gradient-text">Performance</span>
          </motion.h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16">
            Comparative evaluation of lightweight CNN architectures on oral lesion classification.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="glass-card p-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className={`text-3xl md:text-4xl font-bold ${s.color} mb-2`}>{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="glass-card p-8 mt-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              F1-Score Comparison
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Baseline CNN</span>
                  <span>0.35</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-muted-foreground/40" style={{ width: "35%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">MobileNetV2</span>
                  <span className="text-secondary font-semibold">0.63</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-secondary" style={{ width: "63%" }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
