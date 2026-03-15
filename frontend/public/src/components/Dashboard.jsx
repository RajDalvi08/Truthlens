"use client"
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getAnalysisStats, getRecentAnalyses } from "../services/analysisService";
import { HiOutlineTrendingUp, HiOutlineExternalLink, HiOutlineInformationCircle, HiOutlineLightningBolt, HiOutlineShieldCheck, HiOutlineCubeTransparent } from "react-icons/hi";

const COLORS = ['#F97316', '#0EA5E9', '#8B5CF6', '#EC4899', '#10B981'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, analysesData] = await Promise.all([
          getAnalysisStats(),
          getRecentAnalyses(5)
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
  }, []);

  const pieData = [
    { name: 'Neutral', value: 45 },
    { name: 'Left Leaning', value: 30 },
    { name: 'Right Leaning', value: 25 },
  ];

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
            <h1 className="text-5xl font-black tracking-tighter text-[#fdf8f5] uppercase italic">Neural Overview</h1>
            <p className="text-[#d6c2b8] mt-3 font-black uppercase tracking-widest text-[10px] italic underline decoration-[#fdf8f5]/20">Real-time intelligence stream from the TruthLens core.</p>
          </div>
          <div className="flex gap-4">
            <button className="btn-primary gap-3 shadow-[0_0_30px_rgba(245,235,224,0.1)]">
              <HiOutlineLightningBolt className="w-5 h-5" />
              Initialize Analysis
            </button>
          </div>
        </div>
      </motion.div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
              { label: "Total Articles", value: stats?.totalArticles?.toLocaleString(), icon: HiOutlineCubeTransparent, color: "text-[#fdf8f5]", bg: "bg-[#fdf8f5]/5" },
              { label: "Avg Bias Score", value: stats?.avgBias, icon: HiOutlineTrendingUp, color: "text-[#fdf8f5]", bg: "bg-[#fdf8f5]/5" },
              { label: "Neural Fidelity", value: "99.2%", icon: HiOutlineShieldCheck, color: "text-[#fdf8f5]", bg: "bg-[#fdf8f5]/5" },
              { label: "Active Sources", value: stats?.activeSources, icon: HiOutlineInformationCircle, color: "text-[#fdf8f5]", bg: "bg-[#fdf8f5]/5" },
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
                      <p className="text-[9px] uppercase font-black text-[#8d7b68] tracking-[0.2em] mb-1 italic">{stat.label}</p>
                      <h3 className="text-3xl font-black text-[#fdf8f5] italic tracking-tighter tabular-nums">{stat.value}</h3>
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
                <h3 className="text-2xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">Temporal Bias Drift</h3>
                <span className="px-4 py-2 bg-[#fdf8f5]/10 text-[#fdf8f5] border border-[#fdf8f5]/20 text-[9px] font-black uppercase tracking-widest italic animate-pulse">LIVE STREAM</span>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
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
            </div>
          </motion.div>

          {/* Side Pie Chart Small Bento */}
          <motion.div className="lg:col-span-4 glass-card p-10 flex flex-col items-center justify-center overflow-hidden border-[#fdf8f5]/10 bg-[#261a14]/60 rounded-none shadow-2xl">
                <h3 className="text-2xl font-black text-[#fdf8f5] mb-8 w-full text-center uppercase italic tracking-tighter">Narrative Balance</h3>
                <div className="h-[260px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={10}
                            dataKey="value"
                            stroke="none"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-4xl font-black text-[#fdf8f5] italic tracking-tighter">45%</span>
                        <span className="text-[9px] font-black text-[#8d7b68] uppercase tracking-[0.2em] italic">Neutral</span>
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
           <h3 className="text-2xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">Recent Intelligence Ingestion</h3>
           <button className="text-[10px] font-black text-[#fdf8f5] hover:text-[#d6c2b8] flex items-center gap-3 tracking-[0.2em] uppercase italic transition-all group">
               VIEW FULL ARCHIVE <HiOutlineExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
           </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fdf8f5]/[0.03] text-[10px] font-black uppercase tracking-[0.3em] text-[#8d7b68] italic">
                <th className="px-10 py-6">Intel Package</th>
                <th className="px-10 py-6">Origin</th>
                <th className="px-10 py-6">Topic</th>
                <th className="px-10 py-6">Bias Flux</th>
                <th className="px-10 py-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#fdf8f5]/5">
              {recentAnalyses.map((item) => (
                <tr key={item.id} className="group hover:bg-[#fdf8f5]/[0.04] transition-all duration-300 cursor-pointer">
                  <td className="px-10 py-6">
                    <p className="text-sm font-black text-[#d6c2b8] group-hover:text-[#fdf8f5] group-hover:italic transition-all leading-snug max-w-md uppercase tracking-tight">
                      {item.title}
                    </p>
                  </td>
                  <td className="px-10 py-6">
                    <span className="px-4 py-1.5 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 text-[10px] font-black text-[#8d7b68] group-hover:text-[#fdf8f5] group-hover:border-[#fdf8f5]/30 transition-all uppercase tracking-widest italic">
                      {item.source}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                     <span className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.2em] italic group-hover:text-[#d6c2b8] transition-colors">{item.topic}</span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-1.5 w-24 bg-[#fdf8f5]/5 rounded-none overflow-hidden">
                        <div 
                          className="h-full bg-[#fdf8f5] shadow-[0_0_10px_rgba(253,248,245,0.4)]" 
                          style={{ width: `${Math.abs(item.biasScore * 100)}%` }} 
                        />
                      </div>
                      <span className="text-[11px] font-black text-[#fdf8f5] tabular-nums italic">{item.biasScore > 0 ? `+${item.biasScore.toFixed(1)}` : item.biasScore.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="flex items-center gap-2 text-[9px] font-black text-[#fdf8f5] uppercase tracking-[0.2em] italic border border-[#fdf8f5]/10 px-3 py-1.5 rounded-none bg-[#fdf8f5]/[0.03]">
                      <div className="w-2 h-2 rounded-full bg-[#fdf8f5] animate-pulse shadow-[0_0_8px_rgba(253,248,245,0.8)]" />
                      Analyzed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}
