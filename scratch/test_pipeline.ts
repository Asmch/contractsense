import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { connectToDatabase } from "../src/database/connection";
import { ContractModel } from "../src/database/models/Contract";
import { ContractProcessingService } from "../src/features/contracts/services/contract-processing.service";
import mongoose from "mongoose";

async function main() {
  await connectToDatabase();
  
  console.log("Creating a test contract...");
  const contract = await ContractModel.create({
    ownerId: new mongoose.Types.ObjectId(), // Fake user ID
    title: "Test Contract",
    fileUrl: "https://res.cloudinary.com/demo/image/upload/v1/sample.pdf",
    status: "UPLOADED"
  });
  
  console.log(`Created contract ${contract._id}, processing...`);
  
  try {
    await ContractProcessingService.processContract(contract._id.toString());
    console.log("Processing completed successfully!");
    
    const updated = await ContractModel.findById(contract._id);
    console.log("Updated status:", updated?.status);
    console.log("Word count:", updated?.wordCount);
    console.log("Page count:", updated?.pageCount);
  } catch (err) {
    console.error("Processing failed:", err);
  }
  
  process.exit(0);
}

main().catch(console.error);
