"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { compareEvent } from "../services/api";
import { HiOutlineCalendar, HiOutlineLink, HiOutlineExclamationCircle, HiOutlineLightningBolt, HiOutlineServer } from "react-icons/hi";

export default function EventComparison() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError("Please provide an article URL to compare across outlets.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResults(null);

    try {
      const response = await compareEvent(url.trim());
      setResults(response);
    } catch (err) {
      setError(err?.message || "Failed to analyze the event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-24 mesh-bg">
      
      {/* Header */}
      <div className="border-b border-[#fdf8f5]/10 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="text-5xl font-black tracking-tighter text-[#fdf8f5] flex items-center gap-6 uppercase italic">
              <HiOutlineCalendar className="w-12 h-12 text-[#fdf8f5] shadow-2xl" />
              Event Meridian
            </h2>
            <p className="text-[#8d7b68] text-[10px] mt-4 font-black uppercase tracking-[0.25em] italic underline decoration-[#fdf8f5]/10 leading-relaxed">Auto-retrieve and compare multi-source coverage of a single global event nexus.</p>
          </div>
          <div className="px-6 py-2 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 text-[#d6c2b8] text-[9px] font-black uppercase tracking-[0.3em] italic">X-OUTLET_SYNC_V4</div>
      </div>

      {/* Discovery Input */}
      <motion.div 
          className="saas-card p-12 bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-none shadow-2xl relative overflow-hidden group"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
      >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-[#fdf8f5] shadow-[0_0_20px_rgba(253,248,245,0.4)]" />
          
          <div className="max-w-4xl">
              <label className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] mb-6 block italic">Neural Anchor (Article URL Source)</label>
              <div className="flex flex-col sm:flex-row gap-6">
                  <div className="relative flex-1 group/input">
                      <HiOutlineLink className="absolute left-6 top-1/2 -translate-y-1/2 text-[#4d3c2e] group-focus-within/input:text-[#fdf8f5] transition-colors w-6 h-6" />
                      <input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="HTTPS://GLOBAL-INTEL.COM/EVENT-ANCHOR..."
                        className="w-full pl-16 pr-8 py-5 bg-[#1a0f0a] border border-[#fdf8f5]/10 rounded-none text-xs font-black uppercase tracking-widest focus:border-[#fdf8f5] outline-none transition-all text-[#fdf8f5] placeholder:text-[#4d3c2e] italic shadow-2xl"
                      />
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="btn-primary px-12 py-5 gap-4 whitespace-nowrap w-full sm:w-auto shadow-2xl flex items-center justify-center italic"
                  >
                    {isLoading ? (
                        <>
                            <span className="w-5 h-5 border-3 border-[#1a0f0a]/30 border-t-[#1a0f0a] rounded-none animate-spin" />
                            MAPPING...
                        </>
                    ) : (
                        <>
                            <HiOutlineLightningBolt className="w-5 h-5" />
                            EXECUTE EVENT SCAN
                        </>
                    )}
                  </button>
              </div>
              <p className="text-[10px] text-[#4d3c2e] mt-6 italic font-black uppercase tracking-[0.25em] opacity-60">Neural core will crawl global news nodes to identify correlating reports and narrative outliers.</p>
          </div>
      </motion.div>

      {/* Results Section */}
       <AnimatePresence>
          {error && (
            <motion.div 
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               className="p-8 glass-card border-[#fdf8f5]/20 bg-[#fdf8f5]/5 text-[#fdf8f5] flex items-center gap-6 rounded-none shadow-2xl"
            >
               <HiOutlineExclamationCircle className="w-10 h-10 text-[#fdf8f5] animate-pulse" />
               <span className="font-black text-[11px] tracking-[0.2em] uppercase italic underline decoration-[#fdf8f5]/10">CRITICAL_FAULT: {error}</span>
            </motion.div>
          )}

          {results && (
            <motion.div 
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-12"
            >
                {/* Event Summary Card */}
                <div className="glass-card p-12 bg-[#fdf8f5]/[0.02] border-[#fdf8f5]/10 rounded-none shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#fdf8f5]/5 blur-[100px] pointer-events-none group-hover:bg-[#fdf8f5]/10 transition-all duration-1000" />
                    <div className="flex items-start gap-8 relative z-10">
                        <div className="w-20 h-20 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 rounded-none flex items-center justify-center text-[#fdf8f5] shadow-2xl">
                            <HiOutlineServer className="w-10 h-10" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] mb-4 font-mono italic underline decoration-[#fdf8f5]/10">Nexus Core Identified</p>
                            <h2 className="text-4xl font-black text-[#fdf8f5] leading-[0.9] uppercase italic tracking-tighter group-hover:italic transition-all">
                                {results.event || "Unspecified Intelligence Vector 0xAlpha"}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Article Comparisons Bento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {results.articles?.map((article, idx) => (
                    <motion.div 
                        key={idx}
                        className="saas-card p-10 group hover:border-[#fdf8f5]/30 transition-all flex flex-col justify-between bg-[#1a0f0a]/60 border-[#fdf8f5]/10 rounded-none shadow-2xl relative overflow-hidden"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + (idx * 0.1) }}
                    >
                        <div className="absolute top-0 left-0 w-2 h-full bg-[#fdf8f5]/5 group-hover:bg-[#fdf8f5]/20 transition-all" />
                        <div>
                            <div className="flex justify-between items-start mb-10">
                                <span className="px-4 py-1.5 bg-[#fdf8f5]/5 text-[#fdf8f5] border border-[#fdf8f5]/10 text-[9px] font-black uppercase tracking-[0.3em] italic">{article.source || "Neural Node"}</span>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-[#4d3c2e] uppercase mb-2 tracking-[0.2em] italic">Bias_Index</p>
                                    <p className="text-4xl font-black text-[#fdf8f5] tabular-nums italic tracking-tighter shadow-2xl">
                                        {article.bias_score > 0 ? "+" : ""}{article.bias_score}
                                    </p>
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-[#fdf8f5] group-hover:italic transition-all leading-[0.9] mb-12 uppercase tracking-tighter">
                                {article.headline || "Correlated Data Fragment"}
                            </h3>
                        </div>

                        <div className="pt-10 border-t border-[#fdf8f5]/5">
                             <div className="grid grid-cols-3 gap-6">
                                {[
                                  { l: "Linguistic", v: article.linguistic_bias },
                                  { l: "Framing", v: article.framing_bias },
                                  { l: "Entity", v: article.entity_bias },
                                ].map((stat, i) => (
                                    <div key={i} className="group/stat">
                                       <p className="text-[8px] font-black text-[#8d7b68] uppercase tracking-[0.25em] mb-3 italic group-hover/stat:text-[#d6c2b8] transition-colors">{stat.l}</p>
                                       <div className="flex items-center gap-3">
                                          <p className="text-sm font-black text-[#fdf8f5] tabular-nums tracking-widest">{stat.v}</p>
                                          <div className="flex-1 h-0.5 bg-[#fdf8f5]/5 rounded-none overflow-hidden">
                                             <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(parseInt(stat.v)||50)}%` }}
                                                className={`h-full ${i === 0 ? 'bg-[#0EA5E9]' : i === 1 ? 'bg-[#8B5CF6]' : 'bg-[#10B981]'}`}
                                             />
                                          </div>
                                       </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </motion.div>
                  ))}
                </div>
            </motion.div>
          )}
       </AnimatePresence>

    </div>
  );
}
