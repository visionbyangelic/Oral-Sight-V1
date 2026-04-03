import { motion } from "framer-motion";
import { User, Mail, Globe, Award, Github, ExternalLink, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const teamMembers = [
  {
    name: "Ayomide Zaccheaus",
    role: "ML Engineer",
    contribution: "Model architecture, training & project lead",
    github: "https://github.com/Zeepaps",
  },
  {
    name: "Angelic Charles",
    role: "Lead Developer & Researcher",
    contribution: "Full-stack development, system architecture, research & deployment",
    github: "https://github.com/visionbyangelic",
  },
  {
    name: "Temitope Adereni",
    role: "Researcher & Documentation Lead",
    contribution: "Documentation & project coordination",
    github: "https://github.com/temitopeogundare2015-blip",
  },
  {
    name: "Sravanthi Perumalollu",
    role: "Contributor",
    contribution: "Research & ideation",
    github: "https://github.com/sravsperum1",
  },
  {
    name: "Ogunyemi Ezekiel Timilehin",
    role: "Contributor",
    contribution: "Research & ideation",
    github: "https://github.com/Zekes-Lab",
  },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-28 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-8">About <span className="gradient-text">OralSight</span></h1>

          {/* Team Section */}
          <div className="glass-card p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Data Raiders</h2>
                <p className="text-sm text-muted-foreground">DataraFlow Internship Programme · 2026</p>
              </div>
            </div>

            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                      {member.orcid && (
                        <p className="text-xs text-muted-foreground">ORCID: {member.orcid}</p>
                      )}
                    </div>
                  </div>
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Supervisor */}
          <div className="glass-card p-6 mb-8">
            <div className="flex items-center gap-3 text-sm">
              <Award className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Supervisor: Winner Emeto</p>
                <p className="text-muted-foreground">DataraFlow Internship Programme 2026</p>
              </div>
            </div>
          </div>

          {/* Project Description */}
          <div className="glass-card p-8">
            <h3 className="font-semibold text-lg mb-4">About the Project</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              OralSight is a research prototype exploring how lightweight convolutional neural networks can be deployed for dental image screening in low-resource settings across Nigeria. The project evaluates three CNN architectures — a custom baseline, MobileNetV2, and ResNet50 — on their ability to classify oral health conditions from patient-uploaded photographs.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              This work addresses the critical gap in accessible dental AI tools for African populations, where oral pigmentation, dietary habits, and disease presentation may differ significantly from Western training datasets. The goal is to empower patients and clinicians with early screening capabilities using nothing more than a smartphone camera.
            </p>
            <a
              href="https://github.com/visionbyangelic/Oral-Sight-V1/tree/main"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border hover:border-primary/40 transition-colors text-sm font-medium"
            >
              <Github className="h-4 w-4 text-primary" />
              View Project on GitHub
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
    <Footer />
  </div>
);

export default About;
