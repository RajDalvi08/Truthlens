import React, { Suspense, useState } from "react";
import { motion } from "framer-motion";
import Navigation from "./Navigation";

const BiasGlobe = React.lazy(() => import("./three/BiasGlobe"));

const REGION_STATS = [
  { region: "North America", bias: "+0.42", trend: "Right-leaning", articles: "183K", color: "text-purple-400" },
  { region: "Europe", bias: "-0.22", trend: "Center-left", articles: "186K", color: "text-indigo-400" },
  { region: "Asia Pacific", bias: "+0.15", trend: "Mixed", articles: "176K", color: "text-cyan-400" },
  { region: "Middle East", bias: "+0.38", trend: "Polarized", articles: "62K", color: "text-orange-400" },
  { region: "Africa", bias: "+0.30", trend: "Mixed", articles: "28K", color: "text-amber-400" },
  { region: "Latin America", bias: "+0.18", trend: "Mixed", articles: "45K", color: "text-emerald-400" },
];

export default function GlobePage() {
  return (
    <div className="flex min-h-screen bg-[#030303] text-white selection:bg-indigo-500/30">
      <Navigation />

      <div className="flex-1 flex flex-col relative max-w-[100vw] overflow-hidden">
        {/* Background blurs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 blur-[160px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-600/5 blur-[140px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        {/* Header */}
        <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-3xl border-b border-white/5 px-8 h-24 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Global Bias Intelligence
            </h1>
            <p className="text-[10px] text-gray-500 font-mono tracking-widest mt-1 uppercase">3D Interactive Regional Bias Map</p>
          </div>
        </header>

        <main className="p-8 space-y-8 relative z-10 overflow-auto pb-32">
          {/* Globe */}
          <Suspense fallback={
            <div className="w-full h-[600px] rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm text-gray-500 font-mono">Rendering Globe...</p>
              </div>
            </div>
          }>
            <BiasGlobe />
          </Suspense>

          {/* Regional Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REGION_STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -3, borderColor: "rgba(255,255,255,0.15)" }}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-white font-bold text-sm">{stat.region}</h4>
                  <span className={`text-lg font-black ${stat.color}`}>{stat.bias}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-gray-600">TREND</span>
                    <span className="text-gray-400">{stat.trend}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-gray-600">ARTICLES</span>
                    <span className="text-cyan-400">{stat.articles}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
