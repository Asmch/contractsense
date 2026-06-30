"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldAlert, ArrowRight, Activity } from "lucide-react";

interface PersonalizedHandoffProps {
  healthScore: number;
  mainRecommendation: string;
  highRisksCount: number;
}

export function PersonalizedHandoff({ healthScore, mainRecommendation, highRisksCount }: PersonalizedHandoffProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4"
    >
      <div className="max-w-xl w-full bg-white rounded-3xl p-10 shadow-2xl border border-border/50 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
          Review Complete
        </h2>
        
        <p className="text-lg text-foreground/80 mb-10 leading-relaxed max-w-md mx-auto">
          We've finished reviewing your agreement. We found <strong className="text-foreground">{highRisksCount} clauses</strong> worth discussing before you sign. Let's go through them together.
        </p>

        <div className="w-full grid grid-cols-2 gap-4 mb-10">
          <div className="bg-secondary/5 rounded-2xl p-5 border border-border/50 flex flex-col items-center justify-center">
            <span className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Health
            </span>
            <span className="text-3xl font-bold text-foreground">{healthScore}<span className="text-lg text-muted-foreground">/100</span></span>
          </div>

          <div className="bg-amber-500/5 rounded-2xl p-5 border border-amber-500/10 flex flex-col items-center justify-center">
            <span className="text-[11px] font-bold tracking-widest uppercase text-amber-600 mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> Risks
            </span>
            <span className="text-3xl font-bold text-amber-600">{highRisksCount}</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 text-primary font-medium animate-pulse">
          Opening dashboard <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}
