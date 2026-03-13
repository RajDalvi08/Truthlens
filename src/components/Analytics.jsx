"use client"
import React, { useState, useMemo, useEffect, Suspense } from "react"
import Navigation from "./Navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line, ScatterChart, Scatter, ZAxis,
  ComposedChart, Area
} from 'recharts'

const BiasNetwork = React.lazy(() => import("./three/BiasNetwork"));

// ==================== MOCK DATA ====================

const biasDistributionData = [
  { name: 'Left Bias', value: 340, color: '#4f46e5' },
  { name: 'Neutral', value: 512, color: '#06b6d4' },
  { name: 'Right Bias', value: 288, color: '#a855f7' },
]

const trendData = [
  { date: '2026-03-01', cnn: -0.6, fox: 0.7, bbc: -0.1, reuters: 0.0, guardian: -0.8 },
  { date: '2026-03-03', cnn: -0.5, fox: 0.8, bbc: 0.0, reuters: -0.1, guardian: -0.7 },
  { date: '2026-03-05', cnn: -0.7, fox: 0.6, bbc: -0.2, reuters: 0.1, guardian: -0.9 },
  { date: '2026-03-07', cnn: -0.4, fox: 0.9, bbc: 0.1, reuters: 0.0, guardian: -0.6 },
  { date: '2026-03-09', cnn: -0.6, fox: 0.7, bbc: -0.1, reuters: -0.1, guardian: -0.7 },
  { date: '2026-03-11', cnn: -0.8, fox: 0.8, bbc: 0.0, reuters: 0.1, guardian: -0.8 },
]

const sourceComparisonData = [
  { name: 'CNN', score: -0.65, color: '#4f46e5' },
  { name: 'Fox News', score: 0.82, color: '#a855f7' },
  { name: 'BBC', score: -0.15, color: '#06b6d4' },
  { name: 'Reuters', score: 0.05, color: '#06b6d4' },
  { name: 'The Guardian', score: -0.72, color: '#4f46e5' },
].sort((a, b) => a.score - b.score)

const topicBiasData = [
  { topic: 'Politics', left: 45, neutral: 20, right: 35 },
  { topic: 'Economy', left: 30, neutral: 50, right: 20 },
  { topic: 'Tech', left: 15, neutral: 70, right: 15 },
  { topic: 'Health', left: 25, neutral: 60, right: 15 },
  { topic: 'Internal', left: 35, neutral: 30, right: 35 },
]

const scatterData = Array.from({ length: 40 }).map((_, i) => ({
  sentiment: Math.random() * 2 - 1,
  bias: Math.random() * 2 - 1,
  magnitude: Math.random() * 100
}))

const heatmapData = [
  { source: "CNN", Politics: 0.8, Economy: 0.4, Tech: 0.2, Health: 0.3, Global: 0.5 },
  { source: "Fox", Politics: 0.9, Economy: 0.6, Tech: 0.3, Health: 0.4, Global: 0.7 },
  { source: "BBC", Politics: 0.3, Economy: 0.2, Tech: 0.1, Health: 0.2, Global: 0.3 },
  { source: "Reuters", Politics: 0.2, Economy: 0.1, Tech: 0.1, Health: 0.1, Global: 0.2 },
  { source: "Guardian", Politics: 0.7, Economy: 0.5, Tech: 0.2, Health: 0.4, Global: 0.6 },
]

const headlines = [
  { id: 1, title: "Policy Shift Sparks Controversy in Capital", source: "Fox News", bias: 0.85, sentiment: -0.4, date: "2026-03-12" },
  { id: 2, title: "New Economic Reform Promises Stability", source: "BBC", bias: -0.1, sentiment: 0.6, date: "2026-03-11" },
  { id: 3, title: "Tech Giants Face New Regulations", source: "The Guardian", bias: -0.65, sentiment: -0.2, date: "2026-03-10" },
  { id: 4, title: "Global Health Summit Reaches Agreement", source: "Reuters", bias: 0.05, sentiment: 0.8, date: "2026-03-10" },
  { id: 5, title: "Market Volatility Hits Record Highs", source: "CNN", bias: -0.75, sentiment: -0.8, date: "2026-03-09" },
]

const biasedKeywords = [
  { text: "propaganda", val: 95 },
  { text: "controversial", val: 80 },
  { text: "radical", val: 88 },
  { text: "conservative", val: 75 },
  { text: "progressive", val: 72 },
  { text: "extremist", val: 92 },
  { text: "mainstream", val: 65 },
]

