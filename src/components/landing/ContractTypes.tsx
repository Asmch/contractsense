"use client";

import { motion } from "framer-motion";
import { FileSignature, Briefcase, FileText, Handshake, Shield, MonitorSmartphone, Scale } from "lucide-react";

export function ContractTypes() {
  const types = [
    { icon: <Shield className="w-5 h-5 text-primary" />, name: "Non-Disclosure Agreement (NDA)" },
    { icon: <Briefcase className="w-5 h-5 text-primary" />, name: "Master Services Agreement (MSA)" },
    { icon: <FileSignature className="w-5 h-5 text-primary" />, name: "Employment Contract" },
    { icon: <Handshake className="w-5 h-5 text-primary" />, name: "Partnership Agreement" },
    { icon: <FileText className="w-5 h-5 text-primary" />, name: "Freelancer Agreement" },
    { icon: <Scale className="w-5 h-5 text-primary" />, name: "Vendor Agreement" },
    { icon: <MonitorSmartphone className="w-5 h-5 text-primary" />, name: "SaaS Agreement" },
  ];

  return (
    <section className="py-24 bg-white border-y border-border/50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-semibold text-foreground mb-4">
            Analyze every contract you receive.
          </h2>
          <p className="text-muted-foreground">
            Our AI models are trained on millions of legal documents across every major jurisdiction to accurately identify standards and deviations.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {types.map((type, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-center gap-3 px-6 py-4 rounded-xl border border-border/50 bg-secondary/5 hover:border-primary/30 hover:bg-white hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="group-hover:scale-110 transition-transform">{type.icon}</div>
              <span className="font-medium text-foreground text-sm">{type.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
