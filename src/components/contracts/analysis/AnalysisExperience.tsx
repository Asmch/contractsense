"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { DocumentStats } from "./DocumentStats";
import { TrustIndicators } from "./TrustIndicators";
import { NextSteps } from "./NextSteps";
import { ReviewChecklist } from "./ReviewChecklist";
import { AIActivityFeed, Discovery, DiscoveryType } from "./AIActivityFeed";
import { PersonalizedHandoff } from "./PersonalizedHandoff";
import { AlertCircle, RefreshCw, Loader2, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";



export function AnalysisExperience({ contract }: { contract: any }) {
  const router = useRouter();
  const [status, setStatus] = useState(contract.status);
  const [error, setError] = useState<string | null>(null);
  
  const [phase, setPhase] = useState(0); 
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [clausesFound, setClausesFound] = useState(0);
  const [risksFound, setRisksFound] = useState(0);
  const [showHandoff, setShowHandoff] = useState(false);
  
  const [completionData, setCompletionData] = useState<any>(null);

  const hasStarted = useRef(false);
  const simulationTimer = useRef<NodeJS.Timeout | null>(null);

  // Auto-start the actual backend process
  useEffect(() => {
    if (!hasStarted.current && (status === "UPLOADED" || status === "RATE_LIMITED")) {
      hasStarted.current = true;
      startProcessing();
    }
  }, [status]);

  const startProcessing = async () => {
    try {
      const res = await fetch(`/api/contracts/${contract._id}/process`, {
        method: "POST"
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to process document");
      }
    } catch (err: any) {
      if (err.message?.startsWith("RATE_LIMIT_EXCEEDED")) {
        setStatus("RATE_LIMITED");
        setError(err.message);
      } else {
        setStatus("FAILED");
        setError(err.message);
      }
    }
  };

  // Poll backend status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (status !== "COMPLETE" && status !== "FAILED" && status !== "RATE_LIMITED") {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/contracts/${contract._id}/status`);
          if (res.ok) {
            const data = await res.json();
            setStatus(data.status);
            
            if (data.discoveries && data.discoveries.length > discoveries.length) {
              setDiscoveries(data.discoveries);
              
              // Derive stats
              const clauses = data.discoveries.filter((d: any) => d.message.includes("clause")).length;
              const risks = data.discoveries.filter((d: any) => d.type === "warning").length;
              setClausesFound(prev => Math.max(prev, clauses * 2));
              setRisksFound(prev => Math.max(prev, risks));
            }
            
            if (data.status === "COMPLETE") {
              setCompletionData(data);
              setShowHandoff(true);
              // Wait 3 seconds then refresh
              setTimeout(() => {
                router.refresh();
              }, 3000);
            }
          }
        } catch (e) {
          console.error("Polling failed", e);
        }
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [status, contract._id, router, discoveries.length]);

  // Simulate progress phases over time while processing
  useEffect(() => {
    if (status === "COMPLETE" || status === "FAILED" || status === "RATE_LIMITED") {
      if (simulationTimer.current) clearInterval(simulationTimer.current);
      return;
    }

    let tick = 0;
    simulationTimer.current = setInterval(() => {
      tick++;

      // Update Phase (0-4) for Trust Badges
      if (tick === 2) setPhase(1);
      if (tick === 6) setPhase(2);
      if (tick === 10) setPhase(3);
      if (tick === 14) setPhase(4);

    }, 1500);

    return () => {
      if (simulationTimer.current) clearInterval(simulationTimer.current);
    };
  }, [status]);

  if (showHandoff && completionData) {
    const highRisksCount = completionData.decision?.clauseBreakdown?.needsAttention || risksFound;
    return (
      <PersonalizedHandoff 
        healthScore={completionData.safetyScore || 100}
        mainRecommendation={completionData.decision?.verdict?.title || "Review Complete"}
        highRisksCount={highRisksCount}
      />
    );
  }

  if (status === "RATE_LIMITED" || status === "FAILED") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center pt-20 px-4 text-center">
        <div className="w-24 h-24 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mb-6 text-amber-500">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h3 className="text-3xl font-heading font-semibold text-foreground mb-4">
          {status === "RATE_LIMITED" ? "Rate Limit Reached" : "Processing Failed"}
        </h3>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          {error || "An error occurred while analyzing the document."}
        </p>
        <button 
          onClick={() => { hasStarted.current = false; setStatus("UPLOADED"); }}
          className="bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-medium hover:bg-primary/90 flex items-center gap-3"
        >
          <RefreshCw className="w-5 h-5" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-0 bg-[#f8fafc] rounded-3xl border border-border/50 shadow-inner flex flex-col relative overflow-hidden">
      
      {/* Background animated glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[100px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[100px] rounded-full animate-pulse pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between p-8 pb-4 shrink-0 relative z-10 border-b border-border/50 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white border border-border/50 shadow-sm flex items-center justify-center text-primary">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground">We're carefully reviewing your agreement.</h2>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" /> {contract.title || "Document Analysis"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 overflow-y-auto custom-scrollbar">
        
        {/* Left Column (Stats & Trust) */}
        <div className="flex flex-col gap-6">
          <DocumentStats 
            pages={contract.pageCount || 1} 
            words={contract.wordCount || 0} 
            clausesFound={clausesFound} 
            risksFound={risksFound} 
            contractType="Contract"
          />
          <TrustIndicators phase={phase} />
        </div>

        {/* Center Column (Discovery Feed) */}
        <div className="flex flex-col h-full">
          <AIActivityFeed discoveries={discoveries} />
        </div>

        {/* Right Column (Checklist & Next Steps) */}
        <div className="flex flex-col gap-6">
          <ReviewChecklist currentCheckIndex={Math.min(5, Math.floor(discoveries.length / 1.5))} />
          <NextSteps />
        </div>

      </div>
    </div>
  );
}
