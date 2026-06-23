import { NextResponse } from "next/server";
import { ContractModel } from "@/database/models/Contract";
import { ContractClauseModel } from "@/database/models/ContractClause";
import { ContractProcessingLogModel } from "@/database/models/ContractProcessingLog";
import { connectToDatabase } from "@/database/connection";
import { auth } from "@/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectToDatabase();
    
    const contract = await ContractModel.findById(id).lean();
    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    const clauses = await ContractClauseModel.find({ contractId: id }).sort({ order: 1 }).lean();
    const logs = await ContractProcessingLogModel.find({ contractId: id }).sort({ timestamp: 1 }).lean();

    return NextResponse.json({ contract, clauses, logs });
  } catch (error: any) {
    console.error("Debug API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
