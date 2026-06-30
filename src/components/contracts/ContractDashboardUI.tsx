"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { ContractChat } from "@/components/contracts/chat/ContractChat";
import { AnalysisExperience } from "@/components/contracts/analysis/AnalysisExperience";
import { useContractReviewState } from "@/components/contracts/analysis/useContractReviewState";
import { State2Verdict } from "@/components/contracts/analysis/State2Verdict";
import { State3GuidedReview } from "@/components/contracts/analysis/State3GuidedReview";
import { State4NegotiationCenter } from "@/components/contracts/analysis/State4NegotiationCenter";
import { State5BeforeYouLeave } from "@/components/contracts/analysis/State5BeforeYouLeave";
import { Shield } from "lucide-react";

interface ContractDashboardUIProps {
  contract: any;
  clauses: any[];
  isDemo?: boolean;
  DemoChatComponent?: React.ReactNode;
}

export function ContractDashboardUI({ contract, clauses, isDemo = false, DemoChatComponent }: ContractDashboardUIProps) {
  const state = useContractReviewState(contract._id.toString());
  
  if (contract.status !== "COMPLETE") {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <AnalysisExperience contract={{
          _id: contract._id.toString(),
          status: contract.status,
          title: contract.title,
          pageCount: contract.pageCount,
          wordCount: contract.wordCount
        }} />
      </div>
    );
  }

  if (!state.isLoaded) {
    return null; // wait for hydration
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      
      {/* Ambient Header */}
      <div className="py-6 px-8 flex items-center justify-between border-b border-slate-200 bg-white/50 backdrop-blur-md sticky top-0 z-30">
        <h1 className="text-xl font-heading font-bold text-slate-800">{contract.title}</h1>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-slate-400">
             <Shield className="w-4 h-4" />
             Private & Encrypted · Not used for AI training
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 py-12 px-4 relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          {state.currentViewState === 2 && (
            <State2Verdict 
              key="state2" 
              contract={contract} 
              clauses={clauses} 
              onReviewStart={(mode) => {
                state.setReviewMode(mode);
                state.setViewState(3);
              }}
            />
          )}

          {state.currentViewState === 3 && (
            <State3GuidedReview 
              key="state3"
              clauses={clauses}
              mode={state.reviewMode || 'DETAILED'}
              decisions={state.decisions}
              onDecision={state.setDecision}
              onFinish={() => state.setViewState(4)}
              onBack={() => state.setViewState(2)}
            />
          )}

          {state.currentViewState === 4 && (
            <State4NegotiationCenter 
              key="state4"
              clauses={clauses}
              decisions={state.decisions}
              onNext={() => state.setViewState(5)}
              onBack={() => state.setViewState(3)}
            />
          )}

          {state.currentViewState === 5 && (
            <State5BeforeYouLeave 
              key="state5"
              contract={contract}
              clauses={clauses}
              decisions={state.decisions}
              onBack={() => state.setViewState(4)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Footer / Chat */}
      {DemoChatComponent ? DemoChatComponent : <ContractChat contractId={contract._id.toString()} />}

    </div>
  );
}
