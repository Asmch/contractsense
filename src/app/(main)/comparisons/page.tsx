"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, ArrowRight, Activity, GitCompare } from "lucide-react";

export default function ComparisonsPage() {
  const [comparisons, setComparisons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/comparisons")
      .then(res => res.json())
      .then(data => {
        setComparisons(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-foreground">Comparisons</h1>
          <p className="text-sm text-muted-foreground mt-1">Review legal pull requests and version history.</p>
        </div>
        <Link 
          href="/comparisons/new" 
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          New Comparison
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground animate-pulse">Loading comparisons...</div>
      ) : comparisons.length === 0 ? (
        <div className="bg-white rounded-xl border border-border/50 p-12 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <GitCompare className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-heading font-semibold mb-2">No comparisons yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Compare two versions of a contract to instantly see risk changes, new obligations, and removed protections.
          </p>
          <Link 
            href="/comparisons/new" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            Start Comparison
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {comparisons.map((comp) => (
            <Link 
              key={comp._id} 
              href={`/comparisons/${comp._id}`}
              className="bg-white rounded-xl border border-border/50 p-6 hover:shadow-md transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className="font-medium text-foreground">{comp.contractId?.title || "Contract"}</span>
                  <span>•</span>
                  <span>v{comp.originalVersionId?.versionNumber} → v{comp.revisedVersionId?.versionNumber}</span>
                </div>
                <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                  <GitCompare className="w-4 h-4" />
                  Comparison Report
                </h3>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Risk Delta</div>
                  <div className={`text-lg font-heading font-medium flex items-center gap-1 justify-end ${
                    comp.overallChange === 'RISK_INCREASED' ? 'text-destructive' : 
                    comp.overallChange === 'RISK_REDUCED' ? 'text-success' : 'text-foreground'
                  }`}>
                    {comp.overallRiskDelta > 0 ? '+' : ''}{comp.overallRiskDelta}
                    {comp.overallChange === 'RISK_INCREASED' ? <Activity className="w-4 h-4" /> : null}
                  </div>
                </div>
                
                <div className="w-10 h-10 rounded-full bg-secondary/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
