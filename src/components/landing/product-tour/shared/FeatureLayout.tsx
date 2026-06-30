"use client";

import { ReactNode } from "react";
import { ScrollReveal, ScrollRevealItem } from "./ScrollReveal";
import { CheckCircle2 } from "lucide-react";

interface FeatureLayoutProps {
  variant: "left" | "right" | "center" | "full";
  title: string;
  benefits?: string[];
  metric?: string;
  visual: ReactNode;
  id?: string;
}

export function FeatureLayout({ variant, title, benefits, metric, visual, id }: FeatureLayoutProps) {
  
  const textContent = (
    <div className="flex flex-col h-full justify-center space-y-8">
      <ScrollReveal animation={variant === "right" ? "slide-right" : "slide-left"}>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-foreground leading-[1.1]">
          {title}
        </h3>
      </ScrollReveal>

      {benefits && benefits.length > 0 && (
        <ScrollReveal staggerChildren>
          <ul className="space-y-4">
            {benefits.map((benefit, idx) => (
              <ScrollRevealItem key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-lg">{benefit}</span>
              </ScrollRevealItem>
            ))}
          </ul>
        </ScrollReveal>
      )}

      {metric && (
        <ScrollReveal delay={0.2} animation="fade">
          <div className="inline-flex items-center px-4 py-2 rounded-lg bg-primary/5 border border-primary/20 text-primary font-medium text-sm">
            {metric}
          </div>
        </ScrollReveal>
      )}
    </div>
  );

  const visualContent = (
    <ScrollReveal 
      animation="scale" 
      duration={0.8}
      className="w-full h-full min-h-[400px] flex items-center justify-center relative perspective-[2000px]"
    >
      {visual}
    </ScrollReveal>
  );

  if (variant === "center") {
    return (
      <section id={id} className="py-24 relative z-10 scroll-mt-32">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <ScrollReveal animation="slide-up">
              <h3 className="text-3xl md:text-5xl font-heading font-semibold text-foreground mb-8 leading-tight">
                {title}
              </h3>
            </ScrollReveal>
            {benefits && (
              <ScrollReveal staggerChildren className="flex flex-wrap justify-center gap-6">
                {benefits.map((benefit, idx) => (
                   <ScrollRevealItem key={idx} className="flex items-center gap-2 text-muted-foreground font-medium">
                     <CheckCircle2 className="w-4 h-4 text-primary" />
                     {benefit}
                   </ScrollRevealItem>
                ))}
              </ScrollReveal>
            )}
            {metric && (
              <ScrollReveal delay={0.2} animation="fade" className="mt-8">
                <div className="inline-flex items-center px-4 py-2 rounded-lg bg-primary/5 border border-primary/20 text-primary font-medium text-sm">
                  {metric}
                </div>
              </ScrollReveal>
            )}
          </div>
          {visualContent}
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="py-24 relative z-10 scroll-mt-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className={`flex flex-col gap-12 lg:gap-20 ${variant === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
          {/* Mobile: Visuals always come first before text */}
          <div className="w-full lg:w-3/5 order-1 lg:order-none">
            {visualContent}
          </div>
          <div className="w-full lg:w-2/5 order-2 lg:order-none flex items-center">
            {textContent}
          </div>
        </div>
      </div>
    </section>
  );
}
