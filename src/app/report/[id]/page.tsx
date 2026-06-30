import { connectToDatabase } from "@/database/connection";
import { ContractModel as Contract } from "@/database/models/Contract";
import { ContractClauseModel } from "@/database/models/ContractClause";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FileText, ShieldAlert, CheckCircle2, Target, PenTool, TrendingDown, AlertTriangle, LayoutList } from "lucide-react";
import { PrintButton } from "@/components/contracts/PrintButton";
import { ContractReportUI } from "@/components/contracts/ContractReportUI";
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

  // Serialize for Client Component
  const serializedContract = JSON.parse(JSON.stringify(contract));
  const serializedClauses = JSON.parse(JSON.stringify(clauses));

  return <ContractReportUI contract={serializedContract} clauses={serializedClauses} />;
}
