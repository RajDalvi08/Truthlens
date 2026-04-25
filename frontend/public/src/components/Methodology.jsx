import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineChip,
  HiOutlineDatabase,
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
  HiOutlineGlobeAlt,
  HiOutlineCode,
  HiOutlineArrowRight,
  HiOutlineServer,
} from "react-icons/hi";

const pipeline = [
  {
    id: "01",
    icon: HiOutlineGlobeAlt,
    title: "Ingestion Layer",
    subtitle: "Data Acquisition",
    desc: "Articles are ingested via direct URL scraping or raw text submission. The pipeline extracts structural metadata — headline, byline, source, publish date — before passing the cleaned corpus downstream.",
    tags: ["BeautifulSoup", "Requests", "Proxy Fallback"],
    color: "#3b82f6",
  },
  {
    id: "02",
    icon: HiOutlineChip,
    title: "NLP Processing",
    subtitle: "Semantic Decomposition",
    desc: "The article undergoes tokenization, stop-word removal, and lemmatization. A fine-tuned transformer model performs named-entity recognition (NER) and semantic embedding, encoding the political and emotional context of the text.",
    tags: ["Transformer", "NER", "Tokenizer"],
    color: "#8b5cf6",
  },
  {
    id: "03",
    icon: HiOutlineLightningBolt,
    title: "Bias Scoring",
    subtitle: "Political & Linguistic Analysis",
    desc: "The encoded representation is passed through a multi-head classification head trained on a balanced corpus of left, center, and right-leaning articles. Output is a continuous bias score from –1.0 (Hard Left) to +1.0 (Hard Right) with a confidence interval.",
    tags: ["Classification", "Softmax", "Confidence Interval"],
    color: "#f59e0b",
  },
  {
    id: "04",
    icon: HiOutlineDatabase,
    title: "Sentiment Analysis",
    subtitle: "Emotional Valence Detection",
    desc: "A secondary regression head analyzes the emotional framing of the article — detecting whether the tone is alarmist, neutral, or optimistic. Scores are normalized to a –1.0 (Negative) to +1.0 (Positive) scale.",
    tags: ["Valence Model", "Regression", "Normalization"],
    color: "#10b981",
  },
  {
    id: "05",
    icon: HiOutlineShieldCheck,
    title: "Verification & Storage",
    subtitle: "Quality Gate & Persistence",
    desc: "Results pass a quality gate that flags any low-confidence predictions for manual review. Validated records are written to the Firestore database and indexed by user, timestamp, and bias category.",
    tags: ["Firestore", "Confidence Threshold", "Indexing"],
    color: "#ef4444",
  },
];

const techStack = [
  { name: "Python 3.11", label: "Backend Runtime", icon: HiOutlineServer },
  { name: "FastAPI", label: "REST Framework", icon: HiOutlineCode },
  { name: "React 18", label: "Frontend Engine", icon: HiOutlineChip },
  { name: "Firebase", label: "Auth & Storage", icon: HiOutlineDatabase },
  { name: "Recharts", label: "Data Visualization", icon: HiOutlineLightningBolt },
  { name: "Three.js", label: "3D Globe Renderer", icon: HiOutlineGlobeAlt },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 18 } },
};

