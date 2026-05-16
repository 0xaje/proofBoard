"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  Fingerprint
} from "lucide-react";

interface TrustStep {
  id: string;
  label: string;
  status: "pending" | "active" | "completed" | "error";
  icon: React.ReactNode;
  desc: string;
}

interface TrustLoopStatusProps {
  currentStep: string;
  isEncrypted?: boolean;
}

export const TrustLoopStatus: React.FC<TrustLoopStatusProps> = ({ currentStep, isEncrypted = false }) => {
  const steps: TrustStep[] = [
    { id: "capture", label: "Truth Captured", status: "completed", icon: <Fingerprint className="w-4 h-4" />, desc: "Raw input verified and hashed." },
    { id: "encrypt", label: "Privacy Sealed", status: isEncrypted ? "completed" : "pending", icon: <Lock className="w-4 h-4" />, desc: "Seal transformation applied client-side." },
    { id: "store", label: "Walrus Anchored", status: "pending", icon: <ShieldCheck className="w-4 h-4" />, desc: "Stored permanently on decentralized storage." },
    { id: "rehydrate", label: "State Recovered", status: "pending", icon: <RefreshCw className="w-4 h-4" />, desc: "Reconstructible via unique blob identifier." },
    { id: "verify", label: "External Audit", status: "pending", icon: <ExternalLink className="w-4 h-4" />, desc: "Independently verifiable outside the system." },
  ];

  const updatedSteps = steps.map((step, index) => {
    const stepOrder = ["capture", "encrypt", "store", "rehydrate", "verify"];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step.id);

    if (stepIndex < currentIndex) return { ...step, status: "completed" as const };
    if (stepIndex === currentIndex) return { ...step, status: "active" as const };
    return { ...step, status: "pending" as const };
  });

  return (
    <div className="premium-card p-8 bg-black/60 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10" />
      
      <div className="flex flex-col gap-2 mb-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Integrity Trust Loop
        </h3>
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
           Decentralized Audit Pipeline
        </p>
      </div>

      <div className="space-y-6">
        {updatedSteps.map((step, index) => (
          <div key={step.id} className="relative group">
            <div className="flex items-start gap-5">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-700 shadow-2xl ${
                step.status === "completed" ? "bg-green-500 text-white shadow-green-500/20" :
                step.status === "active" ? "bg-primary text-white animate-pulse shadow-primary/40" :
                "bg-white/5 text-muted-foreground/30 border border-white/5"
              }`}>
                {step.status === "completed" ? <CheckCircle2 className="w-6 h-6" /> : step.icon}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-black uppercase tracking-widest ${step.status === "pending" ? "text-muted-foreground/40" : "text-white"}`}>
                    {step.label}
                  </h4>
                  {step.status === "completed" && <span className="text-[9px] font-black text-green-500 uppercase tracking-tighter">Verified</span>}
                  {step.status === "active" && <span className="text-[9px] font-black text-primary uppercase animate-pulse">Processing</span>}
                </div>
                <p className={`text-[10px] leading-relaxed transition-opacity duration-500 ${step.status === "pending" ? "opacity-20" : "opacity-60 font-medium"}`}>
                  {step.desc}
                </p>
              </div>
            </div>
            
            {index < updatedSteps.length - 1 && (
              <div className={`ml-5 my-2 w-[1px] h-6 rounded-full transition-colors duration-700 ${
                step.status === "completed" ? "bg-green-500/30" : "bg-white/5"
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-white/5 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
           Source of Truth: Walrus Network
        </div>
      </div>
    </div>
  );
};
