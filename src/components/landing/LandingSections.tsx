"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Database, Search, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden py-32 px-6">
      <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-cyan-glow/10 rounded-full blur-[140px] animate-pulse delay-1000 pointer-events-none" />
      
      <div className="container mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-6xl mx-auto space-y-10"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 shadow-xl">
            <Zap className="w-4 h-4 fill-current" /> Walrus Content-Addressable Protocol
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-balance">
            Truth is <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/30">Immutable.</span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
            A high-throughput feedback primitive built for the Walrus storage layer. Anchor every user interaction as a cryptographically verifiable shard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
            <Link href="/demo">
              <Button size="lg" className="h-20 px-12 text-xl font-black gap-4 rounded-[28px] bg-primary text-white hover:bg-primary/90 shadow-[0_20px_50px_rgba(0,112,243,0.3)] transition-all hover:scale-105">
                Ecosystem Explorer
                <ArrowRight className="w-7 h-7" />
              </Button>
            </Link>
            <Link href="/builder">
              <Button
                size="lg"
                variant="outline"
                className="h-20 px-12 text-xl font-black rounded-[28px] border-white/10 hover:bg-white/5 backdrop-blur-md transition-all hover:scale-105"
              >
                Provision Form
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export const CapabilitiesStack = () => {
  const stack = [
    {
      label: "CAS Architecture",
      desc: "Pure Content-Addressable Storage (CAS). Schemas and payloads are referenced via unique Walrus blob identifiers.",
      icon: Database,
      accent: "text-blue-500",
    },
    {
      label: "Seal Cryptography",
      desc: "Client-side AES-GCM primitives for sensitive datasets. End-to-end encryption anchored at the application edge.",
      icon: ShieldCheck,
      accent: "text-primary",
    },
    {
      label: "Independent Audit",
      desc: "Cross-platform verification portal. Rehydrate truth directly from the aggregator nodes without internal dependencies.",
      icon: Search,
      accent: "text-cyan-glow",
    },
    {
      label: "Operational Ops",
      desc: "Production-grade console for tracking rehydrated shards, lifecycle management, and CSV-formatted audits.",
      icon: LayoutDashboard,
      accent: "text-purple-500",
    },
  ];

  return (
    <section className="py-40 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stack.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="premium-card p-10 group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-white/10 transition-all duration-500 ${item.accent}`}>
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black mb-3 tracking-tight">{item.label}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm opacity-70 group-hover:opacity-100 transition-opacity">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
