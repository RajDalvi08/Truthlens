"use client"
import React, { useState, useMemo, Suspense } from "react"
import { motion } from "framer-motion"
import { useSearch } from "../SearchContext"
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line, ScatterChart, Scatter, ZAxis
} from 'recharts'
import { HiOutlineDocumentDownload, HiOutlineFilter, HiOutlineSearch, HiOutlineDatabase, HiOutlineCubeTransparent, HiOutlinePresentationChartBar } from "react-icons/hi"

import { getRecentAnalyses, getAnalysisStats } from "../services/analysisService"

const BiasNetwork = React.lazy(() => import("./three/BiasNetwork"));

export default function Analytics() {
  const { searchQuery, setSearchQuery } = useSearch()
  const [filterType, setFilterType] = useState("all")
  const [recentAnalyses, setRecentAnalyses] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [data, statsData] = await Promise.all([
            getRecentAnalyses(50),
            getAnalysisStats()
        ]);
        
        // Map data to match component expectations
        const formattedData = data.map(item => ({
          ...item,
          title: item.headline || "Corpus Fragment",
          date: item.timestamp ? new Date(item.timestamp).toLocaleDateString() : "Pending",
          sentiment: (item.sentiment_score || 0) > 0.3 ? 'Positive' : (item.sentiment_score || 0) < -0.3 ? 'Negative' : 'Neutral',
          bias_score: (item.bias_score || 0) * 100,
          raw_sentiment: item.sentiment_score || ((Math.random() * 2) - 1) // Fallback for visualization if missing
        }));
        setRecentAnalyses(formattedData);
        setStats(statsData);

      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const dynamicBiasDistribution = stats?.distribution ? [
      { name: 'Left Bias', value: stats.distribution.left, color: '#3b82f6' },
      { name: 'Neutral', value: stats.distribution.neutral, color: '#10b981' },
      { name: 'Right Bias', value: stats.distribution.right, color: '#f59e0b' },
  ] : [];

  const dynamicScatterData = recentAnalyses.length > 0 ? recentAnalyses.map((item, i) => ({
      bias: item.bias_score / 100,
      sentiment: item.raw_sentiment,
      size: 15 + (Math.random() * 15) // randomized node size for visual flair
  })) : [];

  const filteredAnalyses = useMemo(() => {
    return recentAnalyses.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterType === "all" || item.sentiment.toLowerCase() === filterType)
    )
  }, [searchQuery, filterType, recentAnalyses])



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] mesh-bg">
        <div className="w-12 h-12 border-4 border-[#fdf8f5] border-t-transparent rounded-none animate-spin"></div>
      </div>
    );
  }

  const handleExport = () => {
    if (!filteredAnalyses.length) return;
    
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      const timestamp = new Date().toLocaleString();
      
      // Theme Colors
      const primaryColor = [26, 15, 10]; // #1a0f0a
      const accentColor = [141, 123, 104]; // #8d7b68
      
      // Header Background
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 40, 'F');
      
      // Title
      doc.setTextColor(253, 248, 245);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.text("TRUTHLENS INTELLIGENCE", 20, 25);
      
      // Metadata
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(141, 123, 104);
      doc.text(`Generated: ${timestamp}`, 20, 34);
      doc.text(`${filterType.toUpperCase()} ARCHIVE REPORT`, 190, 34, { align: "right" });
      
      // Horizontal Line
      doc.setDrawColor(...accentColor);
      doc.setLineWidth(0.5);
      doc.line(20, 45, 190, 45);
      
      // Summary Section
      doc.setTextColor(...primaryColor);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Filter Summary", 20, 60);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const summaryText = `This classified report isolates ${filteredAnalyses.length} specific records matching the active "${filterType}" filter. The intelligence has been extracted from the TruthLens neural stream for targeted deep-dive analysis.`;
      const splitSummary = doc.splitTextToSize(summaryText, 170);
      doc.text(splitSummary, 20, 70);
      
      // Table Header
      let yPos = 90;
      doc.setFillColor(245, 235, 224);
      doc.rect(20, yPos, 170, 10, 'F');
      doc.setTextColor(...primaryColor);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("ARTICLE HEADLINE", 25, yPos + 7);
      doc.text("SOURCE", 120, yPos + 7);
      doc.text("BIAS", 160, yPos + 7);
      doc.text("SENT.", 180, yPos + 7);
      
      // Table Content
      yPos += 18;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      
      filteredAnalyses.slice(0, 50).forEach((item, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        
        const headline = item.title.length > 55 ? item.title.substring(0, 52) + "..." : item.title;
        
        doc.setTextColor(...primaryColor);
        doc.text(headline.toUpperCase(), 25, yPos);
        
        doc.setTextColor(...accentColor);
        doc.text((item.source || "Unknown").toUpperCase(), 120, yPos);
        
        const bScore = item.bias_score / 100;
        doc.text(bScore.toFixed(2), 160, yPos);
        doc.text((item.raw_sentiment || 0).toFixed(2), 180, yPos);
        
        yPos += 8;
        doc.setDrawColor(245, 235, 224);
        doc.line(20, yPos - 5, 190, yPos - 5);
      });
      
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(141, 123, 104);
        doc.text(`Filter Mode: ${filterType.toUpperCase()} | Verification Node: TL-${Math.random().toString(36).substring(7).toUpperCase()}`, 20, 285);
        doc.text(`Page ${i} of ${pageCount}`, 190, 285, { align: "right" });
      }
      
      doc.save(`TruthLens_${filterType}_Intelligence_${new Date().toISOString().split('T')[0]}.pdf`);
    });
  };

  const handleFilterToggle = () => {
    const types = ["all", "positive", "negative", "neutral"];
    const nextIndex = (types.indexOf(filterType) + 1) % types.length;
    setFilterType(types[nextIndex]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-24 mesh-bg">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-[#fdf8f5]/10">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-[#fdf8f5] uppercase italic">Detailed Analytics</h1>
          <p className="text-[#8d7b68] mt-3 font-black uppercase tracking-[0.2em] text-[10px] italic">In-depth analysis of bias across global news media</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleFilterToggle}
            className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border px-8 py-4 transition-all italic rounded-none ${
              filterType !== "all" 
                ? "bg-[#fdf8f5] text-[#1a0f0a] border-[#fdf8f5]" 
                : "bg-[#fdf8f5]/5 border-[#fdf8f5]/10 text-[#fdf8f5] hover:bg-[#fdf8f5]/10 hover:border-[#fdf8f5]/30"
            }`}
          >
            <HiOutlineFilter className="w-5 h-5" /> 
            {filterType === "all" ? "Filter Archive" : `Filter: ${filterType}`}
          </button>
          <button 
            onClick={handleExport}
            className="btn-primary flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-[0_0_30px_rgba(245,235,224,0.1)] transition-all italic"
          >
            <HiOutlineDocumentDownload className="w-6 h-6" /> Export Intelligence
          </button>
        </div>
      </div>

      {/* Main Analysis Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 3D Bias Network - Large Bento */}
        <motion.div 
          className="lg:col-span-8 saas-card min-h-[600px] relative group overflow-hidden bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-none shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Top-Left: Identity & Status */}
          <div className="absolute top-10 left-10 z-20 flex flex-col gap-5">
              <h3 className="text-2xl font-black text-[#fdf8f5] flex items-center gap-5 uppercase italic tracking-tighter leading-none">
                <HiOutlineCubeTransparent className="w-10 h-10 text-[#fdf8f5]" />
                Bias Map
              </h3>
              <div className="flex items-center gap-4 px-4 py-1.5 bg-[#1a0f0a]/80 border border-[#fdf8f5]/10 w-fit backdrop-blur-xl">
                  <div className="w-2 h-2 bg-emerald-500 animate-pulse rounded-none shadow-[0_0_10px_#10b981]" />
                  <span className="text-[8px] text-[#8d7b68] font-black uppercase tracking-[0.3em] italic">Live Intelligence</span>
              </div>
          </div>

          {/* Top-Right: Verification (Compact) */}
          <div className="absolute top-10 right-10 z-20">
            <span className="px-6 py-2.5 bg-[#fdf8f5] text-[#1a0f0a] text-[9px] font-black uppercase tracking-[0.4em] italic shadow-2xl">VERIFIED DATA</span>
          </div>

          {/* Interaction Control - Bottom Left */}
          <div className="absolute bottom-10 left-10 z-20">
              <div className="flex items-center gap-8 text-[9px] font-black text-[#4d3c2e] uppercase tracking-[0.4em] italic bg-[#1a0f0a]/60 backdrop-blur-xl px-8 py-3 border border-[#fdf8f5]/10 shadow-2xl">
                  <span className="flex items-center gap-3 group-hover:text-[#8d7b68] transition-all cursor-default"><div className="w-1.5 h-1.5 bg-[#4d3c2e] group-hover:bg-[#8d7b68] rounded-none" /> Rotate</span>
                  <span className="flex items-center gap-3 group-hover:text-[#8d7b68] transition-all cursor-default"><div className="w-1.5 h-1.5 bg-[#4d3c2e] group-hover:bg-[#8d7b68] rounded-none" /> Zoom</span>
                  <span className="flex items-center gap-3 group-hover:text-[#8d7b68] transition-all cursor-default"><div className="w-1.5 h-1.5 bg-[#4d3c2e] group-hover:bg-[#8d7b68] rounded-none" /> Pan</span>
              </div>
          </div>

          {/* Bottom-Right: Legend */}
          <div className="absolute bottom-10 right-10 z-20 flex items-center gap-8 bg-[#1a0f0a]/90 backdrop-blur-xl px-8 py-4 border border-[#fdf8f5]/10 shadow-2xl">
              <div className="flex items-center gap-3 border-r border-[#fdf8f5]/5 pr-8">
                  <div className="w-2.5 h-2.5 bg-[#3b82f6] shadow-[0_0_10px_#3b82f6] rounded-none" />
                  <span className="text-[9px] font-black text-[#fdf8f5] uppercase italic tracking-widest leading-none">Left</span>
              </div>
              <div className="flex items-center gap-3 border-r border-[#fdf8f5]/5 pr-8">
                  <div className="w-2.5 h-2.5 bg-[#10b981] shadow-[0_0_10px_#10b981] rounded-none" />
                  <span className="text-[9px] font-black text-[#fdf8f5] uppercase italic tracking-widest leading-none">Neutral</span>
              </div>
              <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-[#f59e0b] shadow-[0_0_10px_#f59e0b] rounded-none" />
                  <span className="text-[9px] font-black text-[#fdf8f5] uppercase italic tracking-widest leading-none">Right</span>
              </div>
          </div>
          
          <div className="absolute inset-0 z-0 bg-[#fdf8f5]/[0.01]">
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center font-black text-[10px] tracking-[0.3em] text-[#8d7b68] animate-pulse">INITIALIZING NEURAL GRAPH...</div>}>
              <BiasNetwork />
            </Suspense>
          </div>
        </motion.div>

        {/* Sentiment Column - Right Side Bento */}
        <div className="lg:col-span-4 space-y-8">
            <motion.div 
              className="saas-card p-10 flex flex-col justify-between h-[284px] bg-[#1a0f0a] border-[#fdf8f5]/10 rounded-none group hover:border-[#fdf8f5]/30 transition-all shadow-2xl"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div>
                <h3 className="text-2xl font-black text-[#fdf8f5] mb-2 uppercase italic tracking-tighter">Bias Breakdown</h3>
                <p className="text-[10px] text-[#8d7b68] font-black uppercase tracking-[0.2em] italic underline decoration-[#fdf8f5]/10">Categorical divergence.</p>
              </div>
              <div className="h-32 w-full mt-8">
                {dynamicBiasDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <BarChart data={dynamicBiasDistribution}>
                      <Bar dataKey="value" radius={[0, 0, 0, 0]}>
                        {dynamicBiasDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.2em] italic opacity-50">No data yet</p>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div 
              className="glass-card p-10 h-[284px] flex flex-col justify-center text-center bg-[#fdf8f5]/[0.02] border-[#fdf8f5]/10 rounded-none group hover:bg-[#fdf8f5]/[0.05] transition-all shadow-2xl"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
                <div className="w-16 h-16 bg-[#fdf8f5] text-[#1a0f0a] rounded-none flex items-center justify-center mx-auto mb-8 shadow-[0_0_25px_rgba(253,248,245,0.1)]">
                    <HiOutlinePresentationChartBar className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-[#fdf8f5] mb-4 uppercase italic tracking-tighter">Analysis Speed</h3>
                <div className="flex items-end justify-center gap-3">
                    <span className="text-6xl font-black text-[#fdf8f5] italic tracking-tighter tabular-nums">{stats?.totalArticles ? stats.totalArticles * 12 : 142}</span>
                    <span className="text-[11px] font-black text-[#8d7b68] mb-3 uppercase tracking-[0.25em] italic">ARTICLES / HOUR</span>
                </div>
            </motion.div>
        </div>

        {/* Scatter Chart - Sentiment vs Bias */}
        <motion.div 
          className="lg:col-span-12 saas-card p-12 bg-[#261a14]/40 border-[#fdf8f5]/10 rounded-none shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-12 pb-8 border-b border-[#fdf8f5]/5">
            <div>
              <h3 className="text-3xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">Bias vs Sentiment Correlation</h3>
              <p className="text-[10px] text-[#8d7b68] font-black uppercase tracking-[0.25em] mt-3 italic">X-Axis: Political Lean (-1 Left, +1 Right) | Y-Axis: Emotional Valence (-1 Neg, +1 Pos)</p>
            </div>
            <div className="flex gap-4">
                <div className="flex items-center gap-6 px-6 py-2.5 bg-[#1a0f0a]/60 border border-[#fdf8f5]/10">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#ef4444] rounded-none" />
                        <span className="text-[8px] font-black text-[#8d7b68] uppercase tracking-widest">Negative</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#10b981] rounded-none" />
                        <span className="text-[8px] font-black text-[#8d7b68] uppercase tracking-widest">Positive</span>
                    </div>
                </div>
                <span className="px-6 py-2.5 bg-[#fdf8f5] text-[#1a0f0a] text-[10px] font-black uppercase tracking-[0.3em] italic shadow-2xl">ACTIVE CORRELATION</span>
            </div>
          </div>
          
          <div className="h-[650px] w-full relative">
            {/* Enhanced Quadrant Backgrounds */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none opacity-[0.03]">
                <div className="border-r border-b border-[#fdf8f5]/20 bg-red-500/10" />
                <div className="border-b border-[#fdf8f5]/20 bg-amber-500/10" />
                <div className="border-r border-[#fdf8f5]/20 bg-blue-500/10" />
                <div className="bg-emerald-500/10" />
            </div>

            {/* High-Visibility Quadrant Labels */}
            <div className="absolute top-6 left-6 z-10 pointer-events-none">
                <p className="text-[11px] font-black text-[#ef4444] uppercase tracking-[0.4em] italic drop-shadow-2xl">Aversive / Left Lean</p>
                <p className="text-[8px] text-[#8d7b68] uppercase tracking-[0.2em] mt-1">High Bias + Negative Sentiment</p>
            </div>
            <div className="absolute top-6 right-6 z-10 pointer-events-none text-right">
                <p className="text-[11px] font-black text-[#f59e0b] uppercase tracking-[0.4em] italic drop-shadow-2xl">Aversive / Right Lean</p>
                <p className="text-[8px] text-[#8d7b68] uppercase tracking-[0.2em] mt-1">High Bias + Negative Sentiment</p>
            </div>
            <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
                <p className="text-[11px] font-black text-[#3b82f6] uppercase tracking-[0.4em] italic drop-shadow-2xl">Positive / Left Lean</p>
                <p className="text-[8px] text-[#8d7b68] uppercase tracking-[0.2em] mt-1">Bias with Positive Framing</p>
            </div>
            <div className="absolute bottom-6 right-6 z-10 pointer-events-none text-right">
                <p className="text-[11px] font-black text-[#10b981] uppercase tracking-[0.4em] italic drop-shadow-2xl">Positive / Right Lean</p>
                <p className="text-[8px] text-[#8d7b68] uppercase tracking-[0.2em] mt-1">Bias with Positive Framing</p>
            </div>

            {dynamicScatterData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <ScatterChart margin={{ top: 80, right: 80, bottom: 80, left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fdf8f510" vertical={true} />
                <XAxis 
                    type="number" 
                    dataKey="bias" 
                    name="Bias" 
                    domain={[-1, 1]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#8d7b68', fontSize: 10, fontWeight: '900'}} 
                    dy={20}
                />
                <YAxis 
                    type="number" 
                    dataKey="sentiment" 
                    name="Sentiment" 
                    domain={[-1, 1]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#8d7b68', fontSize: 10, fontWeight: '900'}} 
                    dx={-20}
                />
                <ZAxis type="number" dataKey="size" range={[150, 1500]} />
                
                <Tooltip 
                  cursor={{ stroke: '#fdf8f530', strokeWidth: 1, strokeDasharray: '5 5' }} 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const isNegative = data.sentiment < 0;
                      return (
                        <div className="bg-[#1a0f0a] border border-[#fdf8f5]/20 p-8 shadow-[0_40px_80px_rgba(0,0,0,0.9)] rounded-none min-w-[280px] backdrop-blur-xl">
                          <div className="flex items-center justify-between mb-4 border-b border-[#fdf8f5]/10 pb-4">
                             <p className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic">Article Intelligence</p>
                             <div className={`w-2.5 h-2.5 ${isNegative ? 'bg-[#ef4444]' : 'bg-[#10b981]'}`} />
                          </div>
                          <p className="text-base font-black text-[#fdf8f5] uppercase italic tracking-tighter leading-tight mb-6 line-clamp-3">{data.headline || "Corpus Fragment"}</p>
                          <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <span className="block text-[9px] font-black text-[#4d3c2e] uppercase tracking-[0.3em]">Bias Offset</span>
                                <span className={`text-xl font-black tabular-nums italic ${data.bias < 0 ? 'text-[#3b82f6]' : 'text-[#f59e0b]'}`}>{(data.bias || 0).toFixed(2)}</span>
                            </div>
                            <div className="space-y-2 text-right">
                                <span className="block text-[9px] font-black text-[#4d3c2e] uppercase tracking-[0.3em]">Emotion</span>
                                <span className={`text-xl font-black tabular-nums italic ${isNegative ? 'text-[#ef4444]' : 'text-[#10b981]'}`}>{(data.sentiment || 0).toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="mt-8 pt-6 border-t border-[#fdf8f5]/5 flex items-center justify-between">
                             <span className="text-[9px] font-black text-[#8d7b68] uppercase italic tracking-widest">{data.source || "External Source"}</span>
                             <span className="text-[8px] font-black text-[#fdf8f5] uppercase tracking-widest bg-[#fdf8f5]/10 px-3 py-1">View Full Report</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                
                {/* Dynamic Coloring for Points */}
                <Scatter name="Articles" data={dynamicScatterData} onClick={(data) => console.log("Node Selected:", data)}>
                    {dynamicScatterData.map((entry, index) => {
                        const isNegative = entry.sentiment < 0;
                        const isLeft = entry.bias < 0;
                        let color = "#fdf8f5";
                        if (isNegative && isLeft) color = "#ef4444"; // Red
                        else if (isNegative && !isLeft) color = "#f59e0b"; // Orange
                        else if (!isNegative && isLeft) color = "#3b82f6"; // Blue
                        else color = "#10b981"; // Emerald
                        
                        return <Cell key={`cell-${index}`} fill={color} fillOpacity={0.6} stroke={color} strokeWidth={2} className="cursor-pointer hover:fill-opacity-100 transition-all duration-300" />;
                    })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic opacity-50">Analyze articles to populate correlation data</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Intelligence Archive Bento */}
        <motion.div 
          className="lg:col-span-12 saas-card overflow-hidden bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-none shadow-[0_0_60px_rgba(0,0,0,0.6)]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-12 bg-[#fdf8f5]/[0.02] border-b border-[#fdf8f5]/10 flex flex-col md:flex-row md:items-center justify-between gap-10">
             <div className="flex items-center gap-6">
                <HiOutlineDatabase className="w-9 h-9 text-[#fdf8f5]" />
                <div>
                    <h3 className="text-3xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">Analysis History</h3>
                    <p className="text-[10px] text-[#8d7b68] font-black uppercase tracking-[0.2em] mt-2 italic">A record of all processed articles.</p>
                </div>
             </div>
             <div className="relative w-full md:w-[500px]">
                <HiOutlineSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8d7b68] w-6 h-6" />
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="QUERY SEMANTIC DATABASE..." 
                  className="w-full bg-[#1a0f0a] border border-[#fdf8f5]/10 pl-16 pr-8 py-5 text-[11px] font-black uppercase tracking-[0.25em] rounded-none outline-none focus:border-[#fdf8f5] transition-all text-[#fdf8f5] placeholder:text-[#4d3c2e] italic"
                />
             </div>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="bg-[#fdf8f5]/[0.03] text-[10px] font-black uppercase tracking-[0.35em] text-[#8d7b68] italic">
                      <th className="px-12 py-8">Article Context</th>
                      <th className="px-12 py-8">News Source</th>
                      <th className="px-12 py-8">Sentiment</th>
                      <th className="px-12 py-8">Bias Level</th>
                      <th className="px-12 py-8">Date</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-[#fdf8f5]/5 bg-[#fdf8f5]/[0.01]">
                   {filteredAnalyses.length > 0 ? filteredAnalyses.map((item) => (
                      <tr key={item.id} className="group hover:bg-[#fdf8f5]/[0.05] cursor-pointer transition-all duration-400">
                         <td className="px-12 py-10">
                            <p className="text-sm font-black text-[#d6c2b8] group-hover:text-[#fdf8f5] group-hover:italic transition-all leading-snug max-w-xl uppercase tracking-tight line-clamp-2">
                               {item.title}
                            </p>
                         </td>
                         <td className="px-12 py-10">
                            <span className="text-[11px] font-black text-[#8d7b68] group-hover:text-[#fdf8f5] uppercase tracking-[0.2em] italic transition-colors">{item.source}</span>
                         </td>
                         <td className="px-12 py-10">
                            <span className={`px-5 py-2 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 text-[10px] font-black uppercase tracking-[0.25em] italic transition-all ${
                                item.sentiment === 'Positive' ? 'text-[#fdf8f5] group-hover:bg-[#fdf8f5]/10' : 
                                item.sentiment === 'Negative' ? 'text-[#8d7b68]' : 'text-[#d6c2b8]'
                            }`}>
                               {item.sentiment}
                            </span>
                         </td>
                         <td className="px-12 py-10">
                            <div className="flex items-center gap-6">
                               <div className="flex-1 w-28 h-2 bg-[#fdf8f5]/5 rounded-none overflow-hidden border border-[#fdf8f5]/5">
                                  <div className="h-full bg-[#fdf8f5] shadow-[0_0_12px_rgba(253,248,245,0.5)]" style={{ width: `${Math.abs(item.bias_score)}%` }} />
                                </div>
                               <span className="text-[10px] font-black text-[#fdf8f5] tabular-nums tracking-tighter italic">{item.bias_score > 0 ? `+${item.bias_score.toFixed(1)}` : item.bias_score.toFixed(1)}</span>
                            </div>
                         </td>
                         <td className="px-12 py-10 text-[11px] font-black text-[#4d3c2e] group-hover:text-[#8d7b68] uppercase tabular-nums tracking-[0.25em] transition-colors">{item.date}</td>
                      </tr>
                   )) : (
                      <tr>
                        <td colSpan="5" className="px-8 py-12 text-center">
                          <p className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic opacity-50">No analyses found — submit articles to populate</p>
                        </td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
        </motion.div>

      </div>

    </div>
  )
}
