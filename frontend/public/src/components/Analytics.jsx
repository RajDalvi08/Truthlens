"use client"
import React, { useState, useMemo, Suspense } from "react"
import { motion } from "framer-motion"
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line, ScatterChart, Scatter, ZAxis
} from 'recharts'
import { HiOutlineDocumentDownload, HiOutlineFilter, HiOutlineSearch, HiOutlineDatabase, HiOutlineCubeTransparent, HiOutlinePresentationChartBar } from "react-icons/hi"

import { getRecentAnalyses } from "../services/analysisService"

const BiasNetwork = React.lazy(() => import("./three/BiasNetwork"));

const biasDistributionData = [
  { name: 'Left Bias', value: 340, color: '#3b82f6' }, // Blue
  { name: 'Neutral', value: 512, color: '#10b981' }, // Emerald
  { name: 'Right Bias', value: 288, color: '#f59e0b' }, // Amber
]

const sentimentCorrelationData = [
  { bias: -0.8, sentiment: -0.4, size: 20 },
  { bias: -0.6, sentiment: -0.2, size: 15 },
  { bias: -0.4, sentiment: 0.1, size: 10 },
  { bias: -0.2, sentiment: 0.3, size: 25 },
  { bias: 0, sentiment: 0.8, size: 30 },
  { bias: 0.2, sentiment: 0.4, size: 12 },
  { bias: 0.4, sentiment: 0.1, size: 18 },
  { bias: 0.6, sentiment: -0.3, size: 22 },
  { bias: 0.8, sentiment: -0.6, size: 14 },
]

