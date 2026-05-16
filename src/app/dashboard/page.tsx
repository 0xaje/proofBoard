"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Award, 
  History, 
  Settings, 
  TrendingUp, 
  ShieldCheck, 
  MessageSquare,
  ChevronRight,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const repData = [
  { name: "Mon", rep: 1200 },
  { name: "Tue", rep: 1350 },
  { name: "Wed", rep: 1300 },
  { name: "Thu", rep: 1600 },
  { name: "Fri", rep: 1850 },
  { name: "Sat", rep: 2100 },
  { name: "Sun", rep: 2450 },
];

export default function DashboardPage() {
  const stats = [
    { label: "Total Reputation", value: "2,450", icon: <Award className="text-primary" />, trend: "+12% this week" },
    { label: "Feedback Submitted", value: "34", icon: <MessageSquare className="text-cyan-glow" />, trend: "8 active" },
    { label: "Tasks Verified", value: "12", icon: <ShieldCheck className="text-green-500" />, trend: "Top 5%" },
    { label: "Rank", value: "#42", icon: <TrendingUp className="text-amber-500" />, trend: "Global" },
  ];

  const submissions = [
    { id: 1, title: "Mobile UI scaling bug", project: "Walrus Explorer", status: "Resolved", date: "2 days ago", rep: "+50" },
    { id: 2, title: "Add dark mode toggle", project: "BlobDrive", status: "In Review", date: "5 days ago", rep: "+20" },
    { id: 3, title: "API latency issues in EU", project: "DecentraChat", status: "Pending", date: "1 week ago", rep: "+10" },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome back, sui_master.sui</h1>
          <p className="text-muted-foreground">Your reputation is growing. Keep contributing to earn more rewards.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="gap-2 border-white/10 rounded-xl">
            <Settings className="w-4 h-4" /> Settings
          </Button>
          <Button className="rounded-xl font-bold px-8">Withdraw Rewards</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-dark p-8 rounded-[32px] border-white/5 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shadow-inner border border-white/10">
                {stat.icon}
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">
                {stat.trend}
              </span>
            </div>
            <div className="text-3xl font-bold mb-1 relative z-10 glow-text">{stat.value}</div>
            <div className="text-sm text-muted-foreground font-medium relative z-10">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Reputation Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark p-8 rounded-[32px] border-white/5 mb-12"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <TrendingUp className="text-primary w-6 h-6" /> Reputation Growth
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">Your impact over the last 7 days</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary glow-text">+1,250</div>
            <div className="text-sm text-green-500 font-bold">This Week</div>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={repData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#ffffff1a', borderRadius: '16px', color: '#fff' }}
                itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="rep" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRep)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Submissions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <History className="text-primary w-6 h-6" /> Recent Submissions
            </h2>
            <Button variant="link" className="text-primary p-0 font-bold hover:underline">View All</Button>
          </div>
          
          {submissions.length > 0 ? (
            <div className="space-y-4">
              {submissions.map((sub, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={sub.id} 
                  className="glass-dark p-6 rounded-3xl border-white/5 hover:border-primary/30 transition-all duration-300 group flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] ${
                      sub.status === "Resolved" ? "bg-green-500 text-green-500" : sub.status === "In Review" ? "bg-amber-500 text-amber-500" : "bg-blue-500 text-blue-500"
                    }`} />
                    <div>
                      <h3 className="font-bold group-hover:text-primary transition-colors text-lg">{sub.title}</h3>
                      <div className="text-sm text-muted-foreground font-medium">
                        {sub.project} • {sub.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right hidden sm:block">
                      <div className="text-lg font-black text-primary">{sub.rep} Rep</div>
                      <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground bg-white/5 px-2 py-1 rounded-md mt-1 inline-block">{sub.status}</div>
                    </div>
                    <ChevronRight className="text-muted-foreground w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-dark rounded-[40px] border-white/5 border-dashed p-16 text-center">
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6 text-muted-foreground">
                <History className="w-10 h-10 opacity-50" />
              </div>
              <h3 className="text-xl font-bold mb-2">No Submissions Yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                You haven't submitted any feedback yet. Start contributing to earn reputation and rewards.
              </p>
              <Button className="rounded-xl font-bold px-8 h-12 shadow-lg shadow-primary/20">Explore Projects</Button>
            </div>
          )}
        </div>

        {/* Badges & Rewards */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Star className="text-primary w-6 h-6" /> Achievements
          </h2>
          <div className="glass-dark p-8 rounded-[40px] border-white/5 space-y-8">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={`aspect-square rounded-2xl flex items-center justify-center border ${
                  i < 4 ? "bg-primary/10 border-primary/20 text-primary" : "bg-white/5 border-white/5 text-muted-foreground/30"
                }`}>
                  <Award className={i < 4 ? "w-8 h-8" : "w-6 h-6"} />
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-white/5">
              <h4 className="font-bold mb-4">Level 12 Contributor</h4>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  className="h-full bg-primary glow-border"
                />
              </div>
              <div className="flex justify-between mt-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <span>750 XP</span>
                <span>1000 XP</span>
              </div>
            </div>
            <Button className="w-full h-14 rounded-2xl font-bold">View Skill Tree</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
