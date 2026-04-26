"use client"
import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { HiOutlineTrendingUp, HiOutlineMap, HiOutlineGlobeAlt } from "react-icons/hi";
import { getRegionalBias, getAnalysisStats } from "../services/analysisService";

const BiasGlobe = React.lazy(() => import("./three/BiasGlobe"));

export default function GlobePage() {
  const [regionStats, setRegionStats] = useState([]);
  const [overviewStats, setOverviewStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [regions, stats] = await Promise.all([
          getRegionalBias(),
          getAnalysisStats(),
        ]);
        setRegionStats(regions);
        setOverviewStats(stats);
      } catch (err) {
        console.error("Failed to load globe data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalNodes = overviewStats?.activeSources || 0;

  // Assign UI styles per index for visual variety
  const colorCycle = [
    { color: "text-[#fdf8f5]", bg: "bg-[#fdf8f5]/5" },
    { color: "text-[#d6c2b8]", bg: "bg-[#fdf8f5]/5" },
    { color: "text-[#8d7b68]", bg: "bg-[#fdf8f5]/5" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] mesh-bg">
        <div className="w-12 h-12 border-4 border-[#fdf8f5] border-t-transparent rounded-2xl animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-24 mesh-bg">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#fdf8f5]/10 pb-12">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-[#fdf8f5] flex items-center gap-5 uppercase italic">
            <HiOutlineGlobeAlt className="w-12 h-12 text-[#fdf8f5] shadow-[0_0_20px_rgba(253,248,245,0.2)]" />
            Global Bias Map
          </h1>
          <p className="text-[#8d7b68] text-[10px] mt-4 font-black max-w-xl italic uppercase tracking-[0.2em] underline decoration-[#fdf8f5]/10">
            Interactive 3D map showing news bias and trends around the world.
          </p>
        </div>
        <div className="flex items-center gap-8">
           <span className="px-5 py-2 bg-[#fdf8f5] text-[#1a0f0a] text-[10px] font-black uppercase tracking-[0.3em] italic animate-pulse shadow-xl">LIVE FEED</span>
           <span className="text-[10px] text-[#8d7b68] font-black uppercase tracking-[0.3em] italic underline decoration-[#fdf8f5]/10">382 Sources Tracking</span>
        </div>
      </div>

      {/* Main Globe Section - Large Bento */}
      <motion.div 
        className="saas-card min-h-[700px] relative overflow-hidden group bg-[#1a0f0a] border-[#fdf8f5]/10 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.6)]"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Absolute UI overlay on Globe */}
        <div className="absolute top-12 left-12 z-10 space-y-4 pointer-events-none">
            <h3 className="text-2xl font-black text-[#fdf8f5] flex items-center gap-4 uppercase italic tracking-tighter">
                <HiOutlineMap className="w-7 h-7 text-[#fdf8f5]" />
                Global Bias Trends
            </h3>
            <p className="text-[10px] text-[#8d7b68] font-black uppercase tracking-[0.3em] italic">View Mode: Detailed Analysis</p>
        </div>

        <div className="absolute bottom-12 left-12 z-10 flex gap-6 pointer-events-none">
             {regionStats.length > 0 && (
             <div className="glass-card bg-[#261a14]/80 border-[#fdf8f5]/10 p-6 flex items-center gap-8 rounded-2xl shadow-2xl">
                <div className="w-2.5 h-2.5 rounded-full bg-[#fdf8f5] animate-pulse shadow-[0_0_12px_rgba(253,248,245,0.8)]" />
                <span className="text-[11px] font-black text-[#fdf8f5] uppercase tracking-[0.25em] leading-relaxed italic">
                   North America<br/>
                   <span className="text-[#fdf8f5] underline decoration-[#fdf8f5]/30">+0.42 INDEX</span>
                </span>
             </div>
             )}
        </div>

        <div className="absolute inset-0 z-0 bg-[#fdf8f5]/[0.01]">
            <Suspense fallback={
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#1a0f0a]">
                    <div className="w-16 h-16 border-4 border-[#fdf8f5] border-t-transparent rounded-2xl animate-spin mb-8 shadow-2xl" />
                    <p className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic opacity-50 animate-pulse">Loading World Map...</p>
                </div>
            }>
                <BiasGlobe />
            </Suspense>
        </div>
      </motion.div>

      {/* Regional Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {regionStats.length > 0 ? regionStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (i * 0.05) }}
            className="saas-card p-12 bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-2xl group hover:border-[#fdf8f5]/40 transition-all cursor-pointer shadow-xl relative overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-2 h-full bg-[#fdf8f5]/5 group-hover:bg-[#fdf8f5]/10 transition-colors" />
             <div className="flex justify-between items-start mb-10">
                <h4 className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic group-hover:text-[#d6c2b8] transition-colors">{stat.region}</h4>
                <div className="p-4 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 rounded-2xl group-hover:bg-[#fdf8f5] group-hover:text-[#1a0f0a] transition-all duration-300">
                    <HiOutlineTrendingUp className="w-6 h-6" />
                </div>
             </div>
             
             <div className="flex items-end justify-between">
                <div>
                   <p className="text-5xl font-black text-[#fdf8f5] italic tracking-tighter tabular-nums group-hover:scale-110 transition-transform origin-left">{stat.bias}</p>
                   <p className="text-[10px] font-black text-[#8d7b68] uppercase mt-3 tracking-[0.2em] italic underline decoration-[#fdf8f5]/10">{stat.trend}</p>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-black text-[#4d3c2e] uppercase mb-2 tracking-[0.3em] italic">Total Articles</p>
                   <p className="text-lg font-black text-[#d6c2b8] tabular-nums tracking-widest">{stat.articles}</p>
                </div>
             </div>

             <div className="mt-10 pt-10 border-t border-[#fdf8f5]/5">
                <div className="h-2 w-full bg-[#fdf8f5]/5 rounded-2xl overflow-hidden border border-[#fdf8f5]/5">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (stat.bias_index || 0))}%` }}
                        className="h-full bg-[#fdf8f5] shadow-[0_0_15px_rgba(253,248,245,0.4)]"
                        transition={{ delay: 1 + (i * 0.1), duration: 2, ease: "easeOut" }}
                    />
                </div>
             </div>
          </motion.div>
        )) : (
          <div className="lg:col-span-3 text-center py-20">
            <p className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic opacity-50">Analyze articles to populate regional bias data</p>
          </div>
        )}
      </div>

    </div>
  );
}
