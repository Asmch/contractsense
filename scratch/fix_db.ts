import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { connectToDatabase } from "../src/database/connection";
import { ContractModel } from "../src/database/models/Contract";

async function main() {
  await connectToDatabase();
  console.log("Updating all existing contracts to use the mock sample PDF...");
  
  const result = await ContractModel.updateMany(
    {}, 
    { $set: { fileUrl: "https://res.cloudinary.com/demo/image/upload/v1/sample.pdf" } }
  );
  
  console.log(`Updated ${result.modifiedCount} contracts successfully.`);
  process.exit(0);
}

main().catch(console.error);
