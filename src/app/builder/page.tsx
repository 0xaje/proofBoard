"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Save, 
  Settings2, 
  GripVertical,
  Type,
  AlignLeft,
  ChevronDown,
  CheckSquare,
  Star,
  Link as LinkIcon,
  Upload,
  Eye,
  Database,
  ShieldCheck,
  Share2,
  Zap
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
import { FormSchema, FormField, FieldType } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

const FIELD_ICONS: Record<FieldType, any> = {
  text: Type,
  textarea: AlignLeft,
  select: ChevronDown,
  checkbox: CheckSquare,
  rating: Star,
  url: LinkIcon,
  file: Upload
};

export default function FormBuilderPage() {
  const [title, setTitle] = React.useState("Untitled Form");
  const [description, setDescription] = React.useState("");
  const [fields, setFields] = React.useState<FormField[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [savedFormId, setSavedFormId] = React.useState<string | null>(null);

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: uuidv4(),
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      placeholder: "",
      options: type === "select" || type === "checkbox" ? ["Option 1"] : undefined
    };
    setFields([...fields, newField]);
  };

  const loadTemplate = (type: "bug" | "grant") => {
    if (type === "bug") {
      setTitle("Walrus Bug Reporter");
      setDescription("Submit dynamic bug reports, screenshots, and system logs directly to the decentralized network.");
      setFields([
        {
          id: uuidv4(),
          type: "text",
          label: "Project Name",
          required: true,
          placeholder: "e.g., ProofBoard"
        },
        {
          id: uuidv4(),
          type: "select",
          label: "Issue Category",
          required: true,
          options: ["UI/UX Glitch", "Smart Contract Bug", "Aggregator Latency", "Other"]
        },
        {
          id: uuidv4(),
          type: "textarea",
          label: "Reproduction Steps",
          required: true,
          placeholder: "1. Navigate to builder\n2. Click publish..."
        },
        {
          id: uuidv4(),
          type: "rating",
          label: "Severity Rating",
          required: false
        },
        {
          id: uuidv4(),
          type: "url",
          label: "GitHub Issue Link",
          required: false,
          placeholder: "https://github.com/..."
        },
        {
          id: uuidv4(),
          type: "file",
          label: "Attach Screen Capture / Log File",
          required: false
        }
      ]);
      toast.success("Loaded Walrus Bug Reporter template!");
    } else if (type === "grant") {
      setTitle("Developer Grant Application");
      setDescription("Apply for community builder grants and anchor your milestones immutably.");
      setFields([
        {
          id: uuidv4(),
          type: "text",
          label: "Project Title",
          required: true,
          placeholder: "Enter the name of your dApp"
        },
        {
          id: uuidv4(),
          type: "textarea",
          label: "Detailed Proposal Summary",
          required: true,
          placeholder: "What are you building and why is it valuable?"
        },
        {
          id: uuidv4(),
          type: "select",
          label: "Requested Funding Tier",
          required: true,
          options: ["Micro Grant (< $5k)", "Community Grant ($5k - $15k)", "Core Grant (> $15k)"]
        },
        {
          id: uuidv4(),
          type: "url",
          label: "Team Portfolio / Github Repo",
          required: true,
          placeholder: "https://github.com/..."
        },
        {
          id: uuidv4(),
          type: "file",
          label: "Upload Full Proposal PDF",
          required: true
        }
      ]);
      toast.success("Loaded Developer Grant Application template!");
    }
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleSave = async () => {
    if (fields.length === 0) {
      toast.error("Please add at least one field.");
      return;
    }

    setIsSaving(true);
    const client = new WalrusPublisherClient({ network: "testnet" });

    const schema: FormSchema = {
      id: uuidv4(),
      title,
      description,
      fields,
      createdAt: new Date().toISOString(),
      owner: "User_1"
    };

    try {
      const result = await client.writeBlob({
        data: JSON.stringify(schema),
        contentType: "application/json"
      });

      setSavedFormId(result.blobId);
      
      const existing = JSON.parse(localStorage.getItem("proofboard_forms") || "[]");
      localStorage.setItem("proofboard_forms", JSON.stringify([...existing, { 
        id: result.blobId, 
        title, 
        createdAt: schema.createdAt,
        schema
      }]));

      toast.success("Form Schema Anchored to Walrus!");
    } catch (err: any) {
      toast.error("Failed to save form to Walrus.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const copyLink = () => {
    if (!savedFormId) return;
    const link = `${window.location.origin}/form/${savedFormId}`;
    navigator.clipboard.writeText(link);
    toast.success("Shareable Form Link copied!");
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Form Builder</h1>
            <p className="text-muted-foreground text-lg">Design Walrus-native surveys and feedback loops.</p>
          </div>
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            {savedFormId && (
               <Button variant="outline" onClick={copyLink} className="flex-1 lg:flex-none h-12 rounded-2xl gap-2 font-bold border-primary/20 text-primary">
                <Share2 className="w-4 h-4" /> Share
              </Button>
            )}
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flex-1 lg:flex-none h-12 bg-primary text-white rounded-2xl gap-2 font-bold px-8 shadow-lg shadow-primary/20"
            >
              {isSaving ? <Database className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Anchoring..." : "Publish to Walrus"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Toolbar */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
            <div className="premium-card p-6 space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">Input Fields</h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {(Object.keys(FIELD_ICONS) as FieldType[]).map((type) => {
                  const Icon = FIELD_ICONS[type];
                  return (
                    <button
                      key={type}
                      onClick={() => addField(type)}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all group text-left"
                    >
                      <div className="p-2 rounded-xl bg-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold capitalize">{type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="premium-card p-6 space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">Quick Templates</h3>
              <div className="space-y-3">
                <button
                  onClick={() => loadTemplate("bug")}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-primary/5 border border-primary/20 hover:border-primary hover:bg-primary/10 transition-all text-left group"
                >
                  <div className="p-2 rounded-xl bg-primary/15 text-primary">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Walrus Bug Reporter</p>
                    <p className="text-[9px] text-muted-foreground font-medium">Screenshots, ratings, links</p>
                  </div>
                </button>
                <button
                  onClick={() => loadTemplate("grant")}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="p-2 rounded-xl bg-white/10 text-muted-foreground group-hover:text-primary transition-colors">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Developer Grant</p>
                    <p className="text-[9px] text-muted-foreground font-medium">Files, tiers, descriptions</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Builder Canvas */}
          <div className="lg:col-span-9 space-y-8">
            <div className="premium-card p-8 md:p-12 space-y-10">
              <div className="space-y-6 pb-10 border-b border-white/5">
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-4xl md:text-5xl font-black bg-transparent border-none p-0 focus-visible:ring-0 h-auto tracking-tighter"
                  placeholder="Form Title"
                />
                <Textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-transparent border-none p-0 focus-visible:ring-0 resize-none min-h-[40px] text-xl text-muted-foreground leading-relaxed"
                  placeholder="Add a description for your respondents..."
                />
              </div>

              <div className="space-y-8">
                <AnimatePresence initial={false} mode="popLayout">
                  {fields.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-32 border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.02]"
                    >
                      <Plus className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
                      <p className="text-muted-foreground text-lg font-medium">Your canvas is empty. Add fields to begin.</p>
                    </motion.div>
                  ) : (
                    fields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group relative p-8 rounded-[32px] border border-white/5 bg-white/[0.03] hover:bg-white/[0.05] transition-all"
                      >
                        <div className="absolute left-0 top-8 bottom-8 w-1.5 bg-primary rounded-r-full opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                        <div className="flex flex-col md:flex-row items-start gap-6">
                          <div className="hidden md:flex cursor-grab p-2 text-muted-foreground/40 hover:text-white transition-colors">
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <div className="flex-1 w-full space-y-6">
                            <div className="flex items-center justify-between gap-4">
                              <Input 
                                value={field.label}
                                onChange={(e) => updateField(field.id, { label: e.target.value })}
                                className="bg-transparent border-none p-0 focus-visible:ring-0 font-bold text-xl h-auto w-full tracking-tight"
                                placeholder="Field Label"
                              />
                              <div className="flex items-center gap-4 shrink-0">
                                <div className="flex items-center gap-2">
                                  <Checkbox 
                                    id={`req-${field.id}`}
                                    checked={field.required}
                                    onCheckedChange={(checked) => updateField(field.id, { required: !!checked })}
                                    className="rounded-lg w-5 h-5"
                                  />
                                  <label htmlFor={`req-${field.id}`} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer select-none">Required</label>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => removeField(field.id)}
                                  className="h-10 w-10 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">Placeholder Text</Label>
                                <Input 
                                  value={field.placeholder}
                                  onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                  className="bg-black/40 border-white/10 h-12 text-sm rounded-2xl px-5 focus:border-primary/50 transition-all"
                                  placeholder="Helpful hint for users..."
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">Field Logic</Label>
                                <div className="h-12 flex items-center px-5 bg-white/5 rounded-2xl text-xs font-bold text-primary/80 border border-white/5">
                                  {field.type.toUpperCase()}
                                </div>
                              </div>
                            </div>

                            {(field.type === "select" || field.type === "checkbox") && (
                              <div className="space-y-4 pt-4 border-t border-white/5">
                                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Options List</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {field.options?.map((opt, oi) => (
                                    <div key={oi} className="flex gap-2 group/opt">
                                      <Input 
                                        value={opt}
                                        onChange={(e) => {
                                          const newOpts = [...(field.options || [])];
                                          newOpts[oi] = e.target.value;
                                          updateField(field.id, { options: newOpts });
                                        }}
                                        className="h-10 text-sm bg-black/20 border-white/5 rounded-xl px-4"
                                      />
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-10 w-10 opacity-0 group-opt/hover:opacity-100 hover:bg-red-500/10 text-red-500 rounded-xl transition-all"
                                        onClick={() => {
                                          const newOpts = field.options?.filter((_, idx) => idx !== oi);
                                          updateField(field.id, { options: newOpts });
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-10 border border-dashed border-white/10 rounded-xl gap-2 hover:bg-primary/10 hover:text-primary transition-all font-bold text-xs"
                                    onClick={() => updateField(field.id, { options: [...(field.options || []), `New Option`] })}
                                  >
                                    <Plus className="w-4 h-4" /> Add Option
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="premium-card p-10 flex flex-col md:flex-row items-center justify-between gap-8 bg-primary/[0.02] border-primary/20">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[24px] bg-primary/20 flex items-center justify-center text-primary shadow-2xl shadow-primary/20">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-bold">Immutable Deployment</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Your schema is anchored as a cryptographically verifiable blob on Walrus.</p>
                </div>
              </div>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="w-full md:w-auto h-16 px-12 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                Publish to Walrus
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
