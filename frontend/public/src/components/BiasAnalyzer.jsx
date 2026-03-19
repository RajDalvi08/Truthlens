"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeArticle } from "../services/api";
import { HiOutlineSearch, HiOutlineLightningBolt, HiOutlineDocumentText, HiOutlineLink, HiOutlineExclamationCircle, HiOutlineCubeTransparent, HiOutlineChartSquareBar } from "react-icons/hi";

const SAMPLE_URLS = [
  "https://www.bbc.com/news/world-us-canada-66801944",
  "The city council voted unanimously to approve the new climate policy, while residents expressed mixed reactions about the potential economic impact.",
];

export default function BiasAnalyzer() {
  const [headline, setHeadline] = useState("");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!url.trim() && !text.trim()) {
      setError("Please provide either an Article URL or Article Text.");
      return;
    }

    setIsAnalyzing(true);
    setResults(null);
    setError("");

    try {
      const response = await analyzeArticle({
        url: url.trim(),
        headline: headline.trim(),
        text: text.trim()
      });
      console.log("API RESPONSE:", response);
      setResults(response);
    } catch (err) {
      setError(err?.message || "Failed to analyze the article. Please check your inputs and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSampleClick = (sample) => {
    if (sample.startsWith("http")) {
      setUrl(sample);
      setHeadline("");
      setText("");
    } else {
      setUrl("");
      setHeadline("Sample News Report");
      setText(sample);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-24 mesh-bg">
      
      {/* Dynamic Header */}
      <div className="flex items-end justify-between border-b border-[#fdf8f5]/10 pb-10 flex flex-col md:flex-row md:items-end gap-8">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-[#fdf8f5] uppercase italic">Bias Insight Engine</h2>
          <p className="text-[#8d7b68] text-[10px] mt-4 font-black uppercase tracking-[0.25em] italic underline decoration-[#fdf8f5]/10">Neural processing of semantic vectors and source authenticity.</p>
        </div>
        <div className="hidden md:flex items-center gap-6">
            <div className="w-2.5 h-2.5 rounded-none bg-[#fdf8f5] animate-pulse shadow-[0_0_12px_rgba(253,248,245,0.6)]" />
            <span className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic">CORE_STATUS: <span className="text-[#fdf8f5]">OPTIMIZED</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Input Control Center - Bento Left */}
          <div className="lg:col-span-12">
            <motion.div 
                className="saas-card group relative overflow-hidden bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-none shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#fdf8f5]/[0.02] blur-[100px] pointer-events-none group-hover:bg-[#fdf8f5]/[0.05] transition-all duration-1000" />
                
                <div className="p-12 border-b border-[#fdf8f5]/5 bg-[#fdf8f5]/[0.01]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Text Ingestion */}
                        <div className="space-y-8">
                            <div>
                                <label className="flex items-center gap-4 text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] mb-6 italic underline decoration-[#fdf8f5]/10">
                                    <HiOutlineDocumentText className="w-6 h-6 text-[#fdf8f5]" />
                                    Semantic Ingestion
                                </label>
                                <div className="space-y-5">
                                    <input
                                      type="text"
                                      value={headline}
                                      onChange={(e) => setHeadline(e.target.value)}
                                      placeholder="ARTICLE HEADLINE (OPTIONAL)..."
                                      className="w-full bg-[#1a0f0a] border border-[#fdf8f5]/10 px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] rounded-none outline-none focus:border-[#fdf8f5] transition-all text-[#fdf8f5] placeholder:text-[#4d3c2e] italic"
                                    />
                                    <textarea
                                      value={text}
                                      onChange={(e) => setText(e.target.value)}
                                      placeholder="PASTE COMPLETE ARTICLE BODY HERE FOR FULL-SPECTRUM ANALYSIS..."
                                      rows={8}
                                      className="w-full bg-[#1a0f0a] border border-[#fdf8f5]/10 px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] rounded-none outline-none focus:border-[#fdf8f5] transition-all text-[#fdf8f5] placeholder:text-[#4d3c2e] italic resize-none leading-relaxed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* URL & Source Retrieval */}
                        <div className="space-y-10 flex flex-col justify-between">
                            <div>
                                <label className="flex items-center gap-4 text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] mb-6 italic underline decoration-[#fdf8f5]/10">
                                    <HiOutlineLink className="w-6 h-6 text-[#fdf8f5]" />
                                    Source Automation
                                </label>
                                <div className="relative group/input">
                                    <HiOutlineLink className="absolute left-6 top-1/2 -translate-y-1/2 text-[#4d3c2e] group-focus-within/input:text-[#fdf8f5] transition-colors w-5 h-5" />
                                    <input
                                      type="text"
                                      value={url}
                                      onChange={(e) => setUrl(e.target.value)}
                                      placeholder="HTTPS://GLOBAL-INTEL.COM/NEWS-PATH..."
                                      className="w-full bg-[#1a0f0a] border border-[#fdf8f5]/10 pl-16 pr-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] rounded-none outline-none focus:border-[#fdf8f5] transition-all text-[#fdf8f5] placeholder:text-[#4d3c2e] italic shadow-2xl"
                                    />
                                </div>
                                <p className="text-[10px] text-[#4d3c2e] mt-4 italic font-black uppercase tracking-widest opacity-60">Scraped data vectors will automatically override manual text inputs.</p>
                            </div>

                            <div className="pt-10 border-t border-[#fdf8f5]/5">
                                <label className="text-[9px] font-black text-[#4d3c2e] uppercase mb-5 block tracking-[0.3em] italic">Engine Templates</label>
                                <div className="flex flex-wrap gap-4">
                                    {SAMPLE_URLS.map((sample, i) => (
                                      <button
                                        key={i}
                                        onClick={() => handleSampleClick(sample)}
                                        className="flex-1 text-[10px] py-3.5 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 text-[#8d7b68] hover:bg-[#fdf8f5]/10 hover:border-[#fdf8f5]/30 rounded-none transition-all uppercase font-black italic tracking-[0.25em]"
                                      >
                                        Template {i + 1}
                                      </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-10 mt-14 pt-12 border-t border-[#fdf8f5]/10">
                        <button
                           onClick={handleAnalyze}
                           disabled={(!url.trim() && !text.trim()) || isAnalyzing}
                           className="btn-primary flex items-center justify-center gap-4 px-14 py-6 text-[11px] w-full sm:w-auto shadow-2xl transition-all disabled:opacity-50"
                        >
                           {isAnalyzing ? (
                             <>
                               <span className="w-6 h-6 border-3 border-[#1a0f0a]/30 border-t-[#1a0f0a] rounded-none animate-spin" />
                               INGESTING_VECTORS...
                             </>
                           ) : (
                             <>
                                <HiOutlineLightningBolt className="w-6 h-6" />
                                EXECUTE INTELLIGENCE AUDIT
                             </>
                           )}
                        </button>
                        <div className="flex items-center gap-6">
                            <div className="h-12 w-px bg-[#fdf8f5]/10 hidden sm:block" />
                            <div className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] leading-relaxed italic">
                                TruthLens Neural Core v4.2<br/>
                                <span className="text-[#fdf8f5] opacity-50">STATUS: AWAITING_INJECTION</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analysis Output Pane */}
                <div className="p-12 min-h-[350px] flex items-center justify-center bg-[#fdf8f5]/[0.01] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
                    <AnimatePresence mode="wait">
                        {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-8 p-10 glass-card border-[#fdf8f5]/20 bg-[#fdf8f5]/5 text-[#fdf8f5] rounded-none shadow-2xl relative z-10"
                        >
                            <HiOutlineExclamationCircle className="w-12 h-12 text-[#fdf8f5] animate-pulse" />
                            <div>
                                <h4 className="font-black uppercase tracking-[0.4em] text-[10px] mb-2 italic">Critical Fault Detected</h4>
                                <p className="text-sm font-black italic tracking-tighter bg-[#fdf8f5] text-[#1a0f0a] px-3 py-1">{error}</p>
                            </div>
                        </motion.div>
                        )}

                        {results ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10"
                        >
                            {/* Result Stats - Left Cluster */}
                            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="glass-card p-8 bg-[#1a0f0a]/60 border-[#fdf8f5]/10 group rounded-none shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#fdf8f5]/5 blur-[60px]" />
                                    <p className="text-[9px] font-black text-[#8d7b68] uppercase tracking-[0.3em] mb-4 italic underline decoration-[#fdf8f5]/10">Sentiment Polarity</p>
                                    <div className="text-6xl font-black text-[#fdf8f5] mb-2 italic tracking-tighter tabular-nums leading-none">{results.bias_score}</div>
                                    <div className="text-[10px] font-black text-[#fdf8f5] uppercase tracking-[0.25em] mb-8 italic opacity-80">{results.bias_level}</div>
                                    <div className="h-2 w-full bg-[#fdf8f5]/5 rounded-none overflow-hidden relative border border-[#fdf8f5]/5 shadow-inner">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.abs(results.bias_score)}%` }}
                                            className="h-full bg-gradient-to-r from-[#F97316] to-[#EC4899] shadow-[0_0_20px_rgba(236,72,153,0.4)]" 
                                            transition={{ duration: 2, ease: "easeOut" }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-4 text-[8px] font-black text-[#4d3c2e] tracking-[0.3em] uppercase">
                                        <span>Left Vector</span>
                                        <span>Right Vector</span>
                                    </div>
                                </div>

                                <div className="glass-card p-8 md:col-span-2 flex flex-col justify-between bg-[#1a0f0a]/40 border-[#fdf8f5]/10 rounded-none shadow-2xl relative overflow-hidden">
                                     <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#fdf8f5]/10" />
                                    <p className="text-[9px] font-black text-[#8d7b68] uppercase tracking-[0.3em] mb-6 italic underline decoration-[#fdf8f5]/10">Neural Decomposition Protocols</p>
                                    <div className="space-y-6">
                                        {[
                                            { label: "Linguistic Framing", value: results.linguistic_bias, color: "bg-[#0EA5E9]", shadow: "shadow-[0_0_12px_rgba(14,165,233,0.4)]" },
                                            { label: "Predictive Weighting", value: results.framing_bias, color: "bg-[#8B5CF6]", shadow: "shadow-[0_0_12px_rgba(139,92,246,0.3)]" },
                                            { label: "Entity Salience", value: results.entity_bias, color: "bg-[#10B981]", shadow: "shadow-[0_0_12px_rgba(16,185,129,0.3)]" },
                                        ].map((metric, i) => (
                                            <div key={i} className="space-y-3 group/metric">
                                                <div className="flex justify-between items-center text-[9px] font-black text-[#8d7b68] uppercase tracking-[0.2em] italic group-hover/metric:text-[#fdf8f5] transition-colors">
                                                    <span>{metric.label}</span>
                                                    <span className="text-[#fdf8f5] tabular-nums tracking-widest">{metric.value}</span>
                                                </div>
                                                <div className="h-[1px] w-full bg-[#fdf8f5]/5 rounded-none overflow-hidden relative">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(parseFloat(metric.value) * 100) || 50}%` }}
                                                        className={`h-full ${metric.color} ${metric.shadow}`}
                                                        transition={{ delay: 0.8 + (i*0.2), duration: 1.5 }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Metadata Pane - Right Cluster */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="glass-card p-8 h-full flex flex-col justify-between bg-[#fdf8f5]/[0.02] border-[#fdf8f5]/10 rounded-none shadow-2xl relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#fdf8f5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                    <div>
                                        <p className="text-[9px] font-black text-[#8d7b68] uppercase tracking-[0.3em] mb-6 italic underline decoration-[#fdf8f5]/10">Source Pulse Signature</p>
                                        <div className="p-4 bg-[#1a0f0a] rounded-none border border-[#fdf8f5]/10 shadow-2xl relative z-10">
                                            <p className="text-sm font-black text-[#fdf8f5] break-words italic tracking-tighter uppercase leading-tight">
                                                {results.source || "SYNTHETIC_TEXT_AGENT"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Entities & Explanation Row */}
                            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
                                {/* Entities */}
                                <div className="glass-card p-10 bg-[#1a0f0a]/60 border-[#fdf8f5]/10 rounded-none shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#10B981]/5 blur-[80px] group-hover:bg-[#10B981]/10 transition-colors duration-1000" />
                                    <h3 className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.4em] mb-10 italic underline decoration-[#fdf8f5]/10">Neural Entity Salience</h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <p className="text-[9px] font-black text-[#fdf8f5] uppercase tracking-[0.2em] italic opacity-80 border-l-2 border-[#fdf8f5]/20 pl-4 mb-6">Subject:_Personae</p>
                                            <div className="p-4 bg-[#1a0f0a] border border-[#fdf8f5]/5">
                                                <p className="text-[11px] font-black text-[#fdf8f5] uppercase tracking-[0.15em] italic leading-relaxed">
                                                    {results.entities?.persons?.length > 0 
                                                        ? results.entities.persons.join(", ") 
                                                        : "NULL_DETECTION"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <p className="text-[9px] font-black text-[#fdf8f5] uppercase tracking-[0.2em] italic opacity-80 border-l-2 border-[#fdf8f5]/20 pl-4 mb-6">Subject:_Organization</p>
                                            <div className="p-4 bg-[#1a0f0a] border border-[#fdf8f5]/5">
                                                <p className="text-[11px] font-black text-[#fdf8f5] uppercase tracking-[0.15em] italic leading-relaxed">
                                                    {results.entities?.organizations?.length > 0 
                                                        ? results.entities.organizations.join(", ") 
                                                        : "NULL_DETECTION"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Explanation */}
                                <div className="glass-card p-10 bg-[#1a0f0a]/60 border-[#fdf8f5]/10 rounded-none shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#0EA5E9]/5 blur-[80px] group-hover:bg-[#0EA5E9]/10 transition-colors duration-1000" />
                                    <h3 className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.4em] mb-10 italic underline decoration-[#fdf8f5]/10">Logic_Trace Analysis</h3>
                                    
                                    <div className="space-y-4">
                                        {results.explanation?.length > 0 ? results.explanation.map((line, i) => (
                                            <motion.div 
                                                key={i} 
                                                initial={{ x: -10, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 1.2 + (i * 0.1) }}
                                                className="bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 p-5 text-[11px] font-black text-[#fdf8f5] uppercase tracking-[0.1em] italic leading-relaxed flex gap-4 items-start"
                                            >
                                                <span className="text-[#0EA5E9] font-black mt-0.5">»</span>
                                                {line}
                                            </motion.div>
                                        )) : (
                                            <p className="text-[10px] text-[#4d3c2e] italic font-black uppercase tracking-widest opacity-60 p-5 border border-[#fdf8f5]/5">No explanation available</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        ) : !isAnalyzing && !error && (
                        <div className="flex flex-col items-center justify-center py-24 text-center group cursor-default relative z-10">
                            <motion.div 
                                animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="w-32 h-32 rounded-none border-2 border-[#fdf8f5]/10 flex items-center justify-center mb-10 group-hover:border-[#fdf8f5]/30 transition-all duration-1000"
                            >
                                <HiOutlineSearch className="w-14 h-14 text-[#fdf8f5]/20" />
                            </motion.div>
                            <h3 className="text-3xl font-black text-[#fdf8f5] uppercase tracking-[0.4em] italic opacity-20 group-hover:opacity-50 transition-opacity duration-1000">Awaiting Neural Stimulus</h3>
                            <p className="text-[10px] font-black text-[#8d7b68] mt-4 uppercase tracking-[0.3em] italic opacity-40">Initialize ingestion protocol to begin audit.</p>
                        </div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
          </div>

      </div>

    </div>
  );
}
