"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GitCompare, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewComparisonPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<any[]>([]);
  const [selectedContractId, setSelectedContractId] = useState<string>("");
  const [versions, setVersions] = useState<any[]>([]);
  const [originalVersionId, setOriginalVersionId] = useState<string>("");
  const [revisedVersionId, setRevisedVersionId] = useState<string>("");
  
  const [loadingContracts, setLoadingContracts] = useState(true);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/contracts")
      .then(res => res.json())
      .then(data => {
        setContracts(data.contracts || data || []);
        setLoadingContracts(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingContracts(false);
        setError("Failed to load contracts");
      });
  }, []);

  useEffect(() => {
    if (!selectedContractId) {
      setVersions([]);
      setOriginalVersionId("");
      setRevisedVersionId("");
      return;
    }

    setLoadingVersions(true);
    fetch(`/api/contracts/${selectedContractId}/versions`)
      .then(res => res.json())
      .then(data => {
        setVersions(data || []);
        setLoadingVersions(false);
        
        // Auto-select latest and previous if available
        if (data && data.length >= 2) {
          setRevisedVersionId(data[0]._id);
          setOriginalVersionId(data[1]._id);
        } else if (data && data.length === 1) {
          setRevisedVersionId(data[0]._id);
          setOriginalVersionId(data[0]._id);
        }
      })
      .catch(err => {
        console.error(err);
        setLoadingVersions(false);
        setError("Failed to load versions");
      });
  }, [selectedContractId]);

  const handleCompare = async () => {
    if (!originalVersionId || !revisedVersionId) {
      setError("Please select both versions to compare");
      return;
    }
    
    if (originalVersionId === revisedVersionId) {
      setError("Please select two different versions to compare");
      return;
    }

    setIsComparing(true);
    setError("");

    try {
      const res = await fetch("/api/comparisons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalVersionId, revisedVersionId })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Comparison failed");
      }

      router.push(`/comparisons/${data.id}`);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsComparing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
          <GitCompare className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-heading font-semibold text-foreground mb-2">New Comparison</h1>
        <p className="text-muted-foreground">Select a contract and two versions to analyze differences.</p>
      </div>

      <div className="bg-white rounded-xl border border-border/50 p-8 shadow-sm">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">1. Select Contract</label>
            <select 
              value={selectedContractId}
              onChange={(e) => setSelectedContractId(e.target.value)}
              disabled={loadingContracts}
              className="w-full bg-secondary/5 border border-border/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            >
              <option value="">-- Choose a Contract --</option>
              {contracts.map(c => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </div>

          {selectedContractId && (
            <>
              {loadingVersions ? (
                <div className="py-4 text-center text-sm text-muted-foreground animate-pulse">
                  Loading versions...
                </div>
              ) : versions.length < 2 ? (
                <div className="p-4 bg-warning/10 border border-warning/20 text-warning rounded-lg text-sm">
                  This contract only has {versions.length} version(s). You need at least 2 versions to perform a comparison.
                  <div className="mt-2">
                    <Link href={`/contract/${selectedContractId}`} className="underline font-medium">
                      Go to Contract Page to upload a new version
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6 p-6 bg-secondary/5 rounded-lg border border-border/50">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Original Version (Base)</label>
                    <select 
                      value={originalVersionId}
                      onChange={(e) => setOriginalVersionId(e.target.value)}
                      className="w-full bg-white border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">-- Select --</option>
                      {versions.map(v => (
                        <option key={v._id} value={v._id}>Version {v.versionNumber}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-primary mb-2">Revised Version (New)</label>
                    <select 
                      value={revisedVersionId}
                      onChange={(e) => setRevisedVersionId(e.target.value)}
                      className="w-full bg-white border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">-- Select --</option>
                      {versions.map(v => (
                        <option key={v._id} value={v._id}>Version {v.versionNumber}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleCompare}
              disabled={isComparing || !originalVersionId || !revisedVersionId || originalVersionId === revisedVersionId}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isComparing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Differences...</>
              ) : (
                <><GitCompare className="w-5 h-5" /> Compare Versions</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
