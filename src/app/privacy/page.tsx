"use client";

import Link from "next/link";
import { Scale, ArrowLeft, ShieldCheck, Database, Lock } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/20">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="border-b border-border/50 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 max-w-7xl h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground font-heading font-semibold text-xl tracking-tight">
            <div className="bg-primary/10 p-1.5 rounded-md text-primary">
              <Scale className="w-5 h-5" />
            </div>
            ContractSense
          </Link>
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 max-w-3xl py-16 md:py-24 relative z-10">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-slate prose-lg max-w-none prose-headings:font-heading prose-headings:font-semibold prose-a:text-primary hover:prose-a:text-primary/80">
          
          <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl mb-10 flex flex-col sm:flex-row gap-6 items-start">
            <div className="bg-white p-3 rounded-xl shadow-sm shrink-0">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mt-0 mb-2">Our Core Promise</h3>
              <p className="text-muted-foreground m-0">
                We believe your contracts are deeply confidential. <strong>We never sell your data, and we never use your uploaded documents to train public or foundational AI models.</strong>
              </p>
            </div>
          </div>

          <h2>1. What Data Are We Collecting?</h2>
          <p>We collect only the minimum amount of data required to provide you with our contract analysis services. This includes:</p>
          <ul>
            <li><strong>Account Information:</strong> When you create an account, we collect your Full Name, Email Address, and a securely hashed password. If you use Google to sign in, we receive your basic profile information (name, email, and profile picture).</li>
            <li><strong>Contract Documents:</strong> To provide our core service, you upload contracts (PDFs, DOCX, TXT) to our platform. These files are processed by our system.</li>
            <li><strong>Usage Data:</strong> We collect non-personally identifiable analytics to understand how our application is being used (e.g., page views, feature usage) to improve performance.</li>
          </ul>

          <div className="grid sm:grid-cols-2 gap-6 my-10">
            <div className="glass-panel p-6 border border-border/50 rounded-2xl bg-white/50">
              <Database className="w-6 h-6 text-primary mb-4" />
              <h4 className="font-semibold text-foreground m-0 mb-2">Secure Storage</h4>
              <p className="text-sm text-muted-foreground m-0">Your contract data is stored securely in our MongoDB clusters with strict access controls.</p>
            </div>
            <div className="glass-panel p-6 border border-border/50 rounded-2xl bg-white/50">
              <Lock className="w-6 h-6 text-primary mb-4" />
              <h4 className="font-semibold text-foreground m-0 mb-2">Encryption Everywhere</h4>
              <p className="text-sm text-muted-foreground m-0">Data is encrypted at rest using AES-256 and in transit using TLS 1.3 protocols.</p>
            </div>
          </div>

          <h2>2. How Are We Using Your Data?</h2>
          <p>Your data is used strictly to deliver and improve your experience on ContractSense:</p>
          <ul>
            <li><strong>Service Delivery:</strong> We process your uploaded contracts using advanced Large Language Models (LLMs) via secure API endpoints to generate legal summaries, extract metadata, and identify risks.</li>
            <li><strong>Account Management:</strong> We use your email to authenticate your login, reset passwords, and send critical service updates or billing information.</li>
            <li><strong>Customer Support:</strong> If you reach out for help, we may use your account information to identify you and resolve your issues.</li>
          </ul>

          <h2>3. AI Processing & Third Parties</h2>
          <p>
            We partner with leading AI providers to analyze your documents. We have strict Data Processing Agreements (DPAs) in place ensuring that:
          </p>
          <ul>
            <li>Your contract data is processed ephemerally or retained for the absolute minimum time required (e.g., 30 days) solely for abuse monitoring.</li>
            <li><strong>Your data is explicitly opted-out of any AI model training.</strong></li>
          </ul>

          <h2>4. Data Retention and Deletion</h2>
          <p>
            You have full control over your data. If you delete a contract from your ContractSense dashboard, it is permanently scrubbed from our active databases. 
            If you wish to delete your entire account and all associated data, you can do so from your account settings or by contacting our support team.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or our data practices, please reach out to us at:
            <br />
            <a href="mailto:privacy@contractsense.com">privacy@contractsense.com</a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 bg-white text-center mt-20">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ContractSense. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
