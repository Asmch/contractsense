"use client";

import { MainLayoutUI } from "@/components/layout/MainLayoutUI";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <MainLayoutUI>{children}</MainLayoutUI>;
}
