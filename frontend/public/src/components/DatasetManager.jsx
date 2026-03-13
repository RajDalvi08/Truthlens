import React from "react";
import { motion } from "framer-motion";
import Navigation from "./Navigation";

export default function DatasetManager() {
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-fuchsia-900/10 via-[var(--bg-primary)] to-[var(--bg-primary)] z-0 pointer-events-none"></div>

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
            <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div>
              <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                Dataset Manager
              </h1>
              <p className="text-fuchsia-400 font-mono uppercase tracking-widest mt-2 text-sm">Corpus Management & Training Data</p>
              <p className="text-gray-400 mt-4 max-w-2xl leading-relaxed">
                Manage foundational Truth-Sets. Upload new training data, modify existing classification weights, and curate unbiased baseline sets.
              </p>
            </div>
          </motion.div>

           {/* Placeholder Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -5, borderColor: "rgba(217, 70, 239, 0.4)" }}
                  className="bg-[var(--bg-elevated)] border border-white/5 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300"
                >
                   <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">Dataset Bundle 2024.Q{i}</h3>
                        <p className="text-xs text-gray-500 font-mono mt-1">2.4m Articles • English</p>
                      </div>
                      <span className="px-3 py-1 bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/30 rounded-full text-xs font-bold uppercase">Active</span>
                   </div>
                   <div className="flex gap-4">
                        <button className="flex-1 py-2 rounded-xl border border-white/20 bg-transparent font-bold text-sm text-white hover:bg-white/5 transition-colors">Configure</button>
                        <button className="flex-1 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 font-bold text-sm text-white shadow-lg opacity-80 hover:opacity-100">Export</button>
                   </div>
                </motion.div>
              ))}
            </div>

        </motion.div>
      </main>
    </div>
  );
}
