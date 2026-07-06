import { Upload } from "lucide-react";
import Link from "next/link";
import { connectToDatabase } from "@/database/connection";
import { ContractModel as Contract } from "@/database/models/Contract";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ContractsClientTable } from "./ContractsClientTable";

export default async function ContractsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectToDatabase();
  
  const contractsDocs = await Contract.find({ ownerId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  // Convert ObjectIds and Dates to strings for the client component
  const contracts = contractsDocs.map((c: any) => ({
    _id: c._id.toString(),
    title: c.title,
    status: c.status,
    createdAt: c.createdAt.toISOString()
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-semibold text-foreground">All Contracts</h2>
          <p className="text-muted-foreground mt-1 text-sm">Manage and review all your uploaded legal documents.</p>
        </div>
        <Link 
          href="/contracts/upload" 
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm gold-glow shrink-0"
        >
          <Upload className="w-4 h-4" />
          Upload New
        </Link>
      </div>

      <ContractsClientTable initialContracts={contracts} />
    </div>
  );
}
