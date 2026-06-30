"use client";

import { useEffect, useRef } from "react";
import { Check, AlertTriangle, Lightbulb, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type DiscoveryType = 'success' | 'warning' | 'info';

export interface Discovery {
  id: string;
  type: DiscoveryType;
  message: string;
  detail?: string;
}

interface AIActivityFeedProps {
  discoveries: Discovery[];
}

export function AIActivityFeed({ discoveries }: AIActivityFeedProps) {
  const endOfFeedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to the bottom when new discoveries are added
    if (endOfFeedRef.current) {
      endOfFeedRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [discoveries]);

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-border/50 p-6 shadow-sm flex-1 flex flex-col min-h-[400px] max-h-[500px]">
      <h3 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-6 shrink-0 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-primary" /> AI Discovery Feed
      </h3>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
        <AnimatePresence initial={false}>
          {discoveries.map((discovery, index) => {
            const isLatest = index === discoveries.length - 1;
            
            return (
              <motion.div 
                key={discovery.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                {/* Connector line for all but the last item */}
                {!isLatest && (
                  <div className="absolute left-[11px] top-8 bottom-[-24px] w-px bg-border/60"></div>
                )}

                <div className={`flex gap-4 ${!isLatest ? 'opacity-60' : ''}`}>
                  <div className="shrink-0 mt-0.5 relative z-10 bg-white">
                    {!isLatest ? (
                      <div className="w-6 h-6 rounded-full bg-secondary/20 text-muted-foreground flex items-center justify-center shadow-sm">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={`w-6 h-6 rounded-full text-white flex items-center justify-center shadow-sm ${
                          discovery.type === 'success' ? 'bg-emerald-500' :
                          discovery.type === 'warning' ? 'bg-amber-500' :
                          'bg-blue-500'
                        }`}
                      >
                        {discovery.type === 'success' && <Check className="w-3.5 h-3.5" />}
                        {discovery.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5" />}
                        {discovery.type === 'info' && <Lightbulb className="w-3.5 h-3.5" />}
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1.5 pt-0.5">
                    <span className={`text-sm font-semibold ${
                      discovery.type === 'warning' && isLatest ? 'text-amber-700' : 'text-foreground'
                    }`}>
                      {discovery.message}
                    </span>
                    
                    {/* Only show detail for the latest discovery to collapse the timeline */}
                    {discovery.detail && isLatest && (
                      <span className="text-[13px] text-muted-foreground leading-relaxed">
                        {discovery.detail}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={endOfFeedRef} className="h-4" />
      </div>
    </div>
  );
}
