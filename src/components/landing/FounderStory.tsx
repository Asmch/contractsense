"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, FileText, Scale } from "lucide-react";

export function FounderStory() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-foreground text-background">
      <div className="container mx-auto px-6 max-w-4xl relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-background/20 bg-background/5 text-xs font-semibold tracking-widest uppercase mb-6 text-primary">
            Why ContractSense Exists
          </div>
          
          <h2 className="text-4xl md:text-5xl font-heading font-medium leading-tight max-w-3xl">
            Most founders sign contracts without fully <span className="italic text-primary">understanding</span> what they're agreeing to.
          </h2>

          <div className="space-y-6 text-lg md:text-xl text-background/70 leading-relaxed font-light max-w-3xl">
            <p>
              Winning a new client is exciting. That's exactly when it's easiest to overlook hidden clauses buried inside a lengthy agreement.
            </p>
            <p>
              One unfair clause can affect your payments, intellectual property, liability, or even your ability to exit the contract.
            </p>
            <p>
              Traditional legal reviews are expensive and slow. ContractSense uses AI to explain every clause in plain English, uncover hidden risks, recommend safer alternatives, generate negotiation strategies, compare revisions, and answer questions about your contract instantly.
            </p>
            <p className="font-medium text-background pt-2">
              Every signature deserves complete understanding—not uncertainty.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="pt-6 pb-12 flex flex-wrap items-center gap-4 text-xs font-medium text-background/60">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-background/5 border border-background/10">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Privacy First</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-background/5 border border-background/10">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-background/5 border border-background/10">
              <FileText className="w-4 h-4 text-primary" />
              <span>Explain Every Clause</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-background/5 border border-background/10">
              <Scale className="w-4 h-4 text-primary" />
              <span>Built for Real Contracts</span>
            </div>
          </div>

          {/* Developer Credit */}
          <div className="pt-12 mt-12 border-t border-background/10 flex justify-end text-right">
            <div className="text-[13px] leading-relaxed text-background/50">
              <p className="mb-1 uppercase tracking-wider text-[10px] font-bold text-background/30">Designed & Developed by</p>
              <p className="text-background/80 font-medium text-sm">Asmita Choudhary</p>
              <p>Developer • AI Engineer</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
