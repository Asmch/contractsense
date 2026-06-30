import { NextResponse } from "next/server";
import { ContractModel } from "@/database/models/Contract";
import { ContractClauseModel } from "@/database/models/ContractClause";
import { getContractDecision } from "@/utils/contract-decision";
import { connectToDatabase } from "@/database/connection";
import { auth } from "@/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const contract = await ContractModel.findOne({ _id: id, ownerId: session.user.id }).select("status discoveries");
    
    if (!contract) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (contract.status === "COMPLETE") {
      const clauses = await ContractClauseModel.find({ contractId: id }).lean();
      const decision = getContractDecision(contract, clauses);
      
      return NextResponse.json({ 
        status: contract.status,
        safetyScore: contract.safetyScore,
        decision,
        clauseCount: clauses.length,
        discoveries: contract.discoveries || []
      });
    }

    return NextResponse.json({ 
      status: contract.status, 
      discoveries: contract.discoveries || [] 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
