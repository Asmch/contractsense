"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { UploadCloud, BrainCircuit, ShieldAlert, BookOpen, PenTool, MessageCircle, FileCheck } from "lucide-react";
import { useRef } from "react";

const STEPS = [
  {
    title: "Upload Agreement",
    description: "Upload contracts in PDF, DOCX, or TXT format. AI securely prepares the document for analysis.",
    icon: <UploadCloud className="w-4 h-4 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
  },
  {
    title: "AI Understands Your Contract",
    description: "Extracts text, identifies clauses, parties, obligations, and contract structure before beginning legal analysis.",
    icon: <BrainCircuit className="w-4 h-4 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3" />
  },
  {
    title: "Detect Hidden Risks",
    description: "AI identifies legal, financial, compliance, and business risks across every clause with severity scoring.",
    icon: <ShieldAlert className="w-4 h-4 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
  },
  {
    title: "Simplify Legal Language",
    description: "Every clause is translated into plain English with executive summaries and key takeaways anyone can understand.",
    icon: <BookOpen className="w-4 h-4 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3" />
  },
  {
    title: "Suggest Safer Alternatives",
    description: "Receive balanced clause rewrites, market-standard alternatives, negotiation strategies, and practical recommendations to reduce legal risk.",
    icon: <PenTool className="w-4 h-4 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
  },
  {
    title: "Ask Your Contract",
    description: "Chat with your agreement using AI to get instant answers backed by relevant clauses and contextual explanations.",
    icon: <MessageCircle className="w-4 h-4 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3" />
  },
  {
    title: "Review & Sign Confidently",
    description: "Compare contract versions, export professional reports, and make informed decisions before signing.",
    icon: <FileCheck className="w-4 h-4 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
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
        <h2 className="text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-6">
          From contract upload to <span className="text-primary italic">confident decisions</span> in minutes.
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Every agreement goes through an AI-powered review pipeline that helps you understand, improve, and negotiate contracts before you sign.
        </p>
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
              <motion.div 
                whileInView={{ boxShadow: "0 0 15px rgba(184,135,70,0.5)" }}
                viewport={{ margin: "-200px" }}
                className="absolute left-8 md:left-1/2 w-10 h-10 rounded-full bg-background border-4 border-primary flex items-center justify-center -translate-x-1/2 shadow-sm z-10 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(184,135,70,0.7)]"
              >
                {step.icon}
              </motion.div>

              {/* Content */}
              <div className={`w-[calc(100%-4rem)] md:w-5/12 ml-auto md:ml-0 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20, y: 10 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5 }}
                  className="glass-panel p-5 rounded-2xl relative transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="text-xs font-bold text-primary mb-2">STEP 0{i + 1}</div>
                  <h3 className="text-lg md:text-xl font-heading font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
