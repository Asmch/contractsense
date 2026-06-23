"use client";

import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

export function SocialProofLogos() {
  return (
    <section className="py-12 border-t border-border/50 bg-white">
      <div className="container mx-auto px-6 max-w-7xl text-center">
        <p className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-8">
          Trusted by modern teams
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-60">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-800 rounded-sm rotate-45" />
            <span className="text-xl font-bold font-heading text-slate-800 tracking-tight">Freelancers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border-4 border-slate-800" />
            <span className="text-xl font-bold font-heading text-slate-800 tracking-tight">Agencies</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-slate-800" />
            <span className="text-xl font-bold font-heading text-slate-800 tracking-tight">Startups</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-800 rounded-sm" />
            <span className="text-xl font-bold font-heading text-slate-800 tracking-tight">Legal Teams</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  {
    question: "Is my contract private?",
    answer: "Yes. We use zero-retention architecture for enterprise accounts. Your data is encrypted at rest (AES-256) and in transit (TLS 1.3). We never use your documents to train our foundational models."
  },
  {
    question: "Can AI replace a lawyer?",
    answer: "No. ContractSense acts as an AI paralegal and first-pass reviewer. It identifies standard deviations, surfaces hidden risks, and provides legal clarity, empowering you to make informed decisions or negotiate better. You should still consult counsel for complex, high-stakes agreements."
  },
  {
    question: "What file formats are supported?",
    answer: "Currently, we support PDF (including scanned documents via OCR), DOCX, and raw text pasting. We preserve the original formatting for easy redlining and comparison."
  },
  {
    question: "Which jurisdictions are supported?",
    answer: "Our models are trained on millions of commercial contracts across the US, UK, EU, and India (including IT Act, ICA 1872, and GST compliance checks). We automatically detect the governing law and adjust risk scoring accordingly."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-secondary/5">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-semibold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">Everything you need to know about ContractSense.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="glass-panel border-border/50 rounded-2xl overflow-hidden bg-white/60">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-lg font-medium text-foreground">{faq.question}</span>
                {openIndex === idx ? (
                  <Minus className="w-5 h-5 text-muted-foreground shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </button>
              
              <motion.div
                initial={false}
                animate={{ height: openIndex === idx ? "auto" : 0, opacity: openIndex === idx ? 1 : 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
