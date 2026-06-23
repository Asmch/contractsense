"use client";

import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export function UploadDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-semibold mb-6">
            Ready to <span className="italic text-primary">understand</span> your next contract?
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Drop a PDF below to see how ContractSense instantly extracts risks and plain-English summaries.
          </p>

          <div className="glass-panel max-w-3xl mx-auto rounded-3xl p-2 relative shadow-2xl">
            <div className="border-2 border-dashed border-border/60 rounded-2xl p-12 bg-white/50 relative overflow-hidden min-h-[300px] flex flex-col items-center justify-center">
              
              {/* Animation States */}
              {step === 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium">Drag & Drop your contract</h3>
                  <p className="text-sm text-muted-foreground mt-2">PDF, DOCX, or plain text</p>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-secondary/5 flex items-center justify-center text-secondary mb-4 animate-pulse">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium">Scanning 48 pages...</h3>
                  <div className="w-48 h-2 bg-secondary/10 rounded-full mt-4 overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.5 }}
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4">
                    <div className="text-2xl font-bold">3</div>
                  </div>
                  <h3 className="text-lg font-medium text-destructive">Critical Risks Found</h3>
                  <p className="text-sm text-muted-foreground mt-2">Unlimited liability, Missing IP assignment...</p>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center text-success mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium text-success">Analysis Complete</h3>
                  <p className="text-sm text-muted-foreground mt-2">Summary and redlines generated in 4.2s</p>
                </motion.div>
              )}

            </div>
          </div>

          <div className="mt-12 flex justify-center">
             <Link href="/login" className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 transition-all hover:bg-primary/90 gold-glow text-lg">
                Start for free
                <ArrowRight className="w-5 h-5" />
              </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
