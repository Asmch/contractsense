"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Scale, LayoutDashboard, FileText, Settings, LogOut, Upload, Sparkles, Plus, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Contracts", href: "/contracts", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-secondary/5 flex w-full relative">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-white border-r border-border/50 flex-col h-screen sticky top-0 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <Link href="/" className="flex items-center gap-2 text-foreground font-heading font-semibold text-xl tracking-tight">
            <div className="bg-primary/10 p-1.5 rounded-md text-primary">
              <Scale className="w-5 h-5" />
            </div>
            ContractSense
          </Link>
        </div>

        <div className="p-4 flex-1 flex flex-col gap-1">
          <div className="mb-4">
            <Link 
              href="/contracts/upload" 
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm gold-glow"
            >
              <Upload className="w-4 h-4" />
              Upload Contract
            </Link>
          </div>
          
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2 mt-4">Menu</div>
          
          {navigation.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href + "/") && item.href !== "/dashboard");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive 
                    ? "text-primary bg-primary/5" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/5"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_8px_rgba(184,135,70,0.6)]" />
                )}
                <item.icon className={`w-4 h-4 transition-colors ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-border/50">
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden w-full lg:w-[calc(100%-16rem)]">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 w-full">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-foreground min-h-[44px]" 
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-heading font-medium text-foreground truncate">Command Center</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/contracts/upload" 
              className="hidden md:flex items-center gap-2 bg-secondary/5 border border-border/50 text-foreground px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-secondary/10 transition-colors min-h-[44px]"
            >
              <Upload className="w-4 h-4" />
              Upload
            </Link>
            <button className="hidden sm:flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm gold-glow min-h-[44px]">
              <Sparkles className="w-4 h-4" />
              Analyze
            </button>
            <div className="h-6 w-px bg-border/50 mx-2" />
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm border border-primary/20">
              ME
            </div>
          </div>
        </header>
        
        <main className="p-4 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)} />
          <div className="relative flex flex-col w-64 max-w-[80vw] h-full bg-white shadow-2xl animate-in slide-in-from-left-full">
            <div className="h-16 flex items-center justify-between px-6 border-b border-border/50">
              <Link href="/" className="flex items-center gap-2 text-foreground font-heading font-semibold text-xl tracking-tight" onClick={() => setIsMobileSidebarOpen(false)}>
                <div className="bg-primary/10 p-1.5 rounded-md text-primary">
                  <Scale className="w-5 h-5" />
                </div>
                ContractSense
              </Link>
              <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 min-h-[44px]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 flex flex-col gap-1 overflow-y-auto">
              <div className="mb-4">
                <Link 
                  href="/contracts/upload" 
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm gold-glow min-h-[44px]"
                >
                  <Upload className="w-4 h-4" />
                  Upload Contract
                </Link>
              </div>
              
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2 mt-4">Menu</div>
              
              {navigation.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href + "/") && item.href !== "/dashboard");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group min-h-[44px] ${
                      isActive 
                        ? "text-primary bg-primary/5" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/5"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_8px_rgba(184,135,70,0.6)]" />
                    )}
                    <item.icon className={`w-4 h-4 transition-colors ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="p-4 border-t border-border/50">
              <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
