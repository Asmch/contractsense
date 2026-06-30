import React from "react";
import { getContractDecision } from "@/utils/contract-decision";
import { ReviewMode, ViewState } from "./useContractReviewState";
import { motion } from "framer-motion";

interface State2VerdictProps {
  contract: any;
  clauses: any[];
  onReviewStart: (mode: ReviewMode) => void;
}

export function State2Verdict({ contract, clauses, onReviewStart }: State2VerdictProps) {
  const decision = getContractDecision(contract, clauses);
  const pages = contract.pageCount || 1;
  const time = decision.reviewTime;
  const numClauses = clauses.length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center justify-center min-h-[60vh] max-w-4xl mx-auto px-4 text-center"
    >
      <h1 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-8">Can I sign this?</h1>
      
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className={`w-5 h-5 rounded-full shrink-0 ${decision.verdict.dotColor}`}></div>
        <h2 className={`text-5xl sm:text-6xl font-heading font-extrabold ${decision.verdict.color.split(' ')[0]}`}>
          {decision.verdict.title}
        </h2>
      </div>
      
      <p className="text-xl sm:text-2xl text-slate-700 leading-relaxed max-w-2xl mx-auto mb-8">
        {decision.verdict.subtitle}
      </p>

      {decision.needsAttentionDetailed.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto text-left mb-12 shadow-sm">
          <p className="text-slate-600 font-bold mb-4">Because we found:</p>
          <ul className="space-y-3 mb-6">
            {decision.needsAttentionDetailed.map((issue, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-red-500 mt-1">🔴</span>
                <span className="text-slate-700 font-medium">{issue.title}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3 text-sm font-bold text-slate-400 border-t border-slate-100 pt-6">
            <span className="uppercase tracking-widest">Estimated Review Time:</span>
            <span className="text-slate-900">{time}</span>
          </div>
        </div>
      )}

      {decision.needsAttentionDetailed.length === 0 && (
        <div className="flex items-center justify-center gap-8 text-sm font-medium text-slate-500 mb-16">
          <span>{pages} Pages</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span>{numClauses} Clauses Found</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span>{time}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button 
          onClick={() => onReviewStart('QUICK')}
          className="px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg transition-colors w-full sm:w-auto"
        >
          Quick Review (Top Findings)
        </button>
        <button 
          onClick={() => onReviewStart('DETAILED')}
          className="px-8 py-4 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-lg transition-colors w-full sm:w-auto"
        >
          Detailed Review (Everything)
        </button>
      </div>
    </motion.div>
  );
}
