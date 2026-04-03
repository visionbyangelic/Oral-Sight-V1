import { motion } from "framer-motion";
import { ScanEye, FileImage, TrendingUp, User, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const mockScans = [
  { id: 1, date: "2026-03-15", result: "Oral Homogenous Leukoplakia", confidence: 89.6, status: "Review Recommended" },
  { id: 2, date: "2026-03-10", result: "Healthy Tissue", confidence: 94.2, status: "Normal" },
  { id: 3, date: "2026-02-28", result: "Early Caries Detected", confidence: 76.3, status: "Follow-up Required" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Patient Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, Dr. Demo</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: FileImage, label: "Total Scans", value: "3" },
              { icon: TrendingUp, label: "Health Score", value: "72%" },
              { icon: Calendar, label: "Last Scan", value: "Mar 15" },
            ].map((s) => (
              <motion.div
                key={s.label}
                className="glass-card p-5 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <s.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Trend Chart Placeholder */}
          <motion.div
            className="glass-card p-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Oral Health Trend
            </h2>
            <div className="h-40 flex items-end gap-3 px-4">
              {[65, 70, 68, 72, 75, 72].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    className="w-full rounded-t-md bg-primary/60"
                    initial={{ height: 0 }}
                    animate={{ height: `${v * 1.5}px` }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  />
                  <span className="text-[10px] text-muted-foreground">W{i + 1}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Scan History */}
          <div className="glass-card p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <ScanEye className="h-5 w-5 text-primary" />
              Scan History
            </h2>
            <div className="space-y-3">
              {mockScans.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border"
                >
                  <div>
                    <p className="font-medium text-sm">{scan.result}</p>
                    <p className="text-xs text-muted-foreground">{scan.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-secondary">{scan.confidence}%</p>
                    <p className={`text-xs ${scan.status === "Normal" ? "text-secondary" : "text-destructive"}`}>
                      {scan.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
