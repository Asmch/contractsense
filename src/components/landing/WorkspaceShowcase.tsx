"use client";

import { motion } from "framer-motion";
import { Search, History, Users, ArrowRightLeft } from "lucide-react";

export function WorkspaceShowcase() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-secondary/5">
      <div className="container mx-auto px-6 max-w-7xl text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary tracking-widest uppercase mb-6">
          Workspace
        </div>
        <h2 className="text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-4">
          An <span className="text-primary italic">enterprise</span> command center for legal.
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          One pane of glass for every contract, every clause, every counterparty. Built for in-house teams and lean startups alike.
        </p>
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          <div className="glass-panel rounded-3xl p-8 shadow-2xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 min-w-[1000px]">
            {/* Portfolio Safety */}
            <div className="glass-panel border-border/50 rounded-2xl p-6 bg-white/50">
              <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-6">Portfolio Safety</h3>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary/10" />
                    <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="440" strokeDashoffset="60" className="text-primary" />
                  </svg>
                  <div className="text-center">
                    <div className="text-5xl font-heading font-medium text-foreground">84</div>
                    <div className="text-xs text-muted-foreground mt-1">SAFETY</div>
                  </div>
                </div>
                <div className="mt-6 text-sm font-medium text-success flex items-center gap-1">
                  ▲ 6 pts <span className="text-muted-foreground font-normal">vs last 30 days</span>
                </div>
              </div>
            </div>

            {/* Risk Breakdown */}
            <div className="glass-panel border-border/50 rounded-2xl p-6 bg-white/50">
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
                      <span className="text-muted-foreground">{item.value}</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary/10 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contract Comparison Widget */}
            <div className="glass-panel border-border/50 rounded-2xl p-6 bg-white/50 md:col-span-2">
              <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-6 flex items-center justify-between">
                Contract Comparison
                <ArrowRightLeft className="w-4 h-4 text-primary" />
              </h3>
              
              <div className="flex items-center justify-between mb-6">
                <div className="px-3 py-1.5 rounded-md bg-secondary/5 border border-border/50 text-xs font-medium text-muted-foreground">Version A</div>
                <div className="h-px flex-1 bg-border/50 mx-4" />
                <div className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-xs font-medium text-primary">Version B</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-5 h-5 rounded bg-warning/20 text-warning flex items-center justify-center shrink-0 mt-0.5">!</div>
                  <div>
                    <span className="font-medium text-foreground">Payment Terms</span>
                    <div className="text-xs text-muted-foreground mt-0.5">Net-30 changed to Net-90</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-5 h-5 rounded bg-destructive/20 text-destructive flex items-center justify-center shrink-0 mt-0.5">✕</div>
                  <div>
                    <span className="font-medium text-foreground">IP Ownership</span>
                    <div className="text-xs text-muted-foreground mt-0.5">Client retains IP regardless of payment</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Activity Feed */}
            <div className="glass-panel border-border/50 rounded-2xl p-6 bg-white/50 md:col-span-2">
              <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-6 flex items-center justify-between">
                AI Activity Feed
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              </h3>
              <div className="space-y-5">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">AI</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Analyzed Freelance_MSA_v3.pdf</p>
                    <p className="text-xs text-muted-foreground mt-1">Found 3 risks. 1 critical.</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">2 mins ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/5 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-secondary">MC</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Marcus Chen approved NDA</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">14 mins ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">AI</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Generated negotiation redlines</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
