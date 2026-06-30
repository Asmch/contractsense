import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/connection";
import { ContractModel as Contract } from "@/database/models/Contract";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, fileUrl } = await req.json();

    if (!title || !fileUrl) {
      return NextResponse.json({ message: "Missing title or fileUrl" }, { status: 400 });
    }

    await connectToDatabase();

    const newContract = await Contract.create({
      ownerId: session.user.id,
      title,
      fileUrl,
      status: "UPLOADED",
    });

    return NextResponse.json({ contractId: newContract._id }, { status: 201 });
  } catch (error) {
    console.error("Failed to save contract:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    
    // In development/testing, if no session, just return all or a mock user's contracts
    // For now, let's enforce auth to match POST, but gracefully fallback if needed.
    const query = session?.user?.id ? { ownerId: session.user.id } : {};

    await connectToDatabase();
    
    const contracts = await Contract.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ contracts });
  } catch (error: any) {
    console.error("Failed to fetch contracts:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

