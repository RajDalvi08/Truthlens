import React from "react";
import { motion } from "framer-motion";

export default function Methodology() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-20 animate-in fade-in duration-1000 mesh-bg pb-32">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-20 relative z-10">
          <div className="text-center pt-16 border-b border-[#fdf8f5]/10 pb-20">
            <h1 className="text-6xl md:text-8xl font-black text-[#fdf8f5] tracking-tighter uppercase italic leading-[0.85]">
              Neural <br/>
              <span className="text-[#8d7b68]">Methodology</span>
            </h1>
            <p className="text-[#d6c2b8] mt-8 leading-relaxed max-w-2xl mx-auto font-black uppercase tracking-[0.2em] text-[11px] italic underline decoration-[#fdf8f5]/10">Deep dive into the neural architectures that power real-time bias detection and sentiment parsing across global news networks.</p>
          </div>

          <div className="space-y-12">
            {[
              { id: "01", title: "Semantic Vectorization", desc: "Text is first parsed and converted into high-dimensional vectors. We employ transformer-based LLMs fine-tuned specifically on political corpora to encode contextual meaning beyond simple keyword matching." },
              { id: "02", title: "Bias Spectrum Plotting", desc: "The semantic vectors are passed through a regression model trained on over 5 million manually annotated, hyper-partisan articles. The model plots the article on an axis ranging from (-1.0) to (+1.0), accounting for loaded vocabulary and rhetorical emphasis." },
              { id: "03", title: "Source Credibility Audit", desc: "Before outputting the final Neural Accuracy score, the engine pings recognized journalistic databases (like AP, Reuters, independent auditors) to weigh factual claims. Articles with unverified factual leaps receive severe penalty scores." },
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants} 
                className="saas-card p-12 relative overflow-hidden group bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-none shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#fdf8f5]/5 rounded-none blur-[100px] group-hover:bg-[#fdf8f5]/10 transition-all duration-1000"></div>
                <div className="absolute left-0 top-0 w-2 h-full bg-[#fdf8f5]/5 group-hover:bg-[#fdf8f5]/20 transition-all" />

                <h2 className="text-4xl font-black text-[#fdf8f5] mb-8 flex items-center gap-6 uppercase italic tracking-tighter group-hover:translate-x-4 transition-transform duration-500">
                  <span className="w-16 h-16 rounded-none border border-[#fdf8f5]/20 bg-[#fdf8f5]/5 flex items-center justify-center text-[#fdf8f5] font-black text-xl group-hover:bg-[#fdf8f5] group-hover:text-[#1a0f0a] transition-all shadow-xl">{step.id}</span>
                  {step.title}
                </h2>
                <p className="text-[#d6c2b8] leading-relaxed mb-10 font-black uppercase tracking-tight opacity-80 italic text-sm">
                  {step.desc}
                </p>
                <div className="w-full h-0.5 bg-gradient-to-r from-[#fdf8f5]/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
    </div>
  );
}
