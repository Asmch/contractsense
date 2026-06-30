"use client";

import { m, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: "fade" | "slide-up" | "slide-left" | "slide-right" | "scale" | "none";
  delay?: number;
  duration?: number;
  className?: string;
  margin?: string;
  staggerChildren?: boolean;
}

const variants = {
  "fade": {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
  },
  "slide-up": {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
  },
  "slide-left": {
    initial: { opacity: 0, x: -30 },
    whileInView: { opacity: 1, x: 0 },
  },
  "slide-right": {
    initial: { opacity: 0, x: 30 },
    whileInView: { opacity: 1, x: 0 },
  },
  "scale": {
    initial: { opacity: 0, scale: 0.95 },
    whileInView: { opacity: 1, scale: 1 },
  },
  "none": {
    initial: { opacity: 1 },
    whileInView: { opacity: 1 },
  }
};

export function ScrollReveal({ 
  children, 
  animation = "slide-up", 
  delay = 0, 
  duration = 0.6,
  className = "",
  margin = "-100px",
  staggerChildren = false
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const activeAnimation = shouldReduceMotion && animation !== "none" ? "fade" : animation;

  if (staggerChildren) {
    return (
      <m.div
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: margin as any }}
        variants={{
          initial: {},
          whileInView: {
            transition: { staggerChildren: 0.1, delayChildren: delay }
          }
        }}
        className={className}
      >
        {children}
      </m.div>
    );
  }

  return (
    <m.div
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true, margin: margin as any }}
      transition={{ duration, delay, ease: "easeOut" }}
      variants={variants[activeAnimation]}
      className={className}
    >
      {children}
    </m.div>
  );
}

export function ScrollRevealItem({ children, className = "" }: { children: ReactNode, className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <m.div
      variants={{
        initial: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
        whileInView: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </m.div>
  );
}
