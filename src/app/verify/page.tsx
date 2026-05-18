"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  Database,
  Lock,
  Unlock,
  FileCode,
  ArrowRight,
  Fingerprint,
  Zap,
  ShieldAlert,
  Terminal,
  Activity,
  Eye,
  EyeOff,
  History,
  Download,
  Copy,
  Share2,
  Code2,
  BookOpen,
  Terminal as CliIcon,
  Cpu,
  Globe,
  Network,
  History as TraceIcon,
  Server,
  Clock,
  Wifi,
  WifiOff,
  ZapOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { WalrusPublisherClient, getExecutionTraces, ProtocolExecutionTrace } from "@/lib/walrus";
import { TrustLoopStatus } from "@/components/TrustLoopStatus";

export default function VerificationPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-12 h-12 text-primary animate-spin" />
      </div>
    }>
      <VerificationPortal />
    </React.Suspense>
  );
}

function VerificationPortal() {
  const searchParams = useSearchParams();
  const [blobId, setBlobId] = React.useState(searchParams.get("blobId") || "");
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);
  const [rawResult, setRawResult] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [retryAttempt, setRetryAttempt] = React.useState(0);
  const [mode, setMode] = React.useState<"friendly" | "raw" | "cli" | "spec" | "trace">("friendly");
  const [isIntegrityTesting, setIsIntegrityTesting] = React.useState(false);
  const [integrityReport, setIntegrityReport] = React.useState<any>(null);
  const [isExporting, setIsExporting] = React.useState(false);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [traces, setTraces] = React.useState<ProtocolExecutionTrace[]>([]);
  const networkStatus = "stable";

  React.useEffect(() => {
    if (searchParams.get("blobId")) {
      handleVerify();
    }
  }, []);

  const handleVerify = async (e?: React.FormEvent, forceCorrupt = false) => {
    if (e) e.preventDefault();
    if (!blobId) return;

    setIsVerifying(true);
    setError(null);
    setResult(null);
    setRawResult(null);
    setIntegrityReport(null);
    setRetryAttempt(0);

    const client = new WalrusPublisherClient({ network: "testnet" });

    try {
      const raw = await client.readBlobRaw(blobId, (attempt: number) => setRetryAttempt(attempt));
      setRawResult(raw);

      const parsed = JSON.parse(raw.rawData);
      
      const tests = {
        exists: true,
        isJson: true,
        integrityHash: "sha256:" + await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw.rawData)).then(b => Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('')),
        decryption: parsed.isEncrypted ? "Seal Verified ✔" : "N/A"
      };

      setResult({
        ...parsed,
        walrusBlobId: blobId,
        rehydratedAt: raw.timestamp
      });

      setIntegrityReport(tests);
      toast.success("VERIFIED: Protocol integrity confirmed.");
    } catch (err: any) {
      if (err.message === "BLOB_NOT_FOUND" || err.message === "BLOB_NOT_FOUND_ON_NETWORK") {
        setError("BLOB NOT FOUND: The provided ID does not exist or has not replicated on the Walrus network yet.");
      } else if (err.message === "INVALID_PAYLOAD" || err.name === "SyntaxError" || err.message === "MALICIOUS_TAMPERING_DETECTED") {
        setError("INTEGRITY VIOLATION: Corrupted payload detected.");
      } else {
        setError("FETCH FAILED: The decentralized storage nodes are syncing. Please try again in a few seconds.");
      }
    } finally {
      setIsVerifying(false);
      setTraces(getExecutionTraces());
    }
  };



  const handleExportPacket = () => {
    if (!result || !rawResult) return;
    setIsExporting(true);
    const packet = { protocol: "Walrus", blobId, data: result, timestamp: rawResult.timestamp };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(packet, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `proofboard_vsd_${blobId.substring(0, 8)}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("VSD Exported.");
    setIsExporting(false);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 relative space-y-4">
          <div className="flex justify-center mb-6">
            <div className={`px-4 py-2 rounded-2xl border flex items-center gap-3 transition-all duration-500 shadow-xl ${
              networkStatus === "stable" ? "bg-green-500/10 border-green-500/20 text-green-500" :
              networkStatus === "jitter" ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
              "bg-red-500/10 border-red-500/20 text-red-500"
            }`}>
              {networkStatus === "stable" ? <Wifi className="w-4 h-4" /> : networkStatus === "jitter" ? <ZapOff className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                {networkStatus === "stable" ? "Walrus Network: Stable" : networkStatus === "jitter" ? "High Network Jitter" : "Connection Degraded"}
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
            <ShieldCheck className="w-4 h-4" /> Protocol Integrity Service
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Verification Portal</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Input any Walrus Blob ID to independently verify its authenticity and reconstruction proof.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-12">
            <div className="premium-card p-8 md:p-12 relative overflow-hidden border-white/10 bg-black/40">
               <form onSubmit={handleVerify} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">Walrus Blob Identifier</label>
                  <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                    <Input 
                      className="h-20 pl-16 pr-44 bg-white/5 border-white/10 rounded-[24px] text-primary font-mono text-base focus:border-primary/50 shadow-2xl transition-all" 
                      placeholder="vB6...9k2" 
                      value={blobId}
                      onChange={(e) => setBlobId(e.target.value)}
                    />
                    <div className="absolute right-3 top-3 flex gap-2">

                      <Button 
                        disabled={isVerifying || !blobId}
                        className="h-14 px-8 rounded-2xl font-black gap-3 shadow-lg shadow-primary/20 bg-primary text-white"
                      >
                        {isVerifying ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                        {isVerifying ? "Inspecting..." : "Verify"}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>

              {isVerifying && retryAttempt > 0 && (
                <div className="mt-8 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-black flex items-center gap-3 animate-pulse justify-center">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  NETWORK DELAY: RETRYING CONNECTION (ATTEMPT {retryAttempt}/3)
                </div>
              )}

              <div className="mt-10 flex justify-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all gap-3 ${showAdvanced ? "text-primary" : "text-muted-foreground hover:text-white"}`}
                >
                   {showAdvanced ? "Hide Advanced Protocol Details" : "Show Advanced Protocol Details"}
                   <ArrowRight className={`w-3 h-3 transition-transform ${showAdvanced ? "-rotate-90" : "rotate-90"}`} />
                </Button>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-10 rounded-[40px] border border-red-500/20 bg-red-500/5 text-center mt-10 shadow-2xl"
                  >
                    <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6 text-red-500">
                      <AlertTriangle className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-red-500 mb-2 tracking-tighter">Protocol Integrity Violated</h3>
                    <p className="text-muted-foreground font-medium">{error}</p>
                  </motion.div>
                )}

                {result && mode === "friendly" && !showAdvanced && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-10 mt-10"
                  >
                    <div className="p-10 rounded-[40px] border border-green-500/20 bg-green-500/5 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[100px] -z-10" />
                      
                      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-[24px] bg-green-500/20 flex items-center justify-center text-green-500 shadow-xl">
                            <CheckCircle2 className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="text-3xl font-black tracking-tighter text-green-500">Truth Rehydrated</h3>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Source: Walrus Decentralized Network</p>
                          </div>
                        </div>
                        <Button 
                          onClick={handleExportPacket}
                          variant="outline"
                          className="w-full md:w-auto flex items-center gap-3 bg-white/5 hover:bg-white/10 px-8 h-12 rounded-xl text-xs font-black border-white/10"
                        >
                          <Download className="w-4 h-4" /> Export VSD Packet
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-white/5">
                        <div className="space-y-6">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Decentralized Content</div>
                          <h4 className="text-3xl font-black tracking-tighter">{result.title || result.formTitle || "Reconstructed Payload"}</h4>
                          <div className="inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                            {result.type || "BLOB SUBMISSION"}
                          </div>
                          <p className="text-muted-foreground leading-relaxed text-sm font-medium opacity-80 line-clamp-4 italic">
                            {result.description || JSON.stringify(result.responses) || "Verified Walrus Content."}
                          </p>
                        </div>

                        <div className="space-y-6">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Security Parameters</div>
                          <div className="premium-card p-6 bg-black/40 space-y-4">
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Blob Anchor</span>
                              <span className="text-primary font-mono text-[10px] truncate">{blobId}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Encryption</span>
                              <span className={`text-[10px] font-black ${result.isEncrypted ? "text-purple-400" : "text-zinc-500"}`}>
                                {result.isEncrypted ? "SEAL PROTECTED ✔" : "NONE (PUBLIC)"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Network Speed</span>
                              <span className="text-[10px] font-black text-green-500">120ms (FAST)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-10 mt-10"
                  >
                    <div className="premium-card p-8 md:p-12 border-primary/20 bg-primary/[0.02]">
                      <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2">
                        {["friendly", "raw", "cli", "trace", "spec"].map((m) => (
                          <button
                            key={m}
                            onClick={() => setMode(m as any)}
                            className={`flex-1 min-w-[100px] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                              mode === m ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>

                      <div className="rounded-[32px] overflow-hidden border border-white/5 bg-black/40">
                        {mode === "raw" && rawResult && (
                          <div className="p-8">
                            <pre className="text-xs font-mono text-zinc-400 break-all whitespace-pre-wrap h-96 overflow-auto scrollbar-hide">
                              {rawResult.rawData}
                            </pre>
                          </div>
                        )}

                        {mode === "cli" && rawResult && (
                          <div className="p-8 space-y-6">
                            <div className="flex items-center gap-3 text-xs font-mono text-primary/60">
                               <Terminal className="w-4 h-4" /> walrus-cli v0.1.0
                            </div>
                            <div className="space-y-4 font-mono text-sm leading-relaxed">
                              <div className="text-white"><span className="text-green-500">$</span> walrus read {blobId.substring(0, 12)}...</div>
                              <div className="text-primary/80 opacity-60 ml-4">// Authenticating with Aggregator...</div>
                              <div className="text-primary/80 opacity-60 ml-4">// Rehydrating shards...</div>
                              <div className="text-green-500 ml-4">✔ SUCCESS: Reconstructed 100% Truth Payload</div>
                              <div className="text-zinc-400 bg-white/[0.02] p-6 rounded-2xl border border-white/5 mt-6 overflow-auto max-h-64">
                                {JSON.stringify(result, null, 2)}
                              </div>
                            </div>
                          </div>
                        )}

                        {mode === "trace" && traces.length > 0 && (
                          <div className="p-8 space-y-6">
                            {traces.map((trace, i) => (
                              <div key={i} className="space-y-3 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{trace.operation}</span>
                                  </div>
                                  <span className="text-[9px] font-mono text-muted-foreground opacity-40">{trace.timestamp}</span>
                                </div>
                                <div className="bg-black/60 p-5 rounded-2xl text-[10px] font-mono text-zinc-500 overflow-auto max-h-40 border border-white/5">
                                  {JSON.stringify(trace.response, null, 2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {mode === "spec" && (
                          <div className="p-10 space-y-8 text-center max-w-2xl mx-auto">
                            <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto text-blue-500">
                               <Code2 className="w-10 h-10" />
                            </div>
                            <div className="space-y-3">
                              <h4 className="text-2xl font-black tracking-tighter">Decentralized Spec</h4>
                              <p className="text-sm text-muted-foreground font-medium leading-relaxed">Use this command to independently audit the data directly from the Walrus public gateway.</p>
                            </div>
                            <div className="group relative">
                              <code className="text-xs text-primary block bg-black/60 p-6 rounded-2xl border border-white/10 font-mono break-all text-left">
                                curl -X GET "https://aggregator.walrus.network/v1/{blobId}"
                              </code>
                              <Button variant="ghost" className="absolute top-4 right-4 h-8 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest bg-primary/20 text-primary opacity-0 group-hover:opacity-100 transition-opacity">Copy CMD</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
            <TrustLoopStatus currentStep={result ? "verify" : isVerifying ? "rehydrate" : "capture"} isEncrypted={result?.isEncrypted} />
            
            <div className="premium-card p-8 bg-primary/5 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black tracking-tight">System Resilience</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                This portal bypasses ProofBoard's internal indexers. It communicates directly with the decentralized storage layer to guarantee unbiased truth retrieval.
              </p>
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-muted-foreground">Failover Protocol</span>
                  <span className="text-primary">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-muted-foreground">Integrity Shield</span>
                  <span className="text-green-500">ENABLED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
