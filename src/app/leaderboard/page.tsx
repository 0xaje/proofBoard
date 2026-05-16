"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Medal, 
  TrendingUp, 
  Search,
  ArrowUpRight,
  ShieldCheck,
  Star,
  Activity,
  Zap
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LEADERS = [
  { rank: 1, name: "sui_master.sui", rep: "14,450", contributions: 182, badges: 14, trend: "+850", color: "text-amber-500" },
  { rank: 2, name: "walrus_whale.sui", rep: "12,200", contributions: 145, badges: 11, trend: "+420", color: "text-zinc-400" },
  { rank: 3, name: "0x88...c1b", rep: "9,850", contributions: 112, badges: 8, trend: "+350", color: "text-amber-700" },
  { rank: 4, name: "builder_alice.sui", rep: "7,400", contributions: 86, badges: 6, trend: "+120", color: "text-muted-foreground" },
  { rank: 5, name: "0x33...b11", rep: "6,900", contributions: 69, badges: 5, trend: "+50", color: "text-muted-foreground" },
  { rank: 6, name: "bob_crypto.sui", rep: "5,200", contributions: 44, badges: 4, trend: "+10", color: "text-muted-foreground" },
  { rank: 7, name: "0x7f...e34", rep: "4,800", contributions: 39, badges: 4, trend: "+25", color: "text-muted-foreground" },
  { rank: 8, name: "defi_degen.sui", rep: "4,100", contributions: 28, badges: 3, trend: "+80", color: "text-muted-foreground" },
];

const RECENT_ACTIVITY = [
  { user: "sui_master.sui", action: "earned a Bug Hunter badge", time: "2 mins ago" },
  { user: "0x12...f8a", action: "submitted high severity bug", time: "15 mins ago" },
  { user: "builder_alice.sui", action: "reached 10k rep tier", time: "1 hour ago" },
  { user: "walrus_whale.sui", action: "verified a feature request", time: "3 hours ago" },
];

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-6"
        >
          <Trophy className="w-4 h-4" /> Global Hall of Fame
        </motion.div>
        <h1 className="text-5xl font-bold mb-6 glow-text">Top Contributors</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          The most impactful builders and users in the Walrus ecosystem, ranked by their contribution reputation.
        </p>
      </div>

      {/* Top 3 Podiums */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-end">
        {LEADERS.slice(0, 3).map((leader, i) => (
          <motion.div
            key={leader.rank}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-dark p-8 rounded-[40px] border-white/5 relative overflow-hidden flex flex-col items-center ${
              leader.rank === 1 ? "h-[450px] border-primary/30 bg-primary/5 scale-105 z-10" : "h-[380px]"
            }`}
          >
            {leader.rank === 1 && (
              <div className="absolute top-0 inset-x-0 h-1 bg-primary shadow-[0_0_20px_rgba(var(--primary),0.5)]" />
            )}
            <div className={`text-6xl font-black mb-6 ${leader.color} opacity-20`}>#{leader.rank}</div>
            <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-white/10 mb-6 flex items-center justify-center relative">
               {leader.rank === 1 ? <Trophy className="w-12 h-12 text-primary" /> : <Medal className={`w-10 h-10 ${leader.color}`} />}
               <div className="absolute -bottom-2 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-ocean-deep border-4 border-ocean-deep">
                 <ShieldCheck className="w-4 h-4" />
               </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">{leader.name}</h3>
            <div className="text-3xl font-black text-primary mb-4">{leader.rep} Rep</div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground font-bold uppercase tracking-widest">
              <span>{leader.contributions} Posts</span>
              <span>{leader.badges} Badges</span>
            </div>
            {leader.rank === 1 && (
              <Button className="mt-auto w-full rounded-2xl h-12 font-bold gap-2">
                View Profile <ArrowUpRight className="w-4 h-4" />
              </Button>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Leaderboard Table */}
        <div className="lg:col-span-3 glass-dark rounded-[40px] border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" /> All Rankings
            </h2>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-10 bg-white/5 border-white/10 rounded-xl" placeholder="Search user..." />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <th className="px-8 py-6">Rank</th>
                  <th className="px-8 py-6">Contributor</th>
                  <th className="px-8 py-6">Reputation</th>
                  <th className="px-8 py-6">Contributions</th>
                  <th className="px-8 py-6">Weekly Trend</th>
                  <th className="px-8 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {LEADERS.map((leader, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <span className={`text-lg font-bold ${leader.rank <= 3 ? leader.color : "text-muted-foreground"}`}>
                        #{leader.rank}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-ocean-light border border-white/10 flex items-center justify-center font-bold text-white shadow-inner">
                          {leader.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold group-hover:text-primary transition-colors">{leader.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-primary fill-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
                        <span className="font-bold">{leader.rep}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-muted-foreground font-medium">{leader.contributions}</td>
                    <td className="px-8 py-6">
                      <span className="text-green-500 font-bold flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" /> {leader.trend}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Button variant="ghost" size="sm" className="rounded-lg hover:bg-primary/20 hover:text-primary">
                        Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-8 text-center border-t border-white/5 bg-white/[0.02]">
            <Button variant="outline" className="rounded-xl border-white/10 hover:border-primary/50 transition-colors">
              Load More Contributors
            </Button>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-dark p-8 rounded-[40px] border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
            <h3 className="font-bold mb-6 flex items-center gap-2 text-lg relative z-10">
              <Activity className="w-5 h-5 text-green-500 animate-pulse" /> Live Feed
            </h3>
            <div className="space-y-6 relative z-10">
              {RECENT_ACTIVITY.map((activity, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="flex gap-4 relative"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0 shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
                  {i !== RECENT_ACTIVITY.length - 1 && (
                    <div className="absolute left-[3px] top-4 bottom-[-24px] w-[2px] bg-white/5" />
                  )}
                  <div>
                    <div className="text-sm">
                      <span className="font-bold text-white">{activity.user}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </div>
                    <div className="text-xs text-muted-foreground/60 mt-1 font-medium">{activity.time}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass-dark p-8 rounded-[40px] border-white/5 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full" />
            <h3 className="font-bold mb-6 flex items-center gap-2 text-lg relative z-10">
              <Zap className="w-5 h-5 text-amber-500" /> Network Stats
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-sm text-muted-foreground font-medium">Total Rewards Distributed</span>
                <span className="font-bold text-amber-500">12.5M SUI</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-sm text-muted-foreground font-medium">Verified Contributions</span>
                <span className="font-bold">24,192</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground font-medium">Active Validators</span>
                <span className="font-bold">142</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
