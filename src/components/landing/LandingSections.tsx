"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Database, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-20 pb-32">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-glow/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-8">
            <Zap className="w-3 h-3" />
            Built for the Walrus Ecosystem
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl mx-auto leading-[1.1]">
            <span className="glow-text bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              Decentralized Feedback{" "}
            </span>
            <span className="text-primary italic">Infrastructure</span>
            <span className="glow-text bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              {" "}Layer
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            ProofBoard is a verifiable decentralized feedback infrastructure layer built on Walrus, 
            enabling immutable, encrypted, and rehydratable user feedback for the entire ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link href="/explore">
              <Button size="lg" className="h-14 px-8 text-lg font-semibold gap-2 rounded-2xl glow-border">
                Start Building
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg font-semibold rounded-2xl border-white/10 hover:bg-white/5"
            >
              View Leaderboard
            </Button>
          </div>

          {/* Hero Asset Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative max-w-5xl mx-auto rounded-[40px] overflow-hidden border border-white/10 shadow-2xl shadow-primary/20 group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-transparent to-transparent z-10" />
            <img 
              src="/hero-asset.png" 
              alt="ProofBoard Visualization" 
              className="w-full aspect-video object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
            <div className="absolute bottom-8 left-8 z-20 flex items-center gap-4">
              <div className="glass-dark px-6 py-3 rounded-2xl border-white/10 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-bold tracking-wider uppercase">Network Status: Online</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export const FeatureGrid = () => {
  const features = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "Walrus-Native Storage",
      description: "All feedback and rich media are stored permanently and decentralized on Walrus Protocol.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI Analysis",
      description: "Automated sentiment analysis and bug classification to help builders prioritize what matters.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Reputation Score",
      description: "Earn reputation points for high-quality feedback and contributions to the ecosystem.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Verification",
      description: "On-chain verification of feedback ensure authenticity and prevents spam in the network.",
    },
  ];

  return (
    <section className="py-24 border-y border-white/5 bg-ocean-surface/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              viewport={{ once: true }}
              className="glass-dark p-8 rounded-3xl border-white/5 hover:border-primary/30 transition-all group cursor-default"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
