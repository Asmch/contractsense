import { connectToDatabase } from "@/database/connection";
import { ContractModel as Contract } from "@/database/models/Contract";
import { ContractClauseModel } from "@/database/models/ContractClause";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { 
  FileText, ShieldAlert, Download, Share2, Trash2, GitCompare,
  FileType, LayoutList, Calendar, User as UserIcon, CheckCircle2, ScrollText, Activity, BrainCircuit,
  AlertTriangle, Info, ChevronDown, Target, PenTool
} from "lucide-react";
import Link from "next/link";
import { ProcessingPipeline } from "@/components/contracts/ProcessingPipeline";
import { PrintButton } from "@/components/contracts/PrintButton";
import { ContractDashboardUI } from "@/components/contracts/ContractDashboardUI";
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

  // Serialize for Client Component
  const serializedContract = JSON.parse(JSON.stringify(contract));
  const serializedClauses = JSON.parse(JSON.stringify(clauses));

  return (
    <ContractDashboardUI contract={serializedContract} clauses={serializedClauses} />
  );
}
