"use client";

import { useEffect, useState } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import { productTourData } from "./data/productTourData";
import { ProductTourHeader } from "./ProductTourHeader";

// Steps
import { StepExecutiveSummary } from "./steps/StepExecutiveSummary";
import { StepRiskDetection } from "./steps/StepRiskDetection";
import { StepContractChat } from "./steps/StepContractChat";
import { StepSaferAlternatives } from "./steps/StepSaferAlternatives";
import { StepNegotiation } from "./steps/StepNegotiation";
import { StepComparison } from "./steps/StepComparison";
import { StepReport } from "./steps/StepReport";
import Link from "next/link";

function SmallCTA() {
  return (
    <div className="py-12 flex justify-center relative z-20">
      <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-border/50 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <p className="text-sm font-medium text-foreground">Ready to analyze your own contract?</p>
        <Link href="/demo" className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-full shadow-sm hover:bg-primary/90 transition-colors">
          Try Sample Contract
        </Link>
      </div>
    </div>
  );
}

export function ProductTour() {
  const [activeSection, setActiveSection] = useState(productTourData.steps[0].id);

  useEffect(() => {
    // Intersection Observer to track which section is currently active
    const observers = productTourData.steps.map((step) => {
      const el = document.getElementById(step.id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Add a slight delay to avoid jitter when scrolling fast
              setTimeout(() => {
                if (entry.target.getBoundingClientRect().top < window.innerHeight * 0.6) {
                   setActiveSection(step.id);
                }
              }, 100);
            }
          });
        },
        { rootMargin: "-10% 0px -40% 0px", threshold: 0.2 }
      );

      observer.observe(el);
      return { el, observer };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative bg-[#F8F7F4] border-t border-border/50">
        <ProductTourHeader />
        
        <div className="relative z-10 flex flex-col gap-12 lg:gap-0">
          <StepExecutiveSummary />
          <StepRiskDetection />
          <SmallCTA />
          
          <StepContractChat />
          <StepSaferAlternatives />
          <SmallCTA />
          
          <StepNegotiation />
          <StepComparison />
          <StepReport />
        </div>
      </div>
    </LazyMotion>
  );
}
