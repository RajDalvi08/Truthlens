import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Navigation from "./Navigation";

export default function Methodology() {
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-[var(--bg-primary)] to-[var(--bg-primary)] pointer-events-none z-0"></div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto space-y-12 relative z-10">
          <div className="text-center pt-10">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">Algorithm Methodology</h1>
            <p className="text-gray-400 mt-4 leading-relaxed max-w-2xl mx-auto font-light">Deep dive into the neural architectures that power real-time bias detection and sentiment parsing across global news networks.</p>
          </div>

          <div className="space-y-8">
            <motion.div variants={itemVariants} className="bg-[var(--bg-secondary)] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-500"></div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-mono text-sm">01</span>
                Semantic Vectorization
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">Text is first parsed and converted into high-dimensional vectors. We employ transformer-based LLMs fine-tuned specifically on political corpora to encode contextual meaning beyond simple keyword matching.</p>
              <div className="w-full h-1 bg-gradient-to-r from-cyan-500/50 to-transparent rounded-full mt-6"></div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-[var(--bg-secondary)] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl group-hover:bg-fuchsia-500/20 transition-all duration-500"></div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 font-mono text-sm">02</span>
                Bias Spectrum Plotting
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">The semantic vectors are passed through a regression model trained on over 5 million manually annotated, hyper-partisan articles. The model plots the article on an axis ranging from Far Left (-1.0) to Far Right (+1.0), accounting for loaded vocabulary and rhetorical emphasis.</p>
              <div className="w-full h-1 bg-gradient-to-r from-fuchsia-500/50 to-transparent rounded-full mt-6"></div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-[var(--bg-secondary)] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500"></div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-mono text-sm">03</span>
                Source Credibility Cross-referencing
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">Before outputting the final Neural Accuracy score, the engine pings recognized journalistic databases (like AP, Reuters, independent auditors) to weigh factual claims. Articles with unverified factual leaps receive severe penalty scores.</p>
              <div className="w-full h-1 bg-gradient-to-r from-purple-500/50 to-transparent rounded-full mt-6"></div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
