import { FileText, Upload, Filter, Search } from "lucide-react";
import Link from "next/link";
import { connectToDatabase } from "@/database/connection";
import { ContractModel as Contract } from "@/database/models/Contract";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ContractsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectToDatabase();
  
  const contracts = await Contract.find({ ownerId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-semibold text-foreground">All Contracts</h2>
          <p className="text-muted-foreground mt-1 text-sm">Manage and review all your uploaded legal documents.</p>
        </div>
        <Link 
          href="/contracts/upload" 
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm gold-glow shrink-0"
        >
          <Upload className="w-4 h-4" />
          Upload New
        </Link>
      </div>

      <div className="glass-panel rounded-2xl bg-white border-border/50 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="px-6 py-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center gap-4 justify-between bg-secondary/5">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search contracts..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-border/50 rounded-lg bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <button className="inline-flex items-center gap-2 text-sm font-medium text-foreground bg-white border border-border/50 px-4 py-2 rounded-lg hover:bg-secondary/5 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
        
        {contracts.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-secondary/5 flex items-center justify-center mb-6 border border-border/50 shadow-sm relative">
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs shadow-sm">
                +
              </div>
              <FileText className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h4 className="text-xl font-heading font-medium text-foreground mb-2">Your repository is empty</h4>
            <p className="text-sm text-muted-foreground mb-8 max-w-sm">
              Upload contracts to build your legal intelligence repository and instantly detect risks.
            </p>
            <Link 
              href="/contracts/upload" 
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm gold-glow"
            >
              <Upload className="w-4 h-4" />
              Upload Contract
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-white border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Document Name</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date Uploaded</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {contracts.map((contract: any) => (
                  <tr key={contract._id.toString()} className="hover:bg-secondary/5 transition-colors group">
                    <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                      <div className="p-2 bg-secondary/5 rounded-lg border border-border/50 group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      {contract.title}
                    </td>
                    <td className="px-6 py-4">
                      {contract.status === "UPLOADED" && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-blue-500/10 text-blue-600">Uploaded</span>}
                      {contract.status === "PARSING" && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-orange-500/10 text-orange-600 animate-pulse">Parsing</span>}
                      {contract.status === "ANALYZING" && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-primary/10 text-primary animate-pulse">Analyzing</span>}
                      {contract.status === "READY" && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-600">Ready</span>}
                      {contract.status === "FAILED" && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-red-500/10 text-red-600">Failed</span>}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(contract.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/contract/${contract._id}`} className="font-medium text-primary hover:text-primary/80 hover:underline px-3 py-1.5 rounded-md hover:bg-primary/5 transition-colors">
                        View Analysis
                      </Link>
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
