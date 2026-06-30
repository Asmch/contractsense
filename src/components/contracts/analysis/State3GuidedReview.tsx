import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReviewDecision, ReviewMode, ViewState } from "./useContractReviewState";
import { getFriendlyClauseTitle } from "@/utils/friendly-titles";
import { getInOneSentence, getWhyThisMatters, getAIConfidence, getShouldYouBeConcernedText, getRealLifeExample, getBottomLine } from "@/utils/clause-templates";
import { ChevronDown, MessageSquare, ArrowRight, CheckCircle, ShieldAlert } from "lucide-react";

interface State3GuidedReviewProps {
  clauses: any[];
  mode: ReviewMode;
  decisions: Record<string, ReviewDecision>;
  onDecision: (clauseId: string, decision: ReviewDecision) => void;
  onFinish: () => void;
  onBack: () => void;
}

export function State3GuidedReview({ clauses, mode, decisions, onDecision, onFinish, onBack }: State3GuidedReviewProps) {
  // Sort by severity: CRITICAL > HIGH > MEDIUM > LOW
  const sortedClauses = [...clauses].sort((a, b) => {
    const weights: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    return (weights[b.riskLevel] || 0) - (weights[a.riskLevel] || 0);
  });

  // Filter based on mode
  const reviewableClauses = mode === 'QUICK' 
    ? sortedClauses.filter(c => c.riskLevel === 'HIGH' || c.riskLevel === 'CRITICAL')
    : sortedClauses.filter(c => c.riskLevel !== 'LOW'); // Skip LOW in guided review anyway, put in Good News

  const goodNewsClauses = sortedClauses.filter(c => c.riskLevel === 'LOW');
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showStandard, setShowStandard] = useState(false);

  const isComplete = currentIndex >= reviewableClauses.length;

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      onBack();
    }
  };

  if (isComplete) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto py-12"
      >
        <div className="bg-emerald-50 rounded-[2rem] p-8 md:p-12 mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-emerald-950">Good News</h2>
          </div>
          <p className="text-lg text-emerald-800 mb-8">
            These sections of your agreement are standard and balanced.
          </p>
          <ul className="space-y-4 mb-8">
            {goodNewsClauses.slice(0, 3).map((c, i) => (
              <li key={i} className="flex items-center gap-3 text-emerald-800 text-lg">
                <span className="text-emerald-500">✓</span> {getFriendlyClauseTitle(c.title)} is fair.
              </li>
            ))}
            {goodNewsClauses.length > 3 && (
              <li className="flex items-center gap-3 text-emerald-800/70 text-lg">
                <span className="text-emerald-500/50">✓</span> And {goodNewsClauses.length - 3} other standard terms.
              </li>
            )}
          </ul>
          
          <button 
            onClick={() => setShowStandard(!showStandard)}
            className="text-emerald-700 font-bold text-sm tracking-widest uppercase hover:text-emerald-900 transition-colors flex items-center gap-2"
          >
            {showStandard ? "Hide Standard Clauses" : "Show Standard Clauses"} <ChevronDown className={`w-4 h-4 ${showStandard ? "rotate-180" : ""}`} />
          </button>

          {showStandard && (
            <div className="mt-8 space-y-4 border-t border-emerald-200/50 pt-8">
               {goodNewsClauses.map((c, i) => (
                 <div key={i} className="bg-white/50 p-4 rounded-xl text-emerald-900">
                   <h4 className="font-bold mb-1">{getFriendlyClauseTitle(c.title)}</h4>
                   <p className="text-sm opacity-80">{getInOneSentence(c)}</p>
                 </div>
               ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 pt-8">
          <button 
            onClick={() => setCurrentIndex(reviewableClauses.length - 1)}
            className="px-6 py-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg transition-colors inline-flex items-center gap-2"
          >
            Go Back
          </button>
          <button 
            onClick={onFinish}
            className="px-10 py-5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xl transition-colors inline-flex items-center gap-3 shadow-lg"
          >
            See Action Plan <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    );
  }

  const issue = reviewableClauses[currentIndex];
  const isFirst = currentIndex === 0;
  const friendlyTitle = getFriendlyClauseTitle(issue.title);
  const confidence = getAIConfidence(issue);

  const handleDecision = (decision: ReviewDecision) => {
    onDecision(issue._id.toString(), decision);
    if (decision === 'DISPUTED') {
      window.dispatchEvent(new CustomEvent('ask-clause', { 
        detail: { clauseOrder: issue.order, clauseTitle: friendlyTitle } 
      }));
      // Advance to next after short delay for chat to open
      setTimeout(() => {
        setCurrentIndex(i => i + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 500);
    } else {
      setCurrentIndex(i => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Non-anxious progress and back button */}
      <div className="flex items-center gap-4 mb-12">
        <button 
          onClick={handleBack}
          className="text-slate-400 hover:text-slate-600 font-medium text-sm transition-colors"
        >
          &larr; Back
        </button>
        <div className="text-sm font-bold text-slate-400 ml-4">{currentIndex + 1} of {reviewableClauses.length}</div>
        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-slate-300 transition-all duration-500 ease-out" 
            style={{ width: `${((currentIndex) / reviewableClauses.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={issue._id.toString()}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {isFirst && (issue.riskLevel === 'CRITICAL' || issue.riskLevel === 'HIGH') && (
            <div className="mb-8">
              <h3 className="text-sm font-bold tracking-widest uppercase text-red-500 flex items-center gap-2 mb-2">
                <ShieldAlert className="w-4 h-4" /> Biggest Risk — {friendlyTitle}
              </h3>
              <p className="text-slate-500">We'll start here because this has the biggest impact.</p>
            </div>
          )}
          {!isFirst && (
            <h3 className="text-2xl font-heading font-bold text-slate-900 mb-6">{friendlyTitle}</h3>
          )}

          {/* What Caught Our Attention (Evidence) */}
          <div className="mb-10">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
              📌 Here's what stood out
            </h4>
            <div className="bg-slate-50 border-l-4 border-slate-300 p-6 rounded-r-xl">
              <p className="text-slate-500 mb-3 text-sm">Source: {friendlyTitle}</p>
              <div className="text-lg text-slate-900 font-medium leading-relaxed mb-6">
                {(() => {
                  if (!issue.content) return <span className="italic">Relevant text from clause.</span>;
                  
                  const highlightRanges = issue.clauseInsight?.highlightRanges || [];
                  const triggerPhrases = issue.clauseInsight?.triggerPhrases || [];

                  // If backend didn't provide ranges, try calculating them on the fly
                  let finalRanges = [...highlightRanges];
                  if (finalRanges.length === 0 && triggerPhrases.length > 0) {
                     const lowerContent = issue.content.toLowerCase();
                     triggerPhrases.forEach((phrase: string) => {
                       if (phrase.length > 3) {
                         const start = lowerContent.indexOf(phrase.toLowerCase());
                         if (start !== -1) {
                           finalRanges.push({ start, end: start + phrase.length });
                         }
                       }
                     });
                  }

                  if (finalRanges.length === 0) {
                    return <span className="italic">"{issue.content.substring(0, 250)}..."</span>;
                  }

                  // Sort ranges by start index
                  const ranges = finalRanges.sort((a, b) => a.start - b.start);
                  const elements = [];
                  let currentIndex = 0;

                  for (let i = 0; i < ranges.length; i++) {
                    const range = ranges[i];
                    if (range.start < currentIndex) continue; // Overlapping range fallback
                    
                    // Add text before highlight
                    if (range.start > currentIndex) {
                      elements.push(<span key={`text-${i}`}>{issue.content.substring(currentIndex, range.start)}</span>);
                    }
                    
                    // Add highlight
                    elements.push(
                      <mark key={`highlight-${i}`} className="bg-yellow-200 text-slate-900 px-1 rounded-sm font-bold">
                        {issue.content.substring(range.start, range.end)}
                      </mark>
                    );
                    
                    currentIndex = range.end;
                  }
                  
                  // Add remaining text
                  if (currentIndex < issue.content.length) {
                     elements.push(<span key={`text-end`}>{issue.content.substring(currentIndex)}</span>);
                  }
                  
                  return elements;
                })()}
              </div>

              {issue.clauseInsight?.triggerPhrases && issue.clauseInsight.triggerPhrases.length > 0 && (
                <div className="bg-white/60 p-4 rounded-lg mt-4 text-sm border border-slate-200">
                  <p className="font-bold text-slate-700 mb-2">These phrases stood out to us:</p>
                  <ul className="list-disc pl-5 mb-3 text-slate-600">
                    {issue.clauseInsight.triggerPhrases.map((phrase: string, idx: number) => (
                      <li key={idx}>"{phrase}"</li>
                    ))}
                  </ul>
                  {issue.clauseInsight.reasonFlagged && (
                    <p className="text-slate-800 font-medium">{issue.clauseInsight.reasonFlagged}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Indicator */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${getShouldYouBeConcernedText(issue).color}`}>
              {getShouldYouBeConcernedText(issue).indicator} {getShouldYouBeConcernedText(issue).text}
            </div>
          </div>

          <div className="prose prose-slate prose-lg max-w-none text-slate-700">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">💡 What This Means</h4>
            <p className="text-xl font-medium text-slate-900 mb-6">{getInOneSentence(issue)}</p>
            
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">⚠️ Why This Matters</h4>
            <p>{getWhyThisMatters(issue)}</p>
            
            {getRealLifeExample(issue) && (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 my-8">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">🌍 Real-Life Example</p>
                <p className="text-slate-800 italic">{getRealLifeExample(issue)}</p>
              </div>
            )}
          </div>

          {/* Decision Box / Our Advice */}
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-8 my-8 shadow-sm">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">✅ Our Advice</h4>
            <div className="flex items-start gap-4 mb-4">
               <span className="text-2xl mt-1">✅</span>
               <div className="flex-1">
                 <p className="text-xl font-bold text-slate-900 mb-2">
                   {issue.clauseInsight?.recommendedAction === 'NEGOTIATE' && 'Negotiate this clause.'}
                   {issue.clauseInsight?.recommendedAction === 'SAFE' && 'You can safely accept this.'}
                   {issue.clauseInsight?.recommendedAction === 'REVIEW' && 'Review carefully before accepting.'}
                   {issue.clauseInsight?.recommendedAction === 'LAWYER' && 'Consult a lawyer before signing.'}
                   {!issue.clauseInsight?.recommendedAction && getBottomLine(issue)}
                 </p>
                 <p className="text-slate-600 mb-6">{getBottomLine(issue)}</p>
                 
                 <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                   <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Priority</p>
                     <p className="font-medium text-slate-700">{issue.negotiationPriority || (issue.riskLevel === 'CRITICAL' ? 'Must Fix' : issue.riskLevel === 'HIGH' ? 'Recommended' : 'Optional')}</p>
                   </div>
                   <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Difficulty</p>
                     <p className="font-medium text-slate-700">{issue.negotiationDifficulty || 'Medium'}</p>
                   </div>
                   {issue.clauseInsight?.businessImpact?.ifIgnored && (
                     <div className="col-span-2">
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">If You Ignore This</p>
                       <p className="font-medium text-red-600">{issue.clauseInsight.businessImpact.ifIgnored}</p>
                     </div>
                   )}
                   {issue.clauseInsight?.businessImpact?.ifAccepted && (
                     <div className="col-span-2">
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">If You Negotiate This</p>
                       <p className="font-medium text-emerald-600">{issue.clauseInsight.businessImpact.ifAccepted}</p>
                     </div>
                   )}
                 </div>
               </div>
            </div>
          </div>

          <div className="group relative inline-flex items-center gap-2 mt-4 cursor-help">
             <span className={`text-sm font-bold px-3 py-1 rounded-full ${confidence.color}`}>
               {confidence.text}
             </span>
             <span className="text-sm text-slate-500 border-b border-dashed border-slate-300">Why?</span>
             {/* Tooltip */}
             <div className="absolute bottom-full left-0 mb-2 w-64 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs p-3 rounded-lg pointer-events-none z-10">
               {confidence.description}
             </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4">
             {/* Primary action changes based on risk level */}
             {issue.riskLevel === 'CRITICAL' || issue.riskLevel === 'HIGH' ? (
               <>
                 <button onClick={() => handleDecision('NEGOTIATE')} className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors">
                   Flag for Negotiation
                 </button>
                 <button onClick={() => handleDecision('ACCEPT')} className="w-full sm:w-auto px-6 py-4 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold transition-colors">
                   Accept Risk
                 </button>
               </>
             ) : (
               <>
                 <button onClick={() => handleDecision('ACCEPT')} className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors">
                   Accept
                 </button>
                 <button onClick={() => handleDecision('NEGOTIATE')} className="w-full sm:w-auto px-6 py-4 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold transition-colors">
                   Flag for Negotiation
                 </button>
               </>
             )}
             
             <button onClick={() => handleDecision('SKIP')} className="w-full sm:w-auto px-6 py-4 rounded-full bg-transparent hover:bg-slate-50 text-slate-400 font-bold transition-colors">
               Skip for now
             </button>

             <button onClick={() => handleDecision('DISPUTED')} className="w-full sm:w-auto px-6 py-4 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition-colors ml-auto flex items-center gap-2">
               <MessageSquare className="w-4 h-4" /> Ask AI
             </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
