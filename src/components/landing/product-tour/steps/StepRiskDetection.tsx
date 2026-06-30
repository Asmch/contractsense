"use client";

import { productTourData } from "../data/productTourData";
import { FeatureLayout } from "../shared/FeatureLayout";
import { AnimatedCounter } from "../shared/AnimatedCounter";
import { m } from "framer-motion";
import { msaContract, msaClauses } from "@/demo/contracts/msa";
import { ShieldAlert, Info } from "lucide-react";

function RiskVisual() {
  const lowRisk = msaClauses.filter(c => c.riskLevel === "LOW").length;
  const mediumRisk = msaClauses.filter(c => c.riskLevel === "MEDIUM").length;
  const highRisk = msaClauses.filter(c => c.riskLevel === "HIGH" || c.riskLevel === "CRITICAL").length;

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-6 perspective-[1000px]">
      
      {/* 1. Safety Score Card (Absolute or top depending on preference, let's put it on top right) */}
      <div className="relative">
        <m.div 
          initial={{ rotateY: -5, x: 20, opacity: 0, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
          whileInView={{ rotateY: 0, x: 0, opacity: 1, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)" }}
          whileHover={{ scale: 1.02, rotateY: 2, y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.2)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="absolute -top-12 -right-8 z-20 w-48 bg-white border border-border/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-xl hidden sm:flex"
        >
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Safety Score</h3>
          
          <div className="relative w-24 h-24 flex items-center justify-center mb-3">
            {/* SVG Circle for Score */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="fill-none stroke-secondary/10" strokeWidth="8" />
              <m.circle 
                cx="50" cy="50" r="45" 
                className="fill-none stroke-destructive" 
                strokeWidth="8" 
                strokeDasharray="283"
                initial={{ strokeDashoffset: 283 }}
                whileInView={{ strokeDashoffset: 283 - (283 * (msaContract.safetyScore || 0)) / 100 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-heading font-bold text-foreground">
                <AnimatedCounter from={100} to={msaContract.safetyScore || 0} duration={2} />
              </span>
            </div>
          </div>
        </m.div>

        {/* 2. Clause Example (Left aligned) */}
        <div className="flex flex-col gap-4 mt-8 sm:mt-0 pt-8 sm:pt-0">
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-white p-5 rounded-2xl border border-destructive/20 relative shadow-sm z-10 w-full sm:w-[85%]"
          >
            <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-destructive text-white flex items-center justify-center shadow-lg shadow-destructive/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="text-xs text-muted-foreground mb-2 ml-2">Clause 7.3 - Indemnification</div>
            <p className="text-sm text-foreground ml-2 leading-relaxed">
              Service Provider agrees to indemnify Client from 
              <m.span 
                initial={{ backgroundColor: "transparent", color: "inherit" }}
                whileInView={{ backgroundColor: "rgb(239 68 68 / 0.15)", color: "rgb(220 38 38)" }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="font-semibold px-1 rounded mx-1 transition-colors"
              >
                any and all unlimited liability
              </m.span> 
              arising from third-party claims regardless of cause.
            </p>
          </m.div>
          
          <m.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.8 }}
            className="bg-destructive/5 p-5 rounded-2xl border border-destructive/10 ml-8 relative w-full sm:w-[80%]"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-destructive rounded-l-2xl" />
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-3.5 h-3.5 text-destructive" />
              <div className="text-[10px] font-bold text-destructive uppercase tracking-widest">Why AI Flagged This</div>
            </div>
            <p className="text-sm text-foreground font-medium mb-1">Unlimited Consequential Damages</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Exposes you to infinite financial risk. Industry-standard agreements typically cap liability at 12 months of fees paid.
            </p>
          </m.div>
        </div>
      </div>
      
    </div>
  );
}

export function StepRiskDetection() {
  const step = productTourData.steps[1];
  return (
    <FeatureLayout
      id={step.id}
      variant="right"
      title={step.title}
      benefits={step.benefits}
      metric={step.metric}
      visual={<RiskVisual />}
    />
  );
}
