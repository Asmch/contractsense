"use client";

import Link from "next/link";
import { Scale, Lock } from "lucide-react";
import { motion } from "framer-motion";

export function EnterpriseFooter() {
  return (
    <footer className="bg-[#FAF9F6] pt-14 pb-8 overflow-hidden border-t border-black/5 relative">
      {/* Soft Gold Glow at Bottom (Weakened to 5%) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
      
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-7">
          
          {/* Left Column (Brand & Trust) */}
          <div className="w-full md:w-3/5 flex flex-col items-start">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-5"
            >
              <Link href="/" className="flex items-center gap-3 text-foreground font-heading font-semibold text-3xl tracking-tight mb-2 group">
                <div className="bg-primary/10 p-3 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Scale className="w-7 h-7" />
                </div>
                ContractSense
              </Link>
              <p className="text-lg text-muted-foreground max-w-md leading-snug">
                Understand every contract before you sign.<br />
                Built for founders, freelancers & legal teams.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col items-start"
            >
              <div className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
                <Lock className="w-4 h-4 text-primary" />
                Private by Design
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/80">
                <span>Files encrypted</span>
                <span className="text-border text-[6px]">●</span>
                <span>Private AI</span>
                <span className="text-border text-[6px]">●</span>
                <span>Free during Beta</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column (Navigation) */}
          <div className="w-full md:w-2/5 flex flex-col md:items-end pt-3 md:pt-4">
            <motion.nav 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-4 text-left md:text-right"
            >
              {["Product", "Experience", "Features", "Pricing"].map((link) => (
                <Link 
                  key={link} 
                  href={`#${link.toLowerCase()}`} 
                  className="text-base font-medium text-muted-foreground hover:text-primary transition-colors relative group inline-block"
                >
                  {link}
                </Link>
              ))}
            </motion.nav>
          </div>

        </div>

        {/* Bottom Row */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col md:flex-row items-baseline justify-between text-xs text-muted-foreground pt-4 border-t border-black/5"
        >
          <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-4 md:mb-0 text-center md:text-left">
            <span className="font-semibold text-foreground/80">© {new Date().getFullYear()} ContractSense</span>
            <span>Built by Asmita Choudhary</span>
            <span className="hidden md:inline text-border">|</span>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
          
          <div className="flex items-center gap-6">
             <Link href="#" className="text-muted-foreground hover:text-primary hover:-translate-y-1 hover:rotate-6 transition-all duration-250">
               <span className="sr-only">GitHub</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.15-.38 6.5-1.4 6.5-7.17a5.2 5.2 0 0 0-1.45-3.8 4.9 4.9 0 0 0-.1-3.8s-1.18-.38-3.9 1.4a13.3 13.3 0 0 0-7 0c-2.72-1.78-3.9-1.4-3.9-1.4a4.9 4.9 0 0 0-.1 3.8A5.2 5.2 0 0 0 3 11.8c0 5.76 3.35 6.78 6.5 7.16a4.8 4.8 0 0 0-1 3.03V22"/><path d="M9 20c-5 1.5-5-2.5-7-3"/></svg>
             </Link>
             <Link href="#" className="text-muted-foreground hover:text-primary hover:-translate-y-1 hover:rotate-6 transition-all duration-250">
               <span className="sr-only">LinkedIn</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
             </Link>
             <Link href="#" className="text-muted-foreground hover:text-primary hover:-translate-y-1 hover:rotate-6 transition-all duration-250">
               <span className="sr-only">X (Twitter)</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
             </Link>
          </div>
        </motion.div>

      </div>
    </footer>
  );
}
