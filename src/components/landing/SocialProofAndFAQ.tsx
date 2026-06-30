"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Search } from "lucide-react";
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
    icon: "🔒",
    question: "Is my contract kept private?",
    answer: "Yes. We use zero-retention architecture for enterprise accounts. Your data is encrypted at rest (AES-256) and in transit (TLS 1.3). We never use your documents to train our foundational models."
  },
  {
    icon: "⚖️",
    question: "Can AI replace a lawyer?",
    answer: "No. ContractSense acts as an AI paralegal and first-pass reviewer. It identifies standard deviations, surfaces hidden risks, and provides legal clarity, empowering you to make informed decisions or negotiate better. You should still consult counsel for complex, high-stakes agreements."
  },
  {
    icon: "🤖",
    question: "How accurate is the analysis?",
    answer: "Our AI models are specifically fine-tuned on legal documents and benchmarked against expert lawyers. They identify risks with high precision, but we always present the exact clause source so you can verify the findings."
  },
  {
    icon: "📄",
    question: "Can I upload scanned PDFs?",
    answer: "Yes. We have built-in OCR (Optical Character Recognition) that automatically extracts and processes text from scanned documents and images."
  },
  {
    icon: "🇮🇳",
    question: "Do you support Indian contracts?",
    answer: "Absolutely. Our models understand Indian jurisdiction, including the IT Act, ICA 1872, and GST compliance checks, alongside US, UK, and EU commercial laws."
  },
  {
    icon: "📝",
    question: "Can I compare two contract versions?",
    answer: "Yes. You can upload an original draft and a redlined version. ContractSense will automatically generate a GitHub-style side-by-side comparison highlighting all added, removed, and modified clauses."
  },
  {
    icon: "🤝",
    question: "Can I negotiate using the AI suggestions?",
    answer: "Yes. We provide 'Safer Alternatives' for every high-risk clause. You can copy these directly into your contract or use the AI Contract Chat to draft a custom response to your counterparty."
  },
  {
    icon: "📁",
    question: "What file types are supported?",
    answer: "Currently, we support PDF (text and scanned), DOCX, and TXT files. You can also paste raw text directly into the dashboard."
  },
  {
    icon: "📊",
    question: "Can I export professional reports?",
    answer: "Yes. Once the analysis is complete, you can export a beautifully formatted PDF Executive Summary containing the risk breakdown, key terms, and suggested redlines."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = FAQS.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-secondary/5 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
      <div className="container mx-auto px-6 max-w-3xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary tracking-widest uppercase mb-6">
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-semibold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground mb-8">Everything you need to know about ContractSense.</p>
          
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-border/50 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm placeholder:text-muted-foreground/70"
            />
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <motion.div 
                    key={faq.question}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`glass-panel border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-white shadow-md border-primary/30' : 'bg-white/60 border-border/50 hover:bg-white'}`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-6 text-left group"
                    >
                      <span className="text-lg font-medium text-foreground flex items-center gap-3">
                        <span className="text-xl">{faq.icon}</span>
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${isOpen ? 'bg-primary/10' : 'bg-secondary/5 group-hover:bg-primary/5'}`}
                      >
                        {isOpen ? (
                          <X className="w-4 h-4 text-primary" />
                        ) : (
                          <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                      </motion.div>
                    </button>
                    
                    <motion.div
                      initial={false}
                      animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-muted-foreground leading-relaxed pl-[3.25rem]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center py-12 text-muted-foreground"
              >
                No questions found matching "{searchQuery}".
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
