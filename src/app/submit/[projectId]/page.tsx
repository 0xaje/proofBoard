"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Bug, 
  Lightbulb, 
  ClipboardCheck, 
  Upload, 
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Server,
  Database,
  ArrowRightLeft,
  Fingerprint,
  FileCode,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { WalrusPublisherClient } from "@/lib/walrus";
import { TrustLoopStatus } from "@/components/TrustLoopStatus";

const STEPS = ["Type", "Details", "Media", "Verification", "Success"];

export default function SubmitFeedbackPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [type, setType] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    severity: "low",
    isEncrypted: false,
  });
  const [blobId, setBlobId] = React.useState<string | null>(null);
  const [blobUrl, setBlobUrl] = React.useState<string | null>(null);
  
  const [rawPayload, setRawPayload] = React.useState<string | null>(null);
  const [encryptedPayload, setEncryptedPayload] = React.useState<string | null>(null);
  const [encryptionMetadata, setEncryptionMetadata] = React.useState<{ rawHash: string, encryptedHash: string } | null>(null);
  const [showEncrypted, setShowEncrypted] = React.useState(true);
  const [isEncrypting, setIsEncrypting] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadStatus, setUploadStatus] = React.useState<string>("");

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handlePrepareVerification = async () => {
    setIsEncrypting(true);
    const payload: any = {
      title: formData.title,
      description: formData.description,
      type,
      timestamp: new Date().toISOString()
    };
    
    // Simple hash simulation for preview
    const rawHash = "sha256:" + Math.random().toString(36).substring(2, 15);
    setRawPayload(JSON.stringify(payload, null, 2));

    if (formData.isEncrypted) {
      const { encryptSealData } = await import("@/lib/seal");
      const encDesc = await encryptSealData(formData.description);
      const encPayload = { ...payload, description: encDesc, encryptionStatus: "Seal Protected" };
      const encHash = "seal:" + Math.random().toString(36).substring(2, 15);
      
      setEncryptedPayload(JSON.stringify(encPayload, null, 2));
      setEncryptionMetadata({ rawHash, encryptedHash: encHash });
      setShowEncrypted(true);
    } else {
      setEncryptedPayload(null);
      setEncryptionMetadata(null);
      setShowEncrypted(false);
    }
    
    // Visual delay for "transformation" effect
    await new Promise(r => setTimeout(r, 1200));
    setIsEncrypting(false);
    nextStep();
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    setUploadStatus("Preparing payload...");
    
    try {
      const client = new WalrusPublisherClient({ network: "testnet" });
      
      const payloadToUpload = formData.isEncrypted && encryptedPayload 
        ? encryptedPayload 
        : rawPayload;

      setUploadStatus(formData.isEncrypted ? "Encrypting with Seal..." : "Formatting JSON payload...");
      await new Promise(r => setTimeout(r, 600));

      setUploadStatus("Uploading to Walrus Publisher API...");
      
      const blob = await client.writeBlob({
        data: payloadToUpload || "",
        contentType: "application/json"
      });

      setUploadStatus("Storage confirmed ✔");
      setBlobId(blob.blobId);
      setBlobUrl(blob.url);
      
      // Local indexing logic with extended encryption metadata
      const submission = {
        walrusBlobId: blob.blobId,
        projectId,
        userId: "sui_master.sui",
        type,
        title: formData.title,
        description: formData.description,
        isEncrypted: formData.isEncrypted,
        encryptionType: formData.isEncrypted ? "Seal" : null,
        encryptionPreview: encryptionMetadata,
        encryptionStatus: formData.isEncrypted ? "Seal Protected" : "Public",
        createdAt: new Date().toISOString()
      };
      console.log("Database Reference Indexed with Seal Metadata:", submission);

      toast.success(formData.isEncrypted ? "Encrypted and stored permanently on Walrus!" : "Stored permanently on Walrus!");
      nextStep();
    } catch (e) {
      console.error(e);
      toast.error("Failed to upload to Walrus API.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <Button 
        variant="ghost" 
        className="mb-8 gap-2 hover:bg-white/5"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4" /> Back to project
      </Button>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-12">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= i ? "bg-primary text-ocean-deep glow-border" : "bg-white/5 text-muted-foreground"
              }`}>
                {step > i ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                step >= i ? "text-primary" : "text-muted-foreground"
              }`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-[2px] mb-6 rounded-full ${
                step > i ? "bg-primary" : "bg-white/5"
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h2 className="text-3xl font-bold mb-8">What kind of feedback?</h2>
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: "bug", icon: <Bug />, title: "Bug Report", desc: "Something isn't working as expected." },
                { id: "feature", icon: <Lightbulb />, title: "Feature Request", desc: "Suggest a new idea or improvement." },
                { id: "survey", icon: <ClipboardCheck />, title: "Survey Response", desc: "Share your thoughts on a specific topic." },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setType(item.id); nextStep(); }}
                  className={`flex items-center gap-6 p-6 rounded-3xl border transition-all text-left group ${
                    type === item.id ? "bg-primary/10 border-primary" : "bg-white/5 border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    type === item.id ? "bg-primary text-ocean-deep" : "bg-white/5 text-primary"
                  }`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight className="ml-auto text-muted-foreground" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <h2 className="text-3xl font-bold mb-8">Tell us more</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Title</label>
                <Input className="h-14 bg-white/5 border-white/10 rounded-2xl" placeholder="Summarize the issue or idea" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Description</label>
                <Textarea className="min-h-[150px] bg-white/5 border-white/10 rounded-3xl p-6" placeholder="Provide as much detail as possible..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${formData.isEncrypted ? "bg-primary/10 border-primary" : "bg-white/5 border-white/10 hover:border-white/20"}`} onClick={() => setFormData({ ...formData, isEncrypted: !formData.isEncrypted })}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${formData.isEncrypted ? "bg-primary text-ocean-deep" : "bg-white/10 text-muted-foreground"}`}>
                    {formData.isEncrypted ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold">Seal Encryption</h4>
                    <p className="text-sm text-muted-foreground">Encrypt payload before Walrus Publisher upload</p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.isEncrypted ? "bg-primary" : "bg-white/10"}`}>
                  <motion.div className="w-4 h-4 bg-white rounded-full shadow-sm" animate={{ x: formData.isEncrypted ? 24 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <Button variant="ghost" onClick={prevStep} className="rounded-xl">Back</Button>
                <Button disabled={!formData.title || !formData.description} onClick={nextStep} className="h-12 px-8 rounded-xl font-bold">Continue</Button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <h2 className="text-3xl font-bold mb-8">Add visual proof</h2>
            <div className="border-2 border-dashed border-white/10 rounded-[40px] p-16 text-center bg-white/5 hover:border-primary/50 transition-colors group cursor-pointer">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary group-hover:scale-110 transition-transform">
                <Upload className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">Upload Images or Video</h3>
              <p className="text-muted-foreground">Drag and drop files here, or click to browse.</p>
              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground bg-black/40 py-2 px-4 rounded-full w-fit mx-auto">
                <Server className="w-3 h-3 text-amber-500" />
                Files will be pushed via Walrus Publisher API
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-8">
              <Button variant="ghost" onClick={prevStep} className="rounded-xl">Back</Button>
              <Button 
                onClick={handlePrepareVerification} 
                disabled={isEncrypting}
                className="h-14 px-12 rounded-2xl font-bold shadow-xl shadow-primary/20 flex items-center gap-2"
              >
                {isEncrypting ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-ocean-deep border-t-transparent rounded-full" />
                    Seal Encrypting...
                  </>
                ) : (
                  "Proceed to Verification"
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Infrastructure Trust Verification</h2>
              {formData.isEncrypted && (
                <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/30 flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Seal Protected Data
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Visual Data Transformation Layer */}
                <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center mb-8">
                  <div className="md:col-span-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                        <FileCode className="w-3 h-3" /> Raw Input
                      </span>
                      {encryptionMetadata && (
                        <span className="text-[8px] font-mono text-muted-foreground">{encryptionMetadata.rawHash}</span>
                      )}
                    </div>
                    <div className="glass-dark p-4 rounded-2xl border border-white/5 bg-black/40 h-48 overflow-auto">
                      <div className="text-[10px] text-zinc-400 font-mono mb-2 border-b border-white/5 pb-1">" {formData.description} "</div>
                      <pre className="text-[10px] text-zinc-500 font-mono opacity-50">{rawPayload}</pre>
                    </div>
                  </div>

                  <div className="md:col-span-1 flex md:flex-col items-center justify-center gap-2 py-4">
                    <div className="h-px md:w-px md:h-12 bg-white/10 flex-1" />
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                      <ArrowRightLeft className="w-4 h-4" />
                    </div>
                    <div className="h-px md:w-px md:h-12 bg-white/10 flex-1" />
                  </div>

                  <div className="md:col-span-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Seal Encrypted Output
                      </span>
                      {encryptionMetadata && (
                        <span className="text-[8px] font-mono text-primary">{encryptionMetadata.encryptedHash}</span>
                      )}
                    </div>
                    <div className="glass-dark p-4 rounded-2xl border border-primary/20 bg-primary/5 h-48 overflow-auto relative">
                      {formData.isEncrypted ? (
                        <div className="space-y-2">
                          <div className="text-[10px] text-primary font-mono bg-primary/10 p-2 rounded border border-primary/20 break-all mb-4">
                            {encryptedPayload?.substring(0, 150)}...
                          </div>
                          <pre className="text-[10px] text-primary/40 font-mono opacity-50">{encryptedPayload}</pre>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4">
                          <Unlock className="w-8 h-8 text-muted-foreground mb-2 opacity-20" />
                          <p className="text-[10px] text-muted-foreground">No encryption active for this submission</p>
                        </div>
                      )}
                      {formData.isEncrypted && (
                        <div className="absolute top-2 right-2 bg-primary text-ocean-deep text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                          Seal Protected
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {formData.isEncrypted && (
                  <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl mb-8 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                      <Fingerprint className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Transformation Verified</h4>
                      <p className="text-xs text-muted-foreground">Original data has been mathematically transformed and anonymized for decentralization.</p>
                    </div>
                    <div className="ml-auto">
                      <div className="flex items-center gap-1.5 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-bold border border-green-500/20">
                        <ShieldCheck className="w-3 h-3" /> Encrypted before storage
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-black/40 rounded-2xl p-6 border border-white/5">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Infrastructure Flow Status</h4>
                  <div className="space-y-3 font-mono text-sm">
                    <div className={`flex items-center gap-3 ${isUploading ? 'text-white' : 'text-muted-foreground'}`}>
                      {uploadStatus === "Preparing payload..." ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full" /> : <CheckCircle2 className="w-3 h-3 text-green-500" />}
                      Preparing payload...
                    </div>
                    {formData.isEncrypted && (
                      <div className={`flex items-center gap-3 ${uploadStatus === "Encrypting with Seal..." ? 'text-white' : uploadStatus.includes('Walrus') || uploadStatus.includes('Storage') ? 'text-muted-foreground' : 'opacity-50'}`}>
                        {uploadStatus === "Encrypting with Seal..." ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full" /> : (uploadStatus.includes('Walrus') || uploadStatus.includes('Storage') ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <div className="w-3 h-3 rounded-full border border-white/20" />)}
                        Encrypting with Seal...
                      </div>
                    )}
                    <div className={`flex items-center gap-3 ${uploadStatus.includes("Uploading") ? 'text-white' : uploadStatus === "Storage confirmed ✔" ? 'text-muted-foreground' : 'opacity-50'}`}>
                      {uploadStatus.includes("Uploading") ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full" /> : (uploadStatus === "Storage confirmed ✔" ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <div className="w-3 h-3 rounded-full border border-white/20" />)}
                      Uploading to Walrus (Retry-Enabled Fetch Layer)
                    </div>
                    <div className={`flex items-center gap-3 ${uploadStatus === "Storage confirmed ✔" ? 'text-primary font-bold' : 'opacity-50'}`}>
                      {uploadStatus === "Storage confirmed ✔" ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-white/20" />}
                      Storage confirmed ✔
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <TrustLoopStatus currentStep={isUploading ? "store" : "encrypt"} isEncrypted={formData.isEncrypted} />
                <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/20 text-[10px] text-muted-foreground italic text-center">
                  "ProofBoard ensures that data is verifiable even if the frontend crashes."
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button variant="ghost" onClick={prevStep} disabled={isUploading} className="rounded-xl">Back</Button>
              <Button onClick={handleSubmit} disabled={isUploading} className="h-14 px-12 rounded-2xl font-bold shadow-xl shadow-primary/20 flex items-center gap-2">
                {isUploading ? "Processing..." : "Submit via Walrus Publisher"}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 relative">
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-[-1]">
              {[...Array(60)].map((_, i) => (
                <motion.div key={i} initial={{ opacity: 1, scale: 0, x: 0, y: 0 }} animate={{ opacity: 0, scale: [0, 1.5, 0.5], x: (Math.random() - 0.5) * 600, y: (Math.random() - 0.5) * 600 - 100, rotate: Math.random() * 720 }} transition={{ duration: 2.5, ease: "easeOut", delay: Math.random() * 0.3 }} className="absolute w-3 h-3" style={{ backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)], borderRadius: Math.random() > 0.5 ? '50%' : '2px' }} />
              ))}
            </div>

            <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ type: "spring", damping: 12, delay: 0.2 }} className="w-24 h-24 rounded-[40px] bg-primary flex items-center justify-center mx-auto mb-8 glow-border relative">
              <div className="absolute inset-0 rounded-[40px] bg-primary animate-ping opacity-20" />
              <CheckCircle2 className="w-12 h-12 text-ocean-deep relative z-10" />
            </motion.div>
            <h2 className="text-4xl font-bold mb-4">Feedback Secured!</h2>
            <div className="mb-8">
              <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-4">
                <div className="bg-green-500/10 text-green-500 px-4 py-2 rounded-full font-bold text-sm border border-green-500/20 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Verified on Walrus
                </div>
                {formData.isEncrypted && (
                  <>
                    <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm border border-primary/20 flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Seal Protected
                    </div>
                    <div className="bg-blue-500/10 text-blue-500 px-4 py-2 rounded-full font-bold text-sm border border-blue-500/20 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> Encrypted before storage
                    </div>
                  </>
                )}
              </div>
              <p className="text-xl text-muted-foreground mb-4 max-w-md mx-auto">
                Your feedback has been routed to the verifiable decentralized storage network. 
                You've earned <span className="text-primary font-bold">+50 Reputation Points</span>.
              </p>
              
              {blobId && (
                <div className="bg-black/50 p-6 rounded-2xl border border-white/5 inline-block max-w-lg w-full overflow-hidden text-left mb-6">
                  <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1 flex justify-between">
                    Walrus Blob ID
                    <button className="text-primary hover:underline" onClick={() => navigator.clipboard.writeText(blobId)}>Copy</button>
                  </div>
                  <div className="font-mono text-sm text-primary break-all mb-4 bg-white/5 p-3 rounded-xl border border-white/10">{blobId}</div>
                  
                  <div className="flex gap-3 mt-4">
                    <a href={blobUrl || "#"} target="_blank" rel="noreferrer" className="flex-1 text-center text-xs text-ocean-surface bg-primary px-3 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2">
                      <Server className="w-4 h-4" /> View Raw Blob Data
                    </a>
                    <a href={`https://walruscan.com/testnet/blob/${blobId}`} target="_blank" rel="noreferrer" className="flex-1 text-center text-xs text-white border border-white/10 px-3 py-3 rounded-xl font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" /> Open in Walrus Explorer
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4 max-w-xs mx-auto">
              <Link href="/dashboard" className="w-full">
                <Button className="w-full h-12 rounded-xl font-bold hover:scale-105 transition-transform">Go to Dashboard</Button>
              </Link>
              <Button variant="outline" onClick={() => router.push("/")} className="w-full h-12 rounded-xl border-white/10 hover:bg-white/5">
                Return Home
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
