import { NextResponse } from "next/server";
import { ContractModel } from "@/database/models/Contract";
import { ContractClauseModel } from "@/database/models/ContractClause";
import { connectToDatabase } from "@/database/connection";
import { auth } from "@/auth";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Verify ownership and delete contract
    const contract = await ContractModel.findOneAndDelete({ _id: id, ownerId: session.user.id });
    
    if (!contract) {
      return NextResponse.json({ error: "Not found or not authorized" }, { status: 404 });
    }

    // Also delete associated clauses
    await ContractClauseModel.deleteMany({ contractId: id });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
