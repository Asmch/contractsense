import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { connectToDatabase } from "../src/database/connection";
import { ContractModel } from "../src/database/models/Contract";

async function main() {
  await connectToDatabase();
  const contract = await ContractModel.findById("6a394ffce5fc0750f7b16888");
  console.log("File URL:", contract?.fileUrl);
  process.exit(0);
}

main().catch(console.error);
