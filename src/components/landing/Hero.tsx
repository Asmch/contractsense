"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, ShieldAlert, CheckCircle2, Loader2, Shield, Lock, ShieldCheck, Sparkles, FileText, Zap, Users } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const [demoStep, setDemoStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % 4);
    }, 4000); // 4 seconds per step
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={containerRef} className="relative pt-40 pb-20 overflow-hidden min-h-[90vh] flex items-center">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-[70%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] opacity-70 mix-blend-multiply" />
      </div>

      <div className="container relative z-10 px-6 mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

          {/* Text Content (30%) */}
          <div className="w-full lg:w-[40%] flex flex-col gap-6 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-white/50 backdrop-blur-sm text-xs font-medium text-muted-foreground transition-transform hover:scale-105 duration-300">
                  <span className="w-2 h-2 rounded-full bg-success"></span>
                  Now in private beta
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm text-xs font-medium text-primary transition-transform hover:scale-105 duration-300">
                  <Shield className="w-3 h-3" />
                  Enterprise Security
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-medium leading-[1.1] tracking-tight text-foreground">
                Understand every <span className="text-primary italic">contract</span> before you sign.
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-lg text-muted-foreground leading-relaxed max-w-md"
            >
              Upload any agreement to uncover hidden risks, understand every clause in plain English, compare versions, negotiate smarter with AI, and chat with your contract.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href="/login" className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02] gold-glow whitespace-nowrap">
                  Analyze a Contract
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/demo" className="w-full sm:w-auto px-6 py-3 rounded-full bg-white border border-border text-foreground font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:bg-secondary/5 hover:scale-[1.02] whitespace-nowrap">
                  <Play className="w-4 h-4 text-primary" />
                  Try Sample Contract
                </Link>
              </div>
              <p className="text-center sm:text-left text-xs font-medium text-muted-foreground mt-4 ml-2">
                No credit card required • Free during beta
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 ml-2 text-[11px] font-medium text-muted-foreground/80">
                <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> Files remain private</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Encrypted uploads</span>
                <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> AI-powered analysis</span>
              </div>
            </motion.div>

            {/* Product Capability Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 pt-8 border-t border-border/50"
            >
              <div className="grid grid-cols-2 gap-3 max-w-[450px]">
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-secondary/5 border border-border/50 text-[11px] lg:text-xs font-medium text-foreground/80 transition-all hover:bg-secondary/10">
                  <FileText className="w-4 h-4 text-primary shrink-0" />
                  <span>Supports PDF, DOCX & TXT</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-secondary/5 border border-border/50 text-[11px] lg:text-xs font-medium text-foreground/80 transition-all hover:bg-secondary/10">
                  <Zap className="w-4 h-4 text-primary shrink-0" />
                  <span>Powered by Gemini 2.5 Flash</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-secondary/5 border border-border/50 text-[11px] lg:text-xs font-medium text-foreground/80 transition-all hover:bg-secondary/10">
                  <Lock className="w-4 h-4 text-primary shrink-0" />
                  <span>Enterprise-grade Privacy</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-secondary/5 border border-border/50 text-[11px] lg:text-xs font-medium text-foreground/80 transition-all hover:bg-secondary/10">
                  <Users className="w-4 h-4 text-primary shrink-0" />
                  <span>Built for Legal Teams</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Live Demo UI (70%) */}
          <div className="w-full lg:w-[60%] relative h-[600px] perspective-[2000px]">
            <motion.div
              style={{ y: y1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative w-full max-w-[800px] aspect-[4/3] glass-panel rounded-2xl p-6 shadow-2xl transition-transform hover:scale-[1.02] duration-500 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    {demoStep === 0 && <><Loader2 className="w-3 h-3 animate-spin" /> Uploading...</>}
                    {demoStep === 1 && <><span className="text-primary animate-pulse">✨ Analyzing...</span></>}
                    {demoStep >= 2 && <><span className="text-primary">✨ Analyzed</span> MSA • Acme • Vendor.pdf</>}
                  </div>
                </div>

                {/* Contract Body */}
                <div className="flex gap-8 relative h-full">

                  {/* Left Side: Document */}
                  <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                      <div className="h-3 bg-secondary/5 rounded w-3/4" />
                      <div className="h-3 bg-secondary/5 rounded w-full" />
                      <div className="h-3 bg-secondary/5 rounded w-5/6" />
                    </div>

                    <div className={`relative p-3 -mx-3 transition-colors duration-1000 ${demoStep >= 2 ? 'bg-destructive/5 border-l-2 border-destructive rounded-r-md' : ''}`}>
                      <p className="text-sm leading-relaxed text-foreground">
                        The Service Provider hereby agrees to indemnify and hold harmless the Client from any and all
                        <span className={`transition-all duration-700 ease-out inline-block mx-1 ${demoStep >= 2 ? 'bg-destructive/10 text-destructive border-b-2 border-destructive/30 px-1 rounded-t-sm scale-[1.02]' : 'text-foreground border-transparent border-b-2'}`}> unlimited liability arising from third-party claims </span>
                        regardless of cause.
                      </p>

                      {/* Scanning Line overlay during step 1 */}
                      {demoStep === 1 && (
                        <motion.div
                          className="absolute inset-x-0 h-1 bg-primary/40 shadow-[0_0_10px_rgba(184,135,70,0.5)] z-10"
                          initial={{ top: 0 }}
                          animate={{ top: "100%" }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="h-3 bg-secondary/5 rounded w-full" />
                      <p className="text-sm leading-relaxed text-foreground">
                        Payment shall be due
                        <span className={`transition-all duration-700 ease-out inline-block mx-1 ${demoStep >= 2 ? 'bg-warning/10 text-warning border-b-2 border-warning/30 px-1 rounded-t-sm scale-[1.02]' : 'text-foreground border-transparent border-b-2'}`}> within ninety (90) days </span>
                        of invoice receipt, subject to internal review.
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Sidebar stats or AI Explanation */}
                  <div className="w-[200px] border-l border-border/50 pl-6 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      {demoStep < 3 ? (
                        <motion.div key="stats" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                          <div>
                            <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-4">Safety Score</div>
                            <div className="relative w-20 h-20 flex items-center justify-center">
                              <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-secondary/10" />
                                <motion.circle
                                  cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent"
                                  className={demoStep >= 2 ? 'text-warning' : 'text-transparent'}
                                  strokeDasharray={226}
                                  initial={{ strokeDashoffset: 226 }}
                                  animate={{ strokeDashoffset: demoStep >= 2 ? 226 - (226 * 0.72) : 226 }}
                                  transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                              </svg>
                              <div className={`text-3xl font-heading font-medium transition-colors duration-1000 ${demoStep >= 2 ? 'text-warning' : 'text-foreground/20'}`}>
                                {demoStep >= 2 ? '72' : '--'}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">Risk Distribution</div>
                            <div className="flex items-end gap-1 h-12">
                              {[40, 70, 30, 90, 50, 20, 60].map((h, i) => (
                                <div key={i} className={`flex-1 rounded-t-sm transition-all duration-1000 ${demoStep >= 2 ? (h > 70 ? 'bg-destructive/50' : h > 40 ? 'bg-warning/50' : 'bg-primary/20') : 'bg-secondary/10'}`} style={{ height: `${h}%` }} />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div key="explanation" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                          <div className="text-[10px] font-bold tracking-widest text-primary uppercase mb-2">AI Explanation</div>
                          <p className="text-xs font-medium text-foreground">Unlimited Liability Detected</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            This clause exposes you to infinite financial risk. Industry standard caps liability at 1x to 2x trailing 12-month fees.
                          </p>
                          <div className="p-2 bg-success/10 rounded border border-success/20 text-xs text-success font-medium mt-2">
                            Suggested Rewrite: Cap at 1x fees paid.
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Risk Cards */}
            <motion.div style={{ y: y2 }} className="absolute top-20 -left-12 z-30">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="glass-panel p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-start gap-3 w-64 border border-white/40"
              >
                <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-destructive mb-1">High Risk Clause</div>
                  <div className="text-xs text-muted-foreground">Unlimited indemnification detected in § 7.3</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div style={{ y: y1 }} className="absolute bottom-32 -right-8 z-30">
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="glass-panel p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-start gap-3 w-64 border border-white/40"
              >
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-success mb-1">Safe IP Ownership</div>
                  <div className="text-xs text-muted-foreground">Standard work-for-hire transfer detected.</div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
