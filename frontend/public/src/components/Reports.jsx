import React from "react";
import { motion } from "framer-motion";
import Navigation from "./Navigation";

export default function Reports() {
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/10 via-[var(--bg-primary)] to-[var(--bg-primary)] z-0 pointer-events-none"></div>

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
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    Generated Reports
                  </h1>
                  <p className="text-emerald-400 font-mono uppercase tracking-widest mt-2 text-sm">Audits & Compiled Output</p>
                  <p className="text-gray-400 mt-4 max-w-2xl leading-relaxed">
                    Access historical bias audits, system compliance documents, and automated network summaries.
                  </p>
                </div>
                
                <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-sm text-white shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                   <span>+</span> New Report
                </button>
            </div>
          </motion.div>

           {/* Placeholder Reports List */}
           <motion.div variants={itemVariants} className="bg-[var(--bg-secondary)] border border-white/5 rounded-2xl overflow-hidden">
               <div className="grid grid-cols-4 gap-4 p-4 border-b border-white/10 text-xs font-bold text-gray-500 uppercase tracking-wider bg-white/5">
                   <div className="col-span-2">Report Name</div>
                   <div>Date Generated</div>
                   <div>Status</div>
               </div>
               
               {[1, 2, 3, 4, 5].map((i) => (
                   <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors items-center cursor-pointer">
                    <div className="col-span-2">
                        <p className="text-sm font-bold text-white">Q1 Media Bias Synthesis Report</p>
                        <p className="text-xs text-gray-500 mt-1">PDF • 2.4 MB</p>
                    </div>
                    <div className="text-sm text-gray-400 font-mono">2026-03-{10+i}</div>
                    <div>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                           Ready
                        </span>
                    </div>
                </div>
               ))}
           </motion.div>

        </motion.div>
      </main>
    </div>
  );
}
