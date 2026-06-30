"use client";

import { Check, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface ReviewChecklistProps {
  currentCheckIndex: number;
}

export function ReviewChecklist({ currentCheckIndex }: ReviewChecklistProps) {
  const items = [
    "Payment Terms",
    "Ownership & Intellectual Property",
    "Confidentiality",
    "Liability & Indemnification",
    "Termination Rights",
    "Dispute Resolution"
  ];

  return (
    <div className="bg-white rounded-2xl border border-border/50 p-5 shadow-sm space-y-4">
      <h3 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-1">
        We're Looking At...
      </h3>
      
      <div className="space-y-1">
        {items.map((item, index) => {
          const isCompleted = index < currentCheckIndex;
          const isCurrent = index === currentCheckIndex;
          const isPending = index > currentCheckIndex;

          return (
            <div 
              key={index} 
              className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${
                isCurrent ? "bg-primary/5 border border-primary/10" : "border border-transparent"
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                {isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                ) : isCurrent ? (
                  <motion.div 
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-primary"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-border" />
                )}
              </div>
              
              <span className={`text-sm font-medium transition-colors ${
                isCompleted ? "text-muted-foreground line-through decoration-muted-foreground/30" : 
                isCurrent ? "text-primary" : 
                "text-muted-foreground/50"
              }`}>
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
