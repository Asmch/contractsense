"use client";

import Link from "next/link";
import { Scale, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

export function EnterpriseFooter() {
  return (
    <footer className="bg-white border-t border-border pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-foreground font-heading font-semibold text-xl tracking-tight mb-6">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <Scale className="w-5 h-5" />
              </div>
              ContractSense
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-8">
              Understand every contract before you sign. The AI-powered legal command center for founders, agencies, and in-house teams.
            </p>
            
            {/* Security Badges */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                <ShieldCheck className="w-4 h-4 text-success" /> SOC 2 Type II Ready
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                <Lock className="w-4 h-4 text-success" /> AES-256 Encryption
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                <CheckCircle2 className="w-4 h-4 text-success" /> GDPR & CCPA Compliant
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Security</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Enterprise</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">API</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Legal Guides</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contract Templates</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Partners</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">DPA</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/50 text-xs text-muted-foreground">
          <p>© 2026 ContractSense. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-foreground transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-foreground transition-colors">GitHub</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
