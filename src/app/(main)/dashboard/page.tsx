import { FileText, Upload } from "lucide-react";
import Link from "next/link";
import { connectToDatabase } from "@/database/connection";
import { ContractModel as Contract } from "@/database/models/Contract";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Utility to get contract type from title or filename
const getContractType = (title: string, fileName?: string) => {
  const t = (title || fileName || "").toLowerCase();
  if (t.includes('employment') || t.includes('offer')) return 'Employment Agreement';
  if (t.includes('nda') || t.includes('non-disclosure') || t.includes('confidentiality')) return 'Freelancer NDA';
  if (t.includes('freelance') || t.includes('contractor')) return 'Freelance Agreement';
  if (t.includes('vendor') || t.includes('supplier')) return 'Vendor Contract';
  if (t.includes('lease') || t.includes('rental')) return 'Lease Agreement';
  if (t.includes('partnership')) return 'Partnership Agreement';
  if (t.includes('service')) return 'Service Agreement';
  
  // Clean up ugly filenames if we can't find a type
  if (t.includes('.pdf') || t.includes('.docx')) {
    return 'Legal Agreement';
  }
  
  return title; // Fallback to title
};

const getRecommendationDetails = (contract: any) => {
  if (["UPLOADED", "PARSING", "ANALYZING", "READY"].includes(contract.status)) {
    return { text: "⏱️ Processing", colorClass: "text-blue-600 bg-blue-50/50", borderClass: "border-blue-200", priority: 5, action: "View Status →" };
  }
  if (contract.status === "FAILED") {
    return { text: "⚠️ Failed", colorClass: "text-red-600 bg-red-50/50", borderClass: "border-red-200", priority: 5, action: "Try Again →" };
  }
  
  if (contract.riskLevel === "CRITICAL") {
    return { text: "🔴 Lawyer Review Recommended", colorClass: "text-red-700 bg-red-50/50", borderClass: "border-red-200", priority: 1, action: "Review Contract →" };
  }
  if (contract.riskLevel === "HIGH") {
    return { text: "🟠 Needs Changes", colorClass: "text-orange-700 bg-orange-50/50", borderClass: "border-orange-200", priority: 2, action: "Review Contract →" };
  }
  if (contract.riskLevel === "MEDIUM") {
    return { text: "🟡 Review Before Signing", colorClass: "text-amber-700 bg-amber-50/50", borderClass: "border-amber-200", priority: 3, action: "Review Contract →" };
  }
  return { text: "🟢 Looks Good", colorClass: "text-emerald-700 bg-emerald-50/50", borderClass: "border-emerald-200", priority: 4, action: "Review Contract →" };
};

