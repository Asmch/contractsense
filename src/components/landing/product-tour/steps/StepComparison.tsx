"use client";

import { productTourData } from "../data/productTourData";
import { FeatureLayout } from "../shared/FeatureLayout";
import { m } from "framer-motion";
import { ArrowRightLeft } from "lucide-react";

function ComparisonVisual() {
  return (
    <div className="w-full max-w-2xl mx-auto perspective-[1000px]">
      <m.div 
        initial={{ rotateY: -10, y: 30, opacity: 0, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
        whileInView={{ rotateY: 0, y: 0, opacity: 1, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)" }}
        whileHover={{ scale: 1.02, rotateY: 2, y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.2)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="flex flex-col h-[400px] bg-white rounded-2xl border border-border/50 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-secondary/5">
          <div className="text-xs font-medium text-muted-foreground w-1/2 text-center border-r border-border/50">V1 (Original Draft)</div>
          <ArrowRightLeft className="w-4 h-4 text-muted-foreground/50 absolute left-1/2 -translate-x-1/2 bg-secondary/5" />
          <div className="text-xs font-medium text-primary w-1/2 text-center">V2 (Redlined Version)</div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 overflow-hidden">
          
          {/* Diff Block 1 */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Payment Terms</div>
            <div className="flex gap-4">
              <m.div 
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="flex-1 bg-destructive/5 text-destructive border border-destructive/20 px-3 py-2 rounded text-sm font-medium line-through"
              >
                Net-90 days
              </m.div>
              <m.div 
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex-1 bg-success/10 text-success border border-success/30 px-3 py-2 rounded text-sm font-medium relative"
              >
                Net-30 days
                <m.div 
                   initial={{ opacity: 0, scale: 0.5 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.8, type: "spring" }}
                   className="absolute -right-2 -top-2 bg-success text-white text-[10px] px-1.5 py-0.5 rounded font-bold shadow-sm"
                >
                  +60 Days Faster
                </m.div>
              </m.div>
            </div>
          </div>

          {/* Diff Block 2 */}
          <div className="space-y-2 pt-4">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Liability Cap</div>
            <div className="flex gap-4">
              <m.div 
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex-1 bg-destructive/5 text-destructive border border-destructive/20 px-3 py-2 rounded text-sm font-medium line-through"
              >
                Unlimited
              </m.div>
              <m.div 
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex-1 bg-success/10 text-success border border-success/30 px-3 py-2 rounded text-sm font-medium relative"
              >
                1x Trailing 12-Month Fees
                <m.div 
                   initial={{ opacity: 0, scale: 0.5 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ delay: 1.2, type: "spring" }}
                   className="absolute -right-2 -top-2 bg-success text-white text-[10px] px-1.5 py-0.5 rounded font-bold shadow-sm"
                >
                  Risk Reduced
                </m.div>
              </m.div>
            </div>
          </div>

        </div>
      </m.div>
    </div>
  );
}

export function StepComparison() {
  const step = productTourData.steps[5];
  return (
    <FeatureLayout
      id={step.id}
      variant="left"
      title={step.title}
      benefits={step.benefits}
      metric={step.metric}
      visual={<ComparisonVisual />}
    />
  );
}
