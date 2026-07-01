import { connectToDatabase } from "./database/connection";
import { ContractProcessingLogModel } from "./database/models/ContractProcessingLog";
import { ContractModel } from "./database/models/Contract";

async function main() {
  await connectToDatabase();
  console.log("Connected to DB");
  const contracts = await ContractModel.find().sort({ createdAt: -1 }).limit(1);
  if (contracts.length > 0) {
    const latest = contracts[0];
    console.log("Latest Contract Status:", latest.status);
    console.log("Latest Processing Logs:");
    latest.processingLogs.slice(-5).forEach((l: any) => console.log(l));
    
    // Also check ContractProcessingLogModel
    const logs = await ContractProcessingLogModel.find({ contractId: latest._id }).sort({ timestamp: -1 }).limit(5);
    console.log("Recent DB Logs:", logs.map((l: any) => l.message));
  } else {
    console.log("No contracts found");
  }
  process.exit(0);
}

main().catch(console.error);
