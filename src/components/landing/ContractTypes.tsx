"use client";

import { motion } from "framer-motion";
import { FileSignature, Briefcase, FileText, Handshake, Shield, MonitorSmartphone, Scale, CheckCircle2 } from "lucide-react";

export function ContractTypes() {
  const types = [
    { 
      icon: <Shield className="w-5 h-5 text-primary" />, 
      name: "Non-Disclosure Agreement (NDA)",
      detects: ["Confidentiality", "IP", "Non-compete"]
    },
    { 
      icon: <Briefcase className="w-5 h-5 text-primary" />, 
      name: "Master Services Agreement (MSA)",
      detects: ["Indemnification", "Payment Terms", "Liability"]
    },
    { 
      icon: <FileSignature className="w-5 h-5 text-primary" />, 
      name: "Employment Contract",
      detects: ["Benefits", "Termination", "Equity"]
    },
    { 
      icon: <Handshake className="w-5 h-5 text-primary" />, 
      name: "Partnership Agreement",
      detects: ["Revenue Share", "Governance", "Exit Rights"]
    },
    { 
      icon: <FileText className="w-5 h-5 text-primary" />, 
      name: "Freelancer Agreement",
      detects: ["Deliverables", "Copyright", "Deadlines"]
    },
    { 
      icon: <Scale className="w-5 h-5 text-primary" />, 
      name: "Vendor Agreement",
      detects: ["SLAs", "Data Privacy", "Auto-renewal"]
    },
    { 
      icon: <MonitorSmartphone className="w-5 h-5 text-primary" />, 
      name: "SaaS Agreement",
      detects: ["Uptime", "Data Ownership", "Price Hikes"]
    },
  ];

  const formats = [
    "PDF", "DOCX", "TXT", "Scanned PDF", "Image (OCR)"
  ];

  return (
    <section className="py-24 bg-white border-y border-border/50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-heading font-semibold text-foreground mb-4"
          >
            One AI workspace for every agreement you sign.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Our AI models are trained on millions of legal documents across every major jurisdiction to accurately identify standards and deviations.
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {types.map((type, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="relative group perspective-[1000px]"
            >
              {/* Front Card */}
              <div className="flex flex-col h-[100px] w-[260px] p-4 rounded-xl border border-border/50 bg-secondary/5 group-hover:border-primary/30 group-hover:bg-white group-hover:shadow-lg transition-all cursor-pointer relative overflow-hidden">
                <div className="flex items-center gap-3 mb-2">
                  <div className="group-hover:scale-110 transition-transform">{type.icon}</div>
                  <span className="font-medium text-foreground text-sm line-clamp-1">{type.name}</span>
                </div>
                
                {/* Default State */}
                <div className="text-xs text-muted-foreground flex items-center gap-1 group-hover:opacity-0 transition-opacity absolute bottom-4 left-4">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> AI Ready
                </div>

                {/* Hover State - Detection List */}
                <div className="absolute left-4 bottom-4 right-4 text-xs font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 translate-y-2 group-hover:translate-y-0 duration-300">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-primary/80">Detects:</span>
                    <span className="truncate flex-1">
                      {type.detects.map((d, i) => (
                        <span key={i} className="inline-flex items-center">
                          <CheckCircle2 className="w-3 h-3 text-primary mx-1" />{d}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Supported Formats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-t border-border/50 pt-10 text-center"
        >
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">Supported Formats</div>
          <div className="flex flex-wrap justify-center gap-3">
            {formats.map((format, idx) => (
              <span key={idx} className="px-4 py-2 bg-secondary/5 border border-border/50 rounded-lg text-sm font-medium text-foreground hover:border-primary/30 transition-colors cursor-default">
                {format}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
