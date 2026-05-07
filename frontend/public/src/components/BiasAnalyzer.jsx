"use client"
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext";
import { useNotifications } from "../NotificationContext";
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
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
        text: text.trim(),
        userId: user?.uid
      });
      console.log("API RESPONSE:", response);
      setResults(response);
      
      // Trigger global notification
      addNotification({
        title: "Analysis Complete",
        message: `Intelligence report for '${response.source || response.headline || "Article"}' is ready.`,
        type: "success"
      });
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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-1000 pb-16 mesh-bg">
      
      {/* Dynamic Header */}
      <div className="flex items-end justify-between border-b border-[#fdf8f5]/10 pb-10 flex flex-col md:flex-row md:items-end gap-8">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-[#fdf8f5] uppercase italic">Article Bias Analyzer</h2>
          <p className="text-[#8d7b68] text-[10px] mt-4 font-black uppercase tracking-[0.25em] italic underline decoration-[#fdf8f5]/10">Analyze news articles for bias and sentiment.</p>
        </div>
        <div className="hidden md:flex items-center gap-6">
            <div className={`w-2.5 h-2.5 rounded-2xl ${isOnline ? 'bg-[#fdf8f5] animate-pulse shadow-[0_0_12px_rgba(253,248,245,0.6)]' : 'bg-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.6)]'}`} />
            <span className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic">
                SYSTEM: <span className={isOnline ? "text-[#fdf8f5]" : "text-[#ef4444]"}>{isOnline ? "ONLINE" : "OFFLINE"}</span>
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Input Control Center - Bento Left */}
          <div className="lg:col-span-12">
            <motion.div 
                className="saas-card group relative overflow-hidden bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-2xl shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#fdf8f5]/[0.02] blur-[100px] pointer-events-none group-hover:bg-[#fdf8f5]/[0.05] transition-all duration-1000" />
                
                <div className="p-8 border-b border-[#fdf8f5]/5 bg-[#fdf8f5]/[0.01]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Text Ingestion */}
                        <div className="space-y-8">
                            <div>
                                <label className="flex items-center gap-4 text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] mb-6 italic underline decoration-[#fdf8f5]/10">
                                    <HiOutlineDocumentText className="w-6 h-6 text-[#fdf8f5]" />
                                    Input Article Text
                                </label>
                                <div className="space-y-5">
                                    <input
                                      type="text"
                                      value={headline}
                                      onChange={(e) => setHeadline(e.target.value)}
                                      placeholder="ARTICLE HEADLINE (OPTIONAL)..."
                                      className="w-full bg-[#1a0f0a] border border-[#fdf8f5]/10 px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl outline-none focus:border-[#fdf8f5] transition-all text-[#fdf8f5] placeholder:text-[#4d3c2e] italic"
                                    />
                                    <textarea
                                      value={text}
                                      onChange={(e) => setText(e.target.value)}
                                      placeholder="PASTE THE ARTICLE TEXT HERE FOR ANALYSIS..."
                                      rows={8}
                                      className="w-full bg-[#1a0f0a] border border-[#fdf8f5]/10 px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl outline-none focus:border-[#fdf8f5] transition-all text-[#fdf8f5] placeholder:text-[#4d3c2e] italic resize-none leading-relaxed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* URL & Source Retrieval */}
                        <div className="space-y-10 flex flex-col justify-between">
                            <div>
                                <label className="flex items-center gap-4 text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] mb-6 italic underline decoration-[#fdf8f5]/10">
                                    <HiOutlineLink className="w-6 h-6 text-[#fdf8f5]" />
                                    Analyze by URL
                                </label>
                                <div className="relative group/input">
                                    <HiOutlineLink className="absolute left-6 top-1/2 -translate-y-1/2 text-[#4d3c2e] group-focus-within/input:text-[#fdf8f5] transition-colors w-5 h-5" />
                                    <input
                                      type="text"
                                      value={url}
                                      onChange={(e) => setUrl(e.target.value)}
                                      placeholder="HTTPS://NEWS-SITE.COM/ARTICLE-LINK..."
                                      className="w-full bg-[#1a0f0a] border border-[#fdf8f5]/10 pl-16 pr-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl outline-none focus:border-[#fdf8f5] transition-all text-[#fdf8f5] placeholder:text-[#4d3c2e] italic shadow-2xl"
                                    />
                                </div>
                                <p className="text-[10px] text-[#4d3c2e] mt-4 italic font-black uppercase tracking-widest opacity-60">URL analysis will take priority over manual text input.</p>
                            </div>

                            <div className="pt-10 border-t border-[#fdf8f5]/5">
                                <label className="text-[9px] font-black text-[#4d3c2e] uppercase mb-5 block tracking-[0.3em] italic">Engine Templates</label>
                                <div className="flex flex-wrap gap-4">
                                    {SAMPLE_URLS.map((sample, i) => (
                                      <button
                                        key={i}
                                        onClick={() => handleSampleClick(sample)}
                                        className="flex-1 text-[10px] py-3.5 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 text-[#8d7b68] hover:bg-[#fdf8f5]/10 hover:border-[#fdf8f5]/30 rounded-2xl transition-all uppercase font-black italic tracking-[0.25em]"
                                      >
                                        Sample {i + 1}
                                      </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 mt-8 pt-6 border-t border-[#fdf8f5]/10">
                        <button
                           onClick={handleAnalyze}
                           disabled={(!url.trim() && !text.trim()) || isAnalyzing || !isOnline}
                           className="btn-primary flex items-center justify-center gap-4 px-14 py-6 text-[11px] w-full sm:w-auto shadow-2xl transition-all disabled:opacity-50"
                        >
                           {isAnalyzing ? (
                             <>
                               <span className="w-6 h-6 border-3 border-[#1a0f0a]/30 border-t-[#1a0f0a] rounded-2xl animate-spin" />
                               ANALYZING...
                             </>
                           ) : (
                             <>
                                <HiOutlineLightningBolt className="w-6 h-6" />
                                RUN ANALYSIS
                             </>
                           )}
                        </button>
                        <div className="flex items-center gap-6">
                            <div className="h-12 w-px bg-[#fdf8f5]/10 hidden sm:block" />
                            <div className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] leading-relaxed italic">
                                TruthLens Core v1.0<br/>
                                <span className={`${isOnline ? 'text-[#fdf8f5]' : 'text-[#ef4444]'} opacity-50`}>
                                    STATUS: {isOnline ? 'READY' : 'DISCONNECTED'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analysis Output Pane */}
                <div className="p-8 min-h-[200px] flex items-start justify-center bg-[#fdf8f5]/[0.01] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
                    <AnimatePresence mode="wait">
                        {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-8 p-10 glass-card border-[#fdf8f5]/20 bg-[#fdf8f5]/5 text-[#fdf8f5] rounded-2xl shadow-2xl relative z-10"
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
                            className="w-full space-y-8 relative z-10"
                        >
                            {/* Top Row: Core Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-stretch">
                                {/* Card 1: Sentiment Polarity */}
                                <div className="glass-card p-8 md:col-span-1 bg-[#1a0f0a]/60 border-[#fdf8f5]/10 group rounded-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between text-center">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#fdf8f5]/5 blur-[60px]" />
                                    <p className="text-[9px] font-black text-[#8d7b68] uppercase tracking-[0.3em] mb-6 italic underline decoration-[#fdf8f5]/10 mx-auto">Sentiment Polarity</p>
                                    <div className="text-7xl font-black text-[#fdf8f5] mb-4 italic tracking-tight tabular-nums leading-none">{results.bias_score}</div>
                                    <div className="text-[11px] font-black text-[#fdf8f5] uppercase tracking-[0.4em] mb-10 italic opacity-80">{results.bias_level}</div>
                                    <div className="h-3 w-full bg-[#fdf8f5]/5 rounded-2xl overflow-hidden relative border border-[#fdf8f5]/5 shadow-inner mt-2">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, Math.max(0, results.bias_score))}%` }}
                                            className="h-full bg-gradient-to-r from-[#F97316] to-[#EC4899] shadow-[0_0_20px_rgba(236,72,153,0.4)]" 
                                            transition={{ duration: 2, ease: "easeOut" }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-4 text-[8px] font-black text-[#4d3c2e] tracking-[0.3em] uppercase">
                                        <span>Left Vector</span>
                                        <span>Right Vector</span>
                                    </div>
                                </div>

                                {/* Card 2: Bias Indicators */}
                                <div className="glass-card p-8 md:col-span-2 bg-[#1a0f0a]/40 border-[#fdf8f5]/10 rounded-2xl shadow-2xl relative overflow-hidden">
                                    <p className="text-[9px] font-black text-[#8d7b68] uppercase tracking-[0.3em] mb-8 italic underline decoration-[#fdf8f5]/10">Bias Indicators</p>
                                    <div className="flex flex-wrap gap-4">
                                        {results.indicators && results.indicators.length > 0 ? (
                                            results.indicators.map((indicator, i) => (
                                                <div key={i} className="px-6 py-3 bg-[#1a0f0a] border border-[#fdf8f5]/5 rounded-xl flex items-center gap-3 text-[10px] font-black text-[#fdf8f5] uppercase tracking-[0.2em] italic shadow-2xl">
                                                    <span className="text-[#8d7b68]">♦</span>
                                                    {indicator}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-6 py-3 bg-[#1a0f0a] border border-[#fdf8f5]/5 rounded-xl text-[10px] text-[#4d3c2e] italic font-black uppercase tracking-widest opacity-60">No indicators detected</div>
                                        )}
                                    </div>
                                </div>

                                {/* Card 3: Source Pulse Signature */}
                                <div className="glass-card p-8 md:col-span-1 flex flex-col justify-between bg-[#fdf8f5]/[0.02] border-[#fdf8f5]/10 rounded-2xl shadow-2xl relative group">
                                    <div>
                                        <p className="text-[9px] font-black text-[#8d7b68] uppercase tracking-[0.3em] mb-8 italic underline decoration-[#fdf8f5]/10">Source Pulse Signature</p>
                                        <div className="p-6 bg-[#1a0f0a] rounded-2xl border border-[#fdf8f5]/10 shadow-2xl relative z-10">
                                            <p className="text-sm font-black text-[#fdf8f5] break-words italic tracking-tighter uppercase leading-tight">
                                                {results.source || "MANUAL-ENTRY"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4 pt-8 relative z-10">
                                        <div className="flex items-center gap-4 text-[8px] font-black text-[#4d3c2e] uppercase tracking-[0.3em] italic">
                                            <HiOutlineCubeTransparent className="w-5 h-5 text-[#fdf8f5]/20" />
                                            STATUS: <span className="text-[#8d7b68]">VERIFIED</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Row: Advanced Analysis */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                                {/* Card 4: Neural Entity Salience */}
                                <div className="glass-card p-8 bg-[#1a0f0a]/60 border-[#fdf8f5]/10 rounded-2xl shadow-2xl">
                                    <p className="text-[9px] font-black text-[#8d7b68] uppercase tracking-[0.3em] mb-10 italic underline decoration-[#fdf8f5]/10">Neural Entity Salience</p>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <p className="text-[8px] font-black text-[#4d3c2e] uppercase tracking-[0.4em] italic border-l-2 border-[#8d7b68]/30 pl-4 ml-1">Subject:_Personae</p>
                                            <div className="p-5 bg-[#1a0f0a] rounded-xl border border-[#fdf8f5]/5 shadow-2xl">
                                                <p className="text-[10px] font-black text-[#fdf8f5] uppercase tracking-[0.2em] italic">
                                                    {(results.entities?.personae && results.entities.personae.length > 0) 
                                                        ? results.entities.personae[0] 
                                                        : "NULL_DETECTION"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <p className="text-[8px] font-black text-[#4d3c2e] uppercase tracking-[0.4em] italic border-l-2 border-[#8d7b68]/30 pl-4 ml-1">Subject:_Organization</p>
                                            <div className="p-5 bg-[#1a0f0a] rounded-xl border border-[#fdf8f5]/5 shadow-2xl">
                                                <p className="text-[10px] font-black text-[#fdf8f5] uppercase tracking-[0.2em] italic">
                                                    {(results.entities?.organization && results.entities.organization.length > 0) 
                                                        ? results.entities.organization[0] 
                                                        : "NULL_DETECTION"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 5: Logic Trace Analysis */}
                                <div className="glass-card p-8 bg-[#1a0f0a]/40 border-[#fdf8f5]/10 rounded-2xl shadow-2xl">
                                    <p className="text-[9px] font-black text-[#8d7b68] uppercase tracking-[0.3em] mb-8 italic underline decoration-[#fdf8f5]/10">Logic_Trace Analysis</p>
                                    <div className="p-8 bg-[#1a0f0a] rounded-2xl border border-[#fdf8f5]/5 shadow-2xl min-h-[140px] flex items-center">
                                        {results.explanation && results.explanation.length > 0 ? (
                                            <p className="text-[11px] font-medium text-[#fdf8f5]/90 tracking-wide leading-relaxed">
                                                <span className="text-[#0EA5E9] mr-3 font-black">»</span>
                                                {results.explanation[0]}
                                            </p>
                                        ) : (
                                            <p className="text-[11px] font-black text-[#4d3c2e] uppercase tracking-[0.15em] italic leading-relaxed opacity-60">
                                                Neural analysis stream processing...
                                            </p>
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
                                className="w-32 h-32 rounded-2xl border-2 border-[#fdf8f5]/10 flex items-center justify-center mb-10 group-hover:border-[#fdf8f5]/30 transition-all duration-1000"
                            >
                                <HiOutlineSearch className="w-14 h-14 text-[#fdf8f5]/20" />
                            </motion.div>
                            <h3 className="text-3xl font-black text-[#fdf8f5] uppercase tracking-[0.4em] italic opacity-20 group-hover:opacity-50 transition-opacity duration-1000">Waiting for Input</h3>
                            <p className="text-[10px] font-black text-[#8d7b68] mt-4 uppercase tracking-[0.3em] italic opacity-40">Enter a URL or paste text above to start.</p>
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
