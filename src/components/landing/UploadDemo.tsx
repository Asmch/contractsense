"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const ANIMATION_STEPS = [
  { text: "Uploading...", progress: 20 },
  { text: "Analyzing...", progress: 50 },
  { text: "Finding Risks...", progress: 75 },
  { text: "Generating Summary...", progress: 90 },
  { text: "Ready ✓", progress: 100 }
];

export function UploadDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % ANIMATION_STEPS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-white border-t border-border/50 text-center">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10 flex flex-col items-center">
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold mb-6 leading-[1.1] max-w-3xl"
        >
          Stop signing contracts you don't <span className="italic text-primary">fully understand.</span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-2xl"
        >
          Upload a contract and receive an AI-powered legal review, plain-English explanations, safer alternatives, and an executive report—in minutes.
        </motion.p>
        
        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-12"
        >
          {[
            "Contract Summary",
            "Risk Detection",
            "AI Contract Chat",
            "Safer Alternatives",
            "Version Comparison"
          ].map((text, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm font-medium text-foreground">
              <CheckCircle className="w-4 h-4 text-success" />
              {text}
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-2xl bg-white border border-border/50 rounded-3xl p-6 shadow-xl mb-12 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-secondary/10">
            <motion.div 
               className="h-full bg-primary"
               initial={{ width: `${ANIMATION_STEPS[step === 0 ? 0 : step - 1].progress}%` }}
               animate={{ width: `${ANIMATION_STEPS[step].progress}%` }}
               transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
            
            <div className="flex items-center gap-4 text-left">
              <AnimatePresence mode="wait">
                 <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${step === ANIMATION_STEPS.length - 1 ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary animate-pulse'}`}
                 >
                    {step === ANIMATION_STEPS.length - 1 ? <CheckCircle className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                 </motion.div>
              </AnimatePresence>
              <div>
                 <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-1">Live AI Status</div>
                 <AnimatePresence mode="wait">
                    <motion.div
                       key={step}
                       initial={{ opacity: 0, y: 5 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -5 }}
                       className={`font-semibold ${step === ANIMATION_STEPS.length - 1 ? 'text-success' : 'text-foreground'}`}
                    >
                       {ANIMATION_STEPS[step].text}
                    </motion.div>
                 </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link href="/login" className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20">
                Upload Contract
                <Upload className="w-4 h-4" />
              </Link>
              <Link href="/demo" className="w-full sm:w-auto px-6 py-3 rounded-xl bg-secondary/5 text-foreground font-semibold flex items-center justify-center gap-2 transition-all hover:bg-secondary/10 hover:scale-[1.02] active:scale-[0.98] border border-border/50">
                Sample
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest"
        >
          <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-success" /> No credit card required</span>
          <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-primary" /> Free during Beta</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-foreground" /> Private & Encrypted</span>
        </motion.div>

      </div>
    </section>
  );
}
