"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Filter, MessageSquare, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const PROJECTS = [
  {
    id: "walrus-explorer",
    name: "Walrus Explorer",
    description: "The primary blob explorer for the Walrus Protocol. Search and view any blob stored on the network.",
    category: "Infrastructure",
    feedbackCount: 124,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop",
  },
  {
    id: "blob-drive",
    name: "BlobDrive",
    description: "Decentralized cloud storage powered by Walrus. Secure, permanent, and private file sharing.",
    category: "Storage",
    feedbackCount: 89,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1614850523296-e8c041de43a8?q=80&w=2940&auto=format&fit=crop",
  },
  {
    id: "decentra-chat",
    name: "DecentraChat",
    description: "End-to-end encrypted messaging app using Walrus for message history and media storage.",
    category: "Communication",
    feedbackCount: 56,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2940&auto=format&fit=crop",
  },
];

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Explore Projects</h1>
          <p className="text-muted-foreground">Help improve the Walrus ecosystem by providing high-quality feedback.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-10 bg-ocean-surface/50 border-white/10" placeholder="Search projects..." />
          </div>
          <Button variant="outline" className="gap-2 border-white/10">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="group glass-dark rounded-[32px] overflow-hidden border-white/5 hover:border-primary/30 transition-all flex flex-col"
          >
            <div className="h-48 overflow-hidden relative">
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white">
                {project.category}
              </div>
            </div>
            <div className="p-8 flex flex-1 flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">{project.name}</h3>
                <div className="flex items-center gap-1 text-primary">
                  <Star className="w-4 h-4 fill-primary" />
                  <span className="text-sm font-bold">{project.rating}</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-8 line-clamp-2 flex-1">
                {project.description}
              </p>
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="w-4 h-4" />
                  {project.feedbackCount} reports
                </div>
                <Link href={`/submit/${project.id}`}>
                  <Button className="rounded-xl gap-2 font-bold">
                    Feedback <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
