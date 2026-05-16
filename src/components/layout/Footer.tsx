"use client";

import Link from "next/link";
import { ShieldCheck, X, Terminal, Globe } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-ocean-deep border-t border-white/5 py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <ShieldCheck className="text-ocean-deep w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tighter">ProofBoard</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Verifiable decentralized feedback infrastructure layer. Empowering builders and users through immutable, Walrus-native data systems.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-primary">Infrastructure</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/explore" className="hover:text-primary transition-colors">Explore Projects</Link></li>
              <li><Link href="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Your Reputation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-primary">Developers</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">API Documentation</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Walrus Integration</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Governance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-primary">Community</h4>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all">
                <X className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all">
                <Terminal className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all">
                <Globe className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium">
          <p>© 2026 ProofBoard. Built for the Walrus Hackathon.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
