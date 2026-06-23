import { NextResponse } from "next/server";
import { ContractProcessingService } from "@/features/contracts/services/contract-processing.service";
import { auth } from "@/auth";
import { connectToDatabase } from "@/database/connection";
import { ContractModel } from "@/database/models/Contract";

// Ensure this runs on Node.js (not Edge) because pdf-parse and mammoth require native Node.js APIs
export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Verify ownership
    const contract = await ContractModel.findOne({ _id: id, ownerId: session.user.id });
    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    // Run processing synchronously for now so we can return success when it finishes
    // Note: Vercel hobby limits to 10s or 60s, which is plenty for our rule-based detection
    await ContractProcessingService.processContract(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Processing error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
