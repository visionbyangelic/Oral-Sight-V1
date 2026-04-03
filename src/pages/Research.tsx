import { motion } from "framer-motion";
import { BookOpen, Github, ExternalLink, Database, Cpu, BarChart3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Research = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-28 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Research Paper</h1>
          </div>

          <div className="glass-card p-8 mb-8">
            <h2 className="text-xl font-semibold leading-relaxed mb-4">
              AI-Powered Dental Image Screening for Early Detection of Oral Conditions: A Comparative Evaluation of Lightweight CNN Architectures for Low-Resource Settings in Nigeria
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              <span className="text-foreground font-medium">Data Raiders</span> · DataraFlow Internship Programme · February 2026
            </p>
            <p className="text-sm text-muted-foreground">Supervisor: Winner Emeto, DataraFlow</p>
            <p className="text-sm text-muted-foreground">Team Leader: Angelic Charles, DataRaiders</p>
          </div>

          <div className="glass-card p-8 mb-8">
            <h3 className="font-semibold text-lg mb-4">Abstract</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dental health remains a critical yet underserved aspect of healthcare in low-resource settings, particularly in Nigeria. This study presents Oral Sight, an AI-powered dental image screening prototype that evaluates the feasibility of lightweight convolutional neural network (CNN) architectures for classifying oral health conditions from patient-uploaded images. Three models were trained and compared on a publicly available oral lesions dataset (n=261): a custom baseline CNN, MobileNetV2, and ResNet50. MobileNetV2 achieved the highest macro F1-score of 0.63, demonstrating its superior trade-off between accuracy and computational efficiency for low-resource deployment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Database, label: "Dataset", value: "261 samples", desc: "Oral lesions dataset" },
              { icon: Cpu, label: "Best Model", value: "MobileNetV2", desc: "Highest F1-score" },
              { icon: BarChart3, label: "F1-Score", value: "0.63 macro", desc: "On held-out test set" },
            ].map((s) => (
              <div key={s.label} className="glass-card p-5 text-center">
                <s.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="font-bold text-lg">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Resources</h3>
            <div className="space-y-3">
              <a
                href="https://github.com/Zeepaps/Dental-ai-screening-nigeria-Oral-Sight"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border hover:border-primary/40 transition-colors"
              >
                <Github className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">GitHub Repository</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Research;
