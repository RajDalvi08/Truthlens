"use client"
import React from "react";
import { motion } from "framer-motion";

const revenueData = [
  { month: "Jan", revenue: 45000, costs: 12000 },
  { month: "Feb", revenue: 52000, costs: 14000 },
  { month: "Mar", revenue: 48000, costs: 13000 },
  { month: "Apr", revenue: 61000, costs: 16000 },
  { month: "May", revenue: 59000, costs: 15000 },
  { month: "Jun", revenue: 75000, costs: 18000 },
  { month: "Jul", revenue: 82000, costs: 20000 },
];

const stats = [
  { label: "Total Revenue", value: "$422,000", change: "+18.5%", isPositive: true },
  { label: "Operating Costs", value: "$108,000", change: "-2.4%", isPositive: true },
  { label: "Net Profit", value: "$314,000", change: "+24.8%", isPositive: true },
  { label: "Active Users", value: "8,942", change: "+12.1%", isPositive: true },
];

function AreaChart({ data }) {
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const width = 800;
  const height = 300;
  const padding = 60;

  const getX = (i) => padding + (i / (data.length - 1)) * (width - padding * 2);
  const getY = (val) => height - padding - (val / maxRevenue) * (height - padding * 2);

  const createPath = (key) => data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d[key])}`).join(" ");
  
  const createAreaPath = (key) => {
    return `${createPath(key)} L ${getX(data.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`;
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full min-h-[300px] drop-shadow-2xl">
      <defs>
        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="costsGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid */}
      {[0, 1, 2, 3, 4].map(i => (
        <line key={i} x1={padding} y1={padding + (i * (height - padding * 2)) / 4} x2={width - padding} y2={padding + (i * (height - padding * 2)) / 4} stroke="#fdf8f5" strokeDasharray="6 6" strokeOpacity="0.05" />
      ))}

      {/* Areas */}
      <motion.path d={createAreaPath("revenue")} fill="url(#revenueGrad)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} />
      <motion.path d={createAreaPath("costs")} fill="url(#costsGrad)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.3 }} />

      {/* Lines */}
      <motion.path d={createPath("revenue")} fill="none" stroke="#10b981" strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }} />
      <motion.path d={createPath("costs")} fill="none" stroke="#ef4444" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }} />

      {/* Points & Labels */}
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={getX(i)} cy={getY(d.revenue)} r="5" fill="#10b981" stroke="#1a0f0a" strokeWidth="3" className="shadow-2xl" />
          <text x={getX(i)} y={height - 20} textAnchor="middle" fill="#8d7b68" fontSize="10" className="font-black italic uppercase tracking-widest">{d.month}</text>
        </g>
      ))}
    </svg>
  );
}

export default function Revenue() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-24 mesh-bg">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#fdf8f5]/10 pb-12">
            <div>
              <h1 className="text-5xl font-black text-[#fdf8f5] tracking-tighter uppercase italic leading-none">Revenue Overview</h1>
              <p className="text-[#8d7b68] text-[10px] mt-4 font-black uppercase tracking-[0.3em] italic underline decoration-[#fdf8f5]/10 leading-relaxed">Status: OPERATIONAL // Neural Node Secure Flux</p>
            </div>
            <div className="flex gap-6">
              <button 
                className="px-10 py-4 rounded-none border border-[#fdf8f5]/10 bg-[#fdf8f5]/5 hover:bg-[#fdf8f5]/10 transition-all font-black text-[10px] uppercase tracking-[0.3em] text-[#8d7b68] hover:text-[#fdf8f5] italic shadow-xl"
              >
                Download Report
              </button>
              <button 
                className="btn-primary px-10 py-4 shadow-2xl transition-all italic"
              >
                Create Summary
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-12">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className="bg-[#261a14]/60 border border-[#fdf8f5]/10 rounded-none p-10 relative overflow-hidden group transition-all duration-700 hover:border-[#fdf8f5]/40 shadow-2xl"
              >
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-[#fdf8f5]/5 rounded-none blur-[60px] group-hover:bg-[#fdf8f5]/10 transition-all duration-1000"></div>
                
                <h3 className="text-[9px] text-[#8d7b68] font-black uppercase tracking-[0.3em] mb-6 italic underline decoration-[#fdf8f5]/10">{stat.label}</h3>
                <div className="flex items-end justify-between relative z-10">
                  <span className="text-4xl font-black text-[#fdf8f5] tracking-tighter tabular-nums italic shadow-2xl">{stat.value}</span>
                  <span className={`text-[10px] font-black italic flex items-center gap-2 uppercase tracking-widest ${stat.isPositive ? 'text-[#fdf8f5]' : 'text-[#8d7b68]'}`}>
                    {stat.isPositive ? '▲' : '▼'} {stat.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Chart */}
          <motion.div 
            variants={itemVariants}
            className="bg-[#261a14]/60 border border-[#fdf8f5]/10 rounded-none p-12 relative overflow-hidden mt-12 shadow-2xl group"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-[#fdf8f5]/5 group-hover:bg-[#fdf8f5]/20 transition-all" />
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div>
                <h3 className="text-3xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">Revenue Trends</h3>
                <p className="text-[10px] text-[#8d7b68] font-black uppercase tracking-[0.3em] mt-3 italic underline decoration-[#fdf8f5]/10">Earnings vs Expenses</p>
              </div>
              <div className="flex items-center gap-10">
                <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-none bg-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.6)]"></div>
                  <span className="text-[10px] text-[#d6c2b8] font-black uppercase tracking-[0.3em] italic">Revenue</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-none bg-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.4)]"></div>
                  <span className="text-[10px] text-[#d6c2b8] font-black uppercase tracking-[0.3em] italic">Protocol Costs</span>
                </div>
              </div>
            </div>
            <div className="w-full h-[400px] relative z-10">
              <AreaChart data={revenueData} />
            </div>
          </motion.div>

          {/* Recent Transactions Table */}
          <motion.div 
            variants={itemVariants}
            className="bg-[#261a14]/60 border border-[#fdf8f5]/10 rounded-none overflow-hidden mt-12 shadow-2xl"
          >
            <div className="p-10 border-b border-[#fdf8f5]/10 bg-[#fdf8f5]/[0.02]">
              <h3 className="text-2xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">Recent Subscriptions</h3>
              <p className="text-[9px] text-[#8d7b68] uppercase tracking-[0.3em] mt-2 italic">Subscription History</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#1a0f0a]/80 text-[#8d7b68] font-black text-[10px] uppercase tracking-[0.3em] italic border-b border-[#fdf8f5]/5">
                  <tr>
                    <th className="px-10 py-6 font-black">User ID</th>
                    <th className="px-10 py-6 font-black">Subscription Plan</th>
                    <th className="px-10 py-6 font-black">Price</th>
                    <th className="px-10 py-6 font-black">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#fdf8f5]/5">
                  {[
                    { id: "usr_8fa9...", plan: "Pro Plan", amount: "$99.00", status: "Active" },
                    { id: "usr_2cb4...", plan: "Enterprise Plan", amount: "$499.00", status: "Active" },
                    { id: "usr_9ee1...", plan: "Standard Plan", amount: "$29.00", status: "Inactive" },
                    { id: "usr_5ab0...", plan: "Pro Plan", amount: "$99.00", status: "Active" },
                  ].map((row, i) => (
                    <motion.tr 
                      key={i}
                      whileHover={{ backgroundColor: "rgba(253,248,245,0.03)" }}
                      className="transition-all group relative"
                    >
                      <td className="px-10 py-8 font-black text-[#4d3c2e] text-[11px] tracking-widest italic group-hover:text-[#8d7b68] transition-colors">{row.id}</td>
                      <td className="px-10 py-8 text-[#fdf8f5] font-black uppercase text-sm italic tracking-tighter leading-none group-hover:translate-x-2 transition-transform">{row.plan}</td>
                      <td className="px-10 py-8 font-black text-[#fdf8f5] tabular-nums text-lg italic tracking-tighter shadow-2xl">{row.amount}</td>
                      <td className="px-10 py-8">
                        <span className={`px-5 py-2 rounded-none text-[9px] font-black uppercase tracking-[0.3em] italic shadow-xl transition-all ${
                          row.status === 'Active' ? 'bg-[#fdf8f5] text-[#1a0f0a]' : 'bg-[#fdf8f5]/5 text-[#8d7b68] border border-[#fdf8f5]/10 group-hover:border-[#fdf8f5]/30 group-hover:text-[#fdf8f5]'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

        </motion.div>
    </div>
  );
}
