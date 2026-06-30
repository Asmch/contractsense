import { ContractModel } from "@/database/models/Contract";
import { ContractClauseModel } from "@/database/models/ContractClause";
import { ClauseAnalyzer } from "../ai/analysis/clause-analyzer";
import { ContractScorer } from "../ai/analysis/contract-scorer";
import { SummaryGenerator } from "../ai/analysis/summary-generator";
import { Negotiator } from "../ai/negotiation/negotiator";
import { connectToDatabase } from "@/database/connection";

export class AnalyzeContractJob {
  static async run(contractId: string) {
    await connectToDatabase();
    
    const contract = await ContractModel.findById(contractId);
    if (!contract) throw new Error("Contract not found");

    const log = (stage: string, message: string) => {
      contract.processingLogs.push({ stage, message, timestamp: new Date() });
    };

    const logDiscovery = async (type: string, message: string, detail: string) => {
      await ContractModel.findByIdAndUpdate(contractId, {
        $push: {
          discoveries: {
            id: Math.random().toString(36).substring(7),
            type,
            message,
            detail,
            timestamp: new Date()
          }
        }
      });
    };

    try {
      await ContractModel.findByIdAndUpdate(contractId, {
        $set: { status: "ANALYZING" },
        $push: { processingLogs: { stage: "AI_ANALYSIS", message: "Starting AI risk analysis pipeline", timestamp: new Date() } }
      });

      await logDiscovery("info", "Determining the agreement type.", "Scanning pages and extracting text.");

      const clauses = await ContractClauseModel.find({ contractId }).sort({ order: 1 });
      if (!clauses || clauses.length === 0) {
        throw new Error("No clauses found to analyze");
      }

      let totalTokens = 0;

      // 1. Analyze Clauses in Batches to avoid rate limits
      // Only process clauses that haven't been successfully analyzed yet (Idempotency)
      const meaningfulClauses = clauses.filter(c => c.content.length > 50 && !c.rawAiResponse);
      
      if (meaningfulClauses.length > 0) {
        log("AI_ANALYSIS", `Analyzing ${meaningfulClauses.length} unanalyzed clauses using Adaptive Batching (Gemini 2.5 Flash)...`);
        
        const CRITICAL_TYPES = ["Liability", "Indemnification", "Intellectual Property", "Termination", "Data Privacy", "Governing Law", "Non-Compete"];

        let currentSmallBatch: typeof meaningfulClauses = [];
        let dynamicDiscoveriesCount = 0;

        const processSmallBatch = async () => {
          if (currentSmallBatch.length === 0) return;
          const clausesPayload = currentSmallBatch.map(c => ({ id: c._id.toString(), title: c.title, content: c.content }));
          try {
            const { results, tokensUsed } = await ClauseAnalyzer.analyzeClausesBatch(clausesPayload);
            totalTokens += tokensUsed;
            for (const res of results) {
              const clause = currentSmallBatch.find(c => c._id.toString() === res.clauseId);
              if (clause) await updateClauseWithAnalysis(clause, res.analysis);
            }
          } catch (err) {
            console.error("Batch analysis failed:", err);
            throw err;
          }
          currentSmallBatch = [];
        };

        const updateClauseWithAnalysis = async (clause: any, analysis: any) => {
          if (analysis.cleanTitle) clause.title = analysis.cleanTitle;
          clause.clauseType = analysis.clauseType as any;
          if (analysis.confidenceScore !== undefined) clause.confidenceScore = analysis.confidenceScore;
          clause.riskLevel = analysis.riskLevel;
          clause.riskScore = analysis.riskScore;
          
          // Negotiation specifics
          clause.negotiationPriority = analysis.negotiationPriority;
          clause.negotiationDifficulty = analysis.negotiationDifficulty;
          clause.confidenceLevel = analysis.confidenceLevel;

          if (analysis.clauseInsight) {
            clause.clauseInsight = {
              triggerPhrases: analysis.clauseInsight.triggerPhrases || [],
              reasonFlagged: analysis.clauseInsight.reasonFlagged,
              plainExplanation: analysis.clauseInsight.plainExplanation,
              whyItMatters: analysis.clauseInsight.whyItMatters,
              userImpact: analysis.clauseInsight.userImpact,
              howCommonIsThis: analysis.clauseInsight.howCommonIsThis,
              shouldYouWorry: analysis.clauseInsight.shouldYouWorry,
              canIgnore: analysis.clauseInsight.canIgnore,
              recommendedAction: analysis.clauseInsight.recommendedAction,
              needsHumanReview: analysis.clauseInsight.needsHumanReview,
              businessImpact: analysis.clauseInsight.businessImpact,
              conversationStarter: analysis.clauseInsight.conversationStarter,
              confidenceReason: analysis.clauseInsight.confidenceReason,
              realLifeExample: analysis.clauseInsight.realLifeExample,
              highlightRanges: []
            };
            
            // Calculate highlight ranges safely
            const highlightRanges: { start: number; end: number }[] = [];
            if (Array.isArray(analysis.clauseInsight.triggerPhrases) && clause.content) {
              const lowerContent = clause.content.toLowerCase();
              for (const phrase of analysis.clauseInsight.triggerPhrases) {
                if (phrase && typeof phrase === 'string' && phrase.length > 3) {
                  const lowerPhrase = phrase.toLowerCase();
                  const start = lowerContent.indexOf(lowerPhrase);
                  if (start !== -1) {
                    highlightRanges.push({ start, end: start + phrase.length });
                  }
                }
              }
            }
            clause.clauseInsight.highlightRanges = highlightRanges;
          }
          
          clause.rawAiResponse = JSON.stringify(analysis);
          await clause.save();

          // Phase 6.5 AI Thinking Transparency - Emitting contextual thoughts
          if (analysis.clauseType && dynamicDiscoveriesCount < 4 && Math.random() > 0.4) {
            dynamicDiscoveriesCount++;
            let type = "info";
            let message = `We found a ${analysis.cleanTitle || analysis.clauseType} clause.`;
            let detail = "We're checking whether that's reasonable.";
            
            if (analysis.riskLevel === "HIGH" || analysis.riskLevel === "CRITICAL") {
              type = "warning";
              detail = "This section appears broader than usual. We'll explain why shortly.";
            } else if (analysis.riskLevel === "LOW") {
              type = "success";
              message = `${analysis.cleanTitle || analysis.clauseType} protections found.`;
              detail = "Reviewing whether they are balanced.";
            }
            
            await logDiscovery(type, message, detail);
          }
        };

        for (const clause of meaningfulClauses) {
          const wordCount = clause.content.split(/\s+/).length;
          const isCritical = CRITICAL_TYPES.includes(clause.clauseType);

          if (isCritical || wordCount >= 250) {
            // Process any pending small batch first
            await processSmallBatch();
            
            // Analyze individually
            try {
              const { result, tokensUsed } = await ClauseAnalyzer.analyzeSingleClause({
                id: clause._id.toString(),
                title: clause.title,
                content: clause.content
              });
              totalTokens += tokensUsed;
              await updateClauseWithAnalysis(clause, result);
            } catch (err) {
              console.error(`Single analysis failed for clause ${clause.title}:`, err);
              throw err;
            }
          } else {
            // Add to small batch
            currentSmallBatch.push(clause);
            if (currentSmallBatch.length >= 4) { // Batch 4 small clauses together
              await processSmallBatch();
            }
          }
        }
        
        // Process remaining small batch
        await processSmallBatch();
      }

      await ContractModel.findByIdAndUpdate(contractId, {
        $set: {
          analysisProgress: {
            clausesAnalyzed: true,
            scoringComplete: false,
            summaryGenerated: false,
            negotiationAnalyzed: false
          }
        }
      });

      // 2. Score the Contract Deterministically
      const checkContract = await ContractModel.findById(contractId);
      const updatedClausesBeforeScore = await ContractClauseModel.find({ contractId });
      if (checkContract && !checkContract.analysisProgress?.scoringComplete) {
        await ContractModel.findByIdAndUpdate(contractId, {
          $push: { processingLogs: { stage: "AI_ANALYSIS", message: "Calculating deterministic safety score and granular risk engine...", timestamp: new Date() } }
        });
        await logDiscovery("info", "Comparing responsibilities between both parties.", "Looking for commonly negotiated items.");
        const scoreResult = ContractScorer.calculateScore(updatedClausesBeforeScore);
        
        await ContractModel.findByIdAndUpdate(contractId, {
          $set: {
            safetyScore: scoreResult.safetyScore,
            riskLevel: scoreResult.riskLevel,
            riskEngine: scoreResult.riskEngine,
            scoreExplanation: scoreResult.scoreExplanation,
            "analysisProgress.scoringComplete": true
          }
        });
      }

      // 3. Generate Executive Summary
      const summaryCheck = await ContractModel.findById(contractId);
      if (summaryCheck && !summaryCheck.analysisProgress?.summaryGenerated) {
        await ContractModel.findByIdAndUpdate(contractId, {
          $push: { processingLogs: { stage: "AI_ANALYSIS", message: "Generating executive summary...", timestamp: new Date() } }
        });
        await logDiscovery("info", "Preparing beginner-friendly explanations.", "Summarizing the key takeaways.");
        const updatedClauses = await ContractClauseModel.find({ contractId });
        const { result: summaryResult, tokensUsed: summaryTokens } = await SummaryGenerator.generateSummary(updatedClauses);
        totalTokens += summaryTokens;

        await ContractModel.findByIdAndUpdate(contractId, {
          $set: {
            executiveSummary: summaryResult.executiveSummary,
            keyTakeaways: summaryResult.keyTakeaways,
            "analysisProgress.summaryGenerated": true
          }
        });
      }

      // 4. Run Negotiation AI on eligible clauses
      const negotiationCheck = await ContractModel.findById(contractId);
      if (negotiationCheck && !negotiationCheck.analysisProgress?.negotiationAnalyzed) {
        await ContractModel.findByIdAndUpdate(contractId, {
          $push: { processingLogs: { stage: "AI_ANALYSIS", message: "Running Negotiation Copilot on high-risk clauses...", timestamp: new Date() } }
        });
        const updatedClauses = await ContractClauseModel.find({ contractId });
        
        let negotiatedCount = 0;
        for (const clause of updatedClauses) {
          if (Negotiator.shouldNegotiate(clause as any) && !clause.suggestedRewrite) {
            await ContractModel.findByIdAndUpdate(contractId, {
              $push: { processingLogs: { stage: "AI_ANALYSIS", message: `Generating negotiation strategy for clause: ${clause.title}`, timestamp: new Date() } }
            });
            // Use try-catch so one failed clause doesn't crash the whole job
            try {
              const { tokensUsed } = await Negotiator.analyzeClause(clause as any);
              totalTokens += tokensUsed;
              await clause.save();
              negotiatedCount++;
            } catch (err) {
              console.error(`Failed to negotiate clause ${clause.title}:`, err);
            }
          }
        }
        
        await ContractModel.findByIdAndUpdate(contractId, {
          $push: { processingLogs: { stage: "AI_ANALYSIS", message: `Generated negotiation strategies for ${negotiatedCount} clauses.`, timestamp: new Date() } },
          $set: { "analysisProgress.negotiationAnalyzed": true }
        });

        // 5. Generate Executive Negotiation Report
        const negotiatedClauses = await ContractClauseModel.find({ 
          contractId, 
          suggestedRewrite: { $exists: true, $ne: null } 
        }).sort({ riskScore: -1 });

        const topNegotiations = negotiatedClauses.map(c => c.title);
        const ignoredClauses = updatedClauses
          .filter(c => !Negotiator.shouldNegotiate(c as any))
          .map(c => c.title)
          .slice(0, 3); // Max 3 for brevity

        await ContractModel.findByIdAndUpdate(contractId, {
          $set: {
            executiveNegotiationReport: {
              whatToNegotiateFirst: topNegotiations.slice(0, 1),
              whatToNegotiateSecond: topNegotiations.slice(1, 3),
              whatCanBeIgnored: ignoredClauses
            }
          }
        });
      }

      // Finalize Tracking & Status
      const finalCheck = await ContractModel.findById(contractId);
      
      await logDiscovery("success", "Everything has been reviewed.", "Preparing your recommendations now.");
      
      await ContractModel.findByIdAndUpdate(contractId, {
        $set: {
          aiUsage: {
            provider: "Google",
            model: "gemini-2.5-flash",
            tokensUsed: (finalCheck?.aiUsage?.tokensUsed || 0) + totalTokens,
            estimatedCost: ((finalCheck?.aiUsage?.tokensUsed || 0) + totalTokens) * (0.000000075)
          },
          analysisVersion: "v1",
          analyzedAt: new Date(),
          status: "COMPLETE"
        },
        $push: { processingLogs: { stage: "COMPLETE", message: `AI Analysis finished.`, timestamp: new Date() } }
      });

    } catch (error: any) {
      console.error("Analysis Job Error:", error);
      
      if (error.message?.startsWith("RATE_LIMIT_EXCEEDED")) {
        const waitTime = error.message.split(":")[1] || "60";
        await ContractModel.findByIdAndUpdate(contractId, {
          $set: { status: "RATE_LIMITED" },
          $push: { processingLogs: { stage: "RATE_LIMITED", message: `API Rate Limit hit. Pausing process. Resume in ${waitTime} seconds.`, timestamp: new Date() } }
        });
      } else {
        await ContractModel.findByIdAndUpdate(contractId, {
          $set: { status: "FAILED" },
          $push: { processingLogs: { stage: "FAILED", message: `AI Analysis failed: ${error.message}`, timestamp: new Date() } }
        });
      }
      
      throw error;
    }
  }
}
