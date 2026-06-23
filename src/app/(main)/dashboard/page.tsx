import { FileText, ShieldAlert, CheckCircle2, Clock, Upload, BrainCircuit, PenTool, TrendingDown, Target } from "lucide-react";
import Link from "next/link";
import { connectToDatabase } from "@/database/connection";
import { ContractModel as Contract } from "@/database/models/Contract";
import { ContractClauseModel } from "@/database/models/ContractClause";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DeleteContractButton } from "@/components/dashboard/DeleteContractButton";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectToDatabase();
  
  const recentContracts = await Contract.find({ ownerId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const totalUploaded = await Contract.countDocuments({ ownerId: session.user.id });
  const completedCount = await Contract.countDocuments({ ownerId: session.user.id, status: "COMPLETE" });
  const processingCount = await Contract.countDocuments({ ownerId: session.user.id, status: { $in: ["UPLOADED", "PARSING", "ANALYZING", "READY"] } });

  // Calculate Average Safety Score for Completed Contracts
  const completedContracts = await Contract.find({ ownerId: session.user.id, status: "COMPLETE" }).lean();
  const totalScore = completedContracts.reduce((sum, c) => sum + (c.safetyScore || 0), 0);
  const avgSafetyScore = completedContracts.length > 0 ? Math.round(totalScore / completedContracts.length) : 0;

  // Calculate Negotiation & Risk Metrics
  const allClauses = await ContractClauseModel.find({ 
    contractId: { $in: completedContracts.map(c => c._id) }
  }).lean();
  
  const totalRisks = allClauses.filter(c => c.riskLevel === "HIGH" || c.riskLevel === "CRITICAL").length;
  const rewritesGenerated = allClauses.filter(c => c.suggestedRewrite).length;
  const highPriorityNegotiations = allClauses.filter(c => c.negotiationPriority === "HIGH" || c.negotiationPriority === "CRITICAL").length;
  
  const negotiatedClauses = allClauses.filter(c => typeof c.riskReductionScore === 'number');
  const totalRiskReduction = negotiatedClauses.reduce((sum, c) => sum + (c.riskReductionScore || 0), 0);
  const avgRiskReduction = negotiatedClauses.length > 0 ? Math.round(totalRiskReduction / negotiatedClauses.length) : 0;

  const stats = [
    { name: "Contracts Analyzed", value: completedCount.toString(), icon: FileText, trend: "AI Processed" },
    { name: "Avg Safety Score", value: completedCount > 0 ? `${avgSafetyScore}/100` : "-", icon: BrainCircuit, trend: "Overall health" },
    { name: "High Priority Negotiations", value: highPriorityNegotiations.toString(), icon: Target, trend: "Requires attention" },
    { name: "Total Risks Found", value: totalRisks.toString(), icon: ShieldAlert, trend: "High & Critical" },
    { name: "Rewrites Generated", value: rewritesGenerated.toString(), icon: PenTool, trend: "AI suggested" },
    { name: "Avg Risk Reduction", value: avgRiskReduction > 0 ? `-${avgRiskReduction} pts` : "-", icon: TrendingDown, trend: "Per rewrite" },
    { name: "Total Risk Reduction", value: totalRiskReduction > 0 ? `-${totalRiskReduction} pts` : "-", icon: TrendingDown, trend: "Cumulative" },
    { name: "Processing Now", value: processingCount.toString(), icon: Clock, trend: "In pipeline" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-heading font-semibold text-foreground">Welcome back, {session.user.name?.split(' ')[0] || 'User'}</h2>
        <p className="text-muted-foreground mt-1 text-sm">Here is what is happening with your contracts today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl bg-white border border-border/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/5 flex items-center justify-center text-secondary border border-border/50">
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-heading font-semibold text-foreground mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-muted-foreground mb-3">{stat.name}</div>
            <div className="text-xs text-secondary font-medium bg-secondary/5 inline-flex px-2 py-1 rounded-md">{stat.trend}</div>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-2xl bg-white border-border/50 overflow-hidden">
        <div className="px-6 py-5 border-b border-border/50 flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Recent Contracts</h3>
          <Link href="/contracts" className="text-sm text-primary hover:underline font-medium">View all</Link>
        </div>
        
        {recentContracts.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center border-t border-border/50">
            <div className="w-20 h-20 rounded-2xl bg-secondary/5 flex items-center justify-center mb-6 border border-border/50 shadow-sm relative">
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs shadow-sm">
                +
              </div>
              <FileText className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h4 className="text-xl font-heading font-medium text-foreground mb-2">No contracts analyzed yet</h4>
            <p className="text-sm text-muted-foreground mb-8 max-w-sm">
              Upload your first legal document to extract clauses, detect liabilities, and get a plain-English summary.
            </p>
            <div className="flex items-center gap-4">
              <Link 
                href="/contracts/upload" 
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm gold-glow"
              >
                <Upload className="w-4 h-4" />
                Upload Contract
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/5 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Document Name</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date Uploaded</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentContracts.map((contract: any) => (
                  <tr key={contract._id.toString()} className="hover:bg-secondary/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                      <FileText className="w-4 h-4 text-primary" />
                      {contract.title}
                    </td>
                    <td className="px-6 py-4">
                      {contract.status === "UPLOADED" && <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-blue-500/10 text-blue-600">Uploaded</span>}
                      {contract.status === "PARSING" && <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-orange-500/10 text-orange-600 animate-pulse">Parsing</span>}
                      {contract.status === "ANALYZING" && <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-primary/10 text-primary animate-pulse">Analyzing</span>}
                      {contract.status === "READY" && <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-600">Ready</span>}
                      {contract.status === "COMPLETE" && <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-600">AI Analyzed</span>}
                      {contract.status === "FAILED" && <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-red-500/10 text-red-600">Failed</span>}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(contract.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <Link href={`/contract/${contract._id}`} className="font-medium text-primary hover:underline">
                        View
                      </Link>
                      <DeleteContractButton contractId={contract._id.toString()} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
