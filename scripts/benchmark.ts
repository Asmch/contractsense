import fs from "fs";
import path from "path";
import { ClauseDetectorService } from "../src/features/contracts/services/clause-detector.service";

// Simple mock for the next/navigation or other Next.js specific things if they ever get imported
if (typeof process.env.NODE_ENV === "undefined") {
  (process.env as any).NODE_ENV = "development";
}

async function runBenchmark() {
  const testDir = path.join(__dirname, "../test-contracts");
  
  if (!fs.existsSync(testDir)) {
    console.error(`Test directory not found at ${testDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(testDir).filter(f => f.endsWith(".txt") || f.endsWith(".pdf"));
  
  if (files.length === 0) {
    console.warn("No test files found in test-contracts folder. Please add some .txt files for testing.");
    return;
  }

  console.log("\n=================================");
  console.log("  CLAUSE DETECTOR BENCHMARK");
  console.log("=================================\n");

  for (const file of files) {
    const filePath = path.join(testDir, file);
    
    // For benchmark purposes, we will just assume .txt files for now since pdf-parse requires async loading
    // In a real scenario, you'd integrate DocumentParserService
    if (file.endsWith(".txt")) {
      const text = fs.readFileSync(filePath, "utf-8");
      
      const startTime = performance.now();
      const clauses = ClauseDetectorService.detectClauses(text, "mock_contract_id");
      const endTime = performance.now();
      
      const executionTime = (endTime - startTime).toFixed(2);
      
      const fileName = file.split(".")[0].toUpperCase();
      console.log(`${fileName}: ${clauses.length} clauses detected (${executionTime}ms)`);
      
      // Calculate average confidence
      const avgConf = clauses.reduce((acc, c) => acc + (c.confidenceScore || 0), 0) / (clauses.length || 1);
      console.log(`  └ Average Confidence: ${avgConf.toFixed(1)}%`);
    } else {
      console.log(`${file}: PDF parsing skipped in fast-benchmark. Use .txt for raw detection testing.`);
    }
  }
  
  console.log("\n=================================\n");
}

runBenchmark().catch(console.error);
