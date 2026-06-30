"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  GitCompare, ArrowLeft, Download, ShieldAlert, Activity, 
  BrainCircuit, AlertTriangle, FileText, Plus, Minus, Edit3, CheckCircle2
} from "lucide-react";
import { getFriendlyClauseTitle } from "@/utils/friendly-titles";

export default function ComparisonDetailPage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/comparisons/${params.id}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return <div className="py-20 text-center animate-pulse text-muted-foreground">Loading Comparison Report...</div>;
  }

  if (!data || data.error) {
    return <div className="py-20 text-center text-destructive">Comparison not found or an error occurred.</div>;
  }

  const { comparison, differences } = data;
  
  // Compute Snapshot stats
  const added = differences.filter((d: any) => d.status === "ADDED").length;
  const removed = differences.filter((d: any) => d.status === "REMOVED").length;
  const modified = differences.filter((d: any) => d.status === "MODIFIED").length;

  // Filter for changes that matter
  const meaningfulChanges = differences.filter((d: any) => d.status !== "UNCHANGED");
  
  // Sort for top 5 critical changes based on risk delta
  const criticalChanges = [...meaningfulChanges]
    .filter(d => d.riskDelta > 0)
    .sort((a, b) => b.riskDelta - a.riskDelta)
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/comparisons" className="p-2 hover:bg-secondary/5 rounded-full text-muted-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                Comparison Report
              </span>
              <span className="text-sm text-muted-foreground">
                {new Date(comparison.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl font-heading font-semibold text-foreground flex items-center gap-2">
              {comparison.contractId?.title || "Contract"} 
              <span className="text-muted-foreground font-normal text-lg">
                (v{comparison.originalVersionId?.versionNumber} → v{comparison.revisedVersionId?.versionNumber})
              </span>
            </h1>
          </div>
        </div>
        <Link 
          href={`/report/comparison/${comparison._id}`}
          target="_blank"
          className="flex items-center gap-2 bg-secondary/5 border border-border/50 text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/10 transition-colors"
        >
          <Download className="w-4 h-4" /> Export Report
        </Link>
      </div>

      {/* Section 1: Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center border-l-4 border-l-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity className="w-16 h-16 text-primary" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Overall Risk Delta</span>
          <div className={`text-4xl font-heading font-bold ${comparison.overallRiskDelta > 0 ? 'text-destructive' : comparison.overallRiskDelta < 0 ? 'text-success' : 'text-foreground'}`}>
            {comparison.overallRiskDelta > 0 ? '+' : ''}{comparison.overallRiskDelta} <span className="text-lg font-medium text-muted-foreground">pts</span>
          </div>
          <p className="text-sm font-medium mt-2">
            {comparison.overallChange === 'RISK_INCREASED' ? <span className="text-destructive">Risk Increased</span> : 
             comparison.overallChange === 'RISK_REDUCED' ? <span className="text-success">Risk Reduced</span> : 
             "No Significant Change"}
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center border border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <Plus className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Added Clauses</span>
          </div>
          <div className="text-3xl font-heading font-bold text-emerald-700">{added}</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center border border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <Minus className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Removed Clauses</span>
          </div>
          <div className="text-3xl font-heading font-bold text-red-700">{removed}</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center border border-orange-500/20 bg-orange-500/5">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <Edit3 className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Modified Clauses</span>
          </div>
          <div className="text-3xl font-heading font-bold text-orange-700">{modified}</div>
        </div>
      </div>

      {/* Section 2: Contract Summary */}
      <div className="glass-panel p-8 rounded-2xl border border-border/50 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <BrainCircuit className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-heading font-semibold text-foreground">Contract Summary</h2>
        </div>
        
        <p className="text-foreground/90 leading-relaxed">
          {comparison.executiveSummary || "No executive summary available for this comparison."}
        </p>

        {comparison.keyLegalChanges && comparison.keyLegalChanges.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3 mt-6">Key Legal Impacts</h3>
            <ul className="space-y-2">
              {comparison.keyLegalChanges.map((change: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                  <span className="text-sm text-foreground/80">{change}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Section 3: Critical Changes */}
      {criticalChanges.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h2 className="text-xl font-heading font-semibold text-foreground">Critical Risk Increases</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {criticalChanges.map((diff: any) => (
              <div key={diff._id} className="bg-red-500/5 border border-red-500/20 rounded-xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1 h-full bg-destructive" />
                <h3 className="font-medium text-foreground mb-1 truncate pr-8">
                  {getFriendlyClauseTitle(diff.revisedClauseId?.title || diff.originalClauseId?.title)}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-red-100 text-red-700 px-2 py-0.5 rounded">
                    +{diff.riskDelta} Risk
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                    {diff.changeSeverity} Impact
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {diff.aiDifferenceExplanation || "No explanation provided."}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 4: Clause Differences (The Legal PR View) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-heading font-semibold text-foreground">Clause Differences</h2>
        </div>

        <div className="space-y-6">
          {meaningfulChanges.map((diff: any, index: number) => (
            <div key={diff._id} className="border border-border/50 rounded-2xl overflow-hidden bg-white shadow-sm">
              <div className="flex items-center justify-between p-4 bg-secondary/5 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary/10 text-muted-foreground text-xs font-bold">
                    {index + 1}
                  </span>
                  <h3 className="font-semibold text-foreground">
                    {getFriendlyClauseTitle(diff.status === "ADDED" ? diff.revisedClauseId?.title : diff.originalClauseId?.title)}
                  </h3>
                  
                  {diff.status === "ADDED" && <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Added</span>}
                  {diff.status === "REMOVED" && <span className="text-[10px] font-bold uppercase tracking-widest bg-red-100 text-red-700 px-2 py-0.5 rounded">Removed</span>}
                  {diff.status === "MODIFIED" && <span className="text-[10px] font-bold uppercase tracking-widest bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Modified</span>}
                  
                </div>
                <div className="flex items-center gap-3">
                  {diff.matchConfidence > 0 && diff.status === "MODIFIED" && (
                     <span className="text-xs font-medium text-muted-foreground hidden sm:block">Confidence: {diff.matchConfidence >= 80 ? 'High' : diff.matchConfidence >= 50 ? 'Medium' : 'Low'}</span>
                  )}
                  {diff.riskDelta !== 0 && (
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${diff.riskDelta > 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {diff.riskDelta > 0 ? '+' : ''}{diff.riskDelta} Risk
                    </span>
                  )}
                </div>
              </div>

              {/* Side by side diff */}
              <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-border/50">
                <div className={`p-5 flex-1 ${diff.status === 'REMOVED' ? 'bg-red-50/50' : ''}`}>
                  <h4 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Version {comparison.originalVersionId?.versionNumber} (Base)</h4>
                  {diff.status === "ADDED" ? (
                    <p className="text-sm text-muted-foreground italic">Not present in original version.</p>
                  ) : (
                    <div className={`text-sm leading-relaxed ${diff.status === 'REMOVED' ? 'text-red-900 line-through decoration-red-300' : 'text-foreground'}`}>
                      {diff.originalClauseId?.content}
                    </div>
                  )}
                </div>
                <div className={`p-5 flex-1 ${diff.status === 'ADDED' ? 'bg-emerald-50/50' : ''}`}>
                  <h4 className="text-[10px] font-bold tracking-widest uppercase text-primary mb-3">Version {comparison.revisedVersionId?.versionNumber} (Revised)</h4>
                  {diff.status === "REMOVED" ? (
                    <p className="text-sm text-muted-foreground italic">Removed from revised version.</p>
                  ) : (
                    <div className={`text-sm leading-relaxed ${diff.status === 'ADDED' ? 'text-emerald-900' : 'text-foreground'}`}>
                      {diff.revisedClauseId?.content}
                    </div>
                  )}
                </div>
              </div>

              {/* AI Impact Explanation */}
              {diff.aiDifferenceExplanation && (
                <div className="p-4 bg-primary/5 border-t border-border/50 text-sm">
                  <div className="flex items-start gap-2">
                    <BrainCircuit className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-foreground/90 font-medium mb-1">{diff.aiDifferenceExplanation}</p>
                      {(diff.businessImpact || diff.legalImpact) && (
                        <div className="flex flex-col sm:flex-row gap-4 mt-2 text-xs text-muted-foreground">
                          {diff.businessImpact && <p><strong>Business:</strong> {diff.businessImpact}</p>}
                          {diff.legalImpact && <p><strong>Legal:</strong> {diff.legalImpact}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {meaningfulChanges.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-border/50">
              <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3 opacity-20" />
              <p className="text-foreground font-medium">No significant differences found.</p>
              <p className="text-sm text-muted-foreground mt-1">Both versions of the contract appear identical.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
