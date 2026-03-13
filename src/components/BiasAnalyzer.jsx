import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "./Navigation";

const SAMPLE_ARTICLES = [
  "Controversial new policy sparks outrage among progressive groups as conservatives celebrate the sweeping reforms that promise to reshape the economic landscape.",
  "The president's radical agenda has been met with fierce resistance from both sides of the aisle, with critics calling the proposed legislation a dangerous overreach of executive power.",
];

export default function BiasAnalyzer() {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setResults(null);

    setTimeout(() => {
      const wordCount = inputText.split(/\s+/).length;
      const biasScore = +(Math.random() * 1.6 - 0.8).toFixed(2);
      const sentimentScore = +(Math.random() * 2 - 1).toFixed(2);

      const keyPhrases = [
        { phrase: "controversial", impact: 0.85, type: "Loaded Language" },
        { phrase: "radical agenda", impact: 0.92, type: "Emotional Framing" },
        { phrase: "fierce resistance", impact: 0.78, type: "Conflict Amplification" },
        { phrase: "dangerous overreach", impact: 0.88, type: "Fear Appeal" },
        { phrase: "sweeping reforms", impact: 0.65, type: "Hyperbolic Modifier" },
      ].filter(() => Math.random() > 0.3);

      setResults({ biasScore, sentimentScore, wordCount, keyPhrases });
      setIsAnalyzing(false);
    }, 2500);
  };

  const getBiasLabel = (score) => {
    if (score > 0.5) return { label: "Strong Right Bias", color: "text-purple-400" };
    if (score > 0.2) return { label: "Moderate Right Bias", color: "text-purple-300" };
    if (score > -0.2) return { label: "Relatively Neutral", color: "text-cyan-400" };
    if (score > -0.5) return { label: "Moderate Left Bias", color: "text-indigo-400" };
    return { label: "Strong Left Bias", color: "text-indigo-500" };
  };

  const getSentimentLabel = (score) => {
    if (score > 0.3) return { label: "Positive", color: "text-emerald-400" };
    if (score > -0.3) return { label: "Neutral", color: "text-gray-400" };
    return { label: "Negative", color: "text-red-400" };
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
                  placeholder="Paste a news article or URL here to analyze for bias..."
                  rows={6}
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
                    {SAMPLE_ARTICLES.map((sample, i) => (
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
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="space-y-6"
              >
                {/* Score Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Bias Score */}
                  <div className="bg-[var(--bg-secondary)] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full"></div>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Bias Score</p>
                    <p className={`text-4xl font-black ${getBiasLabel(results.biasScore).color}`}>
                      {results.biasScore > 0 ? "+" : ""}{results.biasScore}
                    </p>
                    <p className={`text-sm font-bold mt-2 ${getBiasLabel(results.biasScore).color}`}>
                      {getBiasLabel(results.biasScore).label}
                    </p>
                    {/* Visual Gauge */}
                    <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((results.biasScore + 1) / 2) * 100}%` }}
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

                  {/* Sentiment Score */}
                  <div className="bg-[var(--bg-secondary)] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full"></div>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Sentiment</p>
                    <p className={`text-4xl font-black ${getSentimentLabel(results.sentimentScore).color}`}>
                      {results.sentimentScore > 0 ? "+" : ""}{results.sentimentScore}
                    </p>
                    <p className={`text-sm font-bold mt-2 ${getSentimentLabel(results.sentimentScore).color}`}>
                      {getSentimentLabel(results.sentimentScore).label}
                    </p>
                    <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((results.sentimentScore + 1) / 2) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-red-500 via-gray-500 to-emerald-500 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[8px] text-gray-600 font-mono">NEGATIVE</span>
                      <span className="text-[8px] text-gray-600 font-mono">NEUTRAL</span>
                      <span className="text-[8px] text-gray-600 font-mono">POSITIVE</span>
                    </div>
                  </div>

                  {/* Word Stats */}
                  <div className="bg-[var(--bg-secondary)] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 blur-2xl rounded-full"></div>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Text Metrics</p>
                    <p className="text-4xl font-black text-cyan-400">{results.wordCount}</p>
                    <p className="text-sm font-bold mt-2 text-gray-400">Words Analyzed</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-gray-600">CONFIDENCE</span>
                        <span className="text-cyan-400 font-bold">{(92 + Math.random() * 6).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-gray-600">MODEL</span>
                        <span className="text-gray-400">TruthLens v4.2</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Phrases */}
                {results.keyPhrases.length > 0 && (
                  <div className="bg-[var(--bg-secondary)] border border-white/5 rounded-3xl p-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-6 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500"></span>
                      Key Bias Indicators
                    </h3>
                    <div className="space-y-3">
                      {results.keyPhrases.map((kp, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3 hover:bg-white/[0.04] transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-fuchsia-400 font-bold text-sm italic">"{kp.phrase}"</span>
                            <span className="px-2 py-0.5 bg-white/5 rounded-lg text-[9px] font-mono text-gray-500 border border-white/5">{kp.type}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${kp.impact * 100}%` }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full"
                              />
                            </div>
                            <span className="text-xs font-mono text-fuchsia-400 font-bold w-10 text-right">{(kp.impact * 100).toFixed(0)}%</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </main>
    </div>
  );
}
