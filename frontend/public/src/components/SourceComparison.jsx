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
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-24 mesh-bg">
      
      {/* Header */}
      <div className="border-b border-[#fdf8f5]/10 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="text-5xl font-black tracking-tighter text-[#fdf8f5] flex items-center gap-5 uppercase italic">
              <HiOutlineScale className="w-12 h-12 text-[#fdf8f5] shadow-2xl" />
              Compare News Sources
            </h2>
            <p className="text-[#8d7b68] text-[10px] mt-4 font-black uppercase tracking-[0.25em] italic underline decoration-[#fdf8f5]/10">Measure the difference in bias between two news outlets.</p>
          </div>
          <div className="flex gap-4">
             <span className="px-6 py-2.5 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 text-[#d6c2b8] text-[10px] font-black uppercase tracking-[0.3em] italic">0xDelta Mode</span>
          </div>
      </div>

      {/* Control Card */}
       <motion.div 
          className="saas-card p-12 bg-[#261a14]/60 border-[#fdf8f5]/10 relative overflow-hidden rounded-2xl shadow-2xl group"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
       >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-[#fdf8f5] shadow-[0_0_20px_rgba(253,248,245,0.4)]" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic">First Article</label>
                  <div className="relative group/input">
                      <HiOutlineLink className="absolute left-5 top-1/2 -translate-y-1/2 text-[#4d3c2e] group-focus-within/input:text-[#fdf8f5] transition-colors" />
                      <input
                        value={url1}
                        onChange={(e) => setUrl1(e.target.value)}
                        placeholder="PRIMARY ARTICLE URL..."
                        className="w-full pl-12 pr-6 py-4 bg-[#1a0f0a] border border-[#fdf8f5]/10 rounded-2xl text-xs font-black uppercase tracking-widest focus:border-[#fdf8f5] outline-none transition-all text-[#fdf8f5] placeholder:text-[#4d3c2e] italic"
                      />
                  </div>
              </div>
              <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic">Second Article</label>
                  <div className="relative group/input">
                      <HiOutlineLink className="absolute left-5 top-1/2 -translate-y-1/2 text-[#4d3c2e] group-focus-within/input:text-[#fdf8f5] transition-colors" />
                      <input
                        value={url2}
                        onChange={(e) => setUrl2(e.target.value)}
                        placeholder="COMPARISON ARTICLE URL..."
                        className="w-full pl-12 pr-6 py-4 bg-[#1a0f0a] border border-[#fdf8f5]/10 rounded-2xl text-xs font-black uppercase tracking-widest focus:border-[#fdf8f5] outline-none transition-all text-[#fdf8f5] placeholder:text-[#4d3c2e] italic"
                      />
                  </div>
              </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center gap-10 pt-12 border-t border-[#fdf8f5]/5">
              <button
                onClick={handleCompare}
                disabled={isLoading}
                className="btn-primary px-12 py-5 gap-4 w-full sm:w-auto shadow-2xl flex items-center justify-center italic"
              >
                {isLoading ? (
                    <>
                        <span className="w-5 h-5 border-3 border-[#1a0f0a]/30 border-t-[#1a0f0a] rounded-2xl animate-spin" />
                        COMPARING...
                    </>
                ) : (
                    <>COMPARE ARTICLES <HiOutlineArrowRight className="w-5 h-5" /></>
                )}
              </button>
              <p className="text-[10px] font-black text-[#8d7b68] uppercase max-w-xs text-center sm:text-left leading-relaxed italic underline decoration-[#fdf8f5]/10">
                  Calculates the difference in bias and linguistic framing between the two articles.
              </p>
          </div>
       </motion.div>

       {/* Results Display */}
       <AnimatePresence>
          {error && (
            <motion.div 
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               className="p-8 glass-card bg-[#fdf8f5]/5 border border-[#fdf8f5]/20 text-[#fdf8f5] flex items-center gap-6 rounded-2xl shadow-2xl"
            >
               <HiOutlineExclamationCircle className="w-10 h-10 text-[#fdf8f5] animate-pulse" />
               <span className="font-black text-[11px] tracking-[0.2em] uppercase italic">ERROR: {error}</span>
            </motion.div>
          )}

          {results && (
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="grid grid-cols-1 lg:grid-cols-12 gap-10"
            >
               {/* Delta summary - Top Wide Bento */}
               <div className="lg:col-span-12 glass-card p-12 flex flex-col md:flex-row md:items-center justify-between gap-10 bg-[#fdf8f5]/[0.02] border-[#fdf8f5]/10 shadow-2xl rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#fdf8f5]/5 blur-[80px] group-hover:bg-[#fdf8f5]/10 transition-all duration-1000" />
                    <div>
                        <h3 className="text-3xl font-black text-[#fdf8f5] uppercase tracking-tighter italic">Comparison Result</h3>
                        <p className="text-[10px] text-[#8d7b68] mt-3 font-black uppercase tracking-[0.25em] italic underline decoration-[#fdf8f5]/10">How different these stories are.</p>
                    </div>
                    <div className="flex items-end gap-5">
                        <span className="text-8xl font-black text-[#fdf8f5] italic tracking-tighter tabular-nums leading-none">{results.bias_difference}</span>
                        <span className="text-[11px] font-black text-[#8d7b68] mb-4 uppercase tracking-[0.3em] italic">Difference Score</span>
                    </div>
               </div>

               {[
                 { label: "ARTICLE 1", data: results.article_1, side: "left" },
                 { label: "ARTICLE 2", data: results.article_2, side: "right" },
               ].map((item, idx) => (
                 <motion.div
                   key={idx}
                   className="lg:col-span-6 saas-card p-10 group hover:border-[#fdf8f5]/30 transition-all bg-[#1a0f0a]/60 border-[#fdf8f5]/10 rounded-2xl shadow-2xl relative overflow-hidden"
                   initial={{ opacity: 0, x: item.side === "left" ? -30 : 30 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.2 + (idx * 0.1) }}
                 >
                    <div className="absolute top-0 left-0 w-2 h-full bg-[#fdf8f5]/5 group-hover:bg-[#fdf8f5]/20 transition-all" />
                    <div className="flex justify-between items-start mb-10">
                        <div className="flex-1">
                            <span className="px-5 py-1.5 bg-[#fdf8f5]/5 text-[#fdf8f5] border border-[#fdf8f5]/10 text-[9px] font-black uppercase tracking-[0.3em] italic">{item.label}</span>
                            <h2 className="mt-8 text-2xl font-black text-[#fdf8f5] group-hover:italic transition-all leading-[0.95] uppercase tracking-tighter">
                                {item.data.headline || "News Article"}
                            </h2>
                        </div>
                        <div className="text-right ml-6">
                            <p className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] leading-none mb-3 italic">Score</p>
                            <p className="text-5xl font-black text-[#fdf8f5] tabular-nums italic tracking-tighter shadow-2xl">
                                {item.data.bias_score > 0 ? "+" : ""}{item.data.bias_score}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6 pt-10 border-t border-[#fdf8f5]/5">
                        {[
                          { l: "Language Difference", v: item.data.linguistic_bias },
                          { l: "Topic Difference", v: item.data.framing_bias },
                          { l: "Key Figures", v: item.data.entity_bias },
                        ].map((stat, i) => (
                          <div key={i} className="flex items-center justify-between group/stat">
                             <span className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.25em] italic underline decoration-[#fdf8f5]/5 group-hover/stat:text-[#d6c2b8] transition-colors">{stat.l}</span>
                             <span className="text-sm font-black text-[#fdf8f5] tabular-nums tracking-widest group-hover/stat:scale-110 transition-transform origin-right">{stat.v}</span>
                          </div>
                        ))}
                    </div>

                    <div className="mt-10 h-2 w-full bg-[#fdf8f5]/5 overflow-hidden border border-[#fdf8f5]/5">
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