export default function Methodology() {
  const [activeStep, setActiveStep] = useState(null);

  return (
    <div className="max-w-6xl mx-auto space-y-24 animate-in fade-in duration-1000 mesh-bg pb-32">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-24 relative z-10"
      >

        {/* ── Hero ── */}
        <motion.div variants={itemVariants} className="pt-16 pb-20 border-b border-[#fdf8f5]/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-2 h-2 bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                <span className="text-[9px] font-black text-[#8d7b68] uppercase tracking-[0.4em] italic">
                  Neural Intelligence Framework — v2.1
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-[#fdf8f5] tracking-tighter uppercase italic leading-[0.85]">
                System<br />
                <span className="text-[#8d7b68]">Methodology</span>
              </h1>
              <p className="text-[#d6c2b8] mt-8 max-w-2xl font-black uppercase tracking-[0.2em] text-[11px] italic leading-relaxed">
                A transparent look at how TruthLens ingests, classifies, and scores news articles across the global information spectrum.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-right shrink-0">
              {[
                { label: "Bias Accuracy", value: "91.4%" },
                { label: "Sentiment Accuracy", value: "88.7%" },
                { label: "Articles Processed", value: "1.2M+" },
              ].map((m) => (
                <div key={m.label} className="bg-[#261a14]/60 border border-[#fdf8f5]/10 px-6 py-3">
                  <p className="text-[9px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic">{m.label}</p>
                  <p className="text-2xl font-black text-[#fdf8f5] italic tracking-tighter">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Pipeline ── */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-3xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">
              Neural Processing Pipeline
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[#fdf8f5]/20 to-transparent" />
          </div>

          <div className="space-y-4">
            {pipeline.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              return (
                <motion.div
                  key={step.id}
                  layout
                  onClick={() => setActiveStep(isActive ? null : idx)}
                  className="saas-card relative overflow-hidden group cursor-pointer bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-none shadow-2xl hover:border-[#fdf8f5]/25 transition-all duration-300"
                  style={{ borderLeft: `3px solid ${step.color}` }}
                  whileHover={{ x: 4 }}
                >
                  <div className="absolute top-0 right-0 w-48 h-48 blur-[80px] pointer-events-none" style={{ background: `${step.color}10` }} />

                  {/* Header row */}
                  <div className="p-8 flex items-center gap-8">
                    <div
                      className="w-16 h-16 flex items-center justify-center shrink-0 border shadow-xl transition-all duration-300"
                      style={{ borderColor: `${step.color}40`, background: `${step.color}15`, color: step.color }}
                    >
                      <Icon className="w-8 h-8" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 mb-1">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] italic" style={{ color: step.color }}>
                          Step {step.id}
                        </span>
                        <span className="text-[8px] font-black text-[#4d3c2e] uppercase tracking-widest italic">
                          {step.subtitle}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-[#fdf8f5] uppercase italic tracking-tighter leading-none">
                        {step.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="hidden md:flex gap-2 flex-wrap justify-end max-w-[200px]">
                        {step.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 text-[8px] font-black text-[#8d7b68] uppercase tracking-[0.2em] italic">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <HiOutlineArrowRight
                        className="w-5 h-5 text-[#8d7b68] transition-transform duration-300"
                        style={{ transform: isActive ? "rotate(90deg)" : "rotate(0deg)" }}
                      />
                    </div>
                  </div>

                  {/* Expandable details */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-8 pb-8 border-t border-[#fdf8f5]/5"
                    >
                      <p className="text-sm text-[#d6c2b8] font-black uppercase tracking-tight leading-relaxed italic opacity-90 mt-6">
                        {step.desc}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Tech Stack ── */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-3xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">
              Technology Stack
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[#fdf8f5]/20 to-transparent" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={tech.name}
                  variants={itemVariants}
                  className="saas-card p-8 group hover:border-[#fdf8f5]/30 transition-all cursor-default bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-none shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#fdf8f5]/5 blur-[50px] pointer-events-none" />
                  <div className="w-12 h-12 mb-6 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 flex items-center justify-center text-[#fdf8f5] group-hover:bg-[#fdf8f5] group-hover:text-[#1a0f0a] transition-all shadow-xl">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-[9px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic mb-2">{tech.label}</p>
                  <h4 className="text-xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">{tech.name}</h4>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Scoring Legend ── */}
        <motion.div variants={itemVariants} className="saas-card p-12 bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-none shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#fdf8f5]/[0.02] to-transparent pointer-events-none" />
          <h2 className="text-3xl font-black text-[#fdf8f5] uppercase italic tracking-tighter mb-10">
            Bias Score Reference
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { range: "–1.0 to –0.6", label: "Hard Left", color: "#3b82f6" },
              { range: "–0.6 to –0.2", label: "Left Lean", color: "#60a5fa" },
              { range: "–0.2 to +0.2", label: "Centrist", color: "#10b981" },
              { range: "+0.2 to +0.6", label: "Right Lean", color: "#f59e0b" },
              { range: "+0.6 to +1.0", label: "Hard Right", color: "#ef4444" },
            ].map((entry) => (
              <div key={entry.label} className="flex flex-col items-center text-center p-6 bg-[#1a0f0a] border border-[#fdf8f5]/5 hover:border-[#fdf8f5]/20 transition-colors group">
                <div className="w-3 h-3 mb-4 shadow-2xl" style={{ background: entry.color, boxShadow: `0 0 12px ${entry.color}80` }} />
                <p className="text-base font-black italic tracking-tighter" style={{ color: entry.color }}>{entry.label}</p>
                <p className="text-[8px] font-black text-[#4d3c2e] uppercase tracking-widest mt-2 tabular-nums">{entry.range}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
