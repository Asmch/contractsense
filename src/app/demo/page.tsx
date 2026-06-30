import { DemoWorkspace } from "@/demo/components/DemoWorkspace";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Tour | ContractSense",
  description: "Experience the ContractSense analysis pipeline.",
};

export default function DemoPage() {
  return (
    <DemoWorkspace />
  );
}
