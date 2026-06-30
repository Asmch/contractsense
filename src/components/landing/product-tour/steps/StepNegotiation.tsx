"use client";

import { productTourData } from "../data/productTourData";
import { FeatureLayout } from "../shared/FeatureLayout";
import { m } from "framer-motion";
import { msaClauses } from "@/demo/contracts/msa";

function NegotiationVisual() {
  const clause = msaClauses[1]; // Net 90 Payment Terms

  return (
    <div className="w-full max-w-2xl mx-auto perspective-[1000px]">
      <m.div 
        initial={{ rotateY: -5, x: 20, opacity: 0, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
        whileInView={{ rotateY: 0, x: 0, opacity: 1, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)" }}
        whileHover={{ scale: 1.02, rotateY: 2, y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.2)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="glass-panel bg-secondary/5 rounded-2xl p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Acceptance Probability */}
          <div className="bg-white border border-border/50 rounded-xl p-4 shadow-sm">
            <h5 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Acceptance Probability</h5>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-secondary/10 rounded-full overflow-hidden">
                <m.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${clause.acceptanceProbability}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  className="h-full bg-primary" 
                />
              </div>
              <span className="text-sm font-bold text-foreground">{clause.acceptanceProbability}%</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3">Based on 10,000+ similar SaaS agreements.</p>
          </div>

          {/* Market Standard */}
          <m.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-border/50 rounded-xl p-4 shadow-sm"
          >
            <h5 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Market Standard</h5>
            <p className="text-sm font-medium text-foreground mb-1">{clause.marketStandard}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{clause.marketStandardReason}</p>
          </m.div>

          {/* Talking Points */}
          <m.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="bg-white border border-border/50 rounded-xl p-4 shadow-sm"
          >
            <h5 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Talking Points</h5>
            <ul className="space-y-2">
              {clause.talkingPoints?.map((tp: string, i: number) => (
                <m.li 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + i * 0.2 }}
                  className="text-xs text-foreground/80 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0"></span>
                  <span className="leading-relaxed">{tp}</span>
                </m.li>
              ))}
            </ul>
          </m.div>
        </div>
      </m.div>
    </div>
  );
}

export function StepNegotiation() {
  const step = productTourData.steps[4];
  return (
    <FeatureLayout
      id={step.id}
      variant="right"
      title={step.title}
      benefits={step.benefits}
      metric={step.metric}
      visual={<NegotiationVisual />}
    />
  );
}
