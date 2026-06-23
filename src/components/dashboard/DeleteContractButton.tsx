"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteContractButton({ contractId }: { contractId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this contract? This action cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/contracts/${contractId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete contract");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting contract");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
      title="Delete Contract"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
