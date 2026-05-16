"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  FileText, 
  Inbox, 
  Download, 
  Filter, 
  ExternalLink,
  ChevronRight,
  Database,
  Search,
  MoreVertical,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface SubmissionSummary {
  blobId: string;
  formId: string;
  formTitle: string;
  timestamp: string;
  isEncrypted: boolean;
  status: "pending" | "reviewing" | "resolved";
}

export default function AdminDashboardPage() {
  const [submissions, setSubmissions] = React.useState<SubmissionSummary[]>([]);
  const [filter, setFilter] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  React.useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("proofboard_submissions") || "[]");
    setSubmissions(stored.map((s: any) => ({
      ...s,
      status: s.status || "pending"
    })));
  }, []);

  const updateStatus = (blobId: string, newStatus: SubmissionSummary["status"]) => {
    const updated = submissions.map(s => s.blobId === blobId ? { ...s, status: newStatus } : s);
    setSubmissions(updated);
    localStorage.setItem("proofboard_submissions", JSON.stringify(updated));
    toast.success(`Status updated to ${newStatus}`);
  };

  const exportCSV = () => {
    if (submissions.length === 0) return;
    
    const headers = ["Blob ID", "Form Title", "Timestamp", "Encrypted", "Status"];
    const rows = submissions.map(s => [
      s.blobId,
      s.formTitle,
      s.timestamp,
      s.isEncrypted ? "Yes" : "No",
      s.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `proofboard_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("CSV Export Successful!");
  };

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = s.formTitle.toLowerCase().includes(filter.toLowerCase()) || s.blobId.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = selectedStatus === "all" || s.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Responses Dashboard</h1>
            <p className="text-muted-foreground text-lg">Monitor and manage decentralized form submissions.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => {
                const stored = JSON.parse(localStorage.getItem("proofboard_submissions") || "[]");
                setSubmissions(stored.map((s: any) => ({ ...s, status: s.status || "pending" })));
                toast.info("Walrus Network Scanned: Truth Rehydrated.");
              }} 
              variant="outline" 
              className="flex-1 lg:flex-none h-12 rounded-2xl gap-2 font-bold border-primary/20 text-primary hover:bg-primary/5 transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Discovery Scan
            </Button>
            <Button onClick={exportCSV} variant="outline" className="flex-1 lg:flex-none h-12 rounded-2xl gap-2 font-bold border-white/10 hover:bg-white/5">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
            <Button onClick={() => window.location.href = "/builder"} className="flex-1 lg:flex-none h-12 bg-primary text-white rounded-2xl gap-2 font-bold px-8 shadow-lg shadow-primary/20">
              <LayoutDashboard className="w-4 h-4" /> New Form
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="premium-card p-8 space-y-3 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Total Submissions</div>
            <div className="text-5xl font-black tracking-tighter text-white">{submissions.length}</div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary">
              <Database className="w-3 h-3" /> Live Walrus Data
            </div>
          </div>
          <div className="premium-card p-8 space-y-3 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-glow/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Active Forms</div>
            <div className="text-5xl font-black tracking-tighter text-white">
               {new Set(submissions.map(s => s.formId)).size}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-glow">
              <FileText className="w-3 h-3" /> Schema Indexed
            </div>
          </div>
          <div className="premium-card p-8 space-y-3 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Privacy Shielded</div>
            <div className="text-5xl font-black tracking-tighter text-white">
              {submissions.filter(s => s.isEncrypted).length}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-purple-400">
              <ShieldCheck className="w-3 h-3" /> Seal Encrypted
            </div>
          </div>
        </div>

        <div className="premium-card bg-black/40 overflow-hidden border border-white/5">
          <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
              <Input 
                placeholder="Search by Form or Blob ID..." 
                className="pl-14 bg-white/5 border-white/10 rounded-[20px] h-14 text-sm focus:border-primary/50 transition-all"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {["all", "pending", "reviewing", "resolved"].map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${
                    selectedStatus === status ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 py-8 pl-10">Form Reference</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 py-8">Walrus Blob ID</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 py-8">Timestamp</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 py-8">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 py-8 pr-10 text-right">Audit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-32 text-muted-foreground/40 font-medium italic">
                      No submissions found. Rehydrate from Walrus network.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((sub) => (
                    <TableRow key={sub.blobId} className="border-white/5 hover:bg-white/[0.03] transition-colors group">
                      <TableCell className="py-8 pl-10">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-[16px] transition-all ${sub.isEncrypted ? "bg-purple-500/10 text-purple-400" : "bg-primary/10 text-primary"}`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <span className="font-bold text-white block">{sub.formTitle}</span>
                            <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                               <ShieldCheck className={`w-3 h-3 ${sub.isEncrypted ? "text-purple-400" : "text-green-400"}`} />
                               <span className="text-[9px] font-black uppercase tracking-tighter">Verified Anchor</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-8">
                        <code className="text-[11px] text-muted-foreground font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                           {sub.blobId.substring(0, 8)}...{sub.blobId.substring(sub.blobId.length - 8)}
                        </code>
                      </TableCell>
                      <TableCell className="py-8 text-xs text-muted-foreground font-medium">
                        {new Date(sub.timestamp).toLocaleDateString()} · {new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell className="py-8">
                        <Badge variant="outline" className={`rounded-xl px-4 py-1 uppercase text-[9px] font-black tracking-widest border-none ${
                          sub.status === "pending" ? "bg-amber-500/10 text-amber-500" :
                          sub.status === "reviewing" ? "bg-blue-500/10 text-blue-500" :
                          "bg-green-500/10 text-green-500"
                        }`}>
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-8 pr-10 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/10 transition-all">
                              <MoreVertical className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="rounded-2xl border-white/10 bg-zinc-900/95 backdrop-blur-xl p-2 min-w-[200px]" align="end">
                            <DropdownMenuItem onClick={() => window.open(`https://walruscan.com/testnet/blob/${sub.blobId}`, "_blank")} className="rounded-xl gap-3 p-3 cursor-pointer hover:bg-white/5">
                              <ExternalLink className="w-4 h-4 text-primary" /> 
                              <span className="text-xs font-bold">Walrus Explorer</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.location.href = `/verify?blobId=${sub.blobId}`} className="rounded-xl gap-3 p-3 cursor-pointer hover:bg-white/5">
                              <ShieldCheck className="w-4 h-4 text-cyan-glow" /> 
                              <span className="text-xs font-bold">Audit Blob ID</span>
                            </DropdownMenuItem>
                            <div className="h-px bg-white/5 my-2 mx-1" />
                            <div className="px-3 py-2 text-[8px] font-black uppercase text-muted-foreground tracking-widest">Update Lifecycle</div>
                            <DropdownMenuItem onClick={() => updateStatus(sub.blobId, "reviewing")} className="rounded-xl p-3 cursor-pointer hover:bg-white/5 text-xs font-medium">Mark as Reviewing</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(sub.blobId, "resolved")} className="rounded-xl p-3 cursor-pointer hover:bg-green-500/10 text-green-500 text-xs font-bold">Mark as Resolved</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
