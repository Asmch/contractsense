"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ProductTour } from "@/components/landing/product-tour/ProductTour";
import { WorkspaceShowcase } from "@/components/landing/WorkspaceShowcase";
import { FounderStory } from "@/components/landing/FounderStory";
import { UploadDemo } from "@/components/landing/UploadDemo";
import { EnterpriseSecurity } from "@/components/landing/EnterpriseSecurity";
import { EnterpriseFooter } from "@/components/landing/EnterpriseFooter";
import { ContractTypes } from "@/components/landing/ContractTypes";
import { Metrics, Integrations } from "@/components/landing/MetricsIntegrations";
import { SocialProofLogos, FAQ } from "@/components/landing/SocialProofAndFAQ";
import { MessageSquare, ArrowRightLeft } from "lucide-react";

export default function LandingPage() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      <div className="mouse-light" />
      <Navbar />
      
      {/* 1. Hero */}
      <Hero />
      
      {/* 1.5 Social Proof Logos (New) */}
      <SocialProofLogos />
      
      {/* 2. How it Works */}
      <HowItWorks />
      
      {/* 3. Founder Story (Moved up for emotional connection) */}
      <FounderStory />
      
      {/* 4. Feature Stories - Now a Cinematic Product Tour */}
      <ProductTour />

      {/* 5. Supported Contract Types */}
      <ContractTypes />

      {/* 6. Enterprise Security */}
      <EnterpriseSecurity />

      {/* 7. Workspace Showcase */}
      <WorkspaceShowcase />

      {/* 8. Integrations */}
      <Integrations />

      {/* 9. Animated Metrics */}
      <Metrics />
      
      {/* 10. FAQ (New) */}
      <FAQ />

      {/* 11. Final Conversion Upload Demo */}
      <UploadDemo />

      {/* 12. Massive Enterprise Footer */}
      <EnterpriseFooter />
      
    </main>
  );
}
