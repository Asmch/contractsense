"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, AlertCircle, RefreshCw, BrainCircuit, FileText, Search, ShieldAlert, PenTool, FileCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function ProcessingPipeline({ contract }: { contract: any }) {
  const router = useRouter();
  const [status, setStatus] = useState(contract.status);
  const [isProcessing, setIsProcessing] = useState(["PARSING", "ANALYZING", "READY"].includes(contract.status));
  const [error, setError] = useState<string | null>(null);
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0);

  // Initialize countdown when hitting RATE_LIMITED
  useEffect(() => {
    if (status === "RATE_LIMITED" && error) {
      const match = error.match(/(\d+) seconds/);
      if (match) {
        setRateLimitCountdown(parseInt(match[1]));
      } else {
        setRateLimitCountdown(60);
      }
    }
  }, [status, error]);

  // Tick down the countdown timer
  useEffect(() => {
    if (rateLimitCountdown > 0) {
      const timer = setTimeout(() => setRateLimitCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [rateLimitCountdown]);

  // Poll for updates if processing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isProcessing && status !== "UPLOADED" && status !== "RATE_LIMITED") {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/contracts/${contract._id}/status`);
          if (res.ok) {
            const data = await res.json();
            setStatus(data.status);
            if (["COMPLETE", "FAILED", "RATE_LIMITED"].includes(data.status)) {
              setIsProcessing(false);
              if (data.status === "COMPLETE") {
                router.refresh();
              }
            }
          }
        } catch (e) {
          console.error("Polling failed", e);
        }
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isProcessing, status, contract._id, router]);

  const startProcessing = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      let currentStage = status === "RATE_LIMITED" ? "ANALYZING" : "PARSING";
      setStatus(currentStage);
      
      const interval = setInterval(() => {
        // Simulate progress visually until polling updates it
        currentStage = currentStage === "PARSING" ? "ANALYZING" : "PARSING";
        setStatus(currentStage);
      }, 3000); 

      const res = await fetch(`/api/contracts/${contract._id}/process`, {
        method: "POST"
      });

      clearInterval(interval);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to process document");
      }
      
      setStatus("COMPLETE");
      setIsProcessing(false);
      router.refresh();
      
    } catch (err: any) {
      setIsProcessing(false);
      
      if (err.message?.startsWith("RATE_LIMIT_EXCEEDED")) {
        setStatus("RATE_LIMITED");
        const waitTime = err.message.split(":")[1] || "60";
        setError(`Please wait ${waitTime} seconds before resuming.`);
      } else {
        setStatus("FAILED");
        setError(err.message);
      }
    }
  };

  const getPipelineSteps = (currentStatus: string) => {
    const isDone = (target: string) => currentStatus === "COMPLETE" || currentStatus === "FAILED" || currentStatus === "RATE_LIMITED";
    const isActive = (target: string) => currentStatus === target;

    return [
      { id: "uploaded", label: "Document Uploaded", icon: FileText, status: "done" },
      { id: "extracting", label: "Reading the Document", icon: Search, status: currentStatus === "UPLOADED" ? "pending" : (isActive("PARSING") ? "active" : "done") },
      { id: "clauses", label: "Finding Important Rules", icon: FileCheck, status: isActive("ANALYZING") ? "active" : (isDone("COMPLETE") ? "done" : "pending") },
      { id: "risks", label: "Analyzing Risks", icon: ShieldAlert, status: isActive("ANALYZING") ? "active" : (isDone("COMPLETE") ? "done" : "pending") }, 
      { id: "negotiation", label: "Building Your Negotiation Plan", icon: PenTool, status: isActive("ANALYZING") ? "active" : (isDone("COMPLETE") ? "done" : "pending") }, 
      { id: "report", label: "Creating Your Guide", icon: BrainCircuit, status: currentStatus === "COMPLETE" ? "done" : "pending" },
    ];
  };

  const steps = getPipelineSteps(status);

  return (
    <div className="w-full h-full flex justify-center pt-6 md:pt-10 relative overflow-y-auto overflow-x-hidden custom-scrollbar bg-white/40 rounded-3xl border border-border/50 shadow-sm backdrop-blur-sm">
      
      {/* Background Pulse Animation for Processing State */}
      {isProcessing && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
            className="w-96 h-96 rounded-full border-[10px] border-primary absolute"
          />
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeOut", delay: 2 }}
            className="w-96 h-96 rounded-full border-[10px] border-primary absolute"
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {status === "UPLOADED" ? (
          <motion.div 
            key="ready"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-start max-w-lg text-center z-10 px-8 pb-8"
          >
            <div className="relative mb-6 group">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-500" />
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white border border-border/50 rounded-full flex items-center justify-center relative shadow-lg text-primary">
                <BrainCircuit className="w-10 h-10 md:w-12 md:h-12" />
              </div>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-heading font-semibold text-foreground mb-3">Ready to Review</h3>
            <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">
              We'll read through this document, highlight any risks, and tell you exactly what to do next.
            </p>
            
            <button 
              onClick={startProcessing}
              disabled={isProcessing}
              className="bg-primary text-primary-foreground px-8 py-3.5 md:px-10 md:py-4 rounded-xl text-lg font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] w-full max-w-sm flex items-center justify-center gap-3 relative overflow-hidden group"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : "Start Review"}
            </button>
          </motion.div>
        ) : status === "RATE_LIMITED" ? (
          <motion.div 
            key="rate-limited"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center max-w-lg text-center z-10 p-8"
          >
            <div className="w-24 h-24 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mb-6 text-amber-500">
              <AlertCircle className="w-12 h-12" />
            </div>
            <h3 className="text-3xl font-heading font-semibold text-foreground mb-4">Rate Limit Reached</h3>
            <p className="text-lg text-muted-foreground mb-8">
              Google Gemini Free Tier limit reached. The process has been safely paused. <br/><br/>
              <span className="font-semibold text-amber-600 bg-amber-500/10 px-4 py-2 rounded-lg inline-block">{error}</span>
            </p>
            <button 
              onClick={startProcessing}
              disabled={isProcessing || rateLimitCountdown > 0}
              className={`px-8 py-4 rounded-xl text-lg font-medium flex items-center justify-center gap-3 w-full max-w-sm transition-all shadow-sm ${
                rateLimitCountdown > 0 
                  ? "bg-muted text-muted-foreground cursor-not-allowed" 
                  : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
              }`}
            >
              {isProcessing ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : rateLimitCountdown > 0 ? (
                <><RefreshCw className="w-5 h-5 opacity-50" /> Resuming in {rateLimitCountdown}s</>
              ) : (
                <><RefreshCw className="w-5 h-5" /> Resume Review</>
              )}
            </button>
          </motion.div>
        ) : status === "FAILED" ? (
           <motion.div 
            key="failed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center max-w-lg text-center z-10 p-8"
          >
            <div className="w-24 h-24 bg-destructive/10 border border-destructive/20 rounded-full flex items-center justify-center mb-6 text-destructive">
              <AlertCircle className="w-12 h-12" />
            </div>
            <h3 className="text-3xl font-heading font-semibold text-foreground mb-4">Processing Failed</h3>
            <p className="text-lg text-muted-foreground mb-8">
              {error || "Something went wrong while reading your document. Please try again."}
            </p>
            <button 
              onClick={startProcessing}
              disabled={isProcessing}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] w-full max-w-sm flex items-center justify-center gap-3"
            >
              {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <><RefreshCw className="w-5 h-5" /> Try Again</>}
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl z-10 px-4 md:px-8 pb-8"
          >
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-2xl md:text-3xl font-heading font-semibold text-foreground mb-2">Reading Document</h3>
              <p className="text-sm md:text-base text-muted-foreground">Please wait while we review your document.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {steps.map((step, idx) => (
                <motion.div 
                  key={step.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`bg-white rounded-2xl p-4 md:p-5 border flex items-center gap-4 md:gap-6 transition-all duration-500 ${
                    step.status === 'active' 
                      ? 'border-primary/50 shadow-[0_4px_20px_rgba(212,175,55,0.1)] scale-[1.02]' 
                      : step.status === 'done' 
                      ? 'border-border/50 opacity-100' 
                      : 'border-border/30 opacity-40'
                  }`}
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${
                    step.status === 'done' ? 'bg-green-500/10 text-green-600' : 
                    step.status === 'active' ? 'bg-primary/10 text-primary' : 
                    'bg-secondary/10 text-muted-foreground'
                  }`}>
                    {step.status === 'done' ? <CheckCircle2 className="w-6 h-6" /> : 
                     step.status === 'active' ? <Loader2 className="w-6 h-6 animate-spin" /> : 
                     <step.icon className="w-5 h-5" />}
                  </div>

                  <div>
                    <h4 className={`text-base md:text-lg font-semibold ${
                      step.status === 'active' ? 'text-primary' : 
                      step.status === 'done' ? 'text-foreground' : 
                      'text-muted-foreground'
                    }`}>
                      {step.label}
                    </h4>
                    {step.status === 'active' && (
                      <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Actively processing...</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
