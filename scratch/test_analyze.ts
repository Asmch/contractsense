import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { AnalyzeContractJob } from "../src/jobs/analyze-contract";
import { connectToDatabase } from "../src/database/connection";
import { ContractModel } from "../src/database/models/Contract";

async function main() {
  try {
    await connectToDatabase();
    const contract = await ContractModel.findOne({ status: { $in: ["READY", "FAILED"] } });
    if (!contract) {
      console.log("No contract found");
      process.exit(0);
    }
    console.log(`Analyzing contract ${contract._id}`);
    await AnalyzeContractJob.run(contract._id.toString());
    console.log("Analysis complete");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
