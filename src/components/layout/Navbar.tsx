"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Wallet, Menu, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

import { usePathname } from "next/navigation";

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/explore", label: "Explore" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/admin/walrus-explorer", label: "Admin" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-ocean-deep/50 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-border transition-transform group-hover:scale-110">
            <ShieldCheck className="text-ocean-deep w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tighter glow-text">
            ProofBoard
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button variant="outline" className="gap-2 border-primary/20 hover:border-primary/50 bg-transparent text-primary hover:bg-primary/10">
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-muted-foreground hover:text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-0 right-0 glass-dark p-6 flex flex-col gap-4 border-b border-white/5"
        >
          <Link href="/explore" className="text-lg font-medium">
            Explore
          </Link>
          <Link href="/leaderboard" className="text-lg font-medium">
            Leaderboard
          </Link>
          <Link href="/docs" className="text-lg font-medium">
            Docs
          </Link>
          <Button className="w-full gap-2">
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </Button>
        </motion.div>
      )}
    </nav>
  );
};