// ==================== COMPONENTS ====================

const Card = ({ title, children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group ${className}`}
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl pointer-events-none" />
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
        {title}
      </h3>
      <div className="flex gap-2">
        <button className="p-1.5 rounded-lg hover:bg-white/5 text-gray-600 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
        </button>
      </div>
    </div>
    {children}
  </motion.div>
)

const MetricCard = ({ label, value, sub, trend = "+", color = "indigo" }) => {
  const [count, setCount] = useState(0)
  const target = parseFloat(value.replace(/,/g, ''))

  useEffect(() => {
    let start = 0
    const duration = 2000
    const interval = 20
    const steps = duration / interval
    const increment = target / steps

    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, interval)
    return () => clearInterval(timer)
  }, [target])

  const formatted = isNaN(target) ? value : Math.round(count).toLocaleString()

  return (
    <Card className="flex flex-col justify-center min-h-[140px]">
      <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">{label}</p>
      <div className={`text-3xl font-black text-${color}-400 flex items-baseline gap-2`}>
        {formatted}{isNaN(target) ? '' : (value.includes('%') ? '%' : '')}
        <span className="text-[10px] text-emerald-500 font-bold">{trend}12%</span>
      </div>
      <p className="text-[9px] text-gray-600 mt-2 font-mono uppercase tracking-tighter">{sub}</p>
    </Card>
  )
}

const AIInsightPanel = () => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-8 flex flex-col gap-4 relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 blur-3xl" />
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 12L2.1 12.1" /><path d="m21.2 8.4-4.5 4.5" /><path d="m21.2 15.6-4.5-4.5" /></svg>
      </div>
      <h4 className="font-black text-xs uppercase tracking-[0.3em] text-indigo-300">AI Intelligence Summary</h4>
    </div>
    <p className="text-sm text-gray-300 leading-7 italic">
      "Political news coverage shows a <span className="text-indigo-400 font-bold">15% increase</span> in right-leaning bias over the past week, primarily driven by economic policy debates. Technology and Health articles remain <span className="text-cyan-400 font-bold">consistently neutral</span> across major global outlets. Sentiment volatility is peak in international coverage."
    </p>
    <div className="flex gap-4 mt-2">
      <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[9px] font-mono text-gray-500">CONFIDENCE: 94.2%</div>
      <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[9px] font-mono text-gray-500">SAMPLES: 48.2K</div>
    </div>
  </motion.div>
)

const HeatmapScale = () => (
  <div className="flex items-center gap-2 mt-4 self-end">
    <span className="text-[8px] font-mono text-gray-600">INTENSITY</span>
    <div className="flex h-1.5 w-32 rounded-full overflow-hidden bg-white/5">
      <div className="flex-1 bg-indigo-500/20" />
      <div className="flex-1 bg-indigo-500/50" />
      <div className="flex-1 bg-indigo-500/80" />
      <div className="flex-1 bg-indigo-500" />
    </div>
  </div>
)

function Analytics() {
  const [activeRange, setActiveRange] = useState("Last 7 Days")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex min-h-screen bg-[#030303] text-white selection:bg-indigo-500/30">
      <Navigation />

      <div className="flex-1 flex flex-col relative max-w-[100vw] overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 blur-[160px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-600/5 blur-[140px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        {/* Top Header / Filter Bar */}
        <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-3xl border-b border-white/5 px-8 h-24 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              TruthLens Intelligence
            </h1>
            <p className="text-[10px] text-gray-500 font-mono tracking-widest mt-1 uppercase">Advanced Neural Analytics Suite v4.2</p>
          </div>

          <div className="flex items-center gap-6">
            {/* Download/Export */}
            <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
              {["PDF", "CSV", "XLS"].map(ext => (
                <button key={ext} className="px-4 py-2 text-[9px] font-black text-gray-500 hover:text-white transition-all uppercase tracking-widest">
                  Export_{ext}
                </button>
              ))}
            </div>

            <div className="h-10 w-px bg-white/5" />

            {/* Range Toggle */}
            <div className="flex bg-white/5 rounded-full p-1 border border-white/10 shadow-inner">
              {["Last 7 Days", "30 Days", "90 Days", "All Time"].map(r => (
                <button
                  key={r}
                  onClick={() => setActiveRange(r)}
                  className={`px-5 py-2 text-[10px] rounded-full transition-all font-mono uppercase tracking-widest ${activeRange === r ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'text-gray-500 hover:text-white'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="p-8 space-y-8 relative z-10 overflow-auto pb-32">

          {/* 10. Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <MetricCard label="Total Articles" value="128,491" sub="Across 142 Sources" color="cyan" />
            <MetricCard label="Average Bias" value="0.42" sub="Leaning Center-Left" trend="-" color="indigo" />
            <MetricCard label="Neutral Ratio" value="54.8%" sub="High Objectivity" color="emerald" />
            <MetricCard label="Max Bias Source" value="Fox News" sub="Right Score: 0.88" trend="" color="fuchsia" />
            <MetricCard label="Highest Bias Topic" value="Politics" sub="Impact: 0.92" trend="" color="purple" />
          </div>

          {/* 3D Bias Relationship Network */}
          <Suspense fallback={
            <div className="w-full h-[500px] rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm text-gray-500 font-mono">Loading 3D Network...</p>
              </div>
            </div>
          }>
            <BiasNetwork />
          </Suspense>

          {/* AI Insight & Heatmap Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AIInsightPanel />
            </div>
            {/* 8. Word Cloud Simplified */}
            <Card title="8. Keyword Bias Salience" className="flex flex-col">
              <div className="flex-1 flex flex-wrap gap-4 items-center justify-center p-4">
                {biasedKeywords.map((kw, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ fontSize: kw.val / 3 }}
                    className="text-indigo-400 hover:text-cyan-400 transition-colors cursor-pointer font-bold select-none drop-shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {kw.text}
                  </motion.span>
                ))}
              </div>
              <p className="text-[8px] text-gray-700 font-mono text-center uppercase tracking-widest mt-4">Top_Keywords_Weighted_By_Frequency</p>
            </Card>
          </div>

          {/* Visualization Grid 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 1. Bias Distribution */}
            <Card title="1. Global Bias Distribution Profile">
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={biasDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={10}
                      dataKey="value"
                      stroke="none"
                    >
                      {biasDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#050510', border: '1px solid #222', borderRadius: '16px' }}
                      itemStyle={{ fontSize: '11px', color: '#fff' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontMono: 'true', paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* 2. Bias Trend Timeline */}
            <Card title="2. Temporal Bias Fluctuations">
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="date" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} domain={[-1, 1]} />
                    <Tooltip contentStyle={{ backgroundColor: '#050510', border: '1px solid #222', borderRadius: '16px' }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Line type="monotone" dataKey="cnn" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                    <Line type="monotone" dataKey="fox" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                    <Line type="monotone" dataKey="reuters" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Visualization Grid 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 3. Media Source Bias Comparison */}
            <Card title="3. Source-Level Sentiment Benchmarks">
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceComparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#111" horizontal={true} vertical={false} />
                    <XAxis type="number" domain={[-1, 1]} stroke="#555" fontSize={10} />
                    <YAxis dataKey="name" type="category" stroke="#555" fontSize={10} width={80} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#050510', border: '1px solid #222', borderRadius: '16px' }} />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                      {sourceComparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.score > 0 ? '#ef4444' : entry.score < -0.3 ? '#3b82f6' : '#6b7280'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {[{ l: "Left", c: "bg-blue-500" }, { l: "Neut", c: "bg-gray-500" }, { l: "Right", c: "bg-red-500" }].map(i => (
                  <div key={i.l} className="flex items-center gap-1.5 text-[8px] font-mono text-gray-500">
                    <div className={`w-1.5 h-1.5 rounded-full ${i.c}`} /> {i.l}
                  </div>
                ))}
              </div>
            </Card>

            {/* 4. Topic-Based Bias Stacked */}
            <Card title="4. Categorical Bias Density">
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topicBiasData} stackOffset="expand">
                    <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
                    <XAxis dataKey="topic" stroke="#555" fontSize={10} />
                    <YAxis stroke="#555" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#050510', border: '1px solid #222', borderRadius: '16px' }} />
                    <Legend verticalAlign="top" iconType="rect" align="right" wrapperStyle={{ fontSize: '10px', paddingBottom: '20px' }} />
                    <Bar dataKey="left" stackId="a" fill="#4f46e5" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="neutral" stackId="a" fill="#06b6d4" />
                    <Bar dataKey="right" stackId="a" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* 6. Heatmap Section */}
          <Card title="6. Cross-Variable Bias Intensity Heatmap">
            <div className="mt-4 flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 w-full overflow-x-auto">
                <div className="inline-grid grid-cols-[100px_repeat(5,1fr)] gap-2 min-w-[600px] w-full">
                  {/* Header */}
                  <div />
                  {["Politics", "Economy", "Tech", "Health", "Global"].map(t => (
                    <div key={t} className="text-[10px] font-black text-gray-600 uppercase tracking-widest text-center">{t}</div>
                  ))}

                  {/* Rows */}
                  {heatmapData.map((row, i) => (
                    <React.Fragment key={i}>
                      <div className="text-[10px] font-mono text-gray-500 flex items-center">{row.source}</div>
                      {["Politics", "Economy", "Tech", "Health", "Global"].map(topic => {
                        const val = row[topic]
                        const opacity = 0.1 + val * 0.9
                        return (
                          <motion.div
                            key={topic}
                            whileHover={{ scale: 0.95 }}
                            className="aspect-[3/1] rounded-xl relative group cursor-pointer border border-white/5"
                            style={{ backgroundColor: `rgba(79, 70, 229, ${opacity})` }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-[10px] font-mono font-bold">{val.toFixed(1)}</span>
                            </div>
                          </motion.div>
                        )
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-64 space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-mono text-gray-500 uppercase leading-relaxed">
                    Top_Correlation_Found: <br />
                    <span className="text-indigo-400 font-bold">FOX_POLITICS :: 0.9</span> <br />
                    <span className="text-cyan-400 font-bold">REUTERS_TECH :: 0.1</span>
                  </p>
                </div>
                <HeatmapScale />
              </div>
            </div>
          </Card>

          {/* Bottom Grid: Scatter & Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 5. Sentiment vs Bias Scatter */}
            <Card title="5. Sentiment v Bias Correlation Mapping" className="lg:col-span-1">
              <div className="h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                    <XAxis type="number" dataKey="sentiment" name="Sentiment" stroke="#555" fontSize={10} domain={[-1, 1]} />
                    <YAxis type="number" dataKey="bias" name="Bias" stroke="#555" fontSize={10} domain={[-1, 1]} />
                    <ZAxis type="number" dataKey="magnitude" range={[50, 400]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#050510', border: '1px solid #222', borderRadius: '16px' }} />
                    <Scatter name="Articles" data={scatterData} fill="#4f46e5">
                      {scatterData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.bias > 0 ? '#a855f7' : entry.bias < 0 ? '#4f46e5' : '#06b6d4'} fillOpacity={0.6} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* 7. Most Biased Headlines Table */}
            <Card title="7. Biased Intelligence Archive" className="lg:col-span-2 overflow-hidden flex flex-col">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search archive vectors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <select className="bg-black border border-white/10 rounded-2xl px-4 py-3 text-[10px] text-gray-400 font-mono uppercase">
                    <option>All Sources</option>
                    <option>CNN</option>
                    <option>Fox News</option>
                  </select>
                  <button className="px-5 py-3 bg-white/5 rounded-2xl text-[10px] font-mono text-indigo-400 hover:bg-white/10 border border-white/5">FILTER_ADV</button>
                </div>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="text-gray-600 font-mono uppercase tracking-[0.2em] border-b border-white/5">
                      <th className="px-6 py-4 font-black">Headline_Vector</th>
                      <th className="px-6 py-4 font-black">Link_Source</th>
                      <th className="px-6 py-4 font-black">Bias_Sc</th>
                      <th className="px-6 py-4 font-black">Sent_Sc</th>
                      <th className="px-6 py-4 font-black">Pub_Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {headlines.map((h, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-6 py-5 font-bold text-gray-200 group-hover:text-indigo-400 transition-colors">{h.title}</td>
                        <td className="px-6 py-5 text-gray-500 font-mono italic">{h.source}</td>
                        <td className="px-6 py-5">
                          <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-black ${h.bias > 0 ? 'text-purple-400 border-purple-500/20 bg-purple-500/5' : 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5'}`}>
                            {h.bias > 0 ? `+${h.bias}` : h.bias}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`font-mono font-bold ${h.sentiment > 0.4 ? 'text-emerald-500' : 'text-gray-500'}`}>{h.sentiment}</span>
                        </td>
                        <td className="px-6 py-5 text-gray-600 font-mono">{h.date}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-8 flex justify-between items-center border-t border-white/5 pt-6">
                <p className="text-[9px] text-gray-600 font-mono">SHOWING 1-5 OF 48,291 RECORDS</p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black tracking-widest hover:text-indigo-400 transition-colors">PREV</button>
                  <button className="px-4 py-2 bg-indigo-600 rounded-xl text-[9px] font-black tracking-widest text-white shadow-lg shadow-indigo-600/20">NEXT</button>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Analytics;
