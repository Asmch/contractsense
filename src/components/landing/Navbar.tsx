"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Scale, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    getSession().then(session => {
      if (session?.user) {
        setIsLoggedIn(true);
      }
    });
  }, []);

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-center p-6 pointer-events-none"
    >
      <div className="glass-panel pointer-events-auto rounded-full px-6 py-3 flex items-center justify-between w-full max-w-5xl">
        <Link href="/" className="flex items-center gap-2 text-foreground font-heading font-semibold text-xl tracking-tight">
          <div className="bg-primary/10 p-2 rounded-full text-primary">
            <Scale className="w-5 h-5" />
          </div>
          ContractSense
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/80">
          <Link href="#product" className="hover:text-primary transition-colors">Product</Link>
          <Link href="#experience" className="hover:text-primary transition-colors">Experience</Link>
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Link href="/dashboard" className="hidden sm:block bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-full transition-all gold-glow min-h-[44px] flex items-center">
              My Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden sm:block min-h-[44px] flex items-center justify-center">
                Sign in
              </Link>
              <Link href="/login" className="hidden sm:block bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-full transition-all gold-glow min-h-[44px] flex items-center">
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
        <div className="absolute top-[80px] left-6 right-6 bg-white/95 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 pointer-events-auto md:hidden">
          <Link href="#product" className="text-foreground font-medium p-2 min-h-[44px]" onClick={() => setIsMobileMenuOpen(false)}>Product</Link>
          <Link href="#experience" className="text-foreground font-medium p-2 min-h-[44px]" onClick={() => setIsMobileMenuOpen(false)}>Experience</Link>
          <Link href="#features" className="text-foreground font-medium p-2 min-h-[44px]" onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
          <Link href="#pricing" className="text-foreground font-medium p-2 min-h-[44px]" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
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
