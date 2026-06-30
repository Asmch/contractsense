import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/database/connection";
import { ComparisonModel } from "@/database/models/Comparison";
import { ComparisonClauseModel } from "@/database/models/ComparisonClause";
import { ContractClauseModel } from "@/database/models/ContractClause";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    
    const comparison = await ComparisonModel.findById(resolvedParams.id)
      .populate({ path: "originalVersionId", select: "versionNumber fileUrl createdAt" })
      .populate({ path: "revisedVersionId", select: "versionNumber fileUrl createdAt" })
      .populate({ path: "contractId", select: "title" })
      .lean();

    if (!comparison) {
      return NextResponse.json({ error: "Comparison not found" }, { status: 404 });
    }

    const differences = await ComparisonClauseModel.find({ comparisonId: resolvedParams.id })
      .populate({ path: "originalClauseId", model: ContractClauseModel })
      .populate({ path: "revisedClauseId", model: ContractClauseModel })
      .lean();

    return NextResponse.json({
      comparison,
      differences
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
