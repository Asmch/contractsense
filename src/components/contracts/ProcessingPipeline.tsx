"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Circle, AlertCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

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
        setRateLimitCountdown(60); // fallback
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
    // Map intermediate polling states if applicable
    const isDone = (target: string) => currentStatus === "COMPLETE" || currentStatus === "FAILED" || currentStatus === "RATE_LIMITED";
    const isActive = (target: string) => currentStatus === target;

    return [
      { id: "uploaded", label: "Uploaded Document", status: "done" },
      { id: "extracting", label: "Extracting Text & Layout", status: currentStatus === "UPLOADED" ? "pending" : (isActive("PARSING") ? "active" : "done") },
      { id: "clauses", label: "Detecting Clauses", status: isActive("ANALYZING") ? "active" : (isDone("COMPLETE") ? "done" : "pending") },
      { id: "risks", label: "AI Risk Analysis", status: isActive("ANALYZING") ? "active" : (isDone("COMPLETE") ? "done" : "pending") }, 
      { id: "summary", label: "Generating Summary", status: isActive("ANALYZING") ? "active" : (isDone("COMPLETE") ? "done" : "pending") }, 
      { id: "report", label: "Building Final Report", status: currentStatus === "COMPLETE" ? "done" : "pending" },
    ];
  };

  const steps = getPipelineSteps(status);

  return (
    <div className="w-full lg:w-[400px] glass-panel bg-white border border-border/50 rounded-2xl flex flex-col shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-y-auto">
      <div className="p-6 border-b border-border/50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Analysis Status</h3>
          <p className="text-sm text-muted-foreground mt-1">Real-time pipeline monitoring</p>
        </div>
        {status === "FAILED" && (
          <button 
            onClick={startProcessing}
            className="p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
            title="Retry Processing"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-6 flex-1">
        {status === "UPLOADED" ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-medium text-foreground mb-2">Ready to Analyze</h3>
            <p className="text-sm text-muted-foreground mb-8 max-w-[250px]">
              Your document has been uploaded. Click below to begin the AI risk analysis.
            </p>
            <button 
              onClick={startProcessing}
              disabled={isProcessing}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all shadow-md gold-glow w-full flex items-center justify-center gap-2"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Start Analysis"}
            </button>
          </div>
        ) : status === "RATE_LIMITED" ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
            <h3 className="text-xl font-heading font-medium text-foreground mb-2">API Rate Limit Hit</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Google Gemini Free Tier limit reached. The process has been safely paused. <br/><br/>
              <span className="font-semibold text-amber-600">{error}</span>
            </p>
            <button 
              onClick={startProcessing}
              disabled={isProcessing || rateLimitCountdown > 0}
              className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm ${
                rateLimitCountdown > 0 
                  ? "bg-muted text-muted-foreground cursor-not-allowed" 
                  : "bg-primary text-primary-foreground hover:bg-primary/90 gold-glow"
              }`}
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : rateLimitCountdown > 0 ? (
                <><RefreshCw className="w-4 h-4 opacity-50" /> Resuming in {rateLimitCountdown}s...</>
              ) : (
                <><RefreshCw className="w-4 h-4" /> Resume Analysis</>
              )}
            </button>
          </div>
        ) : status === "FAILED" ? (
           <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <h3 className="text-xl font-heading font-medium text-foreground mb-2">Processing Failed</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {error || "An error occurred while parsing the document."}
            </p>
            <button 
              onClick={startProcessing}
              disabled={isProcessing}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm gold-glow flex items-center gap-2"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><RefreshCw className="w-4 h-4" /> Retry</>}
            </button>
          </div>
        ) : (
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border/50 before:to-transparent">
            {steps.map((step) => (
              <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                <div className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10 
                  bg-white border-2 ${step.status === "pending" ? "border-muted-foreground/30" : ""}`}>
                  {step.status === "done" && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-500/10 border-none bg-white rounded-full" />
                  )}
                  {step.status === "active" && (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  )}
                  {step.status === "pending" && (
                    <Circle className="w-4 h-4 text-transparent" />
                  )}
                </div>

                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] pl-4 md:pl-0 md:pr-4 md:group-even:pr-0 md:group-even:pl-4">
                  <h4 className={`text-sm font-medium ${
                    step.status === "active" ? "text-primary" : 
                    step.status === "done" ? "text-foreground" : 
                    "text-muted-foreground"
                  }`}>
                    {step.label}
                  </h4>
                  {step.status === "active" && (
                    <p className="text-xs text-muted-foreground mt-1">Processing...</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
