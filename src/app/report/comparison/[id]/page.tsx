"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Scale, Printer, Activity, Plus, Minus, Edit3, ShieldAlert } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { getFriendlyClauseTitle } from "@/utils/friendly-titles";

export default function ComparisonReportPage() {
  const params = useParams();
  const componentRef = useRef<HTMLDivElement>(null);
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: data ? `Comparison_${data.comparison.contractId?.title}_v${data.comparison.originalVersionId?.versionNumber}_to_v${data.comparison.revisedVersionId?.versionNumber}` : "Comparison_Report",
  });

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
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground animate-pulse">Loading Report...</div>;
  }

  if (!data || data.error) {
    return <div className="min-h-screen flex items-center justify-center text-destructive">Comparison not found.</div>;
  }

  const { comparison, differences } = data;
  
  const added = differences.filter((d: any) => d.status === "ADDED").length;
  const removed = differences.filter((d: any) => d.status === "REMOVED").length;
  const modified = differences.filter((d: any) => d.status === "MODIFIED").length;
  const meaningfulChanges = differences.filter((d: any) => d.status !== "UNCHANGED");
  
  const criticalChanges = [...meaningfulChanges]
    .filter(d => d.riskDelta > 0)
    .sort((a, b) => b.riskDelta - a.riskDelta)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white font-sans text-gray-900">
      
      {/* Floating Print Action (Hidden in PDF) */}
      <div className="fixed top-6 right-6 z-50 print:hidden">
        <button 
          onClick={() => handlePrint()}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all font-medium gold-glow"
        >
          <Printer className="w-5 h-5" />
          Download PDF Report
        </button>
      </div>

      <div className="max-w-[1000px] mx-auto py-12 px-8 print:p-0">
        <div ref={componentRef} className="bg-white p-12 shadow-2xl print:shadow-none print:p-0 min-h-[1056px]">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-gray-200 pb-8 mb-10">
            <div>
              <div className="flex items-center gap-2 text-primary mb-4">
                <Scale className="w-8 h-8" />
                <span className="text-2xl font-heading font-black tracking-tight">ContractSense</span>
              </div>
              <h1 className="text-4xl font-heading font-bold text-gray-900 mb-2">Version Comparison Report</h1>
              <h2 className="text-xl text-gray-600 font-medium">
                {comparison.contractId?.title || "Contract Document"}
              </h2>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Generated On</div>
              <div className="text-gray-900 font-medium mb-4">{new Date().toLocaleDateString()}</div>
              
              <div className="inline-flex flex-col border border-gray-200 rounded p-3 bg-gray-50 text-left w-48">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Comparing</span>
                <span className="text-sm font-medium">Version {comparison.originalVersionId?.versionNumber} <span className="text-gray-400 text-xs">(Base)</span></span>
                <div className="h-px w-full bg-gray-200 my-1" />
                <span className="text-sm font-medium text-primary">Version {comparison.revisedVersionId?.versionNumber} <span className="text-primary/70 text-xs">(New)</span></span>
              </div>
            </div>
          </div>

          {/* Snapshot stats */}
          <div className="flex gap-4 mb-10">
             <div className="flex-1 bg-gray-50 border border-gray-200 p-4 rounded text-center">
               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Risk Delta</div>
               <div className={`text-2xl font-bold ${comparison.overallRiskDelta > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                 {comparison.overallRiskDelta > 0 ? '+' : ''}{comparison.overallRiskDelta} pts
               </div>
             </div>
             <div className="flex-1 bg-emerald-50 border border-emerald-100 p-4 rounded text-center">
               <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Added</div>
               <div className="text-2xl font-bold text-emerald-700">{added}</div>
             </div>
             <div className="flex-1 bg-red-50 border border-red-100 p-4 rounded text-center">
               <div className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-1">Removed</div>
               <div className="text-2xl font-bold text-red-700">{removed}</div>
             </div>
             <div className="flex-1 bg-orange-50 border border-orange-100 p-4 rounded text-center">
               <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1">Modified</div>
               <div className="text-2xl font-bold text-orange-700">{modified}</div>
             </div>
          </div>

          {/* Contract Summary */}
          <div className="mb-12">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Contract Comparison Summary</h3>
            <p className="text-sm text-gray-700 leading-relaxed text-justify mb-6">
              {comparison.executiveSummary}
            </p>

            {comparison.keyLegalChanges?.length > 0 && (
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Key Legal Impacts</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {comparison.keyLegalChanges.map((t: string, i: number) => (
                    <li key={i} className="text-sm text-gray-700">{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Top Risk Increases */}
          {criticalChanges.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-bold text-gray-900 border-b border-red-200 pb-2 mb-4 text-red-700 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                Critical Risk Increases
              </h3>
              <table className="w-full text-sm border-collapse border border-gray-200">
                <thead className="bg-red-50">
                  <tr>
                    <th className="border border-gray-200 p-2 text-left font-bold text-red-900">Clause</th>
                    <th className="border border-gray-200 p-2 text-center font-bold text-red-900 w-24">Risk Delta</th>
                    <th className="border border-gray-200 p-2 text-left font-bold text-red-900">AI Impact Explanation</th>
                  </tr>
                </thead>
                <tbody>
                  {criticalChanges.map((diff: any) => (
                    <tr key={diff._id} className="border border-gray-200">
                      <td className="border border-gray-200 p-3 font-medium align-top">
                        {getFriendlyClauseTitle(diff.revisedClauseId?.title || diff.originalClauseId?.title)}
                      </td>
                      <td className="border border-gray-200 p-3 text-center text-red-600 font-bold align-top">
                        +{diff.riskDelta}
                      </td>
                      <td className="border border-gray-200 p-3 text-gray-700 align-top">
                        {diff.aiDifferenceExplanation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Full Clause Differences */}
          <div className="break-before-page">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-6">Complete Clause Differences</h3>
            
            <div className="space-y-8">
              {meaningfulChanges.map((diff: any, idx: number) => (
                <div key={diff._id} className="border border-gray-300 rounded overflow-hidden">
                  
                  {/* Header */}
                  <div className="bg-gray-100 p-3 border-b border-gray-300 flex justify-between items-center">
                    <span className="font-bold text-gray-900">
                      {idx + 1}. {getFriendlyClauseTitle(diff.status === "ADDED" ? diff.revisedClauseId?.title : diff.originalClauseId?.title)}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      diff.status === "ADDED" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                      diff.status === "REMOVED" ? "bg-red-100 text-red-800 border-red-200" :
                      "bg-orange-100 text-orange-800 border-orange-200"
                    }`}>
                      {diff.status}
                    </span>
                  </div>

                  {/* Body Side by Side */}
                  <div className="flex divide-x divide-gray-300">
                    <div className="flex-1 p-4 bg-white">
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-100 pb-1">
                        Version {comparison.originalVersionId?.versionNumber} (Base)
                      </div>
                      <div className={`text-xs text-gray-700 whitespace-pre-wrap ${diff.status === 'REMOVED' ? 'line-through decoration-red-300 text-red-900/60' : ''}`}>
                        {diff.status === "ADDED" ? <span className="italic text-gray-400">Not present.</span> : diff.originalClauseId?.content}
                      </div>
                    </div>
                    
                    <div className="flex-1 p-4 bg-gray-50">
                       <div className="text-[9px] font-bold text-primary uppercase tracking-widest mb-2 border-b border-gray-200 pb-1">
                        Version {comparison.revisedVersionId?.versionNumber} (Revised)
                      </div>
                      <div className={`text-xs text-gray-900 whitespace-pre-wrap ${diff.status === 'ADDED' ? 'text-emerald-900' : ''}`}>
                         {diff.status === "REMOVED" ? <span className="italic text-gray-400">Removed.</span> : diff.revisedClauseId?.content}
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
