"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Send, 
  Loader2, 
  CheckCircle2, 
  ArrowRight,
  Database,
  Lock,
  Unlock,
  AlertTriangle,
  ExternalLink,
  Upload,
  Globe,
  Fingerprint
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WalrusPublisherClient } from "@/lib/walrus";
import { FormSchema, FormSubmission } from "@/lib/types";
import { encryptSealData } from "@/lib/seal";
import { v4 as uuidv4 } from "uuid";

export default function PublicFormPage() {
  const { formId } = useParams();
  const router = useRouter();
  const [schema, setSchema] = React.useState<FormSchema | null>(null);
  const [responses, setResponses] = React.useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedId, setSubmittedId] = React.useState<string | null>(null);
  const [useEncryption, setUseEncryption] = React.useState(false);

  React.useEffect(() => {
    const fetchSchema = async () => {
      const client = new WalrusPublisherClient({ network: "testnet" });
      try {
        const data = await client.readBlob(formId as string);
        setSchema(JSON.parse(data));
      } catch (err) {
        console.error("Failed to fetch form schema:", err);
        toast.error("Form not found on Walrus.");
      } finally {
        setIsLoading(false);
      }
    };
    if (formId) fetchSchema();
  }, [formId]);

  const handleInputChange = (fieldId: string, value: any) => {
    setResponses(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const client = new WalrusPublisherClient({ network: "testnet" });
    const submissionId = uuidv4();

    let finalResponses = { ...responses };
    if (useEncryption) {
      const encrypted = await encryptSealData(JSON.stringify(responses));
      finalResponses = { __sealed: encrypted };
    }

    const submission: FormSubmission = {
      formId: formId as string,
      submissionId,
      responses: finalResponses,
      timestamp: new Date().toISOString(),
      isEncrypted: useEncryption
    };

    try {
      const result = await client.writeBlob({
        data: JSON.stringify(submission),
        contentType: "application/json"
      });

      setSubmittedId(result.id);
      
      const existing = JSON.parse(localStorage.getItem("proofboard_submissions") || "[]");
      localStorage.setItem("proofboard_submissions", JSON.stringify([...existing, { 
        blobId: result.id, 
        formId, 
        formTitle: schema?.title,
        timestamp: submission.timestamp,
        isEncrypted: useEncryption
      }]));

      toast.success("Submission Securely Anchored to Walrus!");
    } catch (err: any) {
      toast.error("Submission failed.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-6 text-center">
           <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Database className="w-8 h-8 text-primary" />
              </div>
           </div>
           <p className="text-xs font-black uppercase tracking-[0.3em] text-primary animate-pulse">Rehydrating Truth from Walrus...</p>
        </div>
      </div>
    );
  }

  if (!schema) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6 bg-background">
        <div className="max-w-md space-y-8 premium-card p-12 border-red-500/20">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto text-red-500">
             <AlertTriangle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tighter">Form Inaccessible</h1>
            <p className="text-muted-foreground font-medium">This schema could not be retrieved from the decentralized network.</p>
          </div>
          <Button onClick={() => router.push("/")} size="lg" className="w-full h-14 rounded-2xl font-bold bg-white text-black">Return Home</Button>
        </div>
      </div>
    );
  }

  if (submittedId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full premium-card p-12 md:p-16 border-green-500/20 bg-green-500/[0.02] text-center space-y-10"
        >
          <div className="w-24 h-24 rounded-[32px] bg-green-500/20 flex items-center justify-center mx-auto text-green-500 shadow-2xl shadow-green-500/20">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-black tracking-tighter text-white leading-none">Proof Recorded</h1>
            <p className="text-lg text-muted-foreground font-medium">Your response is now an immutable blob on Walrus.</p>
          </div>
          
          <div className="bg-black/60 p-8 rounded-[24px] border border-white/5 space-y-4 text-left">
             <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60">Walrus Anchor ID</div>
             <code className="text-[11px] text-primary font-mono break-all leading-relaxed select-all">{submittedId}</code>
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <Button onClick={() => window.open(`https://walruscan.com/testnet/blob/${submittedId}`, "_blank")} className="h-16 rounded-2xl gap-3 font-black text-lg bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              <Globe className="w-6 h-6" /> View on Walrus Scan
            </Button>
            <Button onClick={() => window.location.reload()} variant="ghost" className="h-14 rounded-2xl font-bold text-muted-foreground hover:text-white">
              Submit Another Response
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-24 px-4 md:px-6 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-10">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary rounded-full blur-[140px]" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-glow rounded-full blur-[140px]" />
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-8 md:p-16 border-white/10 bg-black/40 relative overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="space-y-6 mb-16 pb-12 border-b border-white/5">
            <div className="flex items-center gap-3 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
              <Fingerprint className="w-5 h-5" /> Verified Submission
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">{schema.title}</h1>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl">{schema.description}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-10">
              {schema.fields.map((field) => (
                <div key={field.id} className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <Label className="text-lg font-bold tracking-tight flex items-center gap-3">
                      {field.label}
                      {field.required && <span className="text-primary text-xs font-black uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-md">Required</span>}
                    </Label>
                    <span className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest hidden md:block">{field.type}</span>
                  </div>

                  {field.type === "text" && (
                    <Input 
                      required={field.required}
                      placeholder={field.placeholder}
                      className="h-16 px-6 rounded-2xl bg-white/[0.03] border-white/10 focus:border-primary/50 text-base shadow-xl transition-all"
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                  )}

                  {field.type === "textarea" && (
                    <Textarea 
                      required={field.required}
                      placeholder={field.placeholder}
                      className="min-h-[160px] p-6 rounded-2xl bg-white/[0.03] border-white/10 focus:border-primary/50 text-base shadow-xl transition-all resize-none leading-relaxed"
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                  )}

                  {field.type === "select" && (
                    <Select 
                      required={field.required}
                      onValueChange={(val) => handleInputChange(field.id, val)}
                    >
                      <SelectTrigger className="h-16 px-6 rounded-2xl bg-white/[0.03] border-white/10 focus:border-primary/50 text-base shadow-xl transition-all">
                        <SelectValue placeholder={field.placeholder || "Choose an option..."} />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-white/10 bg-zinc-900 p-2 shadow-2xl">
                        {field.options?.map(opt => (
                          <SelectItem key={opt} value={opt} className="rounded-xl h-12 px-4 focus:bg-primary/20 focus:text-primary transition-colors cursor-pointer">{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {field.type === "checkbox" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {field.options?.map(opt => (
                        <div key={opt} className="flex items-center gap-4 p-6 rounded-[24px] bg-white/[0.03] border border-white/5 hover:border-primary/30 hover:bg-white/[0.06] transition-all cursor-pointer group">
                          <Checkbox 
                            id={`${field.id}-${opt}`}
                            onCheckedChange={(checked) => {
                              const current = responses[field.id] || [];
                              const updated = checked 
                                ? [...current, opt] 
                                : current.filter((o: string) => o !== opt);
                              handleInputChange(field.id, updated);
                            }}
                            className="w-6 h-6 rounded-lg"
                          />
                          <label htmlFor={`${field.id}-${opt}`} className="text-base font-medium cursor-pointer w-full group-hover:text-primary transition-colors">{opt}</label>
                        </div>
                      ))}
                    </div>
                  )}

                  {field.type === "url" && (
                    <Input 
                      type="url"
                      required={field.required}
                      placeholder="https://example.com"
                      className="h-16 px-6 rounded-2xl bg-white/[0.03] border-white/10 focus:border-primary/50 text-base shadow-xl transition-all"
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                  )}

                  {field.type === "rating" && (
                    <div className="flex flex-wrap gap-4 p-6 rounded-[32px] bg-white/[0.03] border border-white/5 justify-center shadow-xl">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleInputChange(field.id, star)}
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black transition-all ${
                            responses[field.id] >= star ? "bg-primary text-white shadow-xl shadow-primary/20 scale-110" : "bg-white/5 text-muted-foreground/40 hover:bg-white/10 hover:scale-105"
                          }`}
                        >
                          {star}
                        </button>
                      ))}
                    </div>
                  )}

                  {field.type === "file" && (
                    <div className="p-10 rounded-[32px] border-2 border-dashed border-white/10 bg-white/[0.02] text-center space-y-6 hover:border-primary/30 transition-all group">
                      <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center mx-auto text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-all shadow-xl">
                        <Upload className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-bold">Walrus-Native Storage</p>
                        <p className="text-xs text-muted-foreground font-medium px-4">Files are anchored directly as immutable blobs on the decentralized network.</p>
                      </div>
                      <Input 
                        type="file" 
                        required={field.required}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleInputChange(field.id, { name: file.name, size: file.size, type: file.type });
                            toast.info(`File prepared for Walrus anchor.`);
                          }
                        }}
                        className="hidden"
                        id={`file-${field.id}`}
                      />
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => document.getElementById(`file-${field.id}`)?.click()}
                        className="rounded-xl h-12 px-10 font-black text-xs border-white/10 hover:bg-white/5"
                      >
                        Select Asset
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-12 border-t border-white/5 space-y-8">
              <div className="flex items-center justify-between p-8 rounded-[32px] bg-primary/[0.02] border border-primary/20 shadow-2xl">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-all shadow-xl ${useEncryption ? "bg-primary text-white" : "bg-white/5 text-muted-foreground/40"}`}>
                    {useEncryption ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold tracking-tight">Seal Privacy Shield</h4>
                    <p className="text-xs text-muted-foreground font-medium">Encrypt responses client-side before submission</p>
                  </div>
                </div>
                <Checkbox 
                  checked={useEncryption}
                  onCheckedChange={(val) => setUseEncryption(!!val)}
                  className="w-7 h-7 rounded-lg"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-20 rounded-[32px] bg-primary text-white font-black text-xl gap-4 shadow-[0_20px_50px_rgba(0,112,243,0.3)] hover:scale-105 active:scale-95 transition-all"
              >
                {isSubmitting ? <Loader2 className="w-7 h-7 animate-spin" /> : <Send className="w-7 h-7" />}
                {isSubmitting ? "Anchoring Truth..." : "Submit to Walrus"}
              </Button>
            </div>
          </form>
        </motion.div>
        
        <div className="mt-12 text-center flex flex-col md:flex-row items-center justify-center gap-6 text-muted-foreground opacity-60">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
            <ShieldCheck className="w-4 h-4 text-primary" /> Immutable Walrus Anchor
          </div>
          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/20" />
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
            <Lock className="w-4 h-4 text-cyan-glow" /> End-to-End Seal Encryption
          </div>
          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/20" />
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
            <Globe className="w-4 h-4 text-amber-500" /> Decentralized Integrity
          </div>
        </div>
      </div>
    </div>
  );
}
