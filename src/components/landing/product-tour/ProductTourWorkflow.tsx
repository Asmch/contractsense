"use client";

import { productTourData } from "./data/productTourData";
import { ScrollReveal, ScrollRevealItem } from "./shared/ScrollReveal";
import { ArrowDown, CheckCircle2 } from "lucide-react";

export function ProductTourWorkflow() {
  const { title, steps } = productTourData.workflow;

  return (
    <section className="py-24 md:py-32 relative bg-secondary/5 border-t border-border/50">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <ScrollReveal animation="slide-up">
          <h2 className="text-3xl md:text-5xl font-heading font-medium text-foreground mb-16">
            {title}
          </h2>
        </ScrollReveal>

        <ScrollReveal staggerChildren className="max-w-md mx-auto flex flex-col items-center">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center w-full">
              <ScrollRevealItem className="w-full">
                <div className={`p-4 rounded-xl border flex items-center justify-center gap-3 font-medium transition-all duration-500
                  ${idx === steps.length - 1 
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105' 
                    : 'bg-white text-foreground border-border/50 shadow-sm'
                  }
                `}>
                  {idx === steps.length - 1 && <CheckCircle2 className="w-5 h-5" />}
                  {step}
                </div>
              </ScrollRevealItem>
              
              {idx < steps.length - 1 && (
                <ScrollRevealItem className="py-3">
                  <ArrowDown className="w-5 h-5 text-muted-foreground/30" />
                </ScrollRevealItem>
              )}
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
