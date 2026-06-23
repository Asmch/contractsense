import { connectToDatabase } from "@/database/connection";
import { ContractModel as Contract } from "@/database/models/Contract";
import { ContractClauseModel } from "@/database/models/ContractClause";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { 
  FileText, ShieldAlert, Download, Share2, Trash2, 
  FileType, LayoutList, Calendar, User as UserIcon, CheckCircle2, ScrollText, Activity, BrainCircuit,
  AlertTriangle, Info, ChevronDown, Target, PenTool
} from "lucide-react";
import Link from "next/link";
import { ProcessingPipeline } from "@/components/contracts/ProcessingPipeline";
import { ContractChat } from "@/components/contracts/chat/ContractChat";
import { ClauseScrollListener } from "@/components/contracts/ClauseScrollListener";

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectToDatabase();
  
  const contract = await Contract.findOne({ 
    _id: id,
    ownerId: session.user.id
  }).lean();

  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShieldAlert className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-medium text-foreground">Contract Not Found</h2>
        <p className="text-muted-foreground mt-2">This contract does not exist or you do not have permission to view it.</p>
      </div>
    );
  }

  // Fetch clauses if processing is complete
  let clauses: any[] = [];
  if (contract.status === "COMPLETE" || contract.status === "READY") {
    clauses = await ContractClauseModel.find({ contractId: id }).sort({ order: 1 }).lean();
  }

  // Calculate Risk Breakdown from clauses if not available in contract metadata directly (for safety)
  const lowRisk = clauses.filter(c => c.riskLevel === "LOW").length;
  const mediumRisk = clauses.filter(c => c.riskLevel === "MEDIUM").length;
  const highRisk = clauses.filter(c => c.riskLevel === "HIGH" || c.riskLevel === "CRITICAL").length;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      <ClauseScrollListener />
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/5 border border-border/50 flex items-center justify-center text-secondary">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-semibold text-foreground flex items-center gap-3">
              {contract.title}
              {contract.status === "UPLOADED" && <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-blue-500/10 text-blue-600">Uploaded</span>}
              {contract.status === "PARSING" && <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-orange-500/10 text-orange-600 animate-pulse">Parsing</span>}
              {contract.status === "ANALYZING" && <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-primary/10 text-primary animate-pulse">Analyzing</span>}
              {contract.status === "COMPLETE" && <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-600">AI Analyzed</span>}
              {contract.status === "FAILED" && <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-red-500/10 text-red-600">Failed</span>}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/5 hover:text-foreground border border-transparent hover:border-border/50 transition-all">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <Link href={`/report/${id}`} target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/5 hover:text-foreground border border-transparent hover:border-border/50 transition-all">
            <Download className="w-4 h-4" /> Export Report
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* 2. Metadata Panel */}
      <div className="bg-white/40 backdrop-blur-md border border-border/40 rounded-2xl px-6 py-3 flex flex-wrap items-center gap-x-8 gap-y-3 shrink-0 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-secondary/5 flex items-center justify-center text-muted-foreground">
            <FileType className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80">Format</span>
            <span className="text-xs font-semibold text-foreground">PDF Document</span>
          </div>
        </div>
        
        <div className="w-px h-8 bg-border/40 hidden sm:block"></div>
        
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-secondary/5 flex items-center justify-center text-muted-foreground">
            <LayoutList className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80">Pages</span>
            <span className="text-xs font-semibold text-foreground">{contract.pageCount || 0}</span>
          </div>
        </div>
        
        <div className="w-px h-8 bg-border/40 hidden sm:block"></div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-secondary/5 flex items-center justify-center text-muted-foreground">
            <ScrollText className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80">Word Count</span>
            <span className="text-xs font-semibold text-foreground">{(contract.wordCount || 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="w-px h-8 bg-border/40 hidden sm:block"></div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary">
            <Activity className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-widest text-primary/80">Clauses</span>
            <span className="text-xs font-semibold text-primary">{clauses.length} detected</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5 ml-auto">
          <div className="w-8 h-8 rounded-full bg-secondary/5 flex items-center justify-center text-muted-foreground">
            <UserIcon className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80">Owner</span>
            <span className="text-xs font-semibold text-foreground">{session.user?.name || "User"}</span>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Layout for AI Analyzed Contracts */}
      <div className="flex-1 min-h-0 overflow-hidden pr-2 pb-8">
        {contract.status === "COMPLETE" ? (
          <div className="h-full flex flex-col gap-6">
            
            {/* Main Content Column (Scrollable) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pb-24 pr-4">
              {/* Top Row: Score & Summary */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Safety Score Card */}
              <div className="glass-panel bg-white border border-border/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Contract Safety Score</h3>
                
                <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                  {/* SVG Circle for Score */}
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" className="fill-none stroke-secondary/10" strokeWidth="10" />
                    <circle cx="50" cy="50" r="45" className="fill-none stroke-primary" strokeWidth="10" 
                      strokeDasharray="283" 
                      strokeDashoffset={283 - (283 * (contract.safetyScore || 0)) / 100} 
                      strokeLinecap="round" 
                      style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-heading font-bold text-foreground">{contract.safetyScore || 0}</span>
                    <span className="text-xs font-medium text-muted-foreground">/ 100</span>
                  </div>
                </div>

                {/* Risk Breakdown */}
                <div className="w-full flex items-center justify-between px-4 border-t border-border/50 pt-4 mt-2">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Low</span>
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">{lowRisk}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Medium</span>
                    <span className="text-sm font-bold text-orange-600 bg-orange-500/10 px-3 py-1 rounded-full">{mediumRisk}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">High</span>
                    <span className="text-sm font-bold text-red-600 bg-red-500/10 px-3 py-1 rounded-full">{highRisk}</span>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="lg:col-span-2 glass-panel bg-white border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
                  <h3 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-primary" />
                    Executive Summary
                  </h3>
                  <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                    AI Generated
                  </span>
                </div>
                
                <p className="text-sm text-foreground/80 leading-relaxed mb-6">
                  {contract.executiveSummary || "No summary generated."}
                </p>

                <h4 className="text-sm font-semibold text-foreground mb-3">Key Takeaways</h4>
                <ul className="space-y-2">
                  {contract.keyTakeaways?.map((takeaway: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Executive Negotiation Report */}
            {contract.executiveNegotiationReport && (
              <div className="glass-panel bg-white border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col mt-6">
                 <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
                  <h3 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Executive Negotiation Report
                  </h3>
                  <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                    Top Priorities
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-red-600 uppercase tracking-widest flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-600"></span> Negotiate First</h4>
                    {contract.executiveNegotiationReport.whatToNegotiateFirst?.length > 0 ? (
                      <ul className="space-y-2">
                        {contract.executiveNegotiationReport.whatToNegotiateFirst.map((t: string, i: number) => <li key={i} className="text-sm font-medium">{t}</li>)}
                      </ul>
                    ) : <p className="text-xs text-muted-foreground">None</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-orange-600 uppercase tracking-widest flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-600"></span> Negotiate Second</h4>
                    {contract.executiveNegotiationReport.whatToNegotiateSecond?.length > 0 ? (
                      <ul className="space-y-2">
                        {contract.executiveNegotiationReport.whatToNegotiateSecond.map((t: string, i: number) => <li key={i} className="text-sm font-medium">{t}</li>)}
                      </ul>
                    ) : <p className="text-xs text-muted-foreground">None</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-600"></span> Can Be Ignored</h4>
                    {contract.executiveNegotiationReport.whatCanBeIgnored?.length > 0 ? (
                      <ul className="space-y-2">
                        {contract.executiveNegotiationReport.whatCanBeIgnored.map((t: string, i: number) => <li key={i} className="text-sm font-medium">{t}</li>)}
                      </ul>
                    ) : <p className="text-xs text-muted-foreground">None</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Row: Clause Analysis Accordion */}
            <div className="glass-panel bg-white border border-border/50 rounded-2xl shadow-sm flex flex-col overflow-hidden mt-6">
               <div className="p-6 border-b border-border/50 bg-secondary/5 flex items-center justify-between">
                <h3 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-primary" />
                  Negotiation Center
                </h3>
                <span className="text-xs font-medium text-muted-foreground">
                  {clauses.length} Clauses Analyzed
                </span>
              </div>
              
              <div className="p-2 space-y-2">
                {clauses.map((clause, idx) => (
                  <details id={`clause-${idx + 1}`} key={clause._id.toString()} className="group border border-border/50 rounded-xl overflow-hidden hover:border-primary/30 transition-colors [&_summary::-webkit-details-marker]:hidden">
                    <summary className="bg-white hover:bg-secondary/5 cursor-pointer px-5 py-4 flex items-center justify-between select-none">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary/10 text-muted-foreground text-xs font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="font-medium text-foreground">{clause.title}</h4>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* Risk Badge */}
                        <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded shadow-sm border ${
                          clause.riskLevel === "LOW" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                          clause.riskLevel === "MEDIUM" ? "bg-orange-500/10 text-orange-600 border-orange-500/20" :
                          "bg-red-500/10 text-red-600 border-red-500/20"
                        }`}>
                          {clause.riskLevel} RISK ({clause.riskScore})
                        </span>
                        
                        <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform duration-300 group-open:-rotate-180" />
                      </div>
                    </summary>
                    
                    <div className="px-5 pb-5 pt-2 bg-secondary/5 border-t border-border/50 flex flex-col gap-6">
                      
                      {clause.suggestedRewrite ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                              <h5 className="text-[10px] font-bold tracking-widest uppercase text-red-600 mb-2">Before (Original)</h5>
                              <p className="text-sm text-foreground/90">{clause.content}</p>
                            </div>
                            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 relative">
                              <h5 className="text-[10px] font-bold tracking-widest uppercase text-emerald-600 mb-2">After (Suggested Rewrite)</h5>
                              <p className="text-sm font-medium text-foreground">{clause.suggestedRewrite}</p>
                              
                              <div className="absolute top-4 right-4 flex flex-col items-end">
                                <span className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Risk Reduction</span>
                                <span className="text-sm font-bold text-emerald-600 bg-white px-2 py-0.5 rounded shadow-sm border border-border/50">-{clause.riskReductionScore} pts</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white border border-border/50 rounded-xl p-4">
                              <h5 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Acceptance Probability</h5>
                              <div className="flex items-center gap-3">
                                <div className="flex-1 h-2 bg-secondary/10 rounded-full overflow-hidden">
                                  <div className="h-full bg-primary" style={{ width: `${clause.acceptanceProbability || 0}%` }}></div>
                                </div>
                                <span className="text-sm font-bold text-foreground">{clause.acceptanceProbability || 0}%</span>
                              </div>
                            </div>
                            <div className="bg-white border border-border/50 rounded-xl p-4">
                              <h5 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Market Standard</h5>
                              <p className="text-sm font-medium text-foreground mb-1">{clause.marketStandard}</p>
                              <p className="text-xs text-muted-foreground">{clause.marketStandardReason}</p>
                            </div>
                            <div className="bg-white border border-border/50 rounded-xl p-4">
                              <h5 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Talking Points</h5>
                              <ul className="space-y-1">
                                {clause.talkingPoints?.map((tp: string, i: number) => (
                                  <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0"></span>
                                    {tp}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 pt-2">
                          {/* Left: Original Text & Explanation */}
                          <div className="space-y-4">
                            <div>
                              <h5 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2 flex items-center gap-1">
                                <Info className="w-3 h-3" /> Plain English Translation
                              </h5>
                              <p className="text-sm text-foreground bg-white p-3 rounded-lg border border-border/50 leading-relaxed shadow-sm">
                                {clause.explanation}
                              </p>
                            </div>
                            
                            <div>
                              <h5 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">
                                Original Legal Text
                              </h5>
                              <div className="text-xs text-muted-foreground bg-white p-3 rounded-lg border border-border/50 h-32 overflow-y-auto custom-scrollbar">
                                {clause.content}
                              </div>
                            </div>
                          </div>

                          {/* Right: Concerns & Recommendations */}
                          <div className="space-y-4">
                            <div>
                              <h5 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Key Concerns
                              </h5>
                              {clause.concerns?.length > 0 ? (
                                <ul className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 space-y-2">
                                  {clause.concerns.map((concern: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                                      <span className="mt-1.5 w-1 h-1 rounded-full bg-red-500 shrink-0" />
                                      {concern}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="bg-white border border-border/50 rounded-lg p-3 text-sm text-muted-foreground">
                                  No major concerns detected.
                                </div>
                              )}
                            </div>

                            <div>
                              <h5 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> AI Recommendations
                              </h5>
                              {clause.recommendations?.length > 0 ? (
                                <ul className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3 space-y-2">
                                  {clause.recommendations.map((rec: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                                      <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                                      {rec}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="bg-white border border-border/50 rounded-lg p-3 text-sm text-muted-foreground">
                                  Standard clause, no action required.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </details>
                ))}
              </div>
            </div>
            </div>

            {/* Floating Chat Widget */}
            <ContractChat contractId={id} />

          </div>
        ) : (
          <ProcessingPipeline contract={{
            _id: contract._id.toString(),
            status: contract.status
          }} />
        )}
      </div>
    </div>
  );
}
