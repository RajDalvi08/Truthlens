"use client"
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineDatabase, HiOutlineCloudUpload, HiOutlineCog, HiOutlineShare } from "react-icons/hi";
import { getDatasetStats } from "../services/analysisService";

export default function DatasetManager() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getDatasetStats();
        setDatasets(data);
      } catch (err) {
        console.error("Failed to load datasets:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] mesh-bg">
        <div className="w-12 h-12 border-4 border-[#fdf8f5] border-t-transparent rounded-none animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-24 mesh-bg">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#fdf8f5]/10 pb-12">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-[#fdf8f5] flex items-center gap-6 uppercase italic">
            <HiOutlineDatabase className="w-12 h-12 text-[#fdf8f5] shadow-2xl" />
            Dataset Management
          </h2>
          <p className="text-[#8d7b68] text-[10px] mt-4 font-black uppercase tracking-[0.25em] italic underline decoration-[#fdf8f5]/10 leading-relaxed">Curate foundational training sets and linguistic corpus fragments across the neural network.</p>
        </div>
        <button className="btn-primary flex items-center justify-center gap-4 px-10 py-5 text-[11px] shadow-2xl transition-all italic">
          <HiOutlineCloudUpload className="w-6 h-6" />
          Ingest New Corpus
        </button>
      </div>

      {/* Grid of Datasets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {datasets.map((ds) => (
          <motion.div 
            key={ds.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="saas-card group relative overflow-hidden flex flex-col justify-between bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-none shadow-2xl"
          >
             <div className="absolute top-0 right-0 w-48 h-48 bg-[#fdf8f5]/5 blur-[80px] group-hover:bg-[#fdf8f5]/10 transition-all duration-1000 pointer-events-none" />
             
             <div className="p-10">
                <div className="flex justify-between items-start mb-10">
                    <div className="w-16 h-16 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 rounded-none flex items-center justify-center text-[#fdf8f5] group-hover:bg-[#fdf8f5] group-hover:text-[#1a0f0a] transition-all">
                        <HiOutlineDatabase className="w-8 h-8" />
                    </div>
                    <span className="px-5 py-2 bg-[#fdf8f5]/5 text-[#fdf8f5] border border-[#fdf8f5]/20 text-[9px] font-black uppercase tracking-[0.3em] italic">
                      {ds.active ? "ACTIVE_NODE" : "ARCHIVE_NODE"}
                    </span>
                </div>
                
                <h3 className="text-3xl font-black text-[#fdf8f5] mb-4 uppercase italic tracking-tighter">{ds.name}</h3>
                <p className="text-[11px] text-[#d6c2b8] font-black uppercase tracking-tight mb-10 leading-snug opacity-80 italic">{ds.description}</p>
                
                <div className="flex flex-wrap items-center gap-10 text-[9px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 bg-[#fdf8f5] opacity-50" />
                        {ds.articles.toLocaleString()} ARTICLES
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 bg-[#fdf8f5] opacity-50" />
                        {ds.storage} STORAGE
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 bg-[#fdf8f5] opacity-50" />
                        {ds.version}
                    </div>
                </div>
             </div>

             <div className="p-6 bg-[#fdf8f5]/[0.02] border-t border-[#fdf8f5]/5 grid grid-cols-2 gap-6 relative z-10">
                <button className="flex items-center justify-center gap-4 py-4 text-[10px] font-black uppercase tracking-[0.25em] italic bg-[#1a0f0a] border border-[#fdf8f5]/10 text-[#8d7b68] hover:text-[#fdf8f5] hover:border-[#fdf8f5] transition-all rounded-none shadow-xl">
                    <HiOutlineCog className="w-5 h-5" />
                    Configure
                </button>
                <button className="flex items-center justify-center gap-4 py-4 text-[10px] font-black uppercase tracking-[0.25em] italic bg-[#1a0f0a] border border-[#fdf8f5]/10 text-[#8d7b68] hover:text-[#fdf8f5] hover:border-[#fdf8f5] transition-all rounded-none shadow-xl">
                    <HiOutlineShare className="w-5 h-5" />
                    Synchronize
                </button>
             </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
