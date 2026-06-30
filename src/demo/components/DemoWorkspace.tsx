"use client";

import { useState, useEffect } from "react";
import { ContractDashboardUI } from "@/components/contracts/ContractDashboardUI";
import { ProcessingPipeline } from "@/components/contracts/ProcessingPipeline";
import { msaContract, msaClauses } from "@/demo/contracts/msa";
import { ContractChat } from "@/components/contracts/chat/ContractChat";
import { DemoBanner } from "@/demo/components/DemoBanner";
import { motion, AnimatePresence } from "framer-motion";

export function DemoWorkspace() {
  const [phase, setPhase] = useState<"UPLOADED" | "PARSING" | "ANALYZING" | "COMPLETE">("UPLOADED");

  useEffect(() => {
    // Simulated pipeline sequence for the tour
    const t1 = setTimeout(() => setPhase("PARSING"), 800);
    const t2 = setTimeout(() => setPhase("ANALYZING"), 2000);
    const t3 = setTimeout(() => setPhase("COMPLETE"), 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const getPhaseText = () => {
    switch (phase) {
      case "UPLOADED": return "Uploading sample Master Service Agreement...";
      case "PARSING": return "Extracting 18 clauses from document...";
      case "ANALYZING": return "Analyzing risks with Gemini 2.5 Flash...";
      case "COMPLETE": return "Analysis complete! Explore the dashboard or ask the AI a question.";
    }
  };

  return (
    <div className="relative pt-12">
      <DemoBanner />
      
      {phase === "COMPLETE" ? (
        <ContractDashboardUI 
          contract={msaContract} 
          clauses={msaClauses} 
          isDemo={true}
          DemoChatComponent={
            <ContractChat 
              contractId="demo_msa_01" 
              apiEndpoint="/api/demo/chat" 
              defaultOpen={true}
            />
          }
        />
      ) : (
        <div className="h-[calc(100vh-12rem)]">
          <ProcessingPipeline contract={{
            _id: "demo_msa_01",
            status: phase
          }} />
        </div>
      )}

      {/* Demo helper toast */}
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, y: 20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          key={phase}
          className="fixed bottom-6 left-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-slate-700/50"
        >
          <div className="flex items-center gap-2">
            {phase !== "COMPLETE" && <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />}
            <span className="text-sm font-medium">{getPhaseText()}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
