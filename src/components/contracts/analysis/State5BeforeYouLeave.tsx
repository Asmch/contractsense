import React from "react";
import { motion } from "framer-motion";
import { ReviewDecision } from "./useContractReviewState";
import { getFriendlyClauseTitle } from "@/utils/friendly-titles";
import { Download, MessageSquare, CheckCircle } from "lucide-react";
import Link from "next/link";

interface State5BeforeYouLeaveProps {
  contract: any;
  clauses: any[];
  decisions: Record<string, ReviewDecision>;
  onBack: () => void;
}

export function State5BeforeYouLeave({ contract, clauses, decisions, onBack }: State5BeforeYouLeaveProps) {
  const negotiate = clauses.filter(c => decisions[c._id.toString()] === 'NEGOTIATE');
  const accepted = clauses.filter(c => decisions[c._id.toString()] === 'ACCEPT');
  const disputed = clauses.filter(c => decisions[c._id.toString()] === 'DISPUTED');
  const skipped = clauses.filter(c => decisions[c._id.toString()] === 'SKIP');
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-12"
    >
      <div className="mb-12">
        <h1 className="text-4xl font-heading font-extrabold text-slate-900 mb-4">Before You Sign</h1>
        <p className="text-xl text-slate-600">
          If this were my contract...
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 mb-12 space-y-6">
        
        {negotiate.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              I'd definitely negotiate these {negotiate.length} clauses before signing:
            </h3>
            <ul className="space-y-3 pl-4">
              {negotiate.map(c => (
                <li key={c._id.toString()} className="text-lg text-slate-700 flex items-center gap-3">
                  <span className="text-red-500">🔴</span> {getFriendlyClauseTitle(c.title)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {disputed.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              I'd want to discuss these with my AI Advisor before deciding:
            </h3>
            <ul className="space-y-3 pl-4">
              {disputed.map(c => (
                <li key={c._id.toString()} className="text-lg text-slate-700 flex items-center gap-3">
                  <span className="text-blue-500">🔵</span> {getFriendlyClauseTitle(c.title)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {skipped.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              I left these for later, but wouldn't sign without reading them:
            </h3>
            <ul className="space-y-3 pl-4">
              {skipped.map(c => (
                <li key={c._id.toString()} className="text-lg text-slate-700 flex items-center gap-3">
                  <span className="text-amber-500">🟡</span> {getFriendlyClauseTitle(c.title)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
           <CheckCircle className="w-6 h-6 text-emerald-500" />
           <p className="text-lg text-emerald-800 font-medium">Everything else looks fine and was accepted.</p>
        </div>

      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <button 
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg transition-colors inline-flex items-center gap-2"
        >
          &larr; Review Again
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
          <Link 
            href={`/report/${contract._id}?personalized=true`}
            target="_blank"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-lg transition-colors flex items-center justify-center gap-3"
          >
            <Download className="w-5 h-5" /> Export Report
          </Link>
          <Link 
            href={`/dashboard`}
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg transition-colors flex items-center justify-center gap-3 shadow-lg"
          >
            Finish Review <CheckCircle className="w-5 h-5" />
          </Link>
        </div>
      </div>

    </motion.div>
  );
}
