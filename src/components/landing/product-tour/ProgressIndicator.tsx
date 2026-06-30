"use client";

import { productTourData } from "./data/productTourData";
import { m, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ProgressIndicatorProps {
  activeSection: string;
}

export function ProgressIndicator({ activeSection }: ProgressIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Only show progress indicator when on desktop and scrolled past header
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1024) {
        setIsVisible(false);
        return;
      }
      // Show when scrolled down past ~600px (header area)
      setIsVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3 py-6 px-4 bg-background/60 backdrop-blur-md rounded-2xl border border-border/50 shadow-sm"
        >
          {productTourData.steps.map((step) => {
            const isActive = activeSection === step.id;
            
            return (
              <div key={step.id} className="group flex items-center gap-4 cursor-pointer" onClick={() => {
                const el = document.getElementById(step.id);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}>
                <div className="w-8 text-right text-xs font-mono font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {step.number}
                </div>
                
                <div className="relative flex items-center justify-center w-4 h-4">
                  <div className={`absolute w-full h-[1px] bg-border transition-colors ${isActive ? 'bg-primary' : 'group-hover:bg-foreground/30'}`} />
                  <div className={`w-1.5 h-1.5 rounded-full z-10 transition-all duration-300 ${isActive ? 'bg-primary scale-150 shadow-[0_0_8px_rgba(184,135,70,0.8)]' : 'bg-muted-foreground group-hover:bg-foreground group-hover:scale-110'}`} />
                </div>
                
                <div className={`text-xs font-medium transition-all duration-300 overflow-hidden whitespace-nowrap ${isActive ? 'text-primary w-32 opacity-100' : 'text-muted-foreground w-0 opacity-0 group-hover:w-32 group-hover:opacity-100 group-hover:text-foreground'}`}>
                  {step.navTitle}
                </div>
              </div>
            );
          })}
        </m.div>
      )}
    </AnimatePresence>
  );
}
