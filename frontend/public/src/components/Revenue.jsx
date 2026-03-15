import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Navigation from "./Navigation";

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
  { label: "API Costs", value: "$108,000", change: "-2.4%", isPositive: true },
  { label: "Net Profit", value: "$314,000", change: "+24.8%", isPositive: true },
  { label: "Active Subscribers", value: "8,942", change: "+12.1%", isPositive: true },
];

function AreaChart({ data }) {
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const width = 800;
  const height = 300;
  const padding = 40;

  const getX = (i) => padding + (i / (data.length - 1)) * (width - padding * 2);
  const getY = (val) => height - padding - (val / maxRevenue) * (height - padding * 2);

  const createPath = (key) => data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d[key])}`).join(" ");
  
  const createAreaPath = (key) => {
    return `${createPath(key)} L ${getX(data.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`;
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full min-h-[300px] drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
      <defs>
        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="costsGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d946ef" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#d946ef" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid */}
      {[0, 1, 2, 3, 4].map(i => (
        <line key={i} x1={padding} y1={padding + (i * (height - padding * 2)) / 4} x2={width - padding} y2={padding + (i * (height - padding * 2)) / 4} stroke="#374151" strokeDasharray="4 4" strokeOpacity="0.5" />
      ))}

      {/* Areas */}
      <path d={createAreaPath("revenue")} fill="url(#revenueGrad)" />
      <path d={createAreaPath("costs")} fill="url(#costsGrad)" />

      {/* Lines */}
      <path d={createPath("revenue")} fill="none" stroke="#06b6d4" strokeWidth="3" />
      <path d={createPath("costs")} fill="none" stroke="#d946ef" strokeWidth="3" />

      {/* Points & Labels */}
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={getX(i)} cy={getY(d.revenue)} r="4" fill="#06b6d4" stroke="var(--bg-primary)" strokeWidth="2" />
          <circle cx={getX(i)} cy={getY(d.costs)} r="4" fill="#d946ef" stroke="var(--bg-primary)" strokeWidth="2" />
          <text x={getX(i)} y={height - 15} textAnchor="middle" fill="#9ca3af" fontSize="12" className="font-mono">{d.month}</text>
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
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[#FDEBD0]">
      <Navigation />

      <main className="flex-1 overflow-auto p-8 relative">
        {/* Ambient Background Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGgyMHYyMEgwVTB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMTlMMjAgMTlNMCAwTDIwIDAiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTE5IDBMMTkgMjBNMCAwTDAgMjAiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] z-0 opacity-50 block"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent pointer-events-none z-0"></div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto space-y-8 relative z-10"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Financial Overview</h1>
              <p className="text-sm text-cyan-400 mt-1 uppercase tracking-widest font-mono">Status: Secure</p>
            </div>
            <div className="flex gap-4">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-xl border border-white/20 bg-[var(--bg-elevated)] hover:bg-white/5 transition-colors font-bold text-sm"
              >
                Export CSV
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(6,182,212,0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-sm text-white shadow-lg"
              >
                Generate Report
              </motion.button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(6,182,212,0.3)" }}
                className="bg-[var(--bg-secondary)] border border-white/5 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300"
              >
                <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all duration-500"></div>
                
                <h3 className="text-sm text-gray-400 font-medium mb-2">{stat.label}</h3>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-black text-white tracking-tight">{stat.value}</span>
                  <span className={`text-sm font-bold flex items-center gap-1 ${stat.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stat.isPositive ? '▲' : '▼'} {stat.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Chart */}
          <motion.div 
            variants={itemVariants}
            className="bg-[var(--bg-secondary)] border border-white/5 rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-white">Revenue vs Operating Costs</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                  <span className="text-xs text-gray-400">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.8)]"></div>
                  <span className="text-xs text-gray-400">API Costs</span>
                </div>
              </div>
            </div>
            <div className="w-full h-[300px]">
              <AreaChart data={revenueData} />
            </div>
          </motion.div>

          {/* Recent Transactions Table */}
          <motion.div 
            variants={itemVariants}
            className="bg-[var(--bg-secondary)] border border-white/5 rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">Recent Subscriptions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--bg-elevated)] text-gray-400 font-mono text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-medium">User ID</th>
                    <th className="px-6 py-4 font-medium">Plan</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-[var(--bg-secondary)]">
                  {[
                    { id: "usr_8fa9...", plan: "Pro Analyst", amount: "$99.00", status: "Completed" },
                    { id: "usr_2cb4...", plan: "Enterprise", amount: "$499.00", status: "Completed" },
                    { id: "usr_9ee1...", plan: "Standard", amount: "$29.00", status: "Pending" },
                    { id: "usr_5ab0...", plan: "Pro Analyst", amount: "$99.00", status: "Completed" },
                  ].map((row, i) => (
                    <motion.tr 
                      key={i}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                    >
                      <td className="px-6 py-4 font-mono text-cyan-400">{row.id}</td>
                      <td className="px-6 py-4 text-gray-300">{row.plan}</td>
                      <td className="px-6 py-4 font-bold text-white">{row.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          row.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
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
      </main>
    </div>
  );
}
