"use client";

import { Lock, ShieldCheck, Server } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TrustIndicatorsProps {
  phase: number;
}

export function TrustIndicators({ phase }: TrustIndicatorsProps) {
  return (
    <div className="bg-white rounded-2xl border border-border/50 p-5 shadow-sm space-y-4">
      <h3 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">Security Status</h3>
      
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${phase === 0 ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
          {phase === 0 ? <Lock className="w-4 h-4 animate-pulse" /> : <Lock className="w-4 h-4" />}
        </div>
        <div className="flex flex-col">
          <AnimatePresence mode="wait">
            {phase === 0 ? (
              <motion.span 
                key="encrypting"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-sm font-medium text-foreground"
              >
                Encrypting document...
              </motion.span>
            ) : (
              <motion.span 
                key="encrypted"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-sm font-medium text-emerald-600 flex items-center gap-1.5"
              >
                Securely encrypted
              </motion.span>
            )}
          </AnimatePresence>
          <span className="text-xs text-muted-foreground">AES-256 encryption active</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${phase < 2 ? 'bg-secondary/5 text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
          <Server className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className={`text-sm font-medium ${phase < 2 ? 'text-muted-foreground' : 'text-foreground'}`}>
            {phase < 2 ? 'Preparing secure sandbox' : 'Private analysis in progress'}
          </span>
          <span className="text-xs text-muted-foreground">Data isolated from public models</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${phase < 4 ? 'bg-secondary/5 text-muted-foreground' : 'bg-emerald-500/10 text-emerald-600'}`}>
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className={`text-sm font-medium ${phase < 4 ? 'text-muted-foreground' : 'text-foreground'}`}>
            Data Privacy
          </span>
          <span className="text-xs text-muted-foreground">We never train on your data</span>
        </div>
      </div>
    </div>
  );
}
