import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/database/connection";
import { ContractVersionModel } from "@/database/models/ContractVersion";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    
    const versions = await ContractVersionModel.find({ contractId: resolvedParams.id })
      .sort({ versionNumber: -1 })
      .lean();

    return NextResponse.json(versions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
