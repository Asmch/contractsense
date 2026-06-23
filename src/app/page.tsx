"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeatureStory } from "@/components/landing/FeatureStory";
import { WorkspaceShowcase } from "@/components/landing/WorkspaceShowcase";
import { FounderStory } from "@/components/landing/FounderStory";
import { UploadDemo } from "@/components/landing/UploadDemo";
import { EnterpriseSecurity } from "@/components/landing/EnterpriseSecurity";
import { EnterpriseFooter } from "@/components/landing/EnterpriseFooter";
import { ContractTypes } from "@/components/landing/ContractTypes";
import { Metrics, Integrations } from "@/components/landing/MetricsIntegrations";
import { SocialProofLogos, FAQ } from "@/components/landing/SocialProofAndFAQ";
import { MessageSquare, ArrowRightLeft } from "lucide-react";

// Premium Feature Story Left/Right Demos
function ContractSummaryDemo() {
  return (
    <div className="flex flex-col sm:flex-row gap-6 h-full">
      <div className="flex-1 bg-white p-6 rounded-xl border border-border/50 text-xs text-muted-foreground relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white to-transparent" />
        <div className="space-y-3 opacity-40 blur-[1px]">
          <div className="h-2 w-full bg-slate-200 rounded" />
          <div className="h-2 w-5/6 bg-slate-200 rounded" />
          <div className="h-2 w-full bg-slate-200 rounded" />
          <div className="h-2 w-3/4 bg-slate-200 rounded" />
        </div>
        <div className="my-4 p-2 bg-primary/10 border-l-2 border-primary text-foreground font-medium opacity-100 blur-none">
          Client retains exclusive rights to all derivative works and underlying intellectual property worldwide.
        </div>
        <div className="space-y-3 opacity-40 blur-[1px]">
          <div className="h-2 w-full bg-slate-200 rounded" />
          <div className="h-2 w-5/6 bg-slate-200 rounded" />
        </div>
      </div>
      <div className="flex-1 bg-secondary/5 p-6 rounded-xl border border-primary/20 flex flex-col justify-center">
        <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">AI Summary</div>
        <p className="text-foreground text-sm font-medium mb-4">You are giving away everything.</p>
        <p className="text-muted-foreground text-xs leading-relaxed">
          The client automatically owns any code, designs, or ideas you create during this project, permanently, all over the world.
        </p>
      </div>
    </div>
  );
}

function RiskDetectionDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white p-4 rounded-xl border border-destructive/20 relative">
        <div className="absolute -left-2 -top-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-destructive/20">!</div>
        <div className="text-xs text-muted-foreground mb-1">Clause 9.2 - Liability</div>
        <p className="text-sm text-foreground">
          Contractor shall be liable for <span className="bg-destructive/20 text-destructive font-semibold px-1 rounded">any and all consequential damages</span> arising out of this Agreement.
        </p>
      </div>
      
      <div className="bg-warning/10 p-5 rounded-xl border border-warning/20 ml-8">
        <div className="text-[10px] font-bold text-warning uppercase tracking-widest mb-2">Why AI Flagged This</div>
        <p className="text-xs text-foreground font-medium mb-1">Unlimited Consequential Damages</p>
        <p className="text-xs text-muted-foreground">
          Industry-standard agreements typically waive consequential damages and cap liability at 12 months of fees paid. This exposes you to infinite financial risk.
        </p>
      </div>
    </div>
  );
}

function ContractChatDemo() {
  return (
    <div className="flex flex-col sm:flex-row gap-6 h-full">
      <div className="flex-1 flex flex-col gap-4 justify-end">
        <div className="self-end bg-primary/10 text-foreground text-sm px-4 py-3 rounded-2xl rounded-tr-none border border-primary/20 max-w-[80%]">
          Can I terminate this contract if they stop paying?
        </div>
        <div className="self-start bg-white border border-border/50 text-foreground text-sm px-4 py-3 rounded-2xl rounded-tl-none max-w-[90%] shadow-sm">
          <p className="mb-2">Yes, but only after a 30-day cure period.</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            According to <span className="text-primary font-medium cursor-pointer hover:underline">§ 11.2 (Termination for Cause)</span>, you must provide written notice of non-payment and allow the client 30 days to resolve it before you can legally terminate.
          </p>
        </div>
      </div>
    </div>
  );
}

function ContractComparisonDemo() {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-border/50 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-secondary/5">
        <div className="text-xs font-medium text-muted-foreground">Original Draft</div>
        <ArrowRightLeft className="w-4 h-4 text-muted-foreground/50" />
        <div className="text-xs font-medium text-primary">Redlined Version</div>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Payment Terms</div>
          <div className="text-sm font-medium line-through text-destructive/70 mb-1">Net-90 days</div>
          <div className="text-sm font-medium text-success bg-success/10 px-2 py-0.5 rounded inline-block">Net-30 days</div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Liability Cap</div>
          <div className="text-sm font-medium line-through text-destructive/70 mb-1">Unlimited</div>
          <div className="text-sm font-medium text-success bg-success/10 px-2 py-0.5 rounded inline-block">1x Trailing 12-Month Fees</div>
        </div>
      </div>
    </div>
  );
}


export default function LandingPage() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="min-h-screen relative">
      <div className="mouse-light" />
      <Navbar />
      
      {/* 1. Hero */}
      <Hero />
      
      {/* 1.5 Social Proof Logos (New) */}
      <SocialProofLogos />
      
      {/* 2. How it Works */}
      <HowItWorks />
      
      {/* 3. Founder Story (Moved up for emotional connection) */}
      <FounderStory />
      
      {/* 4. Feature Stories */}
      <div className="bg-white relative z-10 border-t border-border/50">
        <FeatureStory 
          title="Distill 50-page contracts into a 60-second executive brief."
          description="Stop drowning in legalese. Our AI instantly surfaces the core obligations, rights, and timelines in plain English so you know exactly what you're signing up for."
        >
          <ContractSummaryDemo />
        </FeatureStory>

        <FeatureStory 
          reverse
          title="Flag indemnity, liability, and IP red flags instantly."
          description="Every clause is scored against 47 legal risk dimensions. We don't just highlight the problem—we explain exactly why it's dangerous compared to market standards."
        >
          <RiskDetectionDemo />
        </FeatureStory>

        <FeatureStory 
          title="Ask anything about your contracts."
          description="Have a specific question? Just ask. Our legal AI understands the entire context of your agreement and provides cited answers instantly."
        >
          <ContractChatDemo />
        </FeatureStory>

        <FeatureStory 
          reverse
          title="Never miss a sneaky redline."
          description="Upload two versions of a contract and instantly see every meaningful semantic change. We don't just diff text, we diff legal implications."
        >
          <ContractComparisonDemo />
        </FeatureStory>
      </div>

      {/* 5. Supported Contract Types */}
      <ContractTypes />

      {/* 6. Enterprise Security */}
      <EnterpriseSecurity />

      {/* 7. Workspace Showcase */}
      <WorkspaceShowcase />

      {/* 8. Integrations */}
      <Integrations />

      {/* 9. Animated Metrics */}
      <Metrics />
      
      {/* 10. FAQ (New) */}
      <FAQ />

      {/* 11. Final Conversion Upload Demo */}
      <UploadDemo />

      {/* 12. Massive Enterprise Footer */}
      <EnterpriseFooter />
      
    </main>
  );
}
