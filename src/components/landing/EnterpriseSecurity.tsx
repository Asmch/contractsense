"use client";

import { motion } from "framer-motion";
import { LockKeyhole, ServerCrash, EyeOff, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";

export function EnterpriseSecurity() {
  const securityFeatures = [
    {
      icon: (
        <div className="relative">
          <LockKeyhole className="w-5 h-5 text-primary relative z-10" />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-primary rounded-full"
          />
        </div>
      ),
      title: "End-to-end encryption",
      points: [
        "AES-256 encryption at rest",
        "TLS 1.3 secure transfer",
        "Encrypted cloud storage"
      ]
    },
    {
      icon: (
        <div className="relative">
          <ServerCrash className="w-5 h-5 text-primary relative z-10" />
          <motion.div 
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute inset-0 bg-primary blur-[4px] rounded-full"
          />
        </div>
      ),
      title: "Private AI processing",
      points: [
        "Dedicated zero-retention infrastructure",
        "Data never leaves our secure boundary",
        "No multi-tenant bleed"
      ]
    },
    {
      icon: (
        <div className="relative group overflow-hidden">
          <EyeOff className="w-5 h-5 text-primary" />
        </div>
      ),
      title: "Data never used for training",
      points: [
        "Explicit opt-out from all foundation models",
        "Your contracts are strictly yours",
        "No secondary data monetization"
      ]
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-primary" />,
      title: "Role-based access",
      points: [
        "Granular team permissions",
        "SAML SSO integration",
        "Mandatory 2FA for enterprise accounts"
      ]
    }
  ];

  const trustBadges = [
    "🔒 AES-256", "SOC2 Ready", "GDPR Friendly", "Zero Training", "Private AI", "Encrypted Storage"
  ];

  const numbers = [
    { value: "99.9%", label: "Platform Availability" },
    { value: "256-bit", label: "Encryption" },
    { value: "24/7", label: "Infrastructure Monitoring" },
    { value: "0", label: "Contracts used for AI training" },
  ];

  return (
    <section className="relative w-full overflow-hidden">
      {/* Smooth Gradient Transition from Ivory to Navy */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white to-[#0B101A] z-0 pointer-events-none" />
      
      <div className="pt-32 pb-24 bg-[#0B101A] text-white relative z-10">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-24">
            {/* Left Side: Trust Story */}
            <div className="w-full lg:w-5/12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-xs font-semibold text-primary tracking-widest uppercase mb-6">
                  Enterprise Security
                </div>
                
                <h2 className="text-3xl lg:text-5xl font-heading font-medium mb-6 leading-[1.1]">
                  Your contracts never become AI training data. <span className="italic text-primary">Ever.</span>
                </h2>
                
                <p className="text-white/70 text-lg leading-relaxed mb-8">
                  Every upload is encrypted in transit and at rest. Your files remain completely private from upload to analysis.
                </p>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-3 mb-10">
                  {trustBadges.map((badge, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + idx * 0.05 }}
                      className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs font-medium text-white/90"
                    >
                      {badge}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Side: Security Cards */}
            <div className="w-full lg:w-7/12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {securityFeatures.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.08 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group bg-white/5 border border-white/10 hover:border-primary/50 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:shadow-[0_10px_40px_-15px_rgba(184,135,70,0.3)] relative overflow-hidden"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-4 text-white/90 group-hover:text-white transition-colors">{feature.title}</h3>
                    <ul className="space-y-2">
                      {feature.points.map((point, i) => (
                         <li key={i} className="flex items-start gap-2 text-sm text-white/60 group-hover:text-white/80 transition-colors">
                           <CheckCircle2 className="w-3 h-3 text-primary shrink-0 mt-1 opacity-70 group-hover:opacity-100 transition-opacity" />
                           <span className="leading-tight">{point}</span>
                         </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-white/10 mb-16">
            {numbers.map((num, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">{num.value}</div>
                <div className="text-xs text-white/60 uppercase tracking-widest font-medium max-w-[150px]">{num.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Compliance Strip */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.8 }}
             className="flex flex-wrap justify-center items-center gap-4 lg:gap-8 opacity-60 hover:opacity-100 transition-opacity duration-500"
          >
             <span className="text-[10px] uppercase tracking-widest font-bold">Compliance & Standards</span>
             <div className="w-1 h-1 rounded-full bg-white/20 hidden md:block"></div>
             {["AES-256", "TLS 1.3", "SOC2 Ready", "GDPR Ready", "Private AI", "Zero Training"].map((pill, idx) => (
               <span key={idx} className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10">
                 {pill}
               </span>
             ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
