import { connectToDatabase } from "@/database/connection";
import { ContractModel as Contract } from "@/database/models/Contract";
import { ContractClauseModel } from "@/database/models/ContractClause";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FileText, ShieldAlert, CheckCircle2, Target, PenTool, TrendingDown, AlertTriangle, LayoutList } from "lucide-react";
import { PrintButton } from "@/components/contracts/PrintButton";

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
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
    return <div>Contract not found</div>;
  }

  const clauses = await ContractClauseModel.find({ contractId: id }).sort({ order: 1 }).lean();
  const negotiatedClauses = clauses.filter(c => c.suggestedRewrite);

  // Calculate Risk Breakdown
  const criticalCount = clauses.filter(c => c.riskLevel === "CRITICAL").length;
  const highCount = clauses.filter(c => c.riskLevel === "HIGH").length;
  const mediumCount = clauses.filter(c => c.riskLevel === "MEDIUM").length;
  const lowCount = clauses.filter(c => c.riskLevel === "LOW").length;

  const recommendedAction = criticalCount > 0 || highCount > 1 
    ? "NEGOTIATE BEFORE SIGNING" 
    : mediumCount > 0 
      ? "PROCEED WITH CAUTION" 
      : "SAFE TO SIGN";

  // Calculate Potential Risk Reduction
  const totalRiskReduction = negotiatedClauses.reduce((sum, c) => sum + (c.riskReductionScore || 0), 0);
  // Estimate new safety score (max 100)
  const potentialNewScore = Math.min(100, (contract.safetyScore || 0) + Math.round(totalRiskReduction / (clauses.length || 1) * 2)); 
  // Just a simple heuristic for the display
  const pointsImproved = potentialNewScore - (contract.safetyScore || 0);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white min-h-screen text-slate-900 font-sans print:p-0 print:m-0">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-6 mb-8 border-slate-200 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Contract Negotiation Report
          </h1>
          <p className="text-slate-500 mt-2 text-lg">{contract.title}</p>
        </div>
        <div className="text-left md:text-right w-full md:w-auto flex flex-col md:block items-start md:items-end">
          <p className="font-bold text-slate-900 text-lg tracking-tight">ContractSense <span className="text-blue-600">AI</span></p>
          <p className="text-slate-500 text-sm mt-1">{new Date().toLocaleDateString()}</p>
          <PrintButton />
        </div>
      </div>

      {/* Contract Risk Snapshot */}
      <div className="mb-10 page-break-inside-avoid">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 uppercase tracking-wide text-slate-800">
          <ActivityIcon className="w-5 h-5 text-blue-600" />
          Contract Risk Snapshot
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Score */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Safety Score</p>
            <div className="text-5xl font-bold mb-2">
              <span className={contract.safetyScore >= 80 ? "text-emerald-600" : contract.safetyScore >= 50 ? "text-orange-500" : "text-red-600"}>
                {contract.safetyScore}
              </span>
              <span className="text-slate-400 text-2xl">/100</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              contract.riskLevel === "CRITICAL" ? "bg-red-100 text-red-700" :
              contract.riskLevel === "HIGH" ? "bg-orange-100 text-orange-700" :
              "bg-emerald-100 text-emerald-700"
            }`}>
              {contract.riskLevel} Risk
            </span>
          </div>

          {/* Breakdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-center shadow-sm">
             <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Risk Breakdown</p>
             <div className="space-y-3 w-full">
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-600"></span> Critical Risks</span>
                  <span className="font-bold">{criticalCount}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500"></span> High Risks</span>
                  <span className="font-bold">{highCount}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Medium Risks</span>
                  <span className="font-bold">{mediumCount}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Low Risks</span>
                  <span className="font-bold">{lowCount}</span>
                </div>
             </div>
          </div>

          {/* Action */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-sm">
             <div>
               <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Clauses Analyzed</p>
               <p className="text-2xl font-bold text-slate-900">{clauses.length}</p>
             </div>
             <div className="mt-4 pt-4 border-t border-slate-200">
               <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Recommended Action</p>
               <p className={`text-sm font-bold ${recommendedAction === "SAFE TO SIGN" ? "text-emerald-600" : "text-red-600"}`}>
                 {recommendedAction}
               </p>
             </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mb-12 page-break-inside-avoid">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 uppercase tracking-wide text-slate-800">
          <ShieldAlert className="w-5 h-5 text-blue-600" />
          Executive Summary
        </h2>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-700 leading-relaxed mb-6 font-medium text-[15px]">{contract.executiveSummary}</p>
          <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider text-blue-900">Key Takeaways</h3>
            <ul className="space-y-3">
              {contract.keyTakeaways?.map((t: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-slate-700 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Risk Reduction Estimate */}
      {pointsImproved > 0 && (
        <div className="mb-12 page-break-inside-avoid bg-emerald-50 border border-emerald-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
           <div>
             <h3 className="font-bold text-emerald-800 flex items-center gap-2 mb-1">
               <TrendingDown className="w-5 h-5" /> 
               Potential Risk Reduction
             </h3>
             <p className="text-sm text-emerald-700">If suggested negotiations are accepted</p>
           </div>
           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-4 md:mt-0">
             <div className="text-center">
               <p className="text-xs font-bold text-emerald-600/70 uppercase tracking-widest mb-1">Current</p>
               <p className="text-2xl font-bold text-slate-400">{contract.safetyScore}/100</p>
             </div>
             <div className="text-slate-300">→</div>
             <div className="text-center">
               <p className="text-xs font-bold text-emerald-600/70 uppercase tracking-widest mb-1">After Changes</p>
               <p className="text-2xl font-bold text-emerald-600">{potentialNewScore}/100</p>
             </div>
             <div className="sm:ml-4 bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold w-full sm:w-auto text-center min-h-[44px] flex items-center justify-center">
               +{pointsImproved} Points
             </div>
           </div>
        </div>
      )}

      {/* Top 5 Negotiation Targets */}
      {negotiatedClauses.length > 0 && (
        <div className="mb-12 page-break-before-auto">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 uppercase tracking-wide text-slate-800">
            <Target className="w-5 h-5 text-blue-600" />
            Top Negotiation Targets
          </h2>
          <div className="space-y-3">
            {negotiatedClauses.slice(0, 5).map((clause, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border border-slate-200 p-4 rounded-xl shadow-sm gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{clause.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{clause.clauseType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                   <div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Risk Score</p>
                     <p className="font-bold text-slate-900">{clause.riskScore}/100</p>
                   </div>
                   <div className="w-px h-8 bg-slate-200"></div>
                   <div className="w-24">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Priority</p>
                     <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        clause.negotiationPriority === "CRITICAL" ? "bg-red-100 text-red-700" :
                        clause.negotiationPriority === "HIGH" ? "bg-orange-100 text-orange-700" :
                        "bg-blue-100 text-blue-700"
                     }`}>
                       {clause.negotiationPriority}
                     </span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clause-by-Clause Risk Table */}
      <div className="mb-12 page-break-inside-avoid">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 uppercase tracking-wide text-slate-800">
          <LayoutList className="w-5 h-5 text-blue-600" />
          Clause-by-Clause Risk Analysis
        </h2>
        <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead className="bg-slate-50 text-slate-600 font-medium text-xs uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Clause Title</th>
                <th className="px-6 py-4">Risk Score</th>
                <th className="px-6 py-4">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {clauses.map((clause, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-3 font-medium text-slate-900">{clause.title}</td>
                  <td className="px-6 py-3">
                    <span className={
                      (clause.riskScore || 0) >= 80 ? "text-red-600 font-bold" : 
                      (clause.riskScore || 0) >= 60 ? "text-orange-600 font-bold" : 
                      "text-slate-600"
                    }>
                      {clause.riskScore}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        clause.riskLevel === "CRITICAL" ? "bg-red-100 text-red-700" :
                        clause.riskLevel === "HIGH" ? "bg-orange-100 text-orange-700" :
                        clause.riskLevel === "MEDIUM" ? "bg-yellow-100 text-yellow-800" :
                        "bg-emerald-100 text-emerald-700"
                     }`}>
                      {clause.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clauses to Negotiate (Rewrites) */}
      {negotiatedClauses.length > 0 && (
        <div className="page-break-before-always">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-4 border-slate-200 uppercase tracking-wide text-slate-800">
            <PenTool className="w-5 h-5 text-blue-600" />
            Suggested Rewrites & Playbook
          </h2>
          
          <div className="space-y-12">
            {negotiatedClauses.map((clause, idx) => (
              <div key={idx} className="print:break-inside-avoid border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <h3 className="font-bold text-lg text-slate-900">{clause.title}</h3>
                  <div className="flex items-center gap-3">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Acceptance Probability:</span>
                     <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold border border-blue-200">
                       {clause.acceptanceProbability}%
                     </span>
                  </div>
                </div>
                
                <div className="p-6 space-y-6 bg-white">
                  {/* Before / After Side-by-Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-600"></span>
                        Current Clause
                      </h4>
                      <div className="bg-red-50/50 border border-red-100 p-4 rounded-xl text-sm text-slate-700 h-full">
                        {clause.content}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        Suggested Rewrite
                      </h4>
                      <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-sm font-medium text-slate-900 h-full relative">
                        {clause.suggestedRewrite}
                      </div>
                    </div>
                  </div>

                  {/* Playbook */}
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-6">
                    <h4 className="font-bold text-slate-900 mb-4 border-b border-slate-200 pb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-slate-500" />
                      Negotiation Playbook
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Talking Points</h5>
                        <ul className="space-y-3">
                          {clause.talkingPoints?.map((tp: string, i: number) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start gap-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                              <span className="leading-relaxed">{tp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Market Standard</h5>
                          <div className="bg-white p-3 rounded-lg border border-slate-200">
                            <p className="text-sm font-bold text-slate-900 mb-1">{clause.marketStandard}</p>
                            <p className="text-xs text-slate-600 leading-relaxed">{clause.marketStandardReason}</p>
                          </div>
                        </div>
                        
                        {(clause.idealPosition || clause.fallbackPosition) && (
                          <div className="flex gap-4">
                            {clause.idealPosition && (
                              <div className="flex-1">
                                 <h5 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Ideal</h5>
                                 <p className="text-xs font-medium text-slate-800">{clause.idealPosition}</p>
                              </div>
                            )}
                            {clause.fallbackPosition && (
                              <div className="flex-1">
                                 <h5 className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1">Fallback</h5>
                                 <p className="text-xs font-medium text-slate-800">{clause.fallbackPosition}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 print:mt-12 gap-4">
         <div>
           <p className="font-bold text-slate-700">Generated by ContractSense AI</p>
           <p>Generated on: {new Date().toLocaleDateString()}</p>
         </div>
         <div className="text-left sm:text-right max-w-xs">
           <p className="font-bold text-slate-700">Disclaimer</p>
           <p>This report is informational and does not constitute legal advice. Always consult with a qualified attorney before signing.</p>
         </div>
      </div>

    </div>
  );
}

// Simple icon for the snapshot
function ActivityIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}
