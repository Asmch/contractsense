"use client";

import { productTourData } from "../data/productTourData";
import { FeatureLayout } from "../shared/FeatureLayout";
import { m } from "framer-motion";
import { Download, FileText } from "lucide-react";

function ReportVisual() {
  return (
    <div className="w-full max-w-sm mx-auto h-[450px] relative group perspective-[1000px]">
      
      {/* Decorative background pages */}
      <m.div 
        initial={{ rotateZ: 0, x: 0 }}
        whileInView={{ rotateZ: -6, x: -20 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, type: "spring" }}
        className="absolute inset-0 bg-white/50 rounded-lg border border-border/50 shadow-sm"
      />
      <m.div 
        initial={{ rotateZ: 0, x: 0 }}
        whileInView={{ rotateZ: 6, x: 20 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, type: "spring", delay: 0.1 }}
        className="absolute inset-0 bg-white/80 rounded-lg border border-border/50 shadow-sm"
      />

      {/* Main Page */}
      <m.div 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        whileHover={{ scale: 1.02, rotateY: -2 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute inset-0 bg-white rounded-lg border border-border shadow-2xl p-6 flex flex-col transition-transform duration-300"
      >
        <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <div className="font-heading font-semibold text-sm">ContractSense Report</div>
          </div>
          <div className="text-[10px] text-muted-foreground">Generated today</div>
        </div>

        <div className="space-y-4 flex-1">
          <div className="h-4 w-3/4 bg-slate-200 rounded" />
          <div className="h-2 w-full bg-slate-100 rounded" />
          <div className="h-2 w-5/6 bg-slate-100 rounded" />
          
          <div className="py-2">
            <div className="h-16 w-full bg-destructive/10 border border-destructive/20 rounded flex items-center justify-center text-xs font-semibold text-destructive/50">Risk Analysis</div>
          </div>

          <div className="h-2 w-full bg-slate-100 rounded" />
          <div className="h-2 w-2/3 bg-slate-100 rounded" />
        </div>

        <div className="mt-4 pt-4 border-t border-border/50 flex justify-end">
          <m.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-primary-foreground text-xs font-medium px-4 py-2 rounded flex items-center gap-2 shadow-sm"
          >
            <Download className="w-3 h-3" />
            Export PDF
          </m.button>
        </div>
      </m.div>

    </div>
  );
}

export function StepReport() {
  const step = productTourData.steps[6];
  return (
    <FeatureLayout
      id={step.id}
      variant="right"
      title={step.title}
      benefits={step.benefits}
      metric={step.metric}
      visual={<ReportVisual />}
    />
  );
}
