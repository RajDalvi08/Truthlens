import React from "react";
import { motion } from "framer-motion";
import Navigation from "./Navigation";

export default function BiasAnalyzer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[#FDEBD0]">
      <Navigation />

      <main className="flex-1 overflow-auto p-8 relative">
        {/* Ambient Dark Tech Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[var(--bg-primary)] to-[var(--bg-primary)] z-0 pointer-events-none"></div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto space-y-8 relative z-10"
        >
          {/* Header Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-[var(--bg-secondary)] border border-white/5 rounded-3xl p-8 relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div>
              <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                Bias Analyzer
              </h1>
              <p className="text-cyan-400 font-mono uppercase tracking-widest mt-2 text-sm">Advanced NLP Processing Module</p>
              <p className="text-gray-400 mt-4 max-w-2xl leading-relaxed">
                Analyze articles using state-of-the-art Natural Language Processing. Identify political leanings, emotional framing, and logical fallacies in real-time.
              </p>
              
              <div className="mt-8 flex items-center justify-center border-2 border-dashed border-cyan-500/30 rounded-2xl p-12 bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors cursor-pointer group">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-[var(--bg-elevated)] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.3)] border border-cyan-500/50">
                        <span className="text-2xl">⚡</span>
                    </div>
                    <p className="text-white font-bold text-lg">Paste Text or URL</p>
                    <p className="text-sm text-gray-400 mt-1">Ctrl+V to analyze instantly</p>
                  </div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
}
