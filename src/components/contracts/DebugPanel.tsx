"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Terminal, Bug } from "lucide-react";

export function DebugPanel({ contractId }: { contractId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (isOpen && !data) {
      fetch(`/api/contracts/${contractId}/debug`)
        .then(res => res.json())
        .then(setData)
        .catch(console.error);
    }
  }, [isOpen, contractId, data]);

  if (process.env.NODE_ENV !== "development") {
    return null; // Ensure it NEVER renders in production
  }

  return (
    <div className="mt-12 mb-8 border border-zinc-800 rounded-lg overflow-hidden bg-[#0c0c0c]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-yellow-500/10 text-yellow-500 rounded-md">
            <Bug className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="font-mono text-sm font-semibold text-zinc-200">Developer Debug Panel</h3>
            <p className="text-xs text-zinc-500 font-mono">Detector Version: v2.3</p>
          </div>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-zinc-500" /> : <ChevronRight className="w-5 h-5 text-zinc-500" />}
      </button>

      {isOpen && (
        <div className="p-6 border-t border-zinc-800 font-mono text-xs text-zinc-300">
          {!data ? (
            <div className="animate-pulse flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Fetching debug data...
            </div>
          ) : (
            <div className="space-y-8">
              {/* Document Metrics */}
              <div>
                <h4 className="text-yellow-500 mb-3 uppercase tracking-wider font-semibold">Document Metrics</h4>
                <div className="grid grid-cols-4 gap-4 p-4 bg-black/40 rounded border border-zinc-800/50">
                  <div><span className="text-zinc-500">Words:</span> {data.contract.wordCount}</div>
                  <div><span className="text-zinc-500">Pages:</span> {data.contract.pageCount}</div>
                  <div><span className="text-zinc-500">Status:</span> {data.contract.status}</div>
                  <div><span className="text-zinc-500">Total Clauses:</span> {data.clauses.length}</div>
                </div>
              </div>

              {/* Processing Logs */}
              <div>
                <h4 className="text-yellow-500 mb-3 uppercase tracking-wider font-semibold">Processing Logs</h4>
                <div className="p-4 bg-black/40 rounded border border-zinc-800/50 space-y-2 max-h-64 overflow-y-auto">
                  {data.logs.map((log: any, i: number) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-zinc-600 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      <span className={`shrink-0 w-16 ${log.severity === 'ERROR' ? 'text-red-400' : log.severity === 'WARNING' ? 'text-yellow-400' : 'text-blue-400'}`}>
                        [{log.severity}]
                      </span>
                      <span className="text-zinc-400 shrink-0 w-32">[{log.step}]</span>
                      <span className="text-zinc-200">{log.message}</span>
                    </div>
                  ))}
                  {data.logs.length === 0 && <span className="text-zinc-600">No processing logs found.</span>}
                </div>
              </div>

              {/* Detected Boundaries */}
              <div>
                <h4 className="text-yellow-500 mb-3 uppercase tracking-wider font-semibold">Detected Clause Boundaries</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-500">
                        <th className="py-2 px-4 font-normal">#</th>
                        <th className="py-2 px-4 font-normal">Type</th>
                        <th className="py-2 px-4 font-normal w-1/4">Detected Header</th>
                        <th className="py-2 px-4 font-normal">Length</th>
                        <th className="py-2 px-4 font-normal">Strategy</th>
                        <th className="py-2 px-4 font-normal">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {data.clauses.map((clause: any) => (
                        <tr key={clause._id} className="hover:bg-zinc-900/30">
                          <td className="py-3 px-4 text-zinc-500">{clause.order}</td>
                          <td className="py-3 px-4 text-emerald-400">{clause.clauseType}</td>
                          <td className="py-3 px-4 text-zinc-200 truncate max-w-xs" title={clause.title}>{clause.title}</td>
                          <td className="py-3 px-4">{clause.content?.length || 0} chars</td>
                          <td className="py-3 px-4 text-blue-400">{clause.detectedBy || 'N/A'}</td>
                          <td className="py-3 px-4">
                            <span className={clause.confidenceScore >= 80 ? 'text-emerald-400' : clause.confidenceScore >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                              {clause.confidenceScore || 0}%
                            </span>
                            {clause.boundaryConfidence && <span className="text-zinc-500 ml-2">(B: {clause.boundaryConfidence}%)</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
