"use client";

import { productTourData } from "../data/productTourData";
import { FeatureLayout } from "../shared/FeatureLayout";
import { AnimatedCounter } from "../shared/AnimatedCounter";
import { m } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { msaClauses } from "@/demo/contracts/msa";
import { getFriendlyClauseTitle } from "@/utils/friendly-titles";

function MorphVisual() {
  const clause = msaClauses[0]; // Unlimited Indemnification (Critical Risk)

  return (
    <div className="w-full max-w-2xl mx-auto perspective-[1000px]">
      <m.div 
        initial={{ rotateX: 10, y: 30, opacity: 0, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
        whileInView={{ rotateX: 0, y: 0, opacity: 1, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)" }}
        whileHover={{ scale: 1.01, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.2)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="group border border-primary/30 rounded-xl overflow-hidden bg-white shadow-xl"
      >
        <div className="bg-white px-5 py-4 flex items-center justify-between select-none border-b border-border/50">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary/10 text-muted-foreground text-xs font-bold shrink-0">
              {clause.order}
            </span>
            <h4 className="font-medium text-foreground">{getFriendlyClauseTitle(clause.title)}</h4>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded shadow-sm border bg-red-500/10 text-red-600 border-red-500/20">
              {clause.riskLevel} RISK ({clause.riskScore})
            </span>
            <ChevronDown className="w-5 h-5 text-muted-foreground rotate-180" />
          </div>
        </div>
        
        <div className="px-5 pb-5 pt-4 bg-secondary/5 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Before (Original) */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <h5 className="text-[10px] font-bold tracking-widest uppercase text-red-600 mb-2">Before (Original)</h5>
              <p className="text-sm text-foreground/90">
                The Service Provider hereby agrees to indemnify, defend, and hold harmless the Client from <span className="bg-red-500/20 text-red-700 px-1 rounded line-through">any and all unlimited liability</span> arising from third-party claims regardless of cause.
              </p>
            </div>
            
            {/* After (Suggested Rewrite) */}
            <m.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring" }}
              className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 relative"
            >
              <h5 className="text-[10px] font-bold tracking-widest uppercase text-emerald-600 mb-2">After (Suggested Rewrite)</h5>
              <p className="text-sm font-medium text-foreground">
                Service Provider shall indemnify Client for <span className="bg-emerald-500/20 text-emerald-700 px-1 rounded">direct damages arising solely from Service Provider's gross negligence, capped at fees paid in the trailing 12 months</span>.
              </p>
              
              <m.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                className="absolute top-4 right-4 flex flex-col items-end"
              >
                <span className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Risk Reduction</span>
                <span className="text-sm font-bold text-emerald-600 bg-white px-2 py-0.5 rounded shadow-sm border border-border/50">
                  -<AnimatedCounter from={0} to={clause.riskReductionScore || 0} duration={1.5} /> pts
                </span>
              </m.div>
            </m.div>
          </div>
        </div>
      </m.div>
    </div>
  );
}

export function StepSaferAlternatives() {
  const step = productTourData.steps[3];
  return (
    <FeatureLayout
      id={step.id}
      variant="left"
      title={step.title}
      benefits={step.benefits}
      metric={step.metric}
      visual={<MorphVisual />}
    />
  );
}
