"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Hero, CapabilitiesStack } from "@/components/landing/LandingSections";
import { ArrowRight, MessageSquare, TrendingUp, ShieldCheck, Database, Zap, Lock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const SYSTEM_EVENT_HISTORY = [
  { id: 1, type: "CAS Shard", user: "0x71c...82a", time: "2h ago", title: "Latency Spike in Shard Retrieval", desc: "Observing increased TTFB for blobs > 10MB on US-East aggregator nodes. Investigating cache misses.", reps: 45, comments: 12 },
  { id: 2, type: "Protocol", user: "0x44f...19b", time: "5h ago", title: "Batch Anchor Proposal", desc: "PR submitted for multi-blob anchoring. Reduces gas overhead for high-frequency feedback ingestion.", reps: 120, comments: 34 },
  { id: 3, type: "Telemetry", user: "0x99a...3c2", time: "1d ago", title: "Aggregator Node v1.4 Benchmarks", desc: "Initial tests show 15% improvement in reconstruction throughput for erasable shards.", reps: 15, comments: 2 },
];

const REALTIME_INGEST_BUFFER = [
  { type: "Security", user: "0x11b...4d8", title: "Audit: Seal AES-GCM Entropy", desc: "Manual entropy check passed for client-side encryption primitives. No leakage detected.", reps: 500, comments: 8 },
  { type: "Optimization", user: "0x22c...5e9", title: "Refactor: CAS Indexing Logic", desc: "Moving from O(n) to O(log n) for local rehydration scans by implementing a B-Tree index.", reps: 85, comments: 14 },
  { type: "Shard", user: "0x33d...6f0", title: "Blob #vB6...9k2 Rehydrated", desc: "Successful truth reconstruction from 12 separate validator shards after 2-epoch retention.", reps: 30, comments: 5 },
];

export default function Home() {
  const [telemetry, setTelemetry] = useState(SYSTEM_EVENT_HISTORY);

  useEffect(() => {
    const interval = setInterval(() => {
      const ingress = {
        id: Date.now(),
        ...REALTIME_INGEST_BUFFER[Math.floor(Math.random() * REALTIME_INGEST_BUFFER.length)],
        time: "Ingesting..."
      };
      setTelemetry(prev => [ingress, ...prev].slice(0, 3));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-0">
      <Hero />
      <CapabilitiesStack />
      
      <section className="py-40 container mx-auto px-6 overflow-hidden">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-10">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter flex items-center gap-4">
              System Telemetry
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary shadow-[0_0_15px_rgba(0,112,243,0.8)]"></span>
              </span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl font-medium">
              High-throughput feedback streams anchored to the Walrus protocol. Monitoring immutable shards across decentralized nodes.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-white/60 uppercase tracking-widest">
                <Database className="w-3 h-3 text-primary" /> Shardless Storage
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-white/60 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3 text-cyan-glow" /> End-to-End Seal
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-white/60 uppercase tracking-widest">
                <Zap className="w-3 h-3 text-amber-500" /> Atomic Verifiability
              </div>
            </div>
          </div>
          <Button variant="link" className="text-primary font-black text-lg gap-3 p-0 hover:no-underline group">
            Network Explorer <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[400px]">
          <AnimatePresence mode="popLayout">
            {telemetry.map((event) => (
              <motion.div 
                key={event.id}
                layout
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="premium-card p-8 relative flex flex-col group h-full border-white/5 bg-black/40"
              >
                <div className="absolute top-0 right-0 p-6">
                  <div className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-primary/20">
                    {event.type}
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-[18px] bg-white/5 border border-white/5 flex items-center justify-center">
                    <Database className="w-5 h-5 text-white/20" />
                  </div>
                  <div>
                    <div className="text-base font-black text-white">{event.user}</div>
                    <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{event.time}</div>
                  </div>
                </div>
                <h4 className="text-xl font-black mb-3 tracking-tight group-hover:text-primary transition-colors line-clamp-1">{event.title}</h4>
                <p className="text-sm text-muted-foreground/80 mb-8 line-clamp-3 leading-relaxed flex-1 font-medium italic opacity-60">
                  "{event.desc}"
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      <MessageSquare className="w-4 h-4" /> {event.comments}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                      <TrendingUp className="w-4 h-4" /> +{event.reps} REP
                    </div>
                  </div>
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((v) => (
                      <div key={v} className="w-8 h-8 rounded-full border-2 border-ocean-deep bg-zinc-900 shadow-xl" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <section className="py-40 container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto overflow-hidden rounded-[48px] border border-white/10 bg-[#050505] shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-glow/10 blur-[120px] translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative p-12 md:p-24 text-center space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <Zap className="w-3 h-3 fill-current" /> Atomic Settlement Layer
            </div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] text-white">
              Anchor the<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-cyan-glow to-purple-haze">
                Global Feed
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
              Integrate Walrus content-addressable storage into your feedback loop. Provision immutable truth endpoints with ProofBoard.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Link href="/builder">
                <Button size="lg" className="h-16 px-10 rounded-2xl bg-white text-black font-black text-lg gap-3 shadow-2xl hover:scale-105 transition-all">
                  Provision Feed <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/verify">
                <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl font-black text-lg border-white/10 hover:bg-white/5 transition-all">
                  Audit Shard
                </Button>
              </Link>
            </div>

            <div className="pt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                 <ShieldCheck className="w-4 h-4" /> CAS Persistent
               </div>
               <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                 <Lock className="w-4 h-4" /> Seal Primitive
               </div>
               <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                 <RefreshCw className="w-4 h-4" /> Era Retention
               </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
