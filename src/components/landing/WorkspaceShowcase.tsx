"use client";

import { motion } from "framer-motion";
import { ArrowRightLeft, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { useEffect, useState } from "react";

function AnimatedCounter({ end, duration = 2 }: { end: number, duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <>{count}</>;
}

export function WorkspaceShowcase() {
  return (
    <section className="relative py-16 md:py-24 lg:py-32 bg-secondary/5 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-7xl text-center mb-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary tracking-widest uppercase mb-6"
        >
          Workspace
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-4 max-w-4xl mx-auto leading-tight"
        >
          Everything you need to review, negotiate, compare, and manage contracts—from a single AI workspace.
        </motion.h2>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Floating Notification Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2.5, type: "spring" }}
          className="absolute -top-6 -right-6 md:top-4 md:-right-12 z-50 bg-white border border-border/50 shadow-xl rounded-xl px-4 py-3 flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-success" />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">Negotiation Complete</div>
            <div className="text-xs text-muted-foreground">Draft ready for review</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-2xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 min-w-[1000px] border border-border/50 bg-white/40">
            
            {/* Portfolio Safety */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-panel border-border/50 rounded-2xl p-6 bg-white/70 shadow-sm relative overflow-hidden"
            >
              <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-6">Portfolio Safety</h3>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary/10" />
                    <motion.circle 
                      cx="80" cy="80" r="70" 
                      fill="none" stroke="currentColor" 
                      strokeWidth="8" 
                      strokeDasharray="440" 
                      initial={{ strokeDashoffset: 440 }}
                      whileInView={{ strokeDashoffset: 440 - (440 * 84) / 100 }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                      className="text-primary" 
                    />
                  </svg>
                  <div className="text-center">
                    <div className="text-5xl font-heading font-medium text-foreground">
                       <AnimatedCounter end={84} duration={2} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 tracking-widest uppercase font-bold">Safety</div>
                  </div>
                </div>
                <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 2.2 }}
                   className="mt-6 text-sm font-bold text-success flex items-center gap-1 bg-success/10 px-3 py-1 rounded-full"
                >
                  ▲ 6 pts <span className="text-success/70 font-medium ml-1">vs last 30 days</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Risk Breakdown */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="glass-panel border-border/50 rounded-2xl p-6 bg-white/70 shadow-sm"
            >
              <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-6">Risk Breakdown</h3>
              <div className="space-y-6">
                {[
                  { label: "Liability & Indemnity", value: 72, color: "bg-destructive" },
                  { label: "Payment Terms", value: 48, color: "bg-warning" },
                  { label: "Confidentiality", value: 22, color: "bg-success" },
                  { label: "Termination", value: 36, color: "bg-warning" },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span className="text-foreground">{item.label}</span>
                      <span className="text-muted-foreground font-bold">{item.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.8 + i * 0.2, ease: "easeOut" }}
                        className={`h-full ${item.color} rounded-full`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contract Comparison Widget */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="glass-panel border-border/50 rounded-2xl p-6 bg-white/70 shadow-sm md:col-span-2 flex flex-col"
            >
              <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-6 flex items-center justify-between">
                Contract Comparison
                <ArrowRightLeft className="w-4 h-4 text-primary" />
              </h3>
              
              <div className="flex items-center justify-between mb-6">
                <div className="px-3 py-1.5 rounded-md bg-secondary/5 border border-border/50 text-xs font-medium text-muted-foreground">Original Draft</div>
                <div className="h-px flex-1 bg-border/50 mx-4 relative">
                   <motion.div 
                     initial={{ width: 0 }}
                     whileInView={{ width: "100%" }}
                     viewport={{ once: true }}
                     transition={{ duration: 1.5, delay: 1 }}
                     className="absolute inset-0 bg-primary/30"
                   />
                </div>
                <div className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-xs font-bold text-primary">Redlined Version</div>
              </div>

              <div className="space-y-4 flex-1">
                {/* Diff Block 1 */}
                <div className="bg-white border border-border/50 rounded-xl overflow-hidden shadow-sm">
                   <div className="bg-secondary/5 px-4 py-2 border-b border-border/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Payment Terms
                   </div>
                   <div className="px-4 py-3 flex flex-col gap-2">
                     <div className="flex gap-3 text-sm items-center bg-destructive/5 px-2 py-1 rounded border border-destructive/10 text-destructive line-through">
                        <span className="font-mono font-bold">-</span>
                        Net 90 Days
                     </div>
                     <div className="flex gap-3 text-sm items-center bg-success/10 px-2 py-1 rounded border border-success/20 text-success font-medium">
                        <span className="font-mono font-bold">+</span>
                        Net 30 Days
                     </div>
                   </div>
                </div>
                
                {/* Diff Block 2 */}
                <div className="bg-white border border-border/50 rounded-xl overflow-hidden shadow-sm">
                   <div className="bg-secondary/5 px-4 py-2 border-b border-border/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Liability Cap
                   </div>
                   <div className="px-4 py-3 flex flex-col gap-2">
                     <div className="flex gap-3 text-sm items-center bg-destructive/5 px-2 py-1 rounded border border-destructive/10 text-destructive line-through">
                        <span className="font-mono font-bold">-</span>
                        Unlimited liability for all claims
                     </div>
                     <div className="flex gap-3 text-sm items-center bg-success/10 px-2 py-1 rounded border border-success/20 text-success font-medium">
                        <span className="font-mono font-bold">+</span>
                        Capped at trailing 12-months fees
                     </div>
                   </div>
                </div>
              </div>
            </motion.div>

            {/* AI Activity Feed */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
              className="glass-panel border-border/50 rounded-2xl p-6 bg-white/70 shadow-sm md:col-span-2 xl:col-span-4"
            >
              <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-6 flex items-center justify-between">
                Live AI Activity
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Executive Summary Generated", time: "Just now", icon: <Info className="w-4 h-4 text-primary" />, color: "bg-primary/10" },
                  { title: "6 High Risk Clauses Found", time: "1 min ago", icon: <AlertTriangle className="w-4 h-4 text-destructive" />, color: "bg-destructive/10" },
                  { title: "Alternative Clauses Suggested", time: "2 mins ago", icon: <CheckCircle2 className="w-4 h-4 text-success" />, color: "bg-success/10" },
                ].map((log, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, x: -20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 1.2 + (i * 0.3) }}
                     className="flex gap-3 items-center bg-white p-3 rounded-xl border border-border/50 shadow-sm"
                   >
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${log.color}`}>
                       {log.icon}
                     </div>
                     <div>
                       <p className="text-sm font-bold text-foreground">{log.title}</p>
                       <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-1">{log.time}</p>
                     </div>
                   </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
