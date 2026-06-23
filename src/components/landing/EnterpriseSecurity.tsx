"use client";

import { motion } from "framer-motion";
import { LockKeyhole, ServerCrash, EyeOff, ShieldCheck, FileText } from "lucide-react";

export function EnterpriseSecurity() {
  const securityFeatures = [
    {
      icon: <LockKeyhole className="w-5 h-5 text-success" />,
      title: "End-to-end encryption",
      description: "AES-256 encryption at rest and TLS 1.3 in transit."
    },
    {
      icon: <ServerCrash className="w-5 h-5 text-success" />,
      title: "Private AI processing",
      description: "Dedicated zero-retention infrastructure. Your data never leaves our secure boundary."
    },
    {
      icon: <EyeOff className="w-5 h-5 text-success" />,
      title: "Data never used for training",
      description: "We explicitly opt out of all foundational model training. Your contracts are yours."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-success" />,
      title: "Role-based access",
      description: "Granular permissions, SAML SSO, and mandatory 2FA for all enterprise accounts."
    },
    {
      icon: <FileText className="w-5 h-5 text-success" />,
      title: "Immutable Audit logs",
      description: "Track every view, upload, and export with unalterable cryptographic logs."
    }
  ];

  return (
    <section className="py-24 bg-foreground text-background overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-success/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          <div className="w-full lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-success/30 bg-success/10 text-xs font-semibold text-success tracking-widest uppercase mb-6">
                Enterprise Security
              </div>
              <h2 className="text-3xl lg:text-4xl font-heading font-medium mb-4">
                Bank-grade security for your most <span className="italic text-primary">sensitive data.</span>
              </h2>
              <p className="text-background/70 leading-relaxed mb-8">
                Legal documents contain your crown jewels. We treat your data with the paranoia it deserves.
              </p>
            </motion.div>
          </div>

          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {securityFeatures.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-background/5 border border-background/10 p-6 rounded-2xl hover:bg-background/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-background/60 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
