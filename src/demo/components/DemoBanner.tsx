"use client";

import { motion } from "framer-motion";
import { Star, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export function DemoBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-0 left-0 right-0 z-50 bg-primary/10 border-b border-primary/20 backdrop-blur-sm px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm"
    >
      <div className="flex items-center gap-4 text-primary">
        <div className="flex items-center gap-1.5 font-bold tracking-tight">
          <Star className="w-4 h-4 fill-primary" />
          Product Tour
        </div>
        <div className="hidden sm:block w-px h-4 bg-primary/20" />
        <div className="flex items-center gap-1.5 text-primary/80 font-medium text-xs">
          <Clock className="w-3.5 h-3.5" />
          Estimated time: 45 seconds
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-xs text-primary/70 font-medium hidden md:block">Ready to see it on your own files?</span>
        <Link 
          href="/signup"
          className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-primary/90 hover:scale-105 transition-all shadow-sm"
        >
          Create Free Account
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
}
