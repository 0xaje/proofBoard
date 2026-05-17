"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Hero, FeatureGrid } from "@/components/landing/LandingSections";
import { ArrowRight, MessageSquare, TrendingUp, ShieldCheck, Database, Zap, Lock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const PULSE_HISTORY = [
  { id: "pulse-1", type: "Blob Index", user: "0x71c...82a", time: "2h ago", title: "Shard Retrieval Optimized", desc: "Successfully optimized TTFB for 50MB blobs across US-East aggregator nodes.", reps: 145, comments: 22 },
  { id: "pulse-2", type: "Protocol", user: "0x44f...19b", time: "5h ago", title: "Epoch Retention Adjusted", desc: "Batch proposal to extend era retention for critical feedback shards to 15 epochs.", reps: 280, comments: 45 },
  { id: "pulse-3", type: "Security", user: "0x99a...3c2", time: "1d ago", title: "Seal Entropy Audit", desc: "Zero-knowledge proof verification passed for the latest Seal encryption cycle.", reps: 95, comments: 8 },
];

const LIVE_PULSE_DATA = [
  { type: "Network", user: "0x11b...4d8", title: "New Aggregator Provisioned", desc: "Provisioned high-throughput node in FRA-1. Shard distribution balanced.", reps: 50, comments: 2 },
  { type: "Audit", user: "0x22c...5e9", title: "Integrity Scan Complete", desc: "1,200 unique Walrus blobs verified against local storage hashes.", reps: 310, comments: 14 },
  { type: "Storage", user: "0x33d...6f0", title: "Erasure Coding Verified", desc: "Verified 24/32 shard reconstruction for recently anchored feedback blobs.", reps: 120, comments: 5 },
];

export default function Home() {
  const [activities, setActivities] = useState(PULSE_HISTORY);

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = {
        ...LIVE_PULSE_DATA[Math.floor(Math.random() * LIVE_PULSE_DATA.length)],
        id: `live-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        time: "Just now"
      };
      setActivities(prev => [newActivity, ...prev].slice(0, 3));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-0">
      <Hero />
      <FeatureGrid />

      {/* Social Proof / Activity Section */}
      <section className="py-40 container mx-auto px-6 overflow-hidden">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-10">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter flex items-center gap-4">
              Ecosystem Pulse
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary shadow-[0_0_15px_rgba(0,112,243,0.8)]"></span>
              </span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              ProofBoard is a Walrus-native dynamic form builder. Collect immutable feedback, surveys, and bug reports without a centralized backend.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 uppercase tracking-widest">
                <Database className="w-3 h-3 text-primary" /> Walrus Storage
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3 text-cyan-glow" /> Seal Protected
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 uppercase tracking-widest">
                <Zap className="w-3 h-3 text-amber-500" /> Real-time Verifiability
              </div>
            </div>
          </div>
          <Button variant="link" className="text-primary font-bold text-lg gap-3 p-0 hover:no-underline group">
            Global Activity Feed <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[400px]">
          <AnimatePresence mode="popLayout">
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                layout
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="premium-card p-8 relative flex flex-col group h-full"
              >
                <div className="absolute top-0 right-0 p-6">
                  <div className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-primary/20">
                    {activity.type}
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/5" />
                  <div>
                    <div className="text-base font-bold text-white">{activity.user}</div>
                    <div className="text-xs text-muted-foreground font-medium">{activity.time}</div>
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-3 tracking-tight group-hover:text-primary transition-colors line-clamp-1">{activity.title}</h4>
                <p className="text-sm text-muted-foreground/80 mb-8 line-clamp-3 leading-relaxed flex-1 italic">
                  "{activity.desc}"
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <MessageSquare className="w-4 h-4" /> {activity.comments}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-black text-primary">
                      <TrendingUp className="w-4 h-4" /> +{activity.reps} REP
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

      {/* Final CTA */}
      <section className="py-40 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto overflow-hidden rounded-[48px] border border-white/10 bg-[#050505] shadow-2xl"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-glow/10 blur-[120px] translate-y-1/2 -translate-x-1/2" />

          <div className="relative p-12 md:p-24 text-center space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <Zap className="w-3 h-3 fill-current" /> Future of Feedback
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] text-white">
              Ready to Capture<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-cyan-glow to-purple-haze">
                Immutable Truth?
              </span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
              Join the Walrus ecosystem. Create decentralized feedback loops and collect verifiable data today with ProofBoard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Link href="/builder">
                <Button size="lg" className="h-16 px-10 rounded-2xl bg-white text-black font-black text-lg gap-3 shadow-2xl hover:scale-105 transition-all">
                  Get Started for Free <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/verify">
                <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl font-bold text-lg border-white/10 hover:bg-white/5 transition-all">
                  Verify Proof
                </Button>
              </Link>
            </div>

            <div className="pt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> Walrus Storage
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <Lock className="w-4 h-4" /> Seal Encryption
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <RefreshCw className="w-4 h-4" /> Stateless Audit
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
