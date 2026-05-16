"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  ArrowRight, 
  Send, 
  Database, 
  ShieldCheck, 
  LayoutDashboard,
  CheckCircle2,
  ExternalLink,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DemoModePage() {
  const steps = [
    {
      title: "1. Architect a Form",
      desc: "Design a dynamic survey and anchor the schema to Walrus.",
      link: "/builder",
      icon: Plus,
      color: "bg-amber-500/20 text-amber-500"
    },
    {
      title: "2. Collect Feedback",
      desc: "Open the decentralized public link and submit real responses.",
      link: "/builder", // Users go to builder first to generate a link
      icon: Send,
      color: "bg-primary/20 text-primary"
    },
    {
      title: "3. Manage & Export",
      desc: "View Walrus-anchored submissions in the admin console.",
      link: "/admin",
      icon: LayoutDashboard,
      color: "bg-blue-500/20 text-blue-500"
    },
    {
      title: "4. Verify the Truth",
      desc: "Independently audit any blobId via the verification protocol.",
      link: "/verify",
      icon: ShieldCheck,
      color: "bg-purple-500/20 text-purple-500"
    }
  ];

  return (
    <div className="container mx-auto px-6 py-24 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-xs font-bold uppercase tracking-widest">
            <Zap className="w-4 h-4 animate-pulse" /> Official Hackathon Demo Mode
          </div>
          <h1 className="text-6xl font-black tracking-tight">Product Walkthrough</h1>
          <p className="text-xl text-muted-foreground">Follow this end-to-end flow to witness the full power of ProofBoard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-dark p-8 rounded-[40px] border border-white/5 bg-black/40 hover:bg-white/[0.03] transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <step.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">{step.desc}</p>
              <Link href={step.link}>
                <Button className="w-full h-12 rounded-2xl font-bold gap-2">
                  Launch Step {i + 1} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="p-12 rounded-[48px] bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="space-y-2">
            <h4 className="text-2xl font-bold">Protocol Integrity Check</h4>
            <p className="text-sm text-muted-foreground">ProofBoard is fully stateless. All demonstration data is retrieved directly from Walrus Testnet in real-time.</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-tighter text-green-500">
              <Database className="w-4 h-4" /> Walrus Testnet: Online
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
