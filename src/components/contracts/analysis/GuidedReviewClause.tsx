"use client";

import React, { useState } from "react";
import { ChevronDown, MessageSquare, AlertTriangle, CheckCircle, Scale } from "lucide-react";
import { getShouldYouBeConcernedText, getInOneSentence, getWhyThisMatters, getRealLifeExample, getBottomLine, getCanYouIgnoreThis } from "@/utils/clause-templates";

interface GuidedReviewClauseProps {
  clause: any;
  index: number;
  total: number;
  friendlyTitle: string;
}

export function GuidedReviewClause({ clause, index, total, friendlyTitle }: GuidedReviewClauseProps) {
  const [isReadMoreOpen, setIsReadMoreOpen] = useState(false);
  const [isOriginalTextOpen, setIsOriginalTextOpen] = useState(false);

  const shouldConcern = getShouldYouBeConcernedText(clause);
  const inOneSentence = getInOneSentence(clause);
  const whyItMatters = getWhyThisMatters(clause);
  const realLifeExample = getRealLifeExample(clause);
  const bottomLine = getBottomLine(clause);
  const canIgnore = getCanYouIgnoreThis(clause);
  
  // Risk styling
  let riskColor = "text-emerald-600 bg-emerald-50 border-emerald-100";
  let riskDot = "bg-emerald-500";
  let riskLabel = "Standard Clause";
  
  if (clause.riskLevel === "MEDIUM") {
    riskColor = "text-blue-600 bg-blue-50 border-blue-100";
    riskDot = "bg-blue-500";
    riskLabel = "Normal Clause";
  } else if (clause.riskLevel === "HIGH") {
    riskColor = "text-orange-600 bg-orange-50 border-orange-100";
    riskDot = "bg-orange-500";
    riskLabel = "Needs Attention";
  } else if (clause.riskLevel === "CRITICAL") {
    riskColor = "text-red-600 bg-red-50 border-red-100";
    riskDot = "bg-red-500";
    riskLabel = "Danger";
  }

  return (
    <div id={`clause-${index + 1}`} className="relative pl-8 md:pl-12 pb-16">
      {/* Timeline line */}
      {index !== total - 1 && (
        <div className="absolute left-[11px] md:left-[23px] top-8 bottom-0 w-px bg-border/50"></div>
      )}
      
      {/* Timeline Dot */}
      <div className={`absolute left-0 md:left-3 top-2 w-6 h-6 rounded-full border-4 border-white ${riskDot} shadow-sm z-10`}></div>

      {/* Reading Progress & Risk Label */}
      <div className="flex items-center gap-4 mb-3">
        <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
          Clause {index + 1} of {total}
        </span>
        <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${riskColor}`}>
          {riskLabel}
        </span>
      </div>

      {/* Header */}
      <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
        {friendlyTitle}
      </h3>

      <div className="prose prose-slate max-w-none text-foreground/80 space-y-8">
        
        {/* Progressive Disclosure Level 1: In One Sentence & What it Means */}
        <div>
          <p className="text-xl font-medium text-foreground leading-relaxed mb-4">
            {inOneSentence}
          </p>
          <p className="text-lg leading-relaxed">
            {clause.explanation}
          </p>
        </div>

        {/* Action Button: Read More */}
        {!isReadMoreOpen && (
          <button 
            onClick={() => setIsReadMoreOpen(true)}
            className="text-sm font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest flex items-center gap-2"
          >
            Read More <ChevronDown className="w-4 h-4" />
          </button>
        )}

        {/* Progressive Disclosure Level 2: Deep Dive */}
        {isReadMoreOpen && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-10 pt-4 border-t border-border/30">
            
            {/* Why It Matters */}
            <div>
              <h4 className="text-sm font-bold tracking-widest uppercase text-foreground mb-3">Why This Matters</h4>
              <p className="text-lg leading-relaxed">{whyItMatters}</p>
            </div>

            {/* Real Life Example */}
            <div>
              <h4 className="text-sm font-bold tracking-widest uppercase text-foreground mb-3">Real-Life Example</h4>
              <blockquote className="border-l-4 border-primary/20 pl-4 italic text-lg leading-relaxed text-muted-foreground">
                "{realLifeExample}"
              </blockquote>
            </div>

            {/* Better Version (if suggested) */}
            {clause.suggestedRewrite && (
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6">
                <h4 className="text-sm font-bold tracking-widest uppercase text-emerald-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Safer Alternative
                </h4>
                <p className="text-lg font-medium text-emerald-900 leading-relaxed mb-4">
                  {clause.suggestedRewrite}
                </p>
                <div className="pt-4 border-t border-emerald-100/50">
                  <span className="block text-[11px] font-bold tracking-widest uppercase text-emerald-600/70 mb-2">Why this is better</span>
                  <p className="text-base text-emerald-800/80 leading-relaxed">
                    {clause.negotiationAdvice || "This version balances the risk and protects your core legal interests while remaining acceptable to the other party."}
                  </p>
                </div>
              </div>
            )}

            {/* Recommendations / What You Should Do */}
            <div>
              <h4 className="text-sm font-bold tracking-widest uppercase text-foreground mb-4">What You Should Do</h4>
              <ul className="space-y-3">
                {(clause.recommendations?.length > 0 ? clause.recommendations : [bottomLine]).map((rec: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                    <span className="text-lg leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>



            {/* Can you ignore this? */}
            <div className="flex items-center gap-4 py-4 border-y border-border/30">
              <Scale className={`w-5 h-5 ${canIgnore.ignore ? 'text-emerald-500' : 'text-amber-500'}`} />
              <div>
                <span className="font-bold mr-2 text-foreground">{canIgnore.text}</span>
                <span className="text-muted-foreground">— {canIgnore.description}</span>
              </div>
            </div>

            {/* Ask AI Button */}
            <div className="flex justify-start">
              <button 
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('ask-clause', { 
                    detail: { clauseOrder: clause.order, clauseTitle: friendlyTitle } 
                  }));
                }}
                className="flex items-center gap-2 text-primary font-bold bg-primary/5 hover:bg-primary/10 px-5 py-2.5 rounded-full transition-colors text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                Discuss this clause with AI
              </button>
            </div>

            {/* Advanced: Original Legal Text */}
            <div className="pt-8">
              <button 
                onClick={() => setIsOriginalTextOpen(!isOriginalTextOpen)}
                className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest flex items-center gap-2"
              >
                Original Contract Wording <ChevronDown className={`w-3 h-3 transition-transform ${isOriginalTextOpen ? "rotate-180" : ""}`} />
              </button>
              
              {isOriginalTextOpen && (
                <div className="mt-4 p-5 bg-secondary/5 border border-border/50 rounded-xl text-sm font-mono text-muted-foreground leading-relaxed h-48 overflow-y-auto">
                  {clause.content}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
