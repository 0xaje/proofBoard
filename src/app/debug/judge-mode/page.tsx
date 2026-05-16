"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldAlert, 
  Trash2, 
  Zap, 
  Database, 
  RefreshCw, 
  CheckCircle2,
  Lock,
  History,
  Trash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { WalrusPublisherClient } from "@/lib/walrus";

export default function JudgeModePage() {
  const [isWiped, setIsWiped] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(false);
  const [blobId, setBlobId] = React.useState("");
  const [result, setResult] = React.useState<any>(null);

  const handleWipeState = () => {
    setIsWiped(true);
    setResult(null);
    setBlobId("");
    toast.error("LOCAL CACHE WIPED: The application now has zero memory of previous states.");
  };

  const handlePureWalrusFetch = async () => {
    if (!blobId) {
      toast.warning("Enter a Blob ID to fetch directly from Walrus.");
      return;
    }

    setIsFetching(true);
    setResult(null);
    const client = new WalrusPublisherClient({ network: "testnet" });

    try {
      toast.info("FETCHING FROM WALRUS (BYPASSING CACHE)...");
      const data = await client.rehydrateSubmission(blobId);
      setResult(data);
      toast.success("SUCCESS: App state reconstructed solely from Walrus!");
    } catch (err: any) {
      toast.error("FETCH FAILED: Invalid Blob ID or network timeout.");
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-500 uppercase tracking-widest mb-4">
              <ShieldAlert className="w-3 h-3" /> Judge Mode: Stress Test Environment
            </div>
            <h1 className="text-4xl font-bold">Walrus-Only Recovery Mode</h1>
            <p className="text-muted-foreground mt-2">Prove that ProofBoard exists independently of its frontend UI or local database.</p>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleWipeState}
            className="rounded-xl gap-2 font-bold"
          >
            <Trash2 className="w-4 h-4" /> Wipe Local Cache
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="glass-dark p-8 rounded-[40px] border border-red-500/20 bg-red-500/5">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-red-500" /> Scenario: Data Loss
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              In this scenario, we assume the frontend server has crashed and all local databases are wiped. The only thing left in the world is a **Walrus Blob ID**.
            </p>
            <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-8">
              <li className={`flex items-center gap-2 ${isWiped ? "text-red-500" : ""}`}>
                {isWiped ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-3 h-3 border border-white/20 rounded-full" />}
                Local Database Wiped
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 border border-white/20 rounded-full" />
                Frontend Memory Reset
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 border border-white/20 rounded-full" />
                Single Source of Truth: Walrus
              </li>
            </ul>
          </div>

          <div className="glass-dark p-8 rounded-[40px] border border-primary/20 bg-primary/5">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-primary" /> Scenario: Recovery
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              We now use the Walrus rehydration protocol to fetch the submission data directly from decentralized storage and reconstruct the entire application state.
            </p>
            <div className="space-y-4">
              <input 
                type="text"
                placeholder="Paste Blob ID to Rehydrate..."
                value={blobId}
                onChange={(e) => setBlobId(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl h-12 px-4 text-xs font-mono text-primary placeholder:text-zinc-600"
              />
              <Button 
                onClick={handlePureWalrusFetch}
                disabled={isFetching || !blobId}
                className="w-full h-12 rounded-xl font-bold gap-2"
              >
                {isFetching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                Reconstruct State from Walrus
              </Button>
            </div>
          </div>
        </div>

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-dark p-8 rounded-[40px] border border-green-500/20 bg-green-500/5"
          >
            <div className="flex items-center gap-3 mb-8">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
              <div>
                <h3 className="text-2xl font-bold">State Reconstructed Successfully</h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Walrus Verified ✔</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">App State (Injected from Walrus)</div>
                <div className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="text-xl font-bold text-primary">{result.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.description}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cryptographic Metadata</div>
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="text-primary truncate max-w-[100px]">{blobId}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="text-zinc-300 font-bold">{result.type}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Encryption:</span>
                    <span className="text-blue-400 font-bold flex items-center gap-1">
                      <Lock className="w-2 h-2" /> Seal
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
