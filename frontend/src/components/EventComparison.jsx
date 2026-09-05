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
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-10 md:space-y-12 animate-in fade-in duration-1000 pb-16 sm:pb-24">
      
      {/* Header */}
      <div className="border-b border-[#fdf8f5]/10 pb-6 sm:pb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-8">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-[#fdf8f5] flex items-center gap-3 sm:gap-6 uppercase italic">
              <HiOutlineCalendar className="w-8 sm:w-12 h-8 sm:h-12 text-[#fdf8f5] shadow-2xl shrink-0" />
              News Comparison
            </h2>
            <p className="text-[#8d7b68] text-[9px] sm:text-[10px] mt-2 sm:mt-4 font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] italic underline decoration-[#fdf8f5]/10 leading-relaxed">Compare how different news outlets cover the same story.</p>
          </div>
          <div className="px-4 sm:px-6 py-1.5 sm:py-2 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 text-[#d6c2b8] text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] italic self-start md:self-end">X-OUTLET_SYNC_V4</div>
      </div>

      {/* Discovery Input */}
      <motion.div 
          className="saas-card p-5 sm:p-8 md:p-12 bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-2xl shadow-2xl relative overflow-hidden group"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
      >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-[#fdf8f5] shadow-[0_0_20px_rgba(253,248,245,0.4)]" />
          
          <div className="max-w-4xl">
              <label className="text-[9px] sm:text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-4 sm:mb-6 block italic">Main Article URL</label>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="relative flex-1 group/input">
                      <HiOutlineLink className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-[#4d3c2e] group-focus-within/input:text-[#fdf8f5] transition-colors w-5 sm:w-6 h-5 sm:h-6" />
                      <input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="HTTPS://EXAMPLESITE.COM/NEWS-STORY..."
                        className="w-full pl-12 sm:pl-16 pr-4 sm:pr-8 py-3.5 sm:py-5 bg-[#1a0f0a] border border-[#fdf8f5]/10 rounded-none sm:rounded-2xl text-[11px] sm:text-xs font-black uppercase tracking-widest focus:border-[#fdf8f5] outline-none transition-all text-[#fdf8f5] placeholder:text-[#4d3c2e] italic shadow-2xl"
                      />
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="btn-primary px-8 sm:px-12 py-3.5 sm:py-5 gap-3 sm:gap-4 whitespace-nowrap w-full sm:w-auto shadow-2xl flex items-center justify-center italic text-[11px]"
                  >
                    {isLoading ? (
                        <>
                            <span className="w-5 h-5 border-2 border-[#1a0f0a]/30 border-t-[#1a0f0a] rounded-none animate-spin" />
                            COMPARING...
                        </>
                    ) : (
                        <>
                            <HiOutlineLightningBolt className="w-5 h-5" />
                            COMPARE STORY
                        </>
                    )}
                  </button>
              </div>
              <p className="text-[9px] sm:text-[10px] text-[#4d3c2e] mt-4 sm:mt-6 italic font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] opacity-60">The system will find related articles and show how they compare in terms of bias.</p>
          </div>
      </motion.div>

      {/* Results Section */}
       <AnimatePresence>
          {error && (
            <motion.div 
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               className="p-5 sm:p-8 glass-card border-[#fdf8f5]/20 bg-[#fdf8f5]/5 text-[#fdf8f5] flex items-center gap-4 sm:gap-6 rounded-2xl shadow-2xl"
            >
               <HiOutlineExclamationCircle className="w-8 sm:w-10 h-8 sm:h-10 text-[#fdf8f5] animate-pulse shrink-0" />
               <span className="font-black text-[10px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] uppercase italic underline decoration-[#fdf8f5]/10 break-words">CRITICAL_FAULT: {error}</span>
            </motion.div>
          )}

          {results && (
            <motion.div 
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6 sm:space-y-12"
            >
                {/* Event Summary Card */}
                <div className="glass-card p-5 sm:p-8 md:p-12 bg-[#fdf8f5]/[0.02] border-[#fdf8f5]/10 rounded-2xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#fdf8f5]/5 blur-[100px] pointer-events-none group-hover:bg-[#fdf8f5]/10 transition-all duration-1000" />
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 relative z-10">
                        <div className="w-14 sm:w-20 h-14 sm:h-20 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#fdf8f5] shadow-2xl shrink-0">
                            <HiOutlineServer className="w-7 sm:w-10 h-7 sm:h-10" />
                        </div>
                        <div>
                            <p className="text-[9px] sm:text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-2 sm:mb-4 font-mono italic underline decoration-[#fdf8f5]/10">News Story Found</p>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#fdf8f5] leading-[0.9] uppercase italic tracking-tighter group-hover:italic transition-all break-words">
                                {results.event || "Analyzed News Event"}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Article Comparisons Bento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                  {results.articles?.map((article, idx) => (
                    <motion.div 
                        key={idx}
                        className="saas-card p-5 sm:p-8 md:p-10 group hover:border-[#fdf8f5]/30 transition-all flex flex-col justify-between bg-[#1a0f0a]/60 border-[#fdf8f5]/10 rounded-2xl shadow-2xl relative overflow-hidden"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + (idx * 0.1) }}
                    >
                        <div className="absolute top-0 left-0 w-2 h-full bg-[#fdf8f5]/5 group-hover:bg-[#fdf8f5]/20 transition-all" />
                        <div>
                            <div className="flex justify-between items-start mb-6 sm:mb-10 gap-3">
                                <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-[#fdf8f5]/5 text-[#fdf8f5] border border-[#fdf8f5]/10 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] italic">{article.source || "Unknown Source"}</span>
                                <div className="text-right shrink-0">
                                    <p className="text-[8px] sm:text-[9px] font-black text-[#4d3c2e] uppercase mb-1 sm:mb-2 tracking-[0.2em] italic">Bias_Index</p>
                                    <p className="text-2xl sm:text-4xl font-black text-[#fdf8f5] tabular-nums italic tracking-tighter shadow-2xl">
                                        {article.bias_score > 0 ? "+" : ""}{article.bias_score}
                                    </p>
                                </div>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-[#fdf8f5] group-hover:italic transition-all leading-tight mb-6 sm:mb-12 uppercase tracking-tighter line-clamp-2">
                                {article.headline || "Related Article"}
                            </h3>
                        </div>

                        <div className="pt-6 sm:pt-10 border-t border-[#fdf8f5]/5">
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                {[
                                  { l: "Linguistic", v: article.linguistic_bias },
                                  { l: "Framing", v: article.framing_bias },
                                  { l: "Entity", v: article.entity_bias },
                                ].map((stat, i) => (
                                    <div key={i} className="group/stat">
                                       <p className="text-[8px] font-black text-[#8d7b68] uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-1.5 sm:mb-3 italic group-hover/stat:text-[#d6c2b8] transition-colors">{stat.l}</p>
                                       <div className="flex items-center gap-3">
                                          <p className="text-xs sm:text-sm font-black text-[#fdf8f5] tabular-nums tracking-widest">{stat.v}</p>
                                          <div className="flex-1 h-0.5 bg-[#fdf8f5]/5 rounded-2xl overflow-hidden">
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

