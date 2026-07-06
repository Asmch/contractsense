"use client";

import { useState } from "react";
import { FileText, Upload, Filter, Search, Trash2, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Contract {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
}

export function ContractsClientTable({ initialContracts }: { initialContracts: Contract[] }) {
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === "Reviewed") {
      matchesStatus = c.status === "COMPLETE" || c.status === "READY";
    } else if (statusFilter === "Not Reviewed") {
      matchesStatus = c.status !== "COMPLETE" && c.status !== "READY";
    }

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contract? This action cannot be undone.")) return;
    
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/contracts/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setContracts(contracts.filter((c) => c._id !== id));
        router.refresh();
      } else {
        alert("Failed to delete contract");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete contract");
    } finally {
      setIsDeleting(null);
    }
  };

  const statusOptions = ["ALL", "Reviewed", "Not Reviewed"];

  return (
    <div className="glass-panel rounded-2xl bg-white border-border/50 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="px-6 py-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center gap-4 justify-between bg-secondary/5">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search contracts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-border/50 rounded-lg bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground bg-white border border-border/50 px-4 py-2 rounded-lg hover:bg-secondary/5 transition-colors"
          >
            <Filter className="w-4 h-4" />
            {statusFilter === "ALL" ? "Filter" : statusFilter}
          </button>
          
          {showFilterDropdown && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-border/50 rounded-lg shadow-xl overflow-hidden z-10">
              {statusOptions.map(status => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary/5 transition-colors ${statusFilter === status ? "bg-primary/5 text-primary font-medium" : "text-foreground"}`}
                >
                  {status === "ALL" ? "All Statuses" : status}
                </button>
              ))}
            </div>
          )}
        </div>
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
      ) : filteredContracts.length === 0 ? (
        <div className="p-20 text-center flex flex-col items-center justify-center">
          <AlertCircle className="w-10 h-10 text-muted-foreground/50 mb-4" />
          <h4 className="text-lg font-heading font-medium text-foreground mb-2">No contracts found</h4>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
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
              {filteredContracts.map((contract) => (
                <tr key={contract._id} className="hover:bg-secondary/5 transition-colors group">
                  <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                    <div className="p-2 bg-secondary/5 rounded-lg border border-border/50 group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    {contract.title}
                  </td>
                  <td className="px-6 py-4">
                    {(contract.status === "COMPLETE" || contract.status === "READY") ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-600">
                        Reviewed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-orange-500/10 text-orange-600">
                        Not Reviewed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground" suppressHydrationWarning>
                    {new Date(contract.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/contract/${contract._id}`} className="font-medium text-primary hover:text-primary/80 hover:underline px-3 py-1.5 rounded-md hover:bg-primary/5 transition-colors">
                        View Analysis
                      </Link>
                      <button 
                        onClick={() => handleDelete(contract._id)}
                        disabled={isDeleting === contract._id}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50"
                        title="Delete Contract"
                      >
                        {isDeleting === contract._id ? <Loader2 className="w-4 h-4 animate-spin text-destructive" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
