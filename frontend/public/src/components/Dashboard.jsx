"use client"
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getAnalysisStats, getRecentAnalyses } from "../services/analysisService";
import { useAuth } from "../AuthContext";
import { useSearch } from "../SearchContext";
import { HiOutlineSearch, HiOutlineTrendingUp, HiOutlineExternalLink, HiOutlineInformationCircle, HiOutlineLightningBolt, HiOutlineShieldCheck, HiOutlineCubeTransparent } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const COLORS = ['#F97316', '#0EA5E9', '#8B5CF6', '#EC4899', '#10B981'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [biasTimeseries, setBiasTimeseries] = useState([]);
  const [narrativeBalance, setNarrativeBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { searchQuery } = useSearch();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function loadData() {
      if (!user?.uid) return;
      try {
        const [statsData, analysesData] = await Promise.all([
          getAnalysisStats(user.uid),
          getRecentAnalyses(10, user.uid)
        ]);
        setStats(statsData);
        setRecentAnalyses(analysesData);

      } catch (error) {
        console.error("Dashboard data load failure:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const filteredAnalyses = recentAnalyses.filter(item => 
    (item.headline || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.source || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pieData = stats?.distribution ? [
    { name: 'Neutral', value: stats.distribution.neutral, color: COLORS[0] },
    { name: 'Left Leaning', value: stats.distribution.left, color: COLORS[1] },
    { name: 'Right Leaning', value: stats.distribution.right, color: COLORS[2] },
  ] : [
    { name: 'Neutral', value: 100, color: COLORS[0] },
    { name: 'Left Leaning', value: 0, color: COLORS[1] },
    { name: 'Right Leaning', value: 0, color: COLORS[2] },
  ];

  const activePieData = pieData.filter(d => d.value > 0);

  const totalValue = activePieData.reduce((acc, curr) => acc + curr.value, 0) || 1;
  const dominantBias = [...pieData].sort((a, b) => b.value - a.value)[0];
  const dominantPct = Math.round((dominantBias.value / totalValue) * 100);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] mesh-bg">
        <div className="w-12 h-12 border-4 border-[#fdf8f5] border-t-transparent rounded-none animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Header with Glass Effect */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-12 relative overflow-hidden group border-[#fdf8f5]/10 bg-[#261a14]/40"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#fdf8f5]/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#fdf8f5]/10 transition-all duration-1000" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-[#fdf8f5] uppercase italic">Dashboard Overview</h1>
            <p className="text-[#d6c2b8] mt-4 font-black uppercase tracking-widest text-[11px] italic underline decoration-[#fdf8f5]/20 leading-relaxed">Real-time summary of news bias analysis.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate("/bias-analyzer")}
              className="btn-primary gap-3 shadow-[0_0_30px_rgba(245,235,224,0.1)]"
            >
              <HiOutlineLightningBolt className="w-5 h-5" />
              Start New Analysis
            </button>
          </div>
        </div>
      </motion.div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
              { label: "Total Articles", value: stats?.totalArticles?.toLocaleString(), icon: HiOutlineCubeTransparent, color: "text-[#fdf8f5]", bg: "bg-[#fdf8f5]/5" },
              { label: "Average Bias", value: stats?.avgBias, icon: HiOutlineTrendingUp, color: "text-[#fdf8f5]", bg: "bg-[#fdf8f5]/5" },
              { label: "Accuracy Score", value: "99.2%", icon: HiOutlineShieldCheck, color: "text-[#fdf8f5]", bg: "bg-[#fdf8f5]/5" },
              { label: "News Sources", value: stats?.activeSources, icon: HiOutlineInformationCircle, color: "text-[#fdf8f5]", bg: "bg-[#fdf8f5]/5" },
          ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="saas-card p-8 flex items-center gap-6 hover:border-[#fdf8f5]/30 transition-all cursor-default bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-none shadow-xl"
              >
                  <div className={`w-16 h-16 rounded-none ${stat.bg} ${stat.color} flex items-center justify-center text-3xl border border-[#fdf8f5]/10 shadow-[0_0_15px_rgba(253,248,245,0.05)]`}>
                      <stat.icon className="w-8 h-8" />
                  </div>
                  <div>
                      <p className="text-[10px] uppercase font-black text-[#8d7b68] tracking-[0.2em] mb-2 italic">{stat.label}</p>
                      <h3 className="text-3xl font-black text-[#fdf8f5] italic tracking-tighter tabular-nums leading-none">{stat.value}</h3>
                  </div>
              </motion.div>
          ))}
      </div>

      {/* Main Analysis Bento Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Large Trend Chart */}
          <motion.div 
            className="lg:col-span-8 saas-card p-10 min-h-[450px] bg-[#261a14]/40 border-[#fdf8f5]/10 rounded-none shadow-2xl"
            whileHover={{ borderColor: 'rgba(253,248,245,0.2)' }}
          >
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-[#fdf8f5]/5">
                <h3 className="text-2xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">Bias Trends Over Time</h3>
                <span className="px-4 py-2 bg-[#fdf8f5]/10 text-[#fdf8f5] border border-[#fdf8f5]/20 text-[9px] font-black uppercase tracking-widest italic animate-pulse">LATEST DATA</span>
            </div>
            <div className="h-[320px] w-full">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <LineChart data={[
                    { name: 'Mon', value: 400 }, { name: 'Tue', value: 300 }, { name: 'Wed', value: 600 },
                    { name: 'Thu', value: 800 }, { name: 'Fri', value: 500 }, { name: 'Sat', value: 900 },
                    { name: 'Sun', value: 700 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(253,248,245,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8d7b68', fontSize: 10, fontWeight: 900}} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#8d7b68', fontSize: 10, fontWeight: 900}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a0f0a', borderRadius: '0', border: '1px solid rgba(253,248,245,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', padding: '15px' }}
                      itemStyle={{ color: '#fdf8f5', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#ff9d6c" strokeWidth={4} dot={{ r: 5, fill: '#1a0f0a', strokeWidth: 2, stroke: '#ff9d6c' }} activeDot={{ r: 8, fill: '#ff9d6c' }} shadow="0 0 15px rgba(255,157,108,0.4)" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* Side Pie Chart Small Bento */}
          <motion.div className="lg:col-span-4 glass-card p-10 flex flex-col items-center justify-center overflow-hidden border-[#fdf8f5]/10 bg-[#261a14]/60 rounded-none shadow-2xl">
                <h3 className="text-2xl font-black text-[#fdf8f5] mb-8 w-full text-center uppercase italic tracking-tighter">Bias Distribution</h3>
                <div className="h-[260px] w-full relative">
                  {isMounted && (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={activePieData.map(d => ({...d, value: Number(d.value)}))}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={activePieData.length > 1 ? 10 : 0}
                            dataKey="value"
                            stroke="none"
                          >
                            {activePieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                  )}
                    {/* Center Text overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-4xl font-black text-[#fdf8f5] italic tracking-tighter">{dominantPct}%</span>
                        <span className="text-[9px] font-black text-[#8d7b68] uppercase tracking-[0.2em] italic">{dominantBias.name}</span>
                    </div>
                </div>
                <div className="mt-10 grid grid-cols-3 gap-4 w-full border-t border-[#fdf8f5]/5 pt-8">
                    {pieData.map((d, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div className="w-full h-1.5 rounded-none" style={{ backgroundColor: COLORS[i] }} />
                            <span className="text-[9px] font-black text-[#8d7b68] uppercase italic">{d.name}</span>
                        </div>
                    ))}
                </div>
          </motion.div>

      </div>

      {/* Recent Intelligence Bento */}
      <motion.div 
        className="saas-card p-0 bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-none shadow-2xl overflow-hidden"
      >
        <div className="p-10 border-b border-[#fdf8f5]/10 flex items-center justify-between bg-[#fdf8f5]/[0.02]">
           <h3 className="text-2xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">Recently Analyzed Articles</h3>
           <button 
             onClick={() => navigate("/reports")}
             className="text-[10px] font-black text-[#fdf8f5] hover:text-[#d6c2b8] flex items-center gap-3 tracking-[0.2em] uppercase italic transition-all group"
           >
               VIEW ALL <HiOutlineExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
           </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fdf8f5]/[0.03] text-[10px] font-black uppercase tracking-[0.3em] text-[#8d7b68] italic">
                <th className="px-10 py-6">Article Title</th>
                <th className="px-10 py-6">Source</th>
                <th className="px-10 py-6">Category</th>
                <th className="px-10 py-6">Bias Score</th>
                <th className="px-10 py-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#fdf8f5]/5">
              {filteredAnalyses.length > 0 ? filteredAnalyses.map((item) => (
                <tr key={item.id} className="group hover:bg-[#fdf8f5]/[0.04] transition-all duration-300 cursor-pointer">
                  <td className="px-10 py-8">
                    <p className="text-sm font-black text-[#d6c2b8] group-hover:text-[#fdf8f5] group-hover:italic transition-all leading-snug max-w-lg uppercase tracking-tight line-clamp-2">
                      {item.headline || "Corpus Fragment"}
                    </p>
                  </td>
                  <td className="px-10 py-8">
                    <span className="inline-block whitespace-nowrap px-4 py-2 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 text-[10px] font-black text-[#8d7b68] group-hover:text-[#fdf8f5] group-hover:border-[#fdf8f5]/30 transition-all uppercase tracking-widest italic">
                      {item.source || "Unknown Source"}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                     <span className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.2em] italic group-hover:text-[#d6c2b8] transition-colors">General</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-1 w-20 bg-[#fdf8f5]/5 rounded-none overflow-hidden">
                        <div 
                          className="h-full bg-[#fdf8f5] shadow-[0_0_10px_rgba(253,248,245,0.4)]" 
                          style={{ width: `${Math.min(100, Math.abs((item.bias_score || 0) * 100))}%` }} 
                        />
                      </div>
                      <span className="text-[11px] font-black text-[#fdf8f5] tabular-nums italic">{(item.bias_score || 0) > 0 ? `+${(item.bias_score || 0).toFixed(1)}` : (item.bias_score || 0).toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="inline-flex whitespace-nowrap items-center gap-3 text-[9px] font-black text-[#fdf8f5] uppercase tracking-[0.2em] italic border border-[#fdf8f5]/10 px-4 py-2 rounded-none bg-[#fdf8f5]/[0.03]">
                      <div className="w-2 h-2 rounded-full bg-[#fdf8f5] animate-pulse shadow-[0_0_8px_rgba(253,248,245,0.8)]" />
                      Analyzed
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center">
                    <p className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic opacity-50">No analyses yet — submit an article to begin</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}
