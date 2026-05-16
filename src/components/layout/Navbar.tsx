"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Menu, X, ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const saved = localStorage.getItem("proofboard_connected");
    if (saved === "true") setIsConnected(true);
  }, []);

  const handleConnect = () => {
    if (isConnected) {
      setIsConnected(false);
      localStorage.removeItem("proofboard_connected");
      return;
    }
    
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      localStorage.setItem("proofboard_connected", "true");
      toast.success("Wallet Connected: 0x71c...82a");
    }, 1200);
  };

  const navItems = [
    { href: "/demo", label: "Explorer" },
    { href: "/builder", label: "Provision" },
    { href: "/admin", label: "Console" },
    { href: "/verify", label: "Audit" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-2xl">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-glow flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            ProofBoard
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[10px] font-bold uppercase tracking-widest transition-all hover:text-primary ${
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Button 
            onClick={handleConnect}
            disabled={isConnecting}
            className={`rounded-full px-6 font-bold transition-all ${
              isConnected 
                ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20" 
                : "bg-white text-black hover:bg-white/90"
            }`}
          >
            {isConnecting ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : isConnected ? (
              <Wallet className="w-4 h-4 mr-2" />
            ) : null}
            {isConnecting ? "Connecting..." : isConnected ? "0x71c...82a" : "Connect Wallet"}
          </Button>
        </div>

        <button
          className="md:hidden text-muted-foreground hover:text-primary p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/5 bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-bold uppercase tracking-widest ${
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Button 
                onClick={handleConnect}
                disabled={isConnecting}
                className={`w-full h-14 rounded-2xl font-bold ${
                  isConnected ? "bg-primary/10 text-primary" : "bg-white text-black"
                }`}
              >
                {isConnecting ? "Connecting..." : isConnected ? "0x71c...82a" : "Connect Wallet"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
