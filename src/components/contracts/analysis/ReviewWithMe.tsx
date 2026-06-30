"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, HelpCircle, MessageSquare, AlertTriangle, CheckCircle, ArrowRight, BookOpen } from "lucide-react";
import { getFriendlyClauseTitle } from "@/utils/friendly-titles";
import { getInOneSentence, getWhyThisMatters, getBottomLine } from "@/utils/clause-templates";

interface ReviewWithMeProps {
  issues: any[];
}

export function ReviewWithMe({ issues }: ReviewWithMeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSimplified, setShowSimplified] = useState<Record<number, boolean>>({});

  if (!issues || issues.length === 0) {
    return (
      <div className="text-center py-24 bg-emerald-50/50 rounded-3xl border border-emerald-100">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-heading font-bold text-slate-800 mb-2">No Major Issues Found</h3>
        <p className="text-slate-600">This agreement looks fairly standard. You can skip straight to the summary below.</p>
      </div>
    );
  }

  const isComplete = currentIndex >= issues.length;
  
  if (isComplete) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-24 bg-emerald-50/50 rounded-3xl border border-emerald-100"
      >
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-3xl font-heading font-bold text-slate-800 mb-4">You've reviewed all the important issues!</h3>
        <p className="text-lg text-slate-600 mb-8">Great job. You now know exactly what to look out for.</p>
        <button 
          onClick={() => document.getElementById('negotiation')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-colors"
        >
          See How to Negotiate
        </button>
      </motion.div>
    );
  }

  const issue = issues[currentIndex];
  const friendlyTitle = getFriendlyClauseTitle(issue.title);
  const inOneSentence = getInOneSentence(issue);
  const whyItMatters = getWhyThisMatters(issue);
  const whatToDo = getBottomLine(issue);
  const isSimplified = showSimplified[currentIndex];

  const handleExplainAgain = () => {
    setShowSimplified(prev => ({ ...prev, [currentIndex]: true }));
  };

  const handleAskAI = () => {
    window.dispatchEvent(new CustomEvent('ask-clause', { 
      detail: { clauseOrder: issue.order, clauseTitle: friendlyTitle } 
    }));
  };

  const handleGotIt = () => {
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-12 text-center">
        <span className="text-sm font-bold tracking-widest uppercase text-muted-foreground bg-secondary/10 px-4 py-2 rounded-full">
          Issue {currentIndex + 1} of {issues.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-8 md:p-12 border border-border/50 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <h2 className="text-3xl font-heading font-bold text-slate-900">{friendlyTitle}</h2>
          </div>

          <div className="space-y-10">
            {/* What Happened */}
            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">What it says</h4>
              <p className="text-xl font-medium text-slate-800 leading-relaxed">
                {inOneSentence}
              </p>
            </div>

            {/* AI Simplified Explanation (Toggled) */}
            <AnimatePresence>
              {isSimplified && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 40 }}
                  className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6"
                >
                  <h4 className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> The Ultra-Simple Version
                  </h4>
                  <p className="text-lg text-blue-900 leading-relaxed">
                    {issue.legalMeaning || "Basically, this means you are taking on more risk than you normally would in a standard contract. It heavily favors the other side."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Why Care & What to do */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
              <div>
                <h4 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">Why you should care</h4>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {whyItMatters}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">What you should do</h4>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {whatToDo}
                </p>
              </div>
            </div>

          </div>

          {/* Interaction Bar */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!isSimplified && (
                <button 
                  onClick={handleExplainAgain}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition-colors"
                >
                  <HelpCircle className="w-5 h-5 text-slate-400" />
                  Explain Again
                </button>
              )}
              
              <button 
                onClick={handleAskAI}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-blue-500" />
                Ask AI
              </button>
            </div>

            <button 
              onClick={handleGotIt}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors"
            >
              <ThumbsUp className="w-5 h-5" />
              Got It
            </button>
          </div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
