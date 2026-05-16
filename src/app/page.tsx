"use client";

import React, { useState, useEffect } from "react";
import { Hero, FeatureGrid } from "@/components/landing/LandingSections";
import { ArrowRight, Star, MessageSquare, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const PULSE_HISTORY = [
  { id: 1, type: "Bug Report", user: "0x71c...82a", time: "2 hours ago", title: "UI Artifacts in Blob Explorer", desc: "Found some inconsistent rendering when viewing large video blobs on mobile devices...", reps: 45, comments: 12 },
  { id: 2, type: "Feature Request", user: "0x44f...19b", time: "5 hours ago", title: "Add Batch Uploads", desc: "It would be great to select multiple blobs at once for the drive integration.", reps: 120, comments: 34 },
  { id: 3, type: "Survey", user: "0x99a...3c2", time: "1 day ago", title: "Developer Experience Q3", desc: "Feedback on the new Walrus SDK and documentation improvements.", reps: 15, comments: 2 },
];

const LIVE_PULSE_DATA = [
  { type: "Security", user: "0x11b...4d8", title: "Potential Reentrancy in Staking", desc: "Found a theoretical vulnerability in the staking module, needs review.", reps: 500, comments: 8 },
  { type: "Enhancement", user: "0x22c...5e9", title: "Optimize Blob Retrieval", desc: "Suggested a caching layer for frequently accessed blobs to improve latency.", reps: 85, comments: 14 },
  { type: "Bug Report", user: "0x33d...6f0", title: "Login Session Timeout", desc: "Session randomly drops after 5 minutes of inactivity on the dashboard.", reps: 30, comments: 5 },
];

export default function Home() {
  const [activities, setActivities] = useState(PULSE_HISTORY);

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        ...LIVE_PULSE_DATA[Math.floor(Math.random() * LIVE_PULSE_DATA.length)],
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
      <section className="py-24 container mx-auto px-6 overflow-hidden">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
              Ecosystem Pulse
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              ProofBoard is a verifiable decentralized feedback infrastructure layer built on Walrus, enabling immutable, encrypted, and rehydratable user feedback.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-500 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Infrastructure Mode: Active
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest">
                Storage: Walrus Native
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                Security: Seal Encrypted
              </div>
            </div>
          </div>
          <Button variant="link" className="text-primary gap-2 p-0">
            View All Activity <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[350px]">
          <AnimatePresence>
            {activities.map((activity) => (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="glass-dark p-6 rounded-3xl border-white/5 relative group h-full flex flex-col"
              >
                <div className="absolute top-0 right-0 p-4">
                  <div className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-tighter">
                    {activity.type}
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10" />
                  <div>
                    <div className="text-sm font-bold">{activity.user}</div>
                    <div className="text-[10px] text-muted-foreground">{activity.time}</div>
                  </div>
                </div>
                <h4 className="font-bold mb-2 line-clamp-1">{activity.title}</h4>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-3 flex-1">
                  {activity.desc}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MessageSquare className="w-3 h-3" /> {activity.comments}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-500 font-bold">
                      <TrendingUp className="w-3 h-3" /> +{activity.reps} Rep
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((v) => (
                      <div key={v} className="w-6 h-6 rounded-full border border-ocean-deep bg-zinc-800" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary/5 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto glass p-12 rounded-[40px] border-primary/20">
            <h2 className="text-4xl font-bold mb-6">Ready to integrate the infrastructure?</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Deploy ProofBoard's verifiable data system to your project and start collecting immutable feedback on Walrus.
            </p>
            <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/20">
              Get Started Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
