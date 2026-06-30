import { MainLayoutUI } from "@/components/layout/MainLayoutUI";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayoutUI isDemo={true}>
      {children}
    </MainLayoutUI>
  );
}
