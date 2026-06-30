"use client";

import { productTourData } from "./data/productTourData";
import { ScrollReveal } from "./shared/ScrollReveal";

export function ProductTourHeader() {
  const { badge, headline, subtitle } = productTourData.header;

  return (
    <section className="pt-32 pb-16 relative">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <ScrollReveal animation="slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold tracking-widest uppercase mb-8 text-primary">
            {badge}
          </div>
        </ScrollReveal>
        
        <ScrollReveal animation="slide-up" delay={0.1}>
          <h2 className="text-5xl md:text-6xl font-heading font-medium leading-[1.1] text-foreground mb-8">
            {headline}
          </h2>
        </ScrollReveal>

        <ScrollReveal animation="slide-up" delay={0.2}>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
            {subtitle}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
