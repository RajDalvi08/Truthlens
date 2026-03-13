"use client"
import React, { useState, useMemo } from "react"
import Navigation from "./Navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line, ScatterChart, Scatter, ZAxis
} from 'recharts'

// ==================== MOCK DATA ====================

const biasDistributionData = [
  { name: 'Left Bias', value: 32, color: '#4f46e5' },
  { name: 'Neutral', value: 45, color: '#06b6d4' },
  { name: 'Right Bias', value: 23, color: '#a855f7' },
]

const mediaSourceData = [
  { source: 'CNN', left: 0.8, neutral: 0.1, right: 0.1 },
  { source: 'Fox News', left: 0.1, neutral: 0.1, right: 0.8 },
  { source: 'BBC', left: 0.3, neutral: 0.6, right: 0.1 },
  { source: 'Reuters', left: 0.2, neutral: 0.7, right: 0.1 },
  { source: 'The Guardian', left: 0.7, neutral: 0.2, right: 0.1 },
]

const trendData = [
  { date: '2026-03-01', cnn: -0.6, fox: 0.7, bbc: -0.1, reuters: 0.0 },
  { date: '2026-03-03', cnn: -0.5, fox: 0.8, bbc: 0.0, reuters: -0.1 },
  { date: '2026-03-05', cnn: -0.7, fox: 0.6, bbc: -0.2, reuters: 0.1 },
  { date: '2026-03-07', cnn: -0.4, fox: 0.9, bbc: 0.1, reuters: 0.0 },
  { date: '2026-03-09', cnn: -0.6, fox: 0.7, bbc: -0.1, reuters: -0.1 },
  { date: '2026-03-11', cnn: -0.8, fox: 0.8, bbc: 0.0, reuters: 0.1 },
]

const heatmapData = [
  { topic: 'Politics', intensity: 0.9, color: '#4f46e5' },
  { topic: 'Economy', intensity: 0.6, color: '#6366f1' },
  { topic: 'Tech', intensity: 0.3, color: '#818cf8' },
  { topic: 'Health', intensity: 0.4, color: '#4f46e5' },
  { topic: 'Global', intensity: 0.7, color: '#6366f1' },
]

const scatterData = [
  { sentiment: -0.8, bias: -0.9, name: 'Article A' },
  { sentiment: 0.4, bias: -0.2, name: 'Article B' },
  { sentiment: 0.1, bias: 0.1, name: 'Article C' },
  { sentiment: -0.2, bias: 0.8, name: 'Article D' },
  { sentiment: 0.9, bias: 0.3, name: 'Article E' },
  { sentiment: -0.5, bias: 0.7, name: 'Article F' },
  { sentiment: 0.6, bias: -0.1, name: 'Article G' },
]

const headlines = [
  { id: 1, title: "Policy Shift Sparks Controversy in Capital", source: "Fox News", bias: 0.85, sentiment: -0.4, date: "2026-03-12", topic: "Politics" },
  { id: 2, title: "New Economic Reform Promises Stability", source: "BBC", bias: -0.1, sentiment: 0.6, date: "2026-03-11", topic: "Economy" },
  { id: 3, title: "Tech Giants Face New Regulations", source: "The Guardian", bias: -0.65, sentiment: -0.2, date: "2026-03-10", topic: "Technology" },
  { id: 4, title: "Global Health Summit Reaches Agreement", source: "Reuters", bias: 0.05, sentiment: 0.8, date: "2026-03-10", topic: "Health" },
  { id: 5, title: "Market Volatility Hits Record Highs", source: "CNN", bias: -0.75, sentiment: -0.8, date: "2026-03-09", topic: "Economy" },
]

const keywords = [
  { text: "Propaganda", size: 40, weight: "bold" },
  { text: "Agenda", size: 30, weight: "medium" },
  { text: "Biased", size: 35, weight: "bold" },
  { text: "Unverified", size: 25, weight: "normal" },
  { text: "Outrage", size: 32, weight: "medium" },
  { text: "Subjective", size: 28, weight: "normal" },
  { text: "Misleading", size: 38, weight: "bold" },
]

// ==================== COMPONENTS ====================

