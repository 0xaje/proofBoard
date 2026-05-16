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
    { id: "capture", label: "Captured", status: "completed", icon: <Fingerprint className="w-4 h-4" />, desc: "Raw input verified and hashed." },
    { id: "encrypt", label: "Encrypted", status: isEncrypted ? "completed" : "pending", icon: <Lock className="w-4 h-4" />, desc: "Seal transformation applied client-side." },
    { id: "store", label: "Walrus Storage", status: "pending", icon: <ShieldCheck className="w-4 h-4" />, desc: "Anchored permanently on decentralized network." },
    { id: "rehydrate", label: "Rehydratable", status: "pending", icon: <RefreshCw className="w-4 h-4" />, desc: "App state reconstructible via blobId." },
    { id: "verify", label: "External Proof", status: "pending", icon: <ExternalLink className="w-4 h-4" />, desc: "Independently verifiable outside the UI." },
  ];

  // Update statuses based on currentStep
  const updatedSteps = steps.map((step, index) => {
    const stepOrder = ["capture", "encrypt", "store", "rehydrate", "verify"];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step.id);

    if (stepIndex < currentIndex) return { ...step, status: "completed" as const };
    if (stepIndex === currentIndex) return { ...step, status: "active" as const };
    return { ...step, status: "pending" as const };
  });

  return (
    <div className="glass-dark p-6 rounded-[32px] border border-white/5 bg-black/40">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Trust Loop Status Panel
        </h3>
        <div className="text-[10px] font-mono text-muted-foreground bg-white/5 px-2 py-1 rounded">
          Verifying Infrastructure Integrity...
        </div>
      </div>

      <div className="space-y-4">
        {updatedSteps.map((step, index) => (
          <div key={step.id} className="relative">
            <div className="flex items-start gap-4">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                step.status === "completed" ? "bg-green-500 text-ocean-deep" :
                step.status === "active" ? "bg-primary text-ocean-deep animate-pulse shadow-[0_0_15px_rgba(var(--primary),0.5)]" :
                "bg-white/5 text-muted-foreground"
              }`}>
                {step.status === "completed" ? <CheckCircle2 className="w-5 h-5" /> : step.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-sm font-bold ${step.status === "pending" ? "text-muted-foreground" : "text-white"}`}>
                    Step {index + 1}: {step.label}
                  </h4>
                  {step.status === "completed" && <span className="text-[10px] font-bold text-green-500 uppercase">Verified ✔</span>}
                  {step.status === "active" && <span className="text-[10px] font-bold text-primary uppercase animate-pulse">In Progress...</span>}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
            
            {index < updatedSteps.length - 1 && (
              <div className={`ml-4 my-2 w-[2px] h-4 rounded-full ${
                step.status === "completed" ? "bg-green-500/50" : "bg-white/5"
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 text-center">
        <p className="text-[10px] text-muted-foreground font-medium">
          The trust loop ensures Walrus is the single source of truth.
        </p>
      </div>
    </div>
  );
};
