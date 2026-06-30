import { ContractReportUI } from "@/components/contracts/ContractReportUI";
import { msaContract, msaClauses } from "@/demo/contracts/msa";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo Report | ContractSense",
};

export default function DemoReportPage() {
  return (
    <ContractReportUI contract={msaContract} clauses={msaClauses} />
  );
}
