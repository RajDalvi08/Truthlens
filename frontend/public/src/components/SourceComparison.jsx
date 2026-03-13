import React from "react";
import { motion } from "framer-motion";
import Navigation from "./Navigation";

export default function SourceComparison() {
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-900/10 via-[var(--bg-primary)] to-[var(--bg-primary)] z-0 pointer-events-none"></div>

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
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div>
              <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                Source Comparison
              </h1>
              <p className="text-yellow-400 font-mono uppercase tracking-widest mt-2 text-sm">Cross-Network Narrative Alignments</p>
              <p className="text-gray-400 mt-4 max-w-2xl leading-relaxed">
                Compare coverage of the identical event across differing news outlets. Identify omissions, framing disparities, and structural biases.
              </p>
            </div>
            
            <div className="mt-8 flex gap-4 items-center max-w-3xl">
                <input type="text" placeholder="Add Source (e.g., The Guardian)" className="flex-1 bg-[var(--bg-primary)] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50" />
                <span className="text-gray-500 font-black">VS</span>
                <input type="text" placeholder="Add Source (e.g., Fox News)" className="flex-1 bg-[var(--bg-primary)] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50" />
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 font-bold text-sm text-white shadow-lg hover:scale-105 transition-transform">
                  Compare
                </button>
            </div>
          </motion.div>
          
           {/* Placeholder Split View */}
           <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-[var(--bg-secondary)] border border-white/5 rounded-2xl p-6 min-h-[300px] flex items-center justify-center border-dashed border-white/10">
                   <p className="text-gray-500 font-mono text-sm">Awaiting Source A</p>
               </div>
               <div className="bg-[var(--bg-secondary)] border border-white/5 rounded-2xl p-6 min-h-[300px] flex items-center justify-center border-dashed border-white/10">
                   <p className="text-gray-500 font-mono text-sm">Awaiting Source B</p>
               </div>
           </motion.div>

        </motion.div>
      </main>
    </div>
  );
}