export default function Analytics() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [recentAnalyses, setRecentAnalyses] = useState([])
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    async function fetchData() {
      try {
        const data = await getRecentAnalyses(10);
        // Map data to match component expectations
        const formattedData = data.map(item => ({
          ...item,
          date: new Date(item.timestamp.toDate()).toLocaleDateString(),
          sentiment: item.sentimentScore > 0.3 ? 'Positive' : item.sentimentScore < -0.3 ? 'Negative' : 'Neutral',
          bias_score: item.biasScore * 100
        }));
        setRecentAnalyses(formattedData);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredAnalyses = useMemo(() => {
    return recentAnalyses.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === "all" || item.sentiment.toLowerCase() === filterType)
    )
  }, [searchTerm, filterType, recentAnalyses])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] mesh-bg">
        <div className="w-12 h-12 border-4 border-[#fdf8f5] border-t-transparent rounded-none animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-24 mesh-bg">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-[#fdf8f5]/10">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-[#fdf8f5] uppercase italic">Narrative Intelligence</h1>
          <p className="text-[#8d7b68] mt-3 font-black uppercase tracking-[0.2em] text-[10px] italic">Multidimensional analysis of global media vectors // 0xEspresso</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 text-[#fdf8f5] hover:bg-[#fdf8f5]/10 hover:border-[#fdf8f5]/30 rounded-none px-8 py-4 transition-all italic">
            <HiOutlineFilter className="w-5 h-5" /> Filter Archive
          </button>
          <button className="btn-primary flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-[0_0_30px_rgba(245,235,224,0.1)] transition-all italic">
            <HiOutlineDocumentDownload className="w-6 h-6" /> Export Intelligence
          </button>
        </div>
      </div>

      {/* Main Analysis Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 3D Bias Network - Large Bento */}
        <motion.div 
          className="lg:col-span-8 saas-card min-h-[550px] relative group overflow-hidden bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-none shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="absolute top-10 left-10 z-10">
              <h3 className="text-2xl font-black text-[#fdf8f5] flex items-center gap-4 uppercase italic tracking-tighter">
                <HiOutlineCubeTransparent className="w-9 h-9 text-[#fdf8f5]" />
                3D Bias Cluster Map
              </h3>
              <p className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] mt-3 italic">Neural Node Distribution // Vector Alpha</p>
          </div>
          
          <div className="absolute inset-0 z-0 bg-[#fdf8f5]/[0.01]">
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center font-black text-[10px] tracking-[0.3em] text-[#8d7b68] animate-pulse">INITIALIZING NEURAL GRAPH...</div>}>
              <BiasNetwork />
            </Suspense>
          </div>

          <div className="absolute bottom-10 right-10 z-10 flex gap-4">
            <span className="px-6 py-2.5 bg-[#fdf8f5] text-[#1a0f0a] text-[10px] font-black uppercase tracking-[0.2em] italic shadow-2xl">HIGH FIDELITY</span>
            <span className="px-6 py-2.5 bg-[#fdf8f5]/5 text-[#d6c2b8] border border-[#fdf8f5]/10 text-[10px] font-black uppercase tracking-[0.2em] italic underline decoration-[#fdf8f5]/20">1.2K article vectors</span>
          </div>
        </motion.div>

        {/* Sentiment Column - Right Side Bento */}
        <div className="lg:col-span-4 space-y-8">
            <motion.div 
              className="saas-card p-10 flex flex-col justify-between h-[260px] bg-[#1a0f0a] border-[#fdf8f5]/10 rounded-none group hover:border-[#fdf8f5]/30 transition-all shadow-2xl"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div>
                <h3 className="text-2xl font-black text-[#fdf8f5] mb-2 uppercase italic tracking-tighter">Bias Breakdown</h3>
                <p className="text-[10px] text-[#8d7b68] font-black uppercase tracking-[0.2em] italic underline decoration-[#fdf8f5]/10">Categorical divergence.</p>
              </div>
              <div className="h-32 w-full mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={biasDistributionData}>
                    <Bar dataKey="value" radius={[0, 0, 0, 0]}>
                      {biasDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              className="glass-card p-10 h-[260px] flex flex-col justify-center text-center bg-[#fdf8f5]/[0.02] border-[#fdf8f5]/10 rounded-none group hover:bg-[#fdf8f5]/[0.05] transition-all shadow-2xl"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
                <div className="w-16 h-16 bg-[#fdf8f5] text-[#1a0f0a] rounded-none flex items-center justify-center mx-auto mb-8 shadow-[0_0_25px_rgba(253,248,245,0.1)]">
                    <HiOutlinePresentationChartBar className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-[#fdf8f5] mb-4 uppercase italic tracking-tighter">Ingestion Velocity</h3>
                <div className="flex items-end justify-center gap-3">
                    <span className="text-6xl font-black text-[#fdf8f5] italic tracking-tighter tabular-nums">142</span>
                    <span className="text-[11px] font-black text-[#8d7b68] mb-3 uppercase tracking-[0.25em] italic">ARTICLES / HR</span>
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
              <h3 className="text-3xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">Sentiment Correlation Spectrum</h3>
              <p className="text-[10px] text-[#8d7b68] font-black uppercase tracking-[0.25em] mt-3 italic">X: Political Bias | Y: Sentiment Intensity</p>
            </div>
            <span className="px-6 py-2.5 bg-[#fdf8f5]/5 border border-[#fdf8f5]/20 text-[#fdf8f5] text-[10px] font-black uppercase tracking-[0.3em] italic">NODE CONVERGENCE</span>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fdf8f508" vertical={false} />
                <XAxis type="number" dataKey="bias" name="bias" domain={[-1, 1]} axisLine={false} tickLine={false} tick={{fill: '#8d7b68', fontSize: 10, fontWeight: '900'}} dy={15} />
                <YAxis type="number" dataKey="sentiment" name="sentiment" domain={[-1, 1]} axisLine={false} tickLine={false} tick={{fill: '#8d7b68', fontSize: 10, fontWeight: '900'}} dx={-15} />
                <ZAxis type="number" dataKey="size" range={[100, 600]} />
                <Tooltip 
                  cursor={{ stroke: '#fdf8f520', strokeWidth: 2 }} 
                  contentStyle={{backgroundColor: '#1a0f0a', border: '1px solid #fdf8f520', borderRadius: '0', padding: '20px'}}
                  itemStyle={{color: '#fdf8f5', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase'}}
                />
                <Scatter name="Articles" data={sentimentCorrelationData} fill="#ec4899" fillOpacity={0.7} stroke="#ec4899" strokeWidth={1} />
              </ScatterChart>
            </ResponsiveContainer>
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
                    <h3 className="text-3xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">Neural Archive Ingestion</h3>
                    <p className="text-[10px] text-[#8d7b68] font-black uppercase tracking-[0.2em] mt-2 italic">Historical sentiment datasets.</p>
                </div>
             </div>
             <div className="relative w-full md:w-[500px]">
                <HiOutlineSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8d7b68] w-6 h-6" />
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="QUERY SEMANTIC DATABASE..." 
                  className="w-full bg-[#1a0f0a] border border-[#fdf8f5]/10 pl-16 pr-8 py-5 text-[11px] font-black uppercase tracking-[0.25em] rounded-none outline-none focus:border-[#fdf8f5] transition-all text-[#fdf8f5] placeholder:text-[#4d3c2e] italic"
                />
             </div>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="bg-[#fdf8f5]/[0.03] text-[10px] font-black uppercase tracking-[0.35em] text-[#8d7b68] italic">
                      <th className="px-12 py-8">Intel Fragment</th>
                      <th className="px-12 py-8">Source Vector</th>
                      <th className="px-12 py-8">Sentiment</th>
                      <th className="px-12 py-8">Leaning Flux</th>
                      <th className="px-12 py-8">Timestamp</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-[#fdf8f5]/5 bg-[#fdf8f5]/[0.01]">
                   {filteredAnalyses.map((item) => (
                      <tr key={item.id} className="group hover:bg-[#fdf8f5]/[0.05] cursor-pointer transition-all duration-400">
                         <td className="px-12 py-8">
                            <p className="text-sm font-black text-[#d6c2b8] group-hover:text-[#fdf8f5] group-hover:italic transition-all leading-relaxed max-w-lg uppercase tracking-tight">
                               {item.title}
                            </p>
                         </td>
                         <td className="px-12 py-8">
                            <span className="text-[11px] font-black text-[#8d7b68] group-hover:text-[#fdf8f5] uppercase tracking-[0.2em] italic transition-colors">{item.source}</span>
                         </td>
                         <td className="px-12 py-8">
                            <span className={`px-4 py-1.5 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 text-[10px] font-black uppercase tracking-[0.25em] italic transition-all ${
                                item.sentiment === 'Positive' ? 'text-[#fdf8f5] group-hover:bg-[#fdf8f5]/10' : 
                                item.sentiment === 'Negative' ? 'text-[#8d7b68]' : 'text-[#d6c2b8]'
                            }`}>
                               {item.sentiment}
                            </span>
                         </td>
                         <td className="px-12 py-8">
                            <div className="flex items-center gap-5">
                               <div className="flex-1 w-24 h-1.5 bg-[#fdf8f5]/5 rounded-none overflow-hidden border border-[#fdf8f5]/5">
                                  <div className="h-full bg-[#fdf8f5] shadow-[0_0_12px_rgba(253,248,245,0.5)]" style={{ width: `${Math.abs(item.bias_score)}%` }} />
                                </div>
                               <span className="text-[11px] font-black text-[#fdf8f5] tabular-nums tracking-tighter italic">{item.bias_score > 0 ? `+${item.bias_score.toFixed(1)}` : item.bias_score.toFixed(1)}</span>
                            </div>
                         </td>
                         <td className="px-12 py-8 text-[11px] font-black text-[#4d3c2e] group-hover:text-[#8d7b68] uppercase tabular-nums tracking-[0.25em] transition-colors">{item.date}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </motion.div>

      </div>

    </div>
  )
}
