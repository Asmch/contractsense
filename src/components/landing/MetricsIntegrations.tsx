"use client";

import { motion } from "framer-motion";

export function Metrics() {
  return (
    <section className="relative py-16 md:py-24 lg:py-32 bg-primary text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-primary-foreground/20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center pt-8 md:pt-0"
          >
            <div className="text-4xl md:text-5xl lg:text-7xl font-heading font-black tracking-tight mb-3 drop-shadow-md">
              50+
            </div>
            <div className="text-primary-foreground/80 text-xs md:text-sm font-semibold tracking-widest uppercase">Risk Categories Detected</div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-center pt-8 md:pt-0"
          >
            <div className="text-4xl md:text-5xl lg:text-7xl font-heading font-black tracking-tight mb-3 drop-shadow-md">
              AI
            </div>
            <div className="text-primary-foreground/80 text-xs md:text-sm font-semibold tracking-widest uppercase">Plain-English Explanations</div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center pt-8 md:pt-0"
          >
            <div className="text-4xl md:text-4xl lg:text-5xl font-heading font-black tracking-tight mb-3 drop-shadow-md">
              Instant
            </div>
            <div className="text-primary-foreground/80 text-xs md:text-sm font-semibold tracking-widest uppercase">Executive Summaries</div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center pt-8 md:pt-0"
          >
            <div className="text-3xl md:text-3xl lg:text-4xl font-heading font-black tracking-tight mb-3 drop-shadow-md">
              Side-by-Side
            </div>
            <div className="text-primary-foreground/80 text-xs md:text-sm font-semibold tracking-widest uppercase">Contract Comparison</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function Integrations() {
  return (
    <section className="py-16 bg-white overflow-hidden border-t border-border/50">
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-8 flex items-center justify-center gap-2">
          Designed to fit into your workflow
          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full border border-primary/20">Coming Soon</span>
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center text-white font-bold text-xs">▲</div>
            <span className="text-xl font-bold font-heading text-slate-800 tracking-tight">Drive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex flex-wrap gap-[2px]">
              <div className="w-[14px] h-[14px] bg-blue-600 rounded-tl-md"></div>
              <div className="w-[14px] h-[14px] bg-blue-500 rounded-tr-md"></div>
              <div className="w-[14px] h-[14px] bg-blue-400 rounded-bl-md"></div>
              <div className="w-[14px] h-[14px] bg-blue-300 rounded-br-md"></div>
            </div>
            <span className="text-xl font-bold font-heading text-slate-800 tracking-tight">Dropbox</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin-slow"></div>
            <span className="text-xl font-bold font-heading text-slate-800 tracking-tight">OneDrive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center text-white font-bold">DS</div>
            <span className="text-xl font-bold font-heading text-slate-800 tracking-tight">DocuSign</span>
          </div>
        </div>
      </div>
    </section>
  );
}
