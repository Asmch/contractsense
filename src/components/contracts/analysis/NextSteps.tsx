"use client";

import { MessageSquare, ShieldAlert, Sparkles, Handshake, PenTool } from "lucide-react";

export function NextSteps() {
  return (
    <div className="bg-white rounded-2xl border border-border/50 p-5 shadow-sm space-y-5">
      <h3 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">What Happens Next?</h3>
      
      <p className="text-sm text-foreground/80 leading-relaxed">
        After the review is complete, you'll receive:
      </p>

      <ul className="space-y-3">
        <li className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-medium text-foreground">Plain-English explanations</span>
        </li>
        
        <li className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-medium text-foreground">Hidden risk detection</span>
        </li>

        <li className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <PenTool className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-medium text-foreground">Safer alternative clauses</span>
        </li>

        <li className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Handshake className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-medium text-foreground">Negotiation suggestions</span>
        </li>

        <li className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-medium text-foreground">Interactive AI Advisor Chat</span>
        </li>
      </ul>
    </div>
  );
}
