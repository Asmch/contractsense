"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { UploadCloud, BrainCircuit, ShieldAlert, ArrowRightLeft, FileCheck } from "lucide-react";
import { useRef } from "react";

const STEPS = [
  {
    title: "Upload Contract",
    description: "Drop a PDF, DOCX, or paste text. Encrypted end-to-end.",
    icon: <UploadCloud className="w-4 h-4 text-primary" />
  },
  {
    title: "AI Understands Context",
    description: "Parses parties, jurisdiction, obligations, and intent.",
    icon: <BrainCircuit className="w-4 h-4 text-primary" />
  },
  {
    title: "Risk Detection",
    description: "Every clause scored across 47 legal risk dimensions.",
    icon: <ShieldAlert className="w-4 h-4 text-primary" />
  },
  {
    title: "Negotiation Suggestions",
    description: "Receive redlines grounded in 1M+ executed contracts.",
    icon: <ArrowRightLeft className="w-4 h-4 text-primary" />
  },
  {
    title: "Sign Confidently",
    description: "E-sign, archive, and track renewals — all in one place.",
    icon: <FileCheck className="w-4 h-4 text-primary" />
  }
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section ref={containerRef} className="py-16 md:py-24 lg:py-32 relative">
      <div className="container mx-auto px-6 max-w-4xl text-center mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary tracking-widest uppercase mb-6">
          How it works
        </div>
        <h2 className="text-4xl lg:text-5xl font-heading font-semibold text-foreground">
          From upload to <span className="text-primary italic">signature</span> in minutes.
        </h2>
      </div>

      <div className="container mx-auto px-6 max-w-3xl relative">
        {/* The Timeline Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-border/50 -translate-x-1/2 rounded-full overflow-hidden">
          <motion.div 
            className="w-full bg-primary origin-top"
            style={{ scaleY }}
          />
        </div>

        <div className="space-y-12">
          {STEPS.map((step, i) => (
            <div key={i} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group`}>
              
              {/* Timeline Dot */}
              <div className="absolute left-8 md:left-1/2 w-10 h-10 rounded-full bg-background border-4 border-primary flex items-center justify-center -translate-x-1/2 shadow-[0_0_15px_rgba(184,135,70,0.5)] z-10 transition-transform duration-500 group-hover:scale-110">
                {step.icon}
              </div>

              {/* Content */}
              <div className={`w-[calc(100%-4rem)] md:w-5/12 ml-auto md:ml-0 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5 }}
                  className="glass-panel p-6 rounded-2xl relative"
                >
                  <div className="text-xs font-bold text-primary mb-2">STEP 0{i + 1}</div>
                  <h3 className="text-xl font-heading font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
