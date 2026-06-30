import React from "react";
import { motion } from "framer-motion";
import { ReviewDecision } from "./useContractReviewState";
import { getFriendlyClauseTitle } from "@/utils/friendly-titles";
import { ArrowRight, MessageSquare } from "lucide-react";

interface State4NegotiationCenterProps {
  clauses: any[];
  decisions: Record<string, ReviewDecision>;
  onNext: () => void;
  onBack: () => void;
}

export function State4NegotiationCenter({ clauses, decisions, onNext, onBack }: State4NegotiationCenterProps) {
  // Only show clauses explicitly marked as NEGOTIATE
  const negotiatedClauses = clauses.filter(c => decisions[c._id.toString()] === 'NEGOTIATE');
  
  // Sort by severity just to be consistent
  const sorted = [...negotiatedClauses].sort((a, b) => {
    const weights: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    return (weights[b.riskLevel] || 0) - (weights[a.riskLevel] || 0);
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-12"
    >
      <div className="mb-16">
        <h1 className="text-4xl font-heading font-extrabold text-slate-900 mb-4">Negotiation Center</h1>
        <p className="text-xl text-slate-600">
          Based on your review, here is your action plan. We've drafted the emails and talking points for you.
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="bg-slate-50 rounded-[2rem] p-12 text-center border border-slate-200">
          <p className="text-lg text-slate-600">You didn't flag anything for negotiation.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {sorted.map((clause, idx) => (
            <div key={clause._id.toString()} className="border-t border-slate-200 pt-12">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">{idx + 1}. {getFriendlyClauseTitle(clause.title)}</h3>
              <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                <h4 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-2">Why Negotiate?</h4>
                <p className="text-lg text-slate-800">{clause.whyItMatters || "This clause exposes you to unnecessary risk under standard conditions."}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-3">Talking Point</h4>
                  <p className="text-lg text-slate-700 leading-relaxed italic border-l-4 border-slate-200 pl-4">
                    "We need to adjust the {getFriendlyClauseTitle(clause.title).toLowerCase()} because {clause.whyItMatters?.toLowerCase() || 'it exposes us to unnecessary risk'}."
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-3">Suggested Wording</h4>
                  <p className="text-lg text-slate-900 font-medium leading-relaxed bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                    {clause.suggestedRewrite || 'Please revert this clause to standard mutual terms as typically seen in these agreements.'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 border-t border-slate-100 pt-8">
                <div>
                   <h4 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-3">Expected Outcome</h4>
                   <p className="text-slate-700 font-medium">{clause.expectedBusinessImpact?.ifAccepted || "You will gain fairer terms and reduce your liability."}</p>
                </div>
                <div>
                   <h4 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-3">Difficulty</h4>
                   <p className="text-slate-700 font-medium">{clause.negotiationDifficulty || "Medium"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-16 pt-12 border-t border-slate-200 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="px-6 py-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg transition-colors inline-flex items-center gap-2"
        >
          &larr; Go Back
        </button>
        <button 
          onClick={onNext}
          className="px-10 py-5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xl transition-colors inline-flex items-center gap-3 ml-auto"
        >
          View Final Summary <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </motion.div>
  );
}