const Card = ({ title, children, className = "" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden group ${className}`}
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/0 via-cyan-500/50 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6 flex justify-between items-center">
      {title}
      <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
    </h3>
    {children}
  </motion.div>
)

const KPICard = ({ label, value, sub, color="cyan" }) => (
  <Card className="flex flex-col justify-center">
    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">{label}</p>
    <div className={`text-2xl font-black text-${color}-400 mt-1`}>{value}</div>
    <div className="text-[10px] text-gray-600 mt-2 italic font-mono">{sub}</div>
  </Card>
)

const WordCloud = () => (
  <div className="flex flex-wrap gap-4 items-center justify-center h-full p-4">
    {keywords.map((kw, i) => (
      <motion.span 
        key={i}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: i * 0.1 }}
        style={{ fontSize: kw.size, fontWeight: kw.weight }}
        className="text-indigo-400/80 hover:text-cyan-400 transition-colors cursor-default drop-shadow-sm"
        whileHover={{ scale: 1.1, rotate: Math.random() * 10 - 5 }}
      >
        {kw.text}
      </motion.span>
    ))}
  </div>
)

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState("Last 7 Days")
  const [selectedTopic, setSelectedTopic] = useState("All Topics")

  const filteredHeadlines = useMemo(() => {
    return headlines.filter(h => 
      (h.title.toLowerCase().includes(searchQuery.toLowerCase()) || h.source.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedTopic === "All Topics" || h.topic === selectedTopic)
    )
  }, [searchQuery, selectedTopic])

  return (
    <div className="flex min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
      <Navigation />

      <div className="flex-1 flex flex-col relative">
        {/* Background Neural Grid (CSS Only) */}
        <div className="absolute inset-0 bg-[radial-gradient(#111_1px,transparent_1px)] [background-size:40px_40px] opacity-20 pointer-events-none" />

        {/* Header */}
        <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/5 px-8 h-20 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                TruthLens
              </h1>
              <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[9px] font-mono text-indigo-400 uppercase tracking-widest">
                AI_PRO_ANALYSIS
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-mono mt-1">REAL-TIME BIAS INTELLIGENCE ARCHITECTURE</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
              {["Last 7 Days", "30 Days", "All Time"].map(r => (
                <button 
                  key={r}
                  onClick={() => setDateRange(r)}
                  className={`px-4 py-1.5 text-[10px] rounded-full transition-all font-mono uppercase tracking-widest ${dateRange === r ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="h-10 w-px bg-white/5" />
            <div className="flex items-center gap-3">
               <div className="text-right">
                  <p className="text-[10px] font-bold text-white">System Health</p>
                  <p className="text-[9px] font-mono text-emerald-500 uppercase">A_OK_SYNC</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black shadow-lg shadow-indigo-500/20">
                  TL
               </div>
            </div>
          </div>
        </header>

        <main className="p-8 space-y-8 relative z-10 overflow-auto">
          {/* KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard label="Articles Analyzed" value="48,291" sub="+1,204 in 24h" />
            <KPICard label="Avg Bias Score" value="0.52" sub="Leaning Center-Right" color="indigo" />
            <KPICard label="Neutral Ratio" value="42.8%" sub="Optimal Threshold" color="emerald" />
            <KPICard label="Most Biased Source" value="Fox News" sub="Score: 0.88 Right" color="fuchsia" />
          </div>

          {/* AI Insights Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 flex flex-col lg:flex-row items-center gap-6"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 shadow-[0_0_20px_#4f46e5]">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12L2.1 12.1"/><path d="m21.2 8.4-4.5 4.5"/><path d="m21.2 15.6-4.5-4.5"/><path d="m8.4 21.2 4.5-4.5"/><path d="m15.6 21.2-4.5-4.5"/><path d="m8.4 2.8 4.5 4.5"/><path d="m2.8 8.4 4.5 4.5"/><path d="m2.8 15.6 4.5-4.5"/><path d="m15.6 2.8-4.5 4.5"/></svg>
            </div>
            <div>
               <h4 className="text-xs font-mono font-black text-indigo-400 uppercase tracking-widest mb-1">AI_GEN_INSIGHT</h4>
               <p className="text-sm text-gray-300 leading-relaxed">
                  "Right-leaning bias increased by <span className="text-indigo-400 font-bold">12%</span> this week in political news coverage. 
                  Neural models detected a significant shift in legislative sentiment across <span className="text-cyan-400">EU-Region</span> articles."
               </p>
            </div>
            <button className="ml-auto px-4 py-2 border border-white/5 rounded-xl hover:bg-white/5 transition-all text-[10px] font-mono uppercase">Full Report</button>
          </motion.div>

          {/* Visualization Grid 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card title="1. Bias Distribution Profile">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={biasDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {biasDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a0a1a', border: '1px solid #111', borderRadius: '12px' }}
                      itemStyle={{ fontSize: '10px', color: '#fff' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontMono: 'true' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="2. Media Source Comparison Matrix">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mediaSourceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="source" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{ backgroundColor: '#0a0a1a', border: '1px solid #111', borderRadius: '12px' }} />
                    <Legend iconType="rect" />
                    <Bar dataKey="left" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="neutral" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="right" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Visualization Grid 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card title="3. Bias Trend Temporal Flow" className="lg:col-span-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="date" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0a0a1a', border: '1px solid #111', borderRadius: '12px' } } />
                    <Legend />
                    <Line type="monotone" dataKey="cnn" stroke="#4f46e5" strokeWidth={3} dot={{r: 4}} />
                    <Line type="monotone" dataKey="fox" stroke="#a855f7" strokeWidth={3} dot={{r: 4}} />
                    <Line type="monotone" dataKey="reuters" stroke="#06b6d4" strokeWidth={3} dot={{r: 4}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="4. Topic Bias Heatmap">
               <div className="space-y-4 h-[300px] flex flex-col justify-center">
                  {heatmapData.map((d, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="w-16 text-[9px] font-mono text-gray-500 uppercase">{d.topic}</span>
                      <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${d.intensity * 100}%` }}
                          transition={{ delay: i * 0.1, duration: 1 }}
                          className="h-full rounded-full" 
                          style={{ backgroundColor: d.color, boxShadow: `0 0 10px ${d.color}cc` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 w-8">{Math.round(d.intensity * 100)}%</span>
                    </div>
                  ))}
                  <div className="mt-4 text-[8px] font-mono text-gray-700 text-center uppercase tracking-[0.3em]">Intensity_Scale_Matrix</div>
               </div>
            </Card>
          </div>

          {/* Visualization Grid 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card title="5. Sentiment vs Bias Correlation">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                    <XAxis type="number" dataKey="sentiment" name="Sentiment" stroke="#555" fontSize={10} unit="" />
                    <YAxis type="number" dataKey="bias" name="Bias" stroke="#555" fontSize={10} unit="" />
                    <ZAxis type="number" range={[60, 400]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0a0a1a', border: '1px solid #111', borderRadius: '12px' }} />
                    <Scatter name="Articles" data={scatterData} fill="#06b6d4">
                       {scatterData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.bias > 0 ? '#a855f7' : entry.bias < 0 ? '#4f46e5' : '#06b6d4'} />
                       ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="7. Language Bias Word Cloud">
               <WordCloud />
            </Card>
          </div>

          {/* Headlines Table */}
          <Card title="6. Top Biased Headlines Archive" className="overflow-hidden">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
               <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="Search headlines or sources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  />
               </div>
               <select 
                 value={selectedTopic}
                 onChange={(e) => setSelectedTopic(e.target.value)}
                 className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-xs text-gray-400 outline-none"
               >
                  {["All Topics", "Politics", "Economy", "Technology", "Health"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
               </select>
            </div>
            
            <div className="overflow-x-auto">
               <table className="w-full text-left text-[11px]">
                  <thead>
                     <tr className="border-b border-white/5 text-gray-500 uppercase tracking-widest font-mono">
                        <th className="px-4 py-3 font-medium">Headline</th>
                        <th className="px-4 py-3 font-medium">Source</th>
                        <th className="px-4 py-3 font-medium">Bias</th>
                        <th className="px-4 py-3 font-medium">Sentiment</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {filteredHeadlines.map((h, i) => (
                       <motion.tr 
                          key={h.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="hover:bg-white/5 transition-colors group"
                        >
                          <td className="px-4 py-4 font-bold group-hover:text-indigo-400 transition-colors">{h.title}</td>
                          <td className="px-4 py-4 text-gray-400 font-mono">{h.source}</td>
                          <td className="px-4 py-4">
                             <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono uppercase font-bold ${h.bias > 0 ? 'text-purple-400 border-purple-500/20 bg-purple-500/5' : h.bias < 0 ? 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5' : 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5'}`}>
                                {h.bias > 0 ? `+${h.bias} Right` : h.bias < 0 ? `${h.bias} Left` : 'Neutral'}
                             </span>
                          </td>
                          <td className="px-4 py-4">
                             <div className="flex items-center gap-2">
                                <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                                   <div className={`h-full ${h.sentiment > 0 ? 'bg-emerald-500' : 'bg-fuchsia-500'}`} style={{ width: `${Math.abs(h.sentiment)*100}%` }} />
                                </div>
                                <span className="font-mono text-gray-600">{h.sentiment}</span>
                             </div>
                          </td>
                          <td className="px-4 py-4 text-gray-500 font-mono">{h.date}</td>
                       </motion.tr>
                     ))}
                  </tbody>
               </table>
            </div>
            <div className="mt-8 flex justify-center">
               <button className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 uppercase tracking-[0.3em] transition-all">Download_Archival_Data</button>
            </div>
          </Card>
        </main>

        {/* Neural Flux Decorations */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none" />
      </div>
    </div>
  )
}

export default Dashboard;
