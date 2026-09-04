"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { compareArticles } from "../services/api";
import { HiOutlineScale, HiOutlineLink, HiOutlineExclamationCircle, HiOutlineArrowRight } from "react-icons/hi";

export default function SourceComparison() {
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCompare = async () => {
    if (!url1.trim() || !url2.trim()) {
      setError("Please provide both article URLs to compare.");
      return;
    }

    setIsLoading(true);
    setResults(null);
    setError("");

    try {
      const response = await compareArticles(url1.trim(), url2.trim());
      setResults(response);
    } catch (err) {
      setError(err?.message || "Comparison failed. Please check the URLs and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-10 md:space-y-12 animate-in fade-in duration-1000 pb-16 sm:pb-24">
      
      {/* Header */}
      <div className="border-b border-[#fdf8f5]/10 pb-6 sm:pb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-8">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-[#fdf8f5] flex items-center gap-3 sm:gap-5 uppercase italic">
              <HiOutlineScale className="w-8 sm:w-12 h-8 sm:h-12 text-[#fdf8f5] shadow-2xl shrink-0" />
              Source Delta Analysis
            </h2>
            <p className="text-[#8d7b68] text-[9px] sm:text-[10px] mt-2 sm:mt-4 font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] italic underline decoration-[#fdf8f5]/10">Quantify narrative divergence between distinct news entities.</p>
          </div>
          <div className="flex gap-4 self-start md:self-end">
             <span className="px-4 sm:px-6 py-1.5 sm:py-2.5 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 text-[#d6c2b8] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] italic">0xDelta Mode</span>
          </div>
      </div>

      {/* Control Card */}
       <motion.div 
          className="saas-card p-5 sm:p-8 md:p-12 bg-[#261a14]/60 border-[#fdf8f5]/10 relative overflow-hidden rounded-none shadow-2xl group"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
       >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-[#fdf8f5] shadow-[0_0_20px_rgba(253,248,245,0.4)]" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
              <div className="space-y-3 sm:space-y-4">
                  <label className="text-[9px] sm:text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.25em] sm:tracking-[0.3em] italic">Target Vector Alpha</label>
                  <div className="relative group/input">
                      <HiOutlineLink className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-[#4d3c2e] group-focus-within/input:text-[#fdf8f5] transition-colors w-4 sm:w-5 h-4 sm:h-5" />
                      <input
                        value={url1}
                        onChange={(e) => setUrl1(e.target.value)}
                        placeholder="PRIMARY ARTICLE URL..."
                        className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 bg-[#1a0f0a] border border-[#fdf8f5]/10 rounded-none text-[11px] sm:text-xs font-black uppercase tracking-widest focus:border-[#fdf8f5] outline-none transition-all text-[#fdf8f5] placeholder:text-[#4d3c2e] italic"
                      />
                  </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                  <label className="text-[9px] sm:text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.25em] sm:tracking-[0.3em] italic">Target Vector Beta</label>
                  <div className="relative group/input">
                      <HiOutlineLink className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-[#4d3c2e] group-focus-within/input:text-[#fdf8f5] transition-colors w-4 sm:w-5 h-4 sm:h-5" />
                      <input
                        value={url2}
                        onChange={(e) => setUrl2(e.target.value)}
                        placeholder="COMPARISON ARTICLE URL..."
                        className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 bg-[#1a0f0a] border border-[#fdf8f5]/10 rounded-none text-[11px] sm:text-xs font-black uppercase tracking-widest focus:border-[#fdf8f5] outline-none transition-all text-[#fdf8f5] placeholder:text-[#4d3c2e] italic"
                      />
                  </div>
              </div>
          </div>

          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center gap-6 sm:gap-10 pt-6 sm:pt-12 border-t border-[#fdf8f5]/5">
              <button
                onClick={handleCompare}
                disabled={isLoading}
                className="btn-primary px-8 sm:px-12 py-4 sm:py-5 gap-3 sm:gap-4 w-full sm:w-auto shadow-2xl flex items-center justify-center italic text-[11px]"
              >
                {isLoading ? (
                    <>
                        <span className="w-5 h-5 border-2 border-[#1a0f0a]/30 border-t-[#1a0f0a] rounded-none animate-spin" />
                        SYNCHRONIZING...
                    </>
                ) : (
                    <>RUN COMPARATIVE AUDIT <HiOutlineArrowRight className="w-4 sm:w-5 h-4 sm:h-5" /></>
                )}
              </button>
              <p className="text-[9px] sm:text-[10px] font-black text-[#8d7b68] uppercase max-w-xs text-center sm:text-left leading-relaxed italic underline decoration-[#fdf8f5]/10">
                  Calculates absolute bias delta and linguistic framing divergence across multiple neural layers.
              </p>
          </div>
       </motion.div>

       {/* Results Display */}
       <AnimatePresence>
          {error && (
            <motion.div 
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               className="p-5 sm:p-8 glass-card bg-[#fdf8f5]/5 border border-[#fdf8f5]/20 text-[#fdf8f5] flex items-center gap-4 sm:gap-6 rounded-none shadow-2xl"
            >
               <HiOutlineExclamationCircle className="w-8 sm:w-10 h-8 sm:h-10 text-[#fdf8f5] animate-pulse shrink-0" />
               <span className="font-black text-[10px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] uppercase italic break-words">TERMINAL_FAULT: {error}</span>
            </motion.div>
          )}

          {results && (
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10"
            >
               {/* Delta summary - Top Wide Bento */}
               <div className="lg:col-span-12 glass-card p-6 sm:p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-10 bg-[#fdf8f5]/[0.02] border-[#fdf8f5]/10 shadow-2xl rounded-none relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#fdf8f5]/5 blur-[80px] group-hover:bg-[#fdf8f5]/10 transition-all duration-1000" />
                    <div>
                        <h3 className="text-2xl sm:text-3xl font-black text-[#fdf8f5] uppercase tracking-tighter italic">Narrative Divergence Score</h3>
                        <p className="text-[9px] sm:text-[10px] text-[#8d7b68] mt-2 sm:mt-3 font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] italic underline decoration-[#fdf8f5]/10">Cross-source misalignment magnitude.</p>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 border-t md:border-t-0 border-[#fdf8f5]/5 pt-4 md:pt-0">
                        <span className="text-4xl sm:text-6xl md:text-7xl font-black text-[#fdf8f5] italic tracking-tighter tabular-nums leading-tight">{results.bias_difference}</span>
                        <span className="text-[8px] sm:text-[9px] text-[#8d7b68] font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] italic">Absolute Delta Index</span>
                    </div>
               </div>

               {[
                 { label: "VECTOR_ALPHA", data: results.article_1, side: "left" },
                 { label: "VECTOR_BETA", data: results.article_2, side: "right" },
               ].map((item, idx) => (
                 <motion.div
                   key={idx}
                   className="lg:col-span-6 saas-card p-6 sm:p-8 md:p-10 group hover:border-[#fdf8f5]/30 transition-all bg-[#1a0f0a]/60 border-[#fdf8f5]/10 rounded-none shadow-2xl relative overflow-hidden"
                   initial={{ opacity: 0, x: item.side === "left" ? -30 : 30 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.2 + (idx * 0.1) }}
                 >
                    <div className="absolute top-0 left-0 w-2 h-full bg-[#fdf8f5]/5 group-hover:bg-[#fdf8f5]/20 transition-all" />
                    <div className="flex justify-between items-start mb-6 sm:mb-10 gap-4">
                        <div className="flex-1 min-w-0">
                            <span className="px-3 sm:px-5 py-1 sm:py-1.5 bg-[#fdf8f5]/5 text-[#fdf8f5] border border-[#fdf8f5]/10 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] italic">{item.label}</span>
                            <h2 className="mt-4 sm:mt-8 text-xl sm:text-2xl font-black text-[#fdf8f5] group-hover:italic transition-all leading-[0.95] uppercase tracking-tighter break-words">
                                {item.data.headline || "Untitled Intelligence Fragment"}
                            </h2>
                        </div>
                        <div className="text-right ml-2 sm:ml-6 shrink-0">
                            <p className="text-[8px] sm:text-[9px] font-black text-[#8d7b68] uppercase tracking-[0.2em] leading-none mb-1 sm:mb-2 italic">Index</p>
                            <p className="text-2xl sm:text-4xl font-black text-[#fdf8f5] tabular-nums italic tracking-tighter shadow-2xl">
                                {item.data.bias_score > 0 ? "+" : ""}{item.data.bias_score}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4 sm:space-y-6 pt-6 sm:pt-10 border-t border-[#fdf8f5]/5">
                        {[
                          { l: "Linguistic Divergence", v: item.data.linguistic_bias },
                          { l: "Framing Protocol", v: item.data.framing_bias },
                          { l: "Entity Salience", v: item.data.entity_bias },
                        ].map((stat, i) => (
                          <div key={i} className="flex items-center justify-between group/stat">
                             <span className="text-[9px] sm:text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.2em] sm:tracking-[0.25em] italic underline decoration-[#fdf8f5]/5 group-hover/stat:text-[#d6c2b8] transition-colors truncate">{stat.l}</span>
                             <span className="text-xs sm:text-sm font-black text-[#fdf8f5] tabular-nums tracking-widest group-hover/stat:scale-110 transition-transform origin-right shrink-0">{stat.v}</span>
                          </div>
                        ))}
                    </div>

                    <div className="mt-6 sm:mt-10 h-2 w-full bg-[#fdf8f5]/5 overflow-hidden border border-[#fdf8f5]/5">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.abs(item.data.bias_score)}%` }}
                            className={`h-full ${item.side === 'left' ? 'bg-gradient-to-r from-[#0EA5E9] to-[#3b82f6]' : 'bg-gradient-to-r from-[#f59e0b] to-[#F97316]'} shadow-[0_0_15px_rgba(253,248,245,0.4)]`}
                            transition={{ delay: 1, duration: 1.5 }}
                        />
                    </div>
                 </motion.div>
               ))}
            </motion.div>
          )}
       </AnimatePresence>

    </div>
  );
}

