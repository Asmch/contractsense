import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { connectToDatabase } from "../src/database/connection";
import { ContractModel } from "../src/database/models/Contract";
import mongoose from "mongoose";

async function main() {
  await connectToDatabase();
  const contractId = "6a379db35f7af0b82673df33"; // The ID from the user's error
  const contract = await ContractModel.findById(contractId);
  console.log(contract);
  process.exit(0);
}

main().catch(console.error);
