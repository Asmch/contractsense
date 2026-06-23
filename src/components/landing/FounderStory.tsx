"use client";

import { motion } from "framer-motion";

export function FounderStory() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-foreground text-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-background/20 bg-background/5 text-xs font-semibold tracking-widest uppercase mb-6 text-primary">
            Why We Built This
          </div>
          
          <h2 className="text-4xl md:text-5xl font-heading font-medium leading-tight">
            Most freelancers and founders sign contracts they <span className="italic text-primary">don't understand</span>.
          </h2>

          <div className="space-y-6 text-lg md:text-xl text-background/70 leading-relaxed font-light">
            <p>
              I've seen it happen too many times. You land a big client, they send over a 40-page MSA, and the excitement takes over. You skim it, assume it's "standard," and sign it.
            </p>
            <p>
              But there is no such thing as standard. One hidden clause can cost you months of unpaid work, strip you of your IP ownership, or expose you to thousands in legal liability.
            </p>
            <p>
              Traditional lawyers are too slow and expensive for everyday agreements. So we built ContractSense. We trained an AI on millions of executed contracts to instantly flag what's dangerous, what's missing, and what you should push back on.
            </p>
            <p className="font-medium text-background">
              Because legal clarity shouldn't be a luxury. It should be a right.
            </p>
          </div>

          <div className="pt-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-heading font-semibold text-lg">
              AK
            </div>
            <div>
              <div className="font-semibold">Alexus K.</div>
              <div className="text-sm text-background/50">Founder, ContractSense</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
