import React from "react";
import { motion } from "framer-motion";
import Navigation from "./Navigation";

export default function Settings() {
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900/40 via-[var(--bg-primary)] to-[var(--bg-primary)] z-0 pointer-events-none"></div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-8 relative z-10"
        >
          {/* Header Component */}
          <motion.div variants={itemVariants}>
              <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                System Settings
              </h1>
              <p className="text-gray-500 font-mono mt-2 text-sm">Configure Preferences & API Access</p>
          </motion.div>

          {/* Settings Sections */}
          <motion.div 
            variants={itemVariants}
            className="bg-[var(--bg-secondary)] border border-white/5 rounded-3xl p-8 relative overflow-hidden space-y-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
             
             {/* General Settings */}
             <div className="border-b border-white/10 pb-8">
                 <h2 className="text-lg font-bold text-white mb-6 flexItems-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block shrink-0"></span> General Application Settings
                 </h2>
                 <div className="space-y-4 max-w-2xl">
                     <div className="flex justify-between items-center bg-[var(--bg-elevated)] p-4 rounded-xl border border-white/5">
                         <div>
                            <p className="text-sm font-bold text-white">Dark Mode Navigation</p>
                            <p className="text-xs text-gray-500 mt-1">Force dark mode for primary console viewing</p>
                         </div>
                         <div className="w-12 h-6 bg-cyan-500 rounded-full relative cursor-pointer">
                             <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-md"></div>
                         </div>
                     </div>
                     <div className="flex justify-between items-center bg-[var(--bg-elevated)] p-4 rounded-xl border border-white/5">
                         <div>
                            <p className="text-sm font-bold text-white">Daily Summary Emails</p>
                            <p className="text-xs text-gray-500 mt-1">Receive automated bias analytics reports</p>
                         </div>
                         <div className="w-12 h-6 bg-gray-700 rounded-full relative cursor-pointer">
                             <div className="w-4 h-4 bg-gray-400 rounded-full absolute top-1 left-1 shadow-md"></div>
                         </div>
                     </div>
                 </div>
             </div>
             
             {/* Engine Settings */}
             <div>
                 <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-fuchsia-500 inline-block shrink-0"></span> Engine Parameters
                 </h2>
                 <div className="space-y-6 max-w-2xl">
                     <div>
                        <label className="text-sm font-bold text-gray-400 block mb-2">Default Base Model</label>
                        <select className="w-full bg-[var(--bg-primary)] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 appearance-none">
                            <option>Gemini 1.5 Pro - Primary Analytics</option>
                            <option>Gemini 1.5 Flash - Fast Parsing</option>
                            <option>Gemma 2 - Local Classification</option>
                        </select>
                     </div>
                     <div>
                         <label className="text-sm font-bold text-gray-400 block mb-2">Bias Sensitivity Threshold</label>
                         <input type="range" className="w-full accent-fuchsia-500" />
                         <div className="flex justify-between text-xs text-gray-500 font-mono mt-1">
                             <span>Lenient (0.2)</span>
                             <span>Strict (0.8)</span>
                         </div>
                     </div>
                 </div>
             </div>

          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
