import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "./Navigation";
import { analyzeArticle } from "../services/api";

const SAMPLE_URLS = [
  "https://www.bbc.com/news/world-us-canada-66801944",
  "The city council voted unanimously to approve the new climate policy, while residents expressed mixed reactions about the potential economic impact.",
];

export default function BiasAnalyzer() {
  const [headline, setHeadline] = useState("");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
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

  const isUrl = (val) => {
    try {
      new URL(val);
      return val.startsWith("http");
    } catch {
      return false;
    }
  };

  const handleAnalyze = async () => {
    if (!url.trim() && !text.trim()) {
      setError("Please provide either an Article URL or Article Text.");
      return;
    }

    setIsAnalyzing(true);
    setResults(null);
    setError("");

    try {
      const response = await analyzeArticle({
        url: url.trim(),
        headline: headline.trim(),
        text: text.trim()
      });
      setResults(response);
    } catch (err) {
      setError(err?.message || "Failed to analyze the article. Please check your inputs and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSampleClick = (sample) => {
    if (isUrl(sample)) {
      setUrl(sample);
      setHeadline("");
      setText("");
    } else {
      setUrl("");
      setHeadline("Sample News Report");
      setText(sample);
    }
  };

  const getBiasLabel = (score) => {
    if (score > 75) return { label: "Strong Bias / High Subjectivity", color: "text-purple-400" };
    if (score > 50) return { label: "Moderate Bias / Ideological", color: "text-purple-300" };
    if (score > 25) return { label: "Low Bias / Slight Framing", color: "text-cyan-400" };
    return { label: "Neutral / Descriptive", color: "text-cyan-400" };
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
              <div className="mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Manual Input Section */}
                  <div className="space-y-4">
                    <p className="text-xs font-mono uppercase tracking-widest text-cyan-500/80">Manual Content Entry</p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1 ml-1">Headline (Optional)</label>
                        <input
                          type="text"
                          value={headline}
                          onChange={(e) => setHeadline(e.target.value)}
                          placeholder="Enter article headline..."
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/40 transition-all placeholder-gray-700"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1 ml-1">Article Text</label>
                        <textarea
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder="Paste the full article content here..."
                          rows={6}
                          className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-cyan-500/40 transition-all placeholder-gray-700 resize-none leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Divider for Mobile */}
                  <div className="md:hidden flex items-center gap-4">
                    <div className="flex-1 h-px bg-white/5"></div>
                    <span className="text-[10px] font-mono text-gray-600">OR</span>
                    <div className="flex-1 h-px bg-white/5"></div>
                  </div>

                  {/* URL Section */}
                  <div className="space-y-4 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-mono uppercase tracking-widest text-blue-500/80">Automated Retrieval</p>
                      <div className="mt-3">
                        <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1 ml-1">Article URL</label>
                        <input
                          type="text"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="https://news-site.com/article-path"
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all placeholder-gray-700"
                        />
                        <p className="text-[10px] text-gray-600 mt-2 ml-1 italic">
                          * Scraping URL will bypass manually entered headline/text.
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 mt-4">
                      <p className="text-[10px] text-gray-500 font-mono uppercase mb-2">Quick load Samples</p>
                      <div className="flex flex-wrap gap-2">
                        {SAMPLE_URLS.map((sample, i) => (
                          <button
                            key={i}
                            onClick={() => handleSampleClick(sample)}
                            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-mono text-gray-500 hover:text-white hover:border-white/20 transition-all uppercase tracking-wider"
                          >
                            Sample {i + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-center pt-4 border-t border-white/5">
                  <motion.button
                    onClick={handleAnalyze}
                    disabled={(!url.trim() && !text.trim()) || isAnalyzing}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(37,99,235,0.2)] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 uppercase tracking-wider text-sm"
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Neural Processing...
                      </>
                    ) : (
                      <>⚡ Run Analysis</>
                    )}
                  </motion.button>

                  <p className="text-xs text-gray-500 max-w-xs text-center sm:text-left leading-tight">
                    Powered by TruthLens Neural Engine.
                    <span className="block text-gray-600 text-[10px] mt-1 font-mono">Status: Ready for Injection</span>
                  </p>
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


                {/* Score Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Bias Score */}
                  <div className="bg-[var(--bg-secondary)] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full"></div>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Bias Score</p>
                    <p className={`text-4xl font-black ${getBiasLabel(results.bias_score).color}`}>
                      {results.bias_score}
                    </p>
                    <p className={`text-sm font-bold mt-2 ${getBiasLabel(results.bias_score).color}`}>
                      {results.bias_level}
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
