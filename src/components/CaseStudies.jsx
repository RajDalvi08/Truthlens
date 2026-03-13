import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Navigation from "./Navigation";

const cases = [
  { id: 1, title: "Election Coverage 2024", description: "Analysis of 100k+ articles over 3 months leading up to the election, revealing a 40% drift towards hyper-partisan reporting compared to legacy baselines.", accuracy: "98.5%", color: "cyan" },
  { id: 2, title: "Global Climate Summit", description: "Detected coordinated sentiment manipulation across 40 digital native aggregators attempting to downplay summit success.", accuracy: "94.2%", color: "fuchsia" },
  { id: 3, title: "Tech Anti-trust Rulings", description: "Mapped the divergence between Left and Right leaning financial news covering recent EU AI regulations.", accuracy: "92.8%", color: "purple" },
];

export default function CaseStudies() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } }
  };

  const getColorClass = (color) => {
    switch(color) {
      case 'cyan': return 'from-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]';
      case 'fuchsia': return 'from-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.3)]';
      case 'purple': return 'from-purple-500/20 border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]';
      default: return 'from-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[#FDEBD0]">
      <Navigation />
      <main className="flex-1 overflow-auto p-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-[var(--bg-primary)] to-[var(--bg-primary)] pointer-events-none z-0"></div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-6xl mx-auto space-y-12 relative z-10">
          <div className="text-center pt-10">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Intelligence Case Studies</h1>
            <p className="text-gray-400 mt-4 leading-relaxed max-w-2xl mx-auto font-light">Real-world applications of the Neural Truth Protocol in detecting narrative biases at scale.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cases.map((c) => (
              <motion.div 
                key={c.id} 
                variants={itemVariants} 
                whileHover={{ y: -10, scale: 1.02 }}
                className={`bg-gradient-to-b ${getColorClass(c.color).split(' ')[0]} to-[var(--bg-secondary)] border ${getColorClass(c.color).split(' ')[1]} rounded-3xl p-8 relative overflow-hidden transition-all duration-300 group ${getColorClass(c.color).split(' ')[3]}`}
              >
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <h3 className="text-2xl font-bold text-white mb-4 leading-tight">{c.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-8">{c.description}</p>
                
                <div className="absolute bottom-8 left-8">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-mono mb-1">Model Accuracy</p>
                  <p className={`text-2xl font-black ${getColorClass(c.color).split(' ')[2]}`}>{c.accuracy}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
