"use client";

import React from "react";
import { FileText, ShieldAlert, CheckCircle2, Target, Info, MessageSquare, ArrowRight, ShieldCheck, PenTool } from "lucide-react";
import { PrintButton } from "@/components/contracts/PrintButton";
import { getFriendlyClauseTitle } from "@/utils/friendly-titles";
import { getInOneSentence, getWhyThisMatters, getRealLifeExample, getShouldYouBeConcernedText, getBottomLine } from "@/utils/clause-templates";

interface ContractReportUIProps {
  contract: any;
  clauses: any[];
}

export function ContractReportUI({ contract, clauses }: ContractReportUIProps) {
  const criticalClauses = clauses.filter(c => c.riskLevel === "CRITICAL");
  const highClauses = clauses.filter(c => c.riskLevel === "HIGH");
  const mediumClauses = clauses.filter(c => c.riskLevel === "MEDIUM");
  const lowClauses = clauses.filter(c => c.riskLevel === "LOW");

  const topPriorities = [...criticalClauses, ...highClauses];
  const needsAttentionCount = topPriorities.length + mediumClauses.length;

  const negotiatedClauses = clauses.filter(c => c.clauseInsight?.recommendedAction === 'NEGOTIATE' || c.clauseInsight?.conversationStarter);

  const recommendedAction = criticalClauses.length > 0 || highClauses.length > 1 
    ? "Sign after making a few important changes." 
    : mediumClauses.length > 0 
      ? "Proceed with caution. You can sign this, but be aware of the terms." 
      : "You can comfortably sign this.";

  // Helper to generate dynamic insights based on contract title/type
  const getDynamicInsights = () => {
    const title = contract.title?.toLowerCase() || "";
    if (title.includes("employment") || title.includes("offer")) {
      return [
        "In most jurisdictions, employment is 'at-will', meaning either party can terminate at any time.",
        "Non-competes are increasingly difficult to enforce unless they are very narrowly scoped.",
        "Ensure your intellectual property outside of work hours is explicitly protected."
      ];
    }
    if (title.includes("nda") || title.includes("confidential")) {
      return [
        "Confidentiality obligations should usually have a specific time limit (e.g., 2-5 years).",
        "Make sure 'Confidential Information' doesn't include things you already knew before.",
        "Watch out for overly broad definitions that could restrict your future work."
      ];
    }
    // Default / Freelance
    return [
      "Always clarify who owns the intellectual property and when ownership transfers (usually upon full payment).",
      "Net-30 payment terms are standard, but try to negotiate Net-15 for better cash flow.",
      "Make sure you have a clear 'out' clause if the relationship isn't working."
    ];
  };

  const dynamicInsights = getDynamicInsights();

  const renderHighlightedText = (content: string, highlightRanges: { start: number; end: number }[], triggerPhrases: string[]) => {
    if (!content) return <span className="italic">Relevant text from clause.</span>;
                  
    let finalRanges = [...(highlightRanges || [])];
    if (finalRanges.length === 0 && triggerPhrases && triggerPhrases.length > 0) {
        const lowerContent = content.toLowerCase();
        triggerPhrases.forEach((phrase: string) => {
          if (phrase && phrase.length > 3) {
            const start = lowerContent.indexOf(phrase.toLowerCase());
            if (start !== -1) {
              finalRanges.push({ start, end: start + phrase.length });
            }
          }
        });
    }

    if (finalRanges.length === 0) {
      return <span className="italic">"{content.substring(0, 250)}..."</span>;
    }

    const ranges = finalRanges.sort((a, b) => a.start - b.start);
    const elements = [];
    let currentIndex = 0;

    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i];
      if (range.start < currentIndex) continue; 
      
      if (range.start > currentIndex) {
        elements.push(<span key={`text-${i}`}>{content.substring(currentIndex, range.start)}</span>);
      }
      
      elements.push(
        <mark key={`highlight-${i}`} className="bg-yellow-200 text-slate-900 px-1 rounded-sm font-bold">
          {content.substring(range.start, range.end)}
        </mark>
      );
      
      currentIndex = range.end;
    }
    
    if (currentIndex < content.length) {
        elements.push(<span key={`text-end`}>{content.substring(currentIndex)}</span>);
    }
    
    return elements;
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#FAFAFA] min-h-screen text-slate-900 font-sans print:bg-white print:p-0 print:m-0">
      
      {/* PAGE 1: Before You Sign */}
      <div className="p-8 md:p-12 min-h-screen flex flex-col justify-between print:min-h-0 print:page-break-after-always">
        <div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-8 mb-10 border-slate-200 gap-4">
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-3">ContractSense Review</p>
              <h1 className="text-4xl font-heading font-bold text-slate-900 mb-2">
                Before You Sign
              </h1>
              <p className="text-slate-500 text-lg">{contract.title}</p>
            </div>
            <div className="text-left md:text-right w-full md:w-auto">
              <p className="text-slate-500 text-sm mb-3">{new Date().toISOString().split('T')[0]}</p>
              <PrintButton />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 mb-10">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <Target className="w-4 h-4 text-slate-400" />
              Our Recommendation
            </h2>
            <p className="text-3xl font-heading font-bold leading-tight text-slate-900">
              {recommendedAction}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
               <h3 className="text-emerald-800 font-bold mb-4 flex items-center gap-2">
                 <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                 Good News
               </h3>
               <ul className="space-y-3">
                 {lowClauses.length > 0 ? lowClauses.slice(0, 4).map((c, i) => (
                   <li key={i} className="text-sm text-emerald-700 leading-relaxed">• {getFriendlyClauseTitle(c.title)}</li>
                 )) : <li className="text-sm text-emerald-700/70 italic">None found.</li>}
               </ul>
            </div>
            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
               <h3 className="text-orange-800 font-bold mb-4 flex items-center gap-2">
                 <ShieldAlert className="w-5 h-5 text-orange-600" />
                 Review Carefully
               </h3>
               <ul className="space-y-3">
                 {mediumClauses.length > 0 ? mediumClauses.slice(0, 4).map((c, i) => (
                   <li key={i} className="text-sm text-orange-700 leading-relaxed">• {getFriendlyClauseTitle(c.title)}</li>
                 )) : <li className="text-sm text-orange-700/70 italic">None found.</li>}
               </ul>
            </div>
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
               <h3 className="text-red-800 font-bold mb-4 flex items-center gap-2">
                 <ShieldAlert className="w-5 h-5 text-red-600" />
                 Don't Ignore
               </h3>
               <ul className="space-y-3">
                 {topPriorities.length > 0 ? topPriorities.slice(0, 4).map((c, i) => (
                   <li key={i} className="text-sm text-red-700 leading-relaxed">• {getFriendlyClauseTitle(c.title)}</li>
                 )) : <li className="text-sm text-red-700/70 italic">None found.</li>}
               </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-8 mt-8">
           <div className="flex gap-8 text-sm">
             <div>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Reviewed</p>
               <p className="font-bold text-slate-900 text-lg">{clauses.length} Clauses</p>
             </div>
             <div>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Needs Attention</p>
               <p className="font-bold text-slate-900 text-lg">{needsAttentionCount} Clauses</p>
             </div>
             <div>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Looks Good</p>
               <p className="font-bold text-slate-900 text-lg">{lowClauses.length} Clauses</p>
             </div>
           </div>
        </div>
      </div>

      {/* PAGE 2: Your Top Priorities */}
      {topPriorities.length > 0 && (
        <div className="p-8 md:p-12 print:page-break-after-always">
          <h2 className="text-3xl font-heading font-bold text-slate-900 mb-2">Your Top Priorities</h2>
          <p className="text-slate-500 text-lg mb-12">These clauses have the biggest impact and shouldn't be ignored.</p>
          
          <div className="space-y-16">
            {topPriorities.map((clause, idx) => (
              <div key={idx} className="print:break-inside-avoid border-b border-slate-200 pb-16 last:border-0 last:pb-0">
                <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">
                    {idx + 1}
                  </span>
                  {getFriendlyClauseTitle(clause.title)}
                </h3>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    📌 What We Found
                  </h4>
                  <div className="text-slate-800 text-lg leading-relaxed font-medium">
                    {renderHighlightedText(clause.content, clause.clauseInsight?.highlightRanges || [], clause.clauseInsight?.triggerPhrases || [])}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">💡 What This Means</h4>
                    <p className="text-slate-900 text-lg">{getInOneSentence(clause)}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">⚠️ Why It Matters</h4>
                    <p className="text-slate-600 leading-relaxed">{getWhyThisMatters(clause)}</p>
                  </div>
                </div>

                {getRealLifeExample(clause) && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">🌍 Real-Life Example</p>
                    <p className="text-slate-800 italic leading-relaxed">{getRealLifeExample(clause)}</p>
                  </div>
                )}

                <div className="bg-white border-2 border-slate-900 rounded-3xl p-8 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">✅ Our Advice</h4>
                  <div className="flex items-start gap-4">
                     <span className="text-2xl mt-1">✅</span>
                     <div className="flex-1">
                       <p className="text-xl font-bold text-slate-900 mb-2">
                         {clause.clauseInsight?.recommendedAction === 'NEGOTIATE' && 'Negotiate this clause.'}
                         {clause.clauseInsight?.recommendedAction === 'SAFE' && 'You can safely accept this.'}
                         {clause.clauseInsight?.recommendedAction === 'REVIEW' && 'Review carefully before accepting.'}
                         {clause.clauseInsight?.recommendedAction === 'LAWYER' && 'Consult a lawyer before signing.'}
                         {!clause.clauseInsight?.recommendedAction && getBottomLine(clause)}
                       </p>
                       <p className="text-slate-600 mb-6">{getBottomLine(clause)}</p>

                       <div className="flex items-center gap-3">
                         <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${getShouldYouBeConcernedText(clause).color}`}>
                           {getShouldYouBeConcernedText(clause).indicator} {getShouldYouBeConcernedText(clause).text}
                         </div>
                       </div>
                     </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE 3: Negotiation Cheat Sheet */}
      {negotiatedClauses.length > 0 && (
        <div className="p-8 md:p-12 bg-white print:page-break-after-always">
          <h2 className="text-3xl font-heading font-bold text-slate-900 mb-2">Negotiation Cheat Sheet</h2>
          <p className="text-slate-500 text-lg mb-12">How to ask for changes like a professional.</p>
          
          <div className="space-y-8">
            {negotiatedClauses.map((clause, idx) => (
              <div key={idx} className="print:break-inside-avoid border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-slate-50 p-6 border-b border-slate-200">
                  <h3 className="font-bold text-xl text-slate-900 mb-2">{getFriendlyClauseTitle(clause.title)}</h3>
                  <p className="text-slate-600 text-sm">{clause.clauseInsight?.reasonFlagged || getWhyThisMatters(clause)}</p>
                </div>
                
                <div className="p-6">
                  {clause.clauseInsight?.conversationStarter && (
                    <div className="mb-6">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" /> Suggested Message
                      </h4>
                      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 text-blue-900 font-medium italic">
                        "{clause.clauseInsight.conversationStarter}"
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                    {clause.clauseInsight?.businessImpact?.ifIgnored && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">If Ignored</p>
                        <p className="text-red-700 text-sm font-medium">{clause.clauseInsight.businessImpact.ifIgnored}</p>
                      </div>
                    )}
                    {clause.clauseInsight?.businessImpact?.ifAccepted && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">If Negotiated</p>
                        <p className="text-emerald-700 text-sm font-medium">{clause.clauseInsight.businessImpact.ifAccepted}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE 4: Good News */}
      {lowClauses.length > 0 && (
        <div className="p-8 md:p-12 print:page-break-after-always">
          <h2 className="text-3xl font-heading font-bold text-slate-900 mb-2">The Good News</h2>
          <p className="text-slate-500 text-lg mb-12">These clauses are balanced and standard.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lowClauses.map((clause, idx) => (
              <div key={idx} className="print:break-inside-avoid bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-emerald-900 text-lg mb-2">{getFriendlyClauseTitle(clause.title)}</h3>
                  <p className="text-emerald-800/80 text-sm leading-relaxed">{getInOneSentence(clause)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE 5: If This Were My Contract... & Checklist */}
      <div className="p-8 md:p-12 bg-white print:page-break-after-always flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <h2 className="text-3xl font-heading font-bold text-slate-900 mb-6">If This Were My Contract...</h2>
          <div className="prose prose-lg text-slate-700 leading-relaxed max-w-none">
            <p className="mb-4">
              I would be feeling {recommendedAction.includes("Sign") ? "confident" : "cautious"} right now. 
            </p>
            <p className="mb-4">
              {contract.executiveSummary}
            </p>
            <p>
              Remember, a contract is a living conversation. Asking clarifying questions or suggesting reasonable changes is a completely normal part of doing business. Good partners expect it.
            </p>
          </div>
        </div>

        <div className="w-full md:w-80 shrink-0">
          <div className="bg-slate-900 text-white p-8 rounded-3xl">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6" /> Before Signing
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded border-2 border-slate-600 shrink-0 mt-0.5"></div>
                <span className="text-sm text-slate-300">Ask clarifying questions about anything you don't understand.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded border-2 border-slate-600 shrink-0 mt-0.5"></div>
                <span className="text-sm text-slate-300">Send an email summarizing what you agreed to.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded border-2 border-slate-600 shrink-0 mt-0.5"></div>
                <span className="text-sm text-slate-300">Save a copy of the fully signed document.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* PAGE 6 & 7: Helpful Things To Know & About */}
      <div className="p-8 md:p-12">
        <div className="mb-16 print:break-inside-avoid">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-600" />
            Helpful Things To Know
          </h2>
          <div className="space-y-6">
            {dynamicInsights.map((insight, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                <p className="text-slate-700 font-medium">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-12 print:break-inside-avoid">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">About This Review</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-4 max-w-3xl">
            ContractSense AI uses advanced language models to interpret legal text. While we strive for accuracy, AI can occasionally misunderstand nuance or context. 
            This report is designed to give you clarity and confidence, but it is purely informational and <strong>does not constitute legal advice</strong>. 
          </p>
          <p className="text-slate-500 text-sm leading-relaxed max-w-3xl">
            If you are dealing with high-stakes agreements, large sums of money, or complex legal concepts, we strongly recommend consulting a qualified attorney.
          </p>
        </div>
      </div>

    </div>
  );
}
