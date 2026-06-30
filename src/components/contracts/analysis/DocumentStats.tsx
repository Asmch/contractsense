"use client";

import { motion } from "framer-motion";
import { FileType, LayoutList, ScrollText, Activity, ShieldAlert } from "lucide-react";

interface DocumentStatsProps {
  pages: number;
  words: number;
  clausesFound: number;
  risksFound: number;
  contractType?: string;
}

export function DocumentStats({ pages, words, clausesFound, risksFound, contractType }: DocumentStatsProps) {
  return (
    <div className="bg-white rounded-2xl border border-border/50 p-5 shadow-sm">
      <h3 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-4">Document Profile</h3>
      
      <div className="space-y-4">
        {contractType && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-foreground/80">
              <FileType className="w-4 h-4 text-primary" />
              <span>Type</span>
            </div>
            <span className="text-sm font-semibold text-foreground text-right max-w-[150px] truncate">{contractType}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <LayoutList className="w-4 h-4 text-muted-foreground" />
            <span>Pages</span>
          </div>
          <span className="text-sm font-semibold text-foreground">{pages}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <ScrollText className="w-4 h-4 text-muted-foreground" />
            <span>Words</span>
          </div>
          <span className="text-sm font-semibold text-foreground">{words.toLocaleString()}</span>
        </div>

        <div className="h-px w-full bg-border/50 my-2"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <Activity className="w-4 h-4 text-blue-500" />
            <span>Clauses Identified</span>
          </div>
          <motion.span 
            key={clausesFound}
            initial={{ scale: 1.2, color: "#3b82f6" }}
            animate={{ scale: 1, color: "var(--foreground)" }}
            className="text-sm font-semibold text-foreground"
          >
            {clausesFound}
          </motion.span>
        </div>

        {risksFound > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-center justify-between overflow-hidden"
          >
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <ShieldAlert className="w-4 h-4" />
              <span>Potential Issues</span>
            </div>
            <motion.span 
              key={risksFound}
              initial={{ scale: 1.2, color: "#d97706" }}
              animate={{ scale: 1, color: "#d97706" }}
              className="text-sm font-bold text-amber-600"
            >
              {risksFound}
            </motion.span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
