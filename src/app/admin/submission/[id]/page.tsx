"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, ShieldCheck, Clock, CheckCircle2, AlertCircle, Send, User, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { WalrusPublisherClient, LifecycleEvent } from "@/lib/walrus";

export default function SubmissionThreadPage() {
  const { id } = useParams(); // This is the blobId
  const router = useRouter();
  
  const [submission, setSubmission] = useState<any>(null);
  const [events, setEvents] = useState<LifecycleEvent[]>([]);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 1. Fetch submission data
    const fetchSubmission = async () => {
      try {
        const existing = JSON.parse(localStorage.getItem("proofboard_submissions") || "[]");
        const match = existing.find((s: any) => s.blobId === id);
        
        if (match) {
          setSubmission(match);
        } else {
          // Rehydrate if not in local storage
          const client = new WalrusPublisherClient({ network: "testnet" });
          const rehydrated = await client.rehydrateSubmission(id as string);
          setSubmission({ ...rehydrated, blobId: id });
        }
      } catch (e) {
        toast.error("Failed to load submission");
      }
    };

    fetchSubmission();

    // 2. Fetch lifecycle events
    const storedEvents = JSON.parse(localStorage.getItem(`proofboard_events_${id}`) || "[]");
    setEvents(storedEvents);
  }, [id]);

  const addEvent = async (type: LifecycleEvent["type"], payload: any) => {
    setIsSubmitting(true);
    try {
      const client = new WalrusPublisherClient({ network: "testnet" });
      const result = await client.addLifecycleEvent(id as string, {
        type,
        payload,
        author: "Admin",
      });

      // Optimistically add to UI
      const newEvent: LifecycleEvent = {
        type,
        payload,
        parentBlobId: id as string,
        author: "Admin",
        timestamp: new Date().toISOString()
      };

      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      localStorage.setItem(`proofboard_events_${id}`, JSON.stringify(updatedEvents));

      // Also update submission status locally
      if (type === "status_change") {
        const storedSubmissions = JSON.parse(localStorage.getItem("proofboard_submissions") || "[]");
        const updatedSubmissions = storedSubmissions.map((s: any) => 
          s.blobId === id ? { ...s, status: payload.status } : s
        );
        localStorage.setItem("proofboard_submissions", JSON.stringify(updatedSubmissions));
        setSubmission((prev: any) => ({ ...prev, status: payload.status }));
      }

      toast.success("Lifecycle update anchored to Walrus");
    } catch (e) {
      toast.error("Failed to anchor update");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    await addEvent("comment", { text: comment });
    setComment("");
  };

  const updateStatus = async (newStatus: string) => {
    await addEvent("status_change", { status: newStatus });
  };

  if (!submission) return <div className="p-12 text-center text-muted-foreground">Loading decentralized state...</div>;

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 max-w-5xl">
      <Button 
        variant="ghost" 
        className="mb-8 gap-2 text-muted-foreground hover:text-white"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Timeline & Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-dark p-8 rounded-[32px] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Database className="w-32 h-32" />
            </div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 uppercase tracking-widest text-[10px]">
                {submission.status || "Pending"}
              </Badge>
              <div className="text-xs text-muted-foreground font-mono bg-white/5 px-2 py-1 rounded">
                Blob: {id?.toString().substring(0, 8)}...
              </div>
            </div>

            <h1 className="text-3xl font-black mb-4 relative z-10">{submission.formTitle || "Feedback Submission"}</h1>
            <p className="text-muted-foreground leading-relaxed relative z-10">
              {submission.isEncrypted ? "🔒 Content is Seal Encrypted. Decrypt in dashboard view." : "This is a decentralized submission anchored on the Walrus testnet. View the raw data to see user inputs."}
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Lifecycle Timeline
            </h3>

            <div className="space-y-4 pl-4 border-l-2 border-white/10 relative">
              <div className="relative pl-6">
                <div className="absolute left-[-21px] top-1 w-10 h-10 bg-black border-2 border-primary/30 rounded-full flex items-center justify-center text-primary">
                  <Database className="w-4 h-4" />
                </div>
                <div className="glass-dark p-5 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-primary">Submission Anchored</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(submission.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Original form submission successfully verified and stored on Walrus.</p>
                </div>
              </div>

              {events.map((ev, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute left-[-21px] top-1 w-10 h-10 bg-black border-2 border-white/10 rounded-full flex items-center justify-center text-muted-foreground">
                    {ev.type === 'comment' ? <MessageSquare className="w-4 h-4" /> : 
                     ev.type === 'status_change' ? <AlertCircle className="w-4 h-4" /> : 
                     <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div className="glass-dark p-5 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{ev.author}</span>
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground bg-white/5 px-2 py-0.5 rounded">
                          {ev.type.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{new Date(ev.timestamp).toLocaleString()}</span>
                    </div>
                    {ev.type === 'comment' && <p className="text-sm text-muted-foreground">{ev.payload.text}</p>}
                    {ev.type === 'status_change' && <p className="text-sm text-amber-500">Status updated to: <span className="font-bold uppercase tracking-widest">{ev.payload.status}</span></p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 relative pl-6 border-l-2 border-white/10">
               <div className="absolute left-[-21px] top-7 w-10 h-10 bg-black border-2 border-primary rounded-full flex items-center justify-center text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                  <User className="w-4 h-4" />
               </div>
               <div className="flex gap-4">
                 <Input 
                   placeholder="Add a comment or internal note..." 
                   value={comment}
                   onChange={(e) => setComment(e.target.value)}
                   className="flex-1 bg-white/5 border-white/10 rounded-2xl h-14 pl-4 focus:border-primary/50"
                 />
                 <Button 
                   onClick={handleComment}
                   disabled={isSubmitting || !comment.trim()}
                   className="h-14 px-8 rounded-2xl bg-primary text-white font-bold gap-2"
                 >
                   <Send className="w-4 h-4" /> Post Note
                 </Button>
               </div>
               <p className="text-[10px] text-muted-foreground mt-2 pl-2">This comment will be permanently anchored to Walrus as a child blob.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="space-y-6">
          <div className="glass-dark p-6 rounded-3xl border border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Lifecycle Actions</h4>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                onClick={() => updateStatus("reviewing")}
                disabled={isSubmitting}
                className="w-full justify-start h-12 rounded-xl border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 text-blue-400"
              >
                <AlertCircle className="w-4 h-4 mr-3" /> Mark as Reviewing
              </Button>
              <Button 
                variant="outline" 
                onClick={() => updateStatus("planned")}
                disabled={isSubmitting}
                className="w-full justify-start h-12 rounded-xl border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 text-purple-400"
              >
                <Clock className="w-4 h-4 mr-3" /> Add to Planned
              </Button>
              <Button 
                variant="outline" 
                onClick={() => updateStatus("resolved")}
                disabled={isSubmitting}
                className="w-full justify-start h-12 rounded-xl border-white/10 hover:border-green-500/50 hover:bg-green-500/10 text-green-500"
              >
                <CheckCircle2 className="w-4 h-4 mr-3" /> Mark as Resolved
              </Button>
            </div>
          </div>

          <div className="glass-dark p-6 rounded-3xl border border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Metadata</h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-muted-foreground">Priority</span>
                <Badge variant="outline" className="border-amber-500/20 text-amber-500 bg-amber-500/10 uppercase text-[9px] tracking-widest">Medium</Badge>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-muted-foreground">Assignee</span>
                <span className="font-bold">Unassigned</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Verified</span>
                <ShieldCheck className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
