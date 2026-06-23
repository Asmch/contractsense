"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function AnimatedCounter({ end, suffix = "", duration = 2 }: { end: number, suffix?: string, duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <>{count.toLocaleString()}{suffix}</>;
}

export function Metrics() {
  return (
    <section className="relative py-16 md:py-24 lg:py-32 bg-primary text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-primary-foreground/20">
          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl md:text-5xl lg:text-7xl font-heading font-black tracking-tight mb-3 drop-shadow-md">
              <AnimatedCounter end={184320} suffix="+" />
            </div>
            <div className="text-primary-foreground/80 text-xs md:text-sm font-semibold tracking-widest uppercase">Contracts Analyzed</div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl md:text-5xl lg:text-7xl font-heading font-black tracking-tight mb-3 drop-shadow-md">
              <AnimatedCounter end={92800} suffix="+" />
            </div>
            <div className="text-primary-foreground/80 text-xs md:text-sm font-semibold tracking-widest uppercase">Risks Detected</div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl md:text-5xl lg:text-7xl font-heading font-black tracking-tight mb-3 drop-shadow-md">
              <AnimatedCounter end={41200} suffix="h" />
            </div>
            <div className="text-primary-foreground/80 text-xs md:text-sm font-semibold tracking-widest uppercase">Time Saved</div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl md:text-5xl lg:text-7xl font-heading font-black tracking-tight mb-3 drop-shadow-md">
              <AnimatedCounter end={91} suffix="%" />
            </div>
            <div className="text-primary-foreground/80 text-xs md:text-sm font-semibold tracking-widest uppercase">Acceptance Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Integrations() {
  return (
    <section className="py-16 bg-white overflow-hidden border-t border-border/50">
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-8">
          Seamlessly connects with your workflow
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center text-white font-bold text-xs">▲</div>
            <span className="text-xl font-bold font-heading text-slate-800 tracking-tight">Drive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex flex-wrap gap-[2px]">
              <div className="w-[14px] h-[14px] bg-blue-600 rounded-tl-md"></div>
              <div className="w-[14px] h-[14px] bg-blue-500 rounded-tr-md"></div>
              <div className="w-[14px] h-[14px] bg-blue-400 rounded-bl-md"></div>
              <div className="w-[14px] h-[14px] bg-blue-300 rounded-br-md"></div>
            </div>
            <span className="text-xl font-bold font-heading text-slate-800 tracking-tight">Dropbox</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin-slow"></div>
            <span className="text-xl font-bold font-heading text-slate-800 tracking-tight">OneDrive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 flex items-center justify-center text-white font-serif italic font-bold">A</div>
            <span className="text-xl font-bold font-heading text-slate-800 tracking-tight">Acrobat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center text-white font-bold">DS</div>
            <span className="text-xl font-bold font-heading text-slate-800 tracking-tight">DocuSign</span>
          </div>
        </div>
      </div>
    </section>
  );
}
