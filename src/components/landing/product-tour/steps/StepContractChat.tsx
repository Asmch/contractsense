"use client";

import { productTourData } from "../data/productTourData";
import { FeatureLayout } from "../shared/FeatureLayout";
import { m } from "framer-motion";
import { Sparkles, Bot, User as UserIcon, AlertTriangle } from "lucide-react";

function ChatVisual() {
  return (
    <div className="w-full max-w-sm mx-auto perspective-[1000px]">
      <m.div 
        initial={{ rotateY: 5, y: 30, opacity: 0, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
        whileInView={{ rotateY: 0, y: 0, opacity: 1, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)" }}
        whileHover={{ scale: 1.02, rotateY: -2, y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.2)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="flex flex-col bg-white border border-border/50 rounded-2xl overflow-hidden h-[450px]"
      >
        
        {/* Header */}
        <div className="p-4 border-b border-border/50 bg-secondary/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary relative">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground text-sm">Contract Assistant</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Gemini 2.5 Flash</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-zinc-50/50">
          
          <m.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex gap-3 flex-row-reverse"
          >
            <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-secondary text-secondary-foreground rounded-tr-none">
              What happens if I terminate early?
            </div>
          </m.div>

          <m.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.6 }}
            className="flex gap-3 flex-row"
          >
            <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
              <Bot className="w-4 h-4" />
            </div>
            <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-white border border-border/50 text-foreground shadow-sm rounded-tl-none relative overflow-hidden">
              <m.div 
                initial={{ right: 0 }}
                whileInView={{ right: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.8, ease: "linear" }}
                className="absolute top-0 bottom-0 right-0 bg-white z-20 w-full origin-right"
              />
              <p className="mb-2">You can terminate, but with a penalty.</p>
              <p className="text-muted-foreground leading-relaxed">
                According to <span className="inline-flex items-center px-1.5 py-0.5 mx-1 rounded text-[10px] font-bold tracking-wider uppercase bg-primary/20 text-primary border border-primary/30">§ 11.2</span>, you must provide 30 days written notice and pay an early termination fee equal to 50% of the remaining contract value.
              </p>
            </div>
          </m.div>

        </div>

        {/* Input Area (Fake) */}
        <div className="p-3 bg-white border-t border-border/50 shrink-0">
          <div className="relative flex items-center">
            <div className="w-full bg-secondary/5 border border-border/50 rounded-full pl-4 pr-12 py-3 text-sm text-muted-foreground flex items-center">
              <m.span
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: 3 }}
                 className="flex border-r border-foreground pr-1 animate-pulse"
              >
                Can we negotiate this...
              </m.span>
            </div>
          </div>
        </div>
      </m.div>
    </div>
  );
}

export function StepContractChat() {
  const step = productTourData.steps[2];
  return (
    <FeatureLayout
      id={step.id}
      variant="center"
      title={step.title}
      benefits={step.benefits}
      metric={step.metric}
      visual={<ChatVisual />}
    />
  );
}
