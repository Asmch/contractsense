"use client";

import { productTourData } from "../data/productTourData";
import { FeatureLayout } from "../shared/FeatureLayout";
import { m } from "framer-motion";
import { BrainCircuit, CheckCircle2 } from "lucide-react";
import { msaContract } from "@/demo/contracts/msa";

function SummaryVisual() {
  return (
    <div className="w-full max-w-xl mx-auto perspective-[1000px]">
      <m.div 
        initial={{ rotateX: 10, y: 30, opacity: 0, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
        whileInView={{ rotateX: 0, y: 0, opacity: 1, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)" }}
        whileHover={{ scale: 1.02, rotateX: -2, y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.2)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="glass-panel bg-white border border-border/50 rounded-2xl p-6 flex flex-col"
      >
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
          <h3 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            Contract Summary
          </h3>
          <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full relative overflow-hidden">
            <m.div 
              initial={{ left: "-100%" }}
              animate={{ left: "100%" }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute top-0 bottom-0 w-4 bg-white/40 blur-[2px] skew-x-12"
            />
            AI Generated
          </span>
        </div>
        
        <p className="text-sm text-foreground/80 leading-relaxed mb-6">
          <m.span
            initial={{ opacity: 0, backgroundColor: "var(--primary-light)" }}
            whileInView={{ opacity: 1, backgroundColor: "transparent" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {msaContract.executiveSummary}
          </m.span>
        </p>

        <h4 className="text-sm font-semibold text-foreground mb-3">Key Takeaways</h4>
        <ul className="space-y-3">
          {msaContract.keyTakeaways?.map((takeaway, idx) => (
            <m.li 
              key={idx} 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 + idx * 0.2 }}
              className="flex items-start gap-3"
            >
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="text-sm text-foreground/80">{takeaway}</span>
            </m.li>
          ))}
        </ul>
      </m.div>
    </div>
  );
}

export function StepExecutiveSummary() {
  const step = productTourData.steps[0];
  return (
    <FeatureLayout
      id={step.id}
      variant="left"
      title={step.title}
      benefits={step.benefits}
      metric={step.metric}
      visual={<SummaryVisual />}
    />
  );
}
