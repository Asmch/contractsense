"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FeatureStoryProps {
  title: string;
  description: string;
  children: ReactNode;
  reverse?: boolean;
}

export function FeatureStory({ title, description, children, reverse = false }: FeatureStoryProps) {
  return (
    <section className="py-16 md:py-24 lg:py-32 relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${reverse ? 'lg:flex-row-reverse' : ''}`}>
          
          {/* Text Content */}
          <div className="w-full lg:w-1/3 space-y-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-heading font-semibold text-foreground"
            >
              {title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              {description}
            </motion.p>
          </div>

          {/* Interactive Demo Side */}
          <div className="w-full lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full glass-panel rounded-2xl p-8 shadow-2xl overflow-hidden"
            >
              {children}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
