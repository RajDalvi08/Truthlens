import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "./Navigation";
import { analyzeArticle } from "../services/api";

const SAMPLE_URLS = [
  "https://www.bbc.com/news/world-us-canada-66801944",
  "https://www.nytimes.com/2025/01/01/world/europe/sample-article.html",
];

export default function BiasAnalyzer() {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const handleAnalyze = async () => {
    const url = inputText.trim();
    if (!url) return;

    setIsAnalyzing(true);
    setResults(null);
    setError("");

    try {
      const response = await analyzeArticle(url);
      setResults(response);
    } catch (err) {
      setError(err?.message || "Failed to analyze the article. Please check the URL and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getBiasLabel = (score) => {
    if (score > 0.5) return { label: "Strong Right Bias", color: "text-purple-400" };
    if (score > 0.2) return { label: "Moderate Right Bias", color: "text-purple-300" };
    if (score > -0.2) return { label: "Relatively Neutral", color: "text-cyan-400" };
    if (score > -0.5) return { label: "Moderate Left Bias", color: "text-indigo-400" };
    return { label: "Strong Left Bias", color: "text-indigo-500" };
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
              
              {/* Input Area */}
              <div className="mt-8 space-y-4">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste a news article URL here to analyze for bias..."
                  rows={3}
                  className="w-full bg-black/40 border border-cyan-500/20 rounded-2xl p-5 text-white text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all placeholder-gray-600 resize-none font-light leading-relaxed"
                />

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <motion.button
                    onClick={handleAnalyze}
                    disabled={!inputText.trim() || isAnalyzing}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-3"
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Processing Neural Scan...
                      </>
                    ) : (
                      <>⚡ Run Analysis</>
                    )}
                  </motion.button>

                  <div className="flex gap-2">
                    {SAMPLE_URLS.map((sample, i) => (
                      <button
                        key={i}
                        onClick={() => setInputText(sample)}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono text-gray-500 hover:text-white hover:border-white/20 transition-all uppercase tracking-wider"
                      >
                        Sample {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Panel */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 120 }}
                className="bg-[var(--bg-secondary)] border border-red-400/20 rounded-3xl p-6"
              >
                <p className="text-sm font-semibold text-red-200">Error: {error}</p>
              </motion.div>
            )}

            {results && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="space-y-6"
              >
                {/* Article Header */}
                <div className="bg-[var(--bg-secondary)] border border-white/5 rounded-3xl p-6">
                  <p className="text-sm font-mono uppercase tracking-widest text-gray-500">Headline</p>
                  <h2 className="mt-2 text-2xl font-black text-white leading-tight">{results.headline || "(No headline found)"}</h2>
                </div>

                {/* Score Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Bias Score */}
                  <div className="bg-[var(--bg-secondary)] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full"></div>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Bias Score</p>
                    <p className={`text-4xl font-black ${getBiasLabel(results.bias_score).color}`}>
                      {results.bias_score > 0 ? "+" : ""}{results.bias_score}
                    </p>
                    <p className={`text-sm font-bold mt-2 ${getBiasLabel(results.bias_score).color}`}>
                      {getBiasLabel(results.bias_score).label}
                    </p>
                    {/* Visual Gauge */}
                    <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((results.bias_score + 1) / 2) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-purple-500 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[8px] text-gray-600 font-mono">LEFT</span>
                      <span className="text-[8px] text-gray-600 font-mono">CENTER</span>
                      <span className="text-[8px] text-gray-600 font-mono">RIGHT</span>
                    </div>
                  </div>

                  {/* Breakdown Scores */}
                  <div className="bg-[var(--bg-secondary)] border border-white/5 rounded-3xl p-6">
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Bias Breakdown</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Linguistic</span>
                        <span className="text-sm font-bold text-cyan-300">{results.linguistic_bias}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Framing</span>
                        <span className="text-sm font-bold text-cyan-300">{results.framing_bias}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Entity</span>
                        <span className="text-sm font-bold text-cyan-300">{results.entity_bias}</span>
                      </div>
                    </div>
                  </div>

                  {/* Source Info */}
                  <div className="bg-[var(--bg-secondary)] border border-white/5 rounded-3xl p-6">
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Source</p>
                    <p className="text-sm font-semibold text-gray-200 break-words">{results.source || "N/A"}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </main>
    </div>
  );
}
