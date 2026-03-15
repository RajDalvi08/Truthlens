import React from "react";
import { motion } from "framer-motion";

const cases = [
  { id: 1, title: "Election Coverage 2026", description: "Analysis of 100k+ articles over 3 months leading up to the election, revealing a 40% drift towards hyper-partisan reporting compared to legacy baselines.", accuracy: "98.5%", color: "skin" },
  { id: 2, title: "Global Climate Summit", description: "Detected coordinated sentiment manipulation across 40 digital native aggregators attempting to downplay summit success.", accuracy: "94.2%", color: "brown" },
  { id: 3, title: "Tech Anti-trust Rulings", description: "Mapped the divergence between Left and Right leaning financial news covering recent EU AI regulations.", accuracy: "92.8%", color: "espresso" },
];

export default function CaseStudies() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-1000 pb-32 mesh-bg">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-16 relative z-10 pt-16">
          <div className="text-center pb-12 border-b border-[#fdf8f5]/10">
            <h1 className="text-6xl md:text-7xl font-black text-[#fdf8f5] tracking-tighter uppercase italic leading-[0.85]">Intelligence <br/> Case Studies</h1>
            <p className="text-[#8d7b68] mt-8 leading-relaxed max-w-2xl mx-auto font-black uppercase tracking-[0.2em] text-[11px] italic underline decoration-[#fdf8f5]/10 leading-relaxed">Real-world applications of the Neural Truth Protocol in detecting narrative biases at scale across the global information sphere.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
            {cases.map((c) => (
              <motion.div 
                key={c.id} 
                variants={itemVariants} 
                whileHover={{ y: -15, borderColor: 'rgba(253,248,245,0.4)' }}
                className="bg-[#261a14]/60 border border-[#fdf8f5]/10 rounded-none p-12 relative overflow-hidden transition-all duration-700 group shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#fdf8f5]/5 blur-[80px] group-hover:bg-[#fdf8f5]/10 transition-all duration-1000" />
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#fdf8f5]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <span className="text-[9px] font-black text-[#4d3c2e] uppercase tracking-[0.3em] mb-4 block italic">Vector_Analysis_{c.id}</span>
                <h3 className="text-3xl font-black text-[#fdf8f5] mb-8 leading-[0.9] uppercase italic tracking-tighter group-hover:italic transition-all">{c.title}</h3>
                <p className="text-[#d6c2b8] text-[11px] leading-relaxed mb-16 font-black uppercase tracking-tight opacity-80 italic group-hover:opacity-100 transition-opacity">{c.description}</p>
                
                <div className="absolute bottom-12 left-12">
                  <p className="text-[10px] text-[#8d7b68] uppercase font-black tracking-[0.25em] mb-3 italic transition-colors group-hover:text-[#fdf8f5]">Model Accuracy</p>
                  <p className="text-5xl font-black text-[#fdf8f5] italic tracking-tighter tabular-nums shadow-2xl">{c.accuracy}</p>
                </div>
                
                <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                    <div className="w-32 h-32 border-8 border-[#fdf8f5]" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
    </div>
  );
}
