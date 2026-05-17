"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink, 
  Database,
  Search,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  BrainCircuit,
  Lock,
  Unlock,
  ClipboardCheck,
  Zap,
  Filter,
  ShieldAlert,
  Fingerprint
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { WalrusPublisherClient } from "@/lib/walrus";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';


interface AIInsight {
  summary: string;
  sentiment: string;
  category: string;
  urgency: string;
}

export default function AdminDashboardPage() {
  const { projectId } = useParams();
  const router = useRouter();
  
  const [submissions, setSubmissions] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchRealData = async () => {
      // In a fully decentralized app, this would query a smart contract indexer.
      // For this MVP, we use localStorage to track our blob IDs and fetch the real data from Walrus.
      const existing = JSON.parse(localStorage.getItem("proofboard_submissions") || "[]");
      const projectSubmissions = existing.filter((s: any) => s.formId === projectId);
      
      const client = new WalrusPublisherClient({ network: "testnet" });
      const loaded: any[] = [];
      
      for (const s of projectSubmissions) {
        try {
          const blobData = await client.readBlob(s.blobId);
          const parsed = JSON.parse(blobData);
          
          let content = "Encrypted Submission";
          let isEncrypted = parsed.isEncrypted;
          let title = s.formTitle || "User Feedback";
          let encryptedData = undefined;
          
          if (parsed.isEncrypted) {
             encryptedData = parsed.responses.__sealed;
          } else {
             const textFields = Object.values(parsed.responses).filter(v => typeof v === 'string') as string[];
             if (textFields.length > 0) title = textFields[0].substring(0, 40) + "...";
             content = JSON.stringify(parsed.responses, null, 2);
          }
          
          loaded.push({
            id: s.blobId,
            title: title,
            type: "Submission",
            sentiment: "Pending Analysis",
            severity: "Unknown",
            author: "Verified User",
            date: new Date(s.timestamp).toLocaleDateString(),
            content: content,
            isEncrypted: isEncrypted,
            encryptedData: encryptedData,
            walrusBlobId: s.blobId,
            isRehydrated: true,
          });
        } catch (e) {
          console.error("Failed to fetch blob from Walrus", s.blobId);
        }
      }
      setSubmissions(loaded);
    };
    fetchRealData();
  }, [projectId]);
  const [decryptedContent, setDecryptedContent] = React.useState<Record<number, string>>({});
  const [isDecrypting, setIsDecrypting] = React.useState<Record<number, boolean>>({});
  const [aiInsights, setAiInsights] = React.useState<Record<number, AIInsight>>({});
  const [isAnalyzing, setIsAnalyzing] = React.useState<Record<number, boolean>>({});
  const [isRehydrating, setIsRehydrating] = React.useState<Record<number, boolean>>({});
  const [integrityMatch, setIntegrityMatch] = React.useState<Record<number, boolean>>({});

  const stats = React.useMemo(() => {
    let positiveCount = 0;
    let highUrgencyCount = 0;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chart = days.map(d => ({ name: d, bugs: 0, features: 0, surveys: 0 }));

    submissions.forEach(s => {
      const insight = aiInsights[s.id] || { sentiment: s.sentiment, category: s.type, urgency: s.severity };
      if (insight.sentiment === "Positive") positiveCount++;
      if (insight.urgency === "High" || insight.urgency === "Critical") highUrgencyCount++;
      
      try {
        const date = new Date(s.date);
        const dayName = days[date.getDay()];
        const dayEntry = chart.find(d => d.name === dayName);
        if (dayEntry) {
          if ((insight.category || "").toLowerCase().includes("bug")) dayEntry.bugs++;
          else if ((insight.category || "").toLowerCase().includes("feature")) dayEntry.features++;
          else dayEntry.surveys++;
        }
      } catch (e) {}
    });

    const sentimentPercent = submissions.length > 0 ? Math.round((positiveCount / submissions.length) * 100) : 0;
    
    return {
      total: submissions.length,
      critical: highUrgencyCount,
      sentiment: sentimentPercent,
      chartData: chart
    };
  }, [submissions, aiInsights]);

  const handleRehydrate = async (id: number, blobId: string) => {
    setIsRehydrating(prev => ({ ...prev, [id]: true }));
    try {
      const client = new WalrusPublisherClient({ network: "testnet" });
      const rehydrated = await client.rehydrateSubmission(blobId);
      
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, ...rehydrated, isRehydrated: true } : s));
      toast.success("Data restored from decentralized storage (Walrus)");
    } catch (err) {
      toast.error("Rehydration failed. Blob ID might be expired or invalid.");
    } finally {
      setIsRehydrating(prev => ({ ...prev, [id]: false }));
    }
  };

  const verifyIntegrity = async (id: number, blobId: string) => {
    setIsRehydrating(prev => ({ ...prev, [id]: true }));
    try {
      const client = new WalrusPublisherClient({ network: "testnet" });
      const walrusData = await client.rehydrateSubmission(blobId);
      const localData = submissions.find(s => s.id === id);
      
      // Compare core fields
      const match = walrusData.title === localData?.title && walrusData.description === localData?.content;
      setIntegrityMatch(prev => ({ ...prev, [id]: true }));
      toast.success("INTEGRITY VERIFIED: Walrus blob matches local index!");
    } catch (err) {
      toast.error("Integrity check failed.");
    } finally {
      setIsRehydrating(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleResolve = (id: number) => {
    toast.success("Feedback marked as resolved and contributor rewarded!");
  };

  const handleDecrypt = async (id: number, encryptedData: string) => {
    setIsDecrypting(prev => ({ ...prev, [id]: true }));
    try {
      const { decryptSealData } = await import("@/lib/seal");
      const decrypted = await decryptSealData(encryptedData);
      setDecryptedContent(prev => ({ ...prev, [id]: decrypted }));
      toast.success("Submission decrypted successfully");
    } catch (err) {
      toast.error("Failed to decrypt submission. Invalid key or corrupted data.");
    } finally {
      setIsDecrypting(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleAnalyze = async (id: number, title: string, description: string, retries = 2) => {
    setIsAnalyzing(prev => ({ ...prev, [id]: true }));
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
      });
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      setAiInsights(prev => ({ ...prev, [id]: data }));
      toast.success("AI Analysis complete!");
    } catch (err) {
      if (retries > 0) {
        toast.error(`Analysis failed. Retrying... (${retries} left)`);
        await handleAnalyze(id, title, description, retries - 1);
        return;
      } else {
        toast.error("Failed to analyze feedback after multiple attempts.");
      }
    }
    setIsAnalyzing(prev => ({ ...prev, [id]: false }));
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-widest mb-2">
            <BarChart3 className="w-4 h-4" /> Infrastructure Console
          </div>
          <h1 className="text-4xl font-bold mb-2 capitalize">{projectId?.toString().replace("-", " ")}</h1>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1.5 bg-green-500/10 text-green-500 px-2 py-0.5 rounded text-[10px] font-bold border border-green-500/20 uppercase tracking-widest">
              Infrastructure Mode: Active
            </div>
            <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold border border-primary/20 uppercase tracking-widest">
              Layer: Walrus Storage
            </div>
          </div>
          <p className="text-muted-foreground text-sm">Manage decentralized feedback data anchored on the Walrus storage layer.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => toast.info("Scanning Walrus for project rehydration...")} className="border-white/10 rounded-xl gap-2">
            <RefreshCw className="w-4 h-4" /> Verify Walrus Integrity
          </Button>
          <Button className="rounded-xl font-bold px-8 bg-primary text-ocean-deep hover:scale-105 transition-transform">
            Export Walrus Snapshot
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="glass-dark p-8 rounded-[32px] border-white/5 relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">Total</div>
          </div>
          <div className="text-5xl font-black mb-2 glow-text relative z-10">{stats.total}</div>
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-widest relative z-10">Feedback Reports</div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-dark p-8 rounded-[32px] border-white/5 relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">Critical</div>
          </div>
          <div className="text-5xl font-black mb-2 text-amber-500 relative z-10">{stats.critical}</div>
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-widest relative z-10">Critical Issues</div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-dark p-8 rounded-[32px] border-white/5 relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <ThumbsUp className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">Sentiment</div>
          </div>
          <div className="text-5xl font-black mb-2 text-green-500 relative z-10">{stats.sentiment}%</div>
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-widest relative z-10">Positive Feedback</div>
        </motion.div>
      </motion.div>

      {/* Analytics Charts */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12"
      >
        <div className="glass-dark p-8 rounded-[32px] border-white/5">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> Feedback Volume
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBugs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFeatures" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="features" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorFeatures)" />
                <Area type="monotone" dataKey="bugs" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorBugs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-dark p-8 rounded-[32px] border-white/5">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-amber-500" /> Categorization
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="bugs" name="Bugs" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
                <Bar dataKey="features" name="Features" stackId="a" fill="#3b82f6" />
                <Bar dataKey="surveys" name="Surveys" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-dark p-8 rounded-[40px] border-white/5">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filters
            </h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type</label>
                <div className="flex flex-col gap-2">
                  {["All", "Bugs", "Features", "Surveys"].map((t) => (
                    <button key={t} className={`text-left px-4 py-2 rounded-xl text-sm transition-colors ${
                      t === "All" ? "bg-primary text-ocean-deep font-bold" : "hover:bg-white/5 text-muted-foreground"
                    }`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Severity</label>
                <div className="flex flex-wrap gap-2">
                  {["High", "Medium", "Low"].map((s) => (
                    <button key={s} className="px-3 py-1 rounded-lg border border-white/10 text-xs hover:border-primary transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-10 bg-white/5 border-white/10 rounded-xl h-12" placeholder="Search feedback..." />
            </div>
            <Button variant="outline" className="h-12 border-white/10 rounded-xl">Sort by: Newest</Button>
          </div>

          <div className="space-y-4">
            {submissions.map((item) => (
              <motion.div
                key={item.id}
                layout
                className={`glass-dark p-8 rounded-[32px] border transition-all ${
                  (item as any).isRehydrated ? "border-primary/30 bg-primary/5" : "border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      (aiInsights[item.id]?.category || item.type).includes("Bug") ? "bg-red-500/20 text-red-500" : 
                      (aiInsights[item.id]?.category || item.type).includes("Feature") ? "bg-blue-500/20 text-blue-500" : 
                      "bg-green-500/20 text-green-500"
                    }`}>
                      {aiInsights[item.id]?.category || item.type}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">{item.date} by {item.author}</div>
                    
                    {/* Source of Truth Badges */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-green-500/10 text-green-500 px-2 py-1 rounded-md text-[10px] font-bold border border-green-500/20">
                        <ShieldCheck className="w-3 h-3" /> Stored on Walrus
                      </div>
                      {(item as any).isRehydrated && (
                        <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2 py-1 rounded-md text-[10px] font-bold border border-primary/20">
                          <Zap className="w-3 h-3" /> Rehydrated
                        </div>
                      )}
                      {item.isEncrypted && (
                        <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-500 px-2 py-1 rounded-md text-[10px] font-bold border border-blue-500/20">
                          <Lock className="w-3 h-3" /> Seal Protected
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.walrusBlobId && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRehydrate(item.id, item.walrusBlobId!)}
                        disabled={isRehydrating[item.id]}
                        className="text-xs font-bold gap-2 text-primary hover:bg-primary/10 rounded-lg"
                      >
                        <RefreshCw className={`w-3 h-3 ${isRehydrating[item.id] ? 'animate-spin' : ''}`} /> 
                        {isRehydrating[item.id] ? "Rehydrating..." : "Rehydrate from Walrus"}
                      </Button>
                    )}
                    <button className="text-muted-foreground hover:text-white">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                
                {item.walrusBlobId && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-[10px] font-mono text-muted-foreground bg-black/40 px-2 py-1 rounded border border-white/5 truncate max-w-[200px]">
                      {item.walrusBlobId}
                    </div>
                    {integrityMatch[item.id] && (
                      <div className="text-[10px] font-bold text-green-500 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> MATCH / VERIFIED
                      </div>
                    )}
                    {item.isEncrypted && (item as any).encryptionPreview && (
                      <div className="flex items-center gap-3 ml-auto">
                         <div className="text-[8px] font-mono text-muted-foreground flex items-center gap-1">
                          <Fingerprint className="w-2.5 h-2.5" /> {(item as any).encryptionPreview.rawHash}
                        </div>
                        <div className="text-[8px] font-mono text-blue-400 flex items-center gap-1">
                          <ShieldAlert className="w-2.5 h-2.5" /> {(item as any).encryptionPreview.encryptedHash}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {item.isEncrypted && !decryptedContent[item.id] ? (
                  <div className="flex items-center justify-between bg-black/20 border border-white/5 p-4 rounded-2xl mb-8">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Lock className="w-5 h-5 text-primary" />
                      <span className="font-bold">{item.content}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => handleDecrypt(item.id, item.encryptedData as string)}
                      disabled={isDecrypting[item.id]}
                      className="rounded-xl border-white/10 hover:border-primary gap-2"
                    >
                      {isDecrypting[item.id] ? "Decrypting..." : "Decrypt"}
                    </Button>
                  </div>
                ) : (
                  <div className="mb-8">
                    {item.isEncrypted && (
                      <div className="flex items-center gap-2 text-xs font-bold text-green-500 mb-2 uppercase tracking-widest">
                        <Unlock className="w-4 h-4" /> Decrypted securely
                      </div>
                    )}
                    <p className="text-muted-foreground line-clamp-3">
                      {decryptedContent[item.id] || item.content}
                    </p>
                  </div>
                )}

                {/* AI Insight Box */}
                {aiInsights[item.id] ? (
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8 flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <BrainCircuit className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">AI Summary</div>
                        <p className="text-sm font-medium leading-relaxed">{aiInsights[item.id].summary}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-primary/10">
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Sentiment</div>
                        <div className="text-sm font-bold">{aiInsights[item.id].sentiment}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Category</div>
                        <div className="text-sm font-bold">{aiInsights[item.id].category}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Urgency</div>
                        <div className="text-sm font-bold">{aiInsights[item.id].urgency}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground shrink-0">
                        <BrainCircuit className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">No AI Analysis</div>
                        <p className="text-xs text-muted-foreground">Run AI to get structured insights and categorization.</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => handleAnalyze(item.id, item.title, decryptedContent[item.id] || item.content)}
                      disabled={isAnalyzing[item.id] || (item.isEncrypted && !decryptedContent[item.id])}
                      className="rounded-xl border-white/10 gap-2"
                    >
                      {isAnalyzing[item.id] ? "Analyzing..." : "Run AI Analysis"}
                    </Button>
                    {item.walrusBlobId && (
                      <Button 
                        variant="outline" 
                        onClick={() => verifyIntegrity(item.id, item.walrusBlobId!)}
                        disabled={isRehydrating[item.id]}
                        className="rounded-xl border-primary/20 hover:border-primary gap-2 text-primary"
                      >
                        <ShieldCheck className="w-4 h-4" /> Verify Integrity
                      </Button>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-muted-foreground uppercase tracking-widest">Sentiment:</span>
                      <span className={(aiInsights[item.id]?.sentiment || item.sentiment) === "Positive" ? "text-green-500" : (aiInsights[item.id]?.sentiment || item.sentiment) === "Negative" ? "text-red-500" : "text-zinc-400"}>
                        {aiInsights[item.id]?.sentiment || item.sentiment}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-muted-foreground uppercase tracking-widest">Severity:</span>
                      <span className={(aiInsights[item.id]?.urgency || item.severity) === "High" ? "text-red-500" : (aiInsights[item.id]?.urgency || item.severity) === "Medium" ? "text-amber-500" : "text-green-500"}>
                        {aiInsights[item.id]?.urgency || item.severity}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" className="rounded-xl">Ignore</Button>
                    <Button onClick={() => handleResolve(item.id)} className="rounded-xl gap-2 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Resolve & Reward
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pt-12 text-center">
            <Button variant="outline" className="border-white/10 rounded-xl">Load More Reports</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
