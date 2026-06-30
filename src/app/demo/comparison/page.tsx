import { DemoBanner } from "@/demo/components/DemoBanner";
import { GitCompare } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo Comparison | ContractSense",
};

export default function DemoComparisonPage() {
  return (
    <div className="relative pt-12 min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <DemoBanner />
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
          <GitCompare className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-heading font-semibold text-foreground mb-3">
          Contract Comparison
        </h2>
        <p className="text-muted-foreground text-sm">
          This feature allows you to compare different versions of a contract to spot precise changes in risk and obligations. 
          Create a free account to try the comparison engine on your own files.
        </p>
      </div>
    </div>
  );
}