const getReason = (contract: any) => {
  if (contract.status !== "COMPLETE") {
    if (contract.status === "FAILED") return "Analysis failed. Please try again.";
    return "Contract is currently being analyzed.";
  }

  if (contract.riskLevel === "LOW") {
    return "No major risks were found. The agreement appears balanced overall.";
  }

  // Find the biggest penalty for a human readable string
  if (contract.scoreExplanation && contract.scoreExplanation.length > 0) {
    const penalties = contract.scoreExplanation.filter((s: any) => s.type === "PENALTY").sort((a: any, b: any) => b.impact - a.impact);
    if (penalties.length > 0) {
      const topReason = penalties[0].reason.toLowerCase();
      // Ensure we don't show API rate limits
      if (topReason.includes("api rate") || topReason.includes("timeout") || topReason.includes("error")) {
         return "This agreement contains clauses that may require your attention before signing.";
      }
      
      // Try to make it conversational
      if (topReason.includes("intellectual property") || topReason.includes("ownership")) {
        return "This agreement says the company will own everything you create during your work. If that's not what you expected, it's worth discussing before you sign.";
      }
      if (topReason.includes("payment")) {
        return "The payment terms may delay when you receive your money. It's worth reviewing the payment schedule.";
      }
      if (topReason.includes("termination")) {
        return "The other party can end the agreement at any time, which may leave you vulnerable. We recommend reviewing the termination clauses.";
      }
      if (topReason.includes("liability")) {
        return "The agreement may expose you to significant financial risk due to unlimited liability clauses.";
      }
      
      // Fallback
      return `This agreement contains terms related to ${topReason} that may need clarification before signing.`;
    }
  }

  if (contract.keyTakeaways && contract.keyTakeaways.length > 0) {
    return contract.keyTakeaways[0];
  }

  if (contract.riskLevel === "CRITICAL" || contract.riskLevel === "HIGH") {
    return "Some high-risk terms in this agreement need your immediate review.";
  }

  return "Some clauses should be reviewed before you decide to sign.";
};

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectToDatabase();
  
  const allContracts = await Contract.find({ ownerId: session.user.id })
    .lean();
    
  const enrichedContracts = allContracts.map(c => ({
    ...c,
    displayTitle: getContractType(c.title, c.fileName),
    recommendation: getRecommendationDetails(c),
    reason: getReason(c)
  })).sort((a, b) => {
    if (a.recommendation.priority !== b.recommendation.priority) {
      return a.recommendation.priority - b.recommendation.priority;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  const awaitingAction = enrichedContracts.filter(c => c.recommendation.priority <= 3);
  const looksGood = enrichedContracts.filter(c => c.recommendation.priority === 4);
  const processing = enrichedContracts.filter(c => c.recommendation.priority === 5);

  const pendingCount = awaitingAction.length;
  const firstName = session.user.name?.split(' ')[0] || 'User';

  const renderCard = (contract: any) => (
    <div 
      key={contract._id.toString()} 
      className="group flex flex-col p-8 bg-white rounded-[24px] border border-slate-200/60 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] transition-all gap-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        
        {/* Left Side: Title & Badge */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
            <h3 className="text-[22px] font-heading font-semibold text-slate-900 flex items-center gap-2">
              📄 {contract.displayTitle}
            </h3>
            <span className={`inline-flex items-center px-3.5 py-1.5 rounded-lg font-medium text-[13px] border ${contract.recommendation.colorClass} ${contract.recommendation.borderClass}`}>
              {contract.recommendation.text}
            </span>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-900">Why we recommend this</p>
            <p className="text-[15px] leading-relaxed text-slate-600">
              {contract.reason}
            </p>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar: Metadata & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-5 mt-2 border-t border-slate-100 gap-4">
        <div className="text-sm text-slate-500 font-medium flex items-center gap-2">
          <span>{contract.pageCount || 1} Pages</span>
          <span className="text-slate-300">•</span>
          <span>
            {contract.status === "COMPLETE" ? "Reviewed " : "Added "} 
            {new Date(contract.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        
        <Link 
          href={`/contract/${contract._id}`} 
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-slate-50 hover:bg-slate-100 text-slate-900 px-6 py-2.5 rounded-xl text-[15px] font-semibold transition-colors border border-slate-200 group-hover:border-slate-300 group-hover:shadow-sm"
        >
          {contract.recommendation.action}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-24 pt-8">
      {/* Hero Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-16 px-2">
        <div>
          <h1 className="text-[34px] font-heading font-semibold text-slate-900 tracking-tight mb-2">👋 Welcome back, {firstName}</h1>
          <p className="text-slate-500 text-[17px]">
            {pendingCount > 0 
              ? `You have ${pendingCount} contract${pendingCount > 1 ? 's' : ''} waiting for your review.` 
              : `You're all caught up. Upload another agreement anytime.`}
          </p>
        </div>
        
        <Link 
          href="/contracts/upload" 
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-2xl text-[15px] font-medium hover:bg-primary/90 transition-all shadow-[0_2px_12px_rgba(184,135,70,0.25)] hover:shadow-[0_4px_16px_rgba(184,135,70,0.35)] shrink-0 whitespace-nowrap"
        >
          <Upload className="w-[18px] h-[18px]" />
          Analyze Contract
        </Link>
      </div>

      {/* Main Section */}
      <div>
        
        {enrichedContracts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-4 text-center bg-white rounded-[32px] border border-slate-200/50 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-heading font-semibold text-slate-900 mb-2">No contracts yet.</h3>
            <p className="text-slate-500 mb-8 max-w-sm text-lg">Upload your first agreement to get started.</p>
            <Link 
              href="/contracts/upload" 
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-2xl text-[15px] font-medium hover:bg-primary/90 transition-all shadow-[0_2px_12px_rgba(184,135,70,0.25)] hover:shadow-[0_4px_16px_rgba(184,135,70,0.35)]"
            >
              <Upload className="w-[18px] h-[18px]" />
              Analyze Contract
            </Link>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* Awaiting Action Section */}
            {(awaitingAction.length > 0 || processing.length > 0) && (
              <div>
                <h2 className="text-xl font-heading font-semibold text-slate-900 mb-6 px-2 tracking-tight">Contracts Awaiting Action</h2>
                <div className="space-y-6">
                  {awaitingAction.map(renderCard)}
                  {processing.map(renderCard)}
                </div>
              </div>
            )}
            
            {/* Looks Good Section */}
            {looksGood.length > 0 && (
              <div>
                <h2 className="text-xl font-heading font-semibold text-slate-900 mb-6 px-2 tracking-tight">No Major Concerns Found</h2>
                <div className="space-y-6">
                  {looksGood.map(renderCard)}
                </div>
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
}
