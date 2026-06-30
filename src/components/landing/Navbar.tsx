"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Scale, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  useEffect(() => {
    getSession().then(session => {
      if (session?.user) {
        setIsLoggedIn(true);
      }
    });
  }, []);

  const navItems = [
    { path: "#product", name: "Product" },
    { path: "#experience", name: "Experience" },
    { path: "#features", name: "Features" },
    { path: "#pricing", name: "Pricing" },
  ];

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-center p-6 pointer-events-none"
    >
      <div className="pointer-events-auto rounded-full px-6 py-3 flex items-center justify-between w-full max-w-5xl bg-white/70 backdrop-blur-2xl border border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all duration-300">
        <Link href="/" className="flex items-center gap-2 text-foreground font-heading font-semibold text-xl tracking-tight group">
          <div className="bg-primary/10 p-2 rounded-full text-primary transition-transform duration-300 group-hover:scale-105">
            <Scale className="w-5 h-5" />
          </div>
          ContractSense
        </Link>
        
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              href={item.path} 
              onMouseEnter={() => setHoveredPath(item.path)}
              onMouseLeave={() => setHoveredPath(null)}
              className="relative px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors z-10"
            >
              {item.name}
              {hoveredPath === item.path && (
                <motion.div
                  layoutId="navbar-hover"
                  className="absolute inset-0 bg-black/5 rounded-full -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", bounce: 0.1, duration: 0.3 }}
                />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Link href="/dashboard" className="hidden sm:block bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300 gold-glow min-h-[44px] flex items-center hover:scale-[1.02]">
              My Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden sm:block px-3 py-2">
                Sign in
              </Link>
              <Link href="/login" className="hidden sm:block bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300 gold-glow min-h-[44px] flex items-center hover:scale-[1.02]">
                Get Started
              </Link>
            </>
          )}

          <button 
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors min-h-[44px] flex items-center justify-center pointer-events-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-[80px] left-6 right-6 bg-white/95 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-2xl flex flex-col gap-2 pointer-events-auto md:hidden">
          {navItems.map((item) => (
             <Link key={item.path} href={item.path} className="text-foreground font-medium p-3 rounded-xl hover:bg-black/5 transition-colors min-h-[44px]" onClick={() => setIsMobileMenuOpen(false)}>{item.name}</Link>
          ))}
          <hr className="border-border/50 my-2" />
          {isLoggedIn ? (
            <Link href="/dashboard" className="bg-primary text-primary-foreground text-center font-medium p-3 rounded-xl min-h-[44px]" onClick={() => setIsMobileMenuOpen(false)}>My Dashboard</Link>
          ) : (
            <Link href="/login" className="bg-primary text-primary-foreground text-center font-medium p-3 rounded-xl min-h-[44px]" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
          )}
        </div>
      )}
    </motion.nav>
  );
}
