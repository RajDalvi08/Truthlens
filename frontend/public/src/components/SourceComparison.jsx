import React, { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "./Navigation";
import { compareArticles } from "../services/api";

export default function SourceComparison() {
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const handleCompare = async () => {
    if (!url1.trim() || !url2.trim()) {
      setError("Please provide both article URLs to compare.");
      return;
    }

    setIsLoading(true);
    setResults(null);
    setError("");

    try {
      const response = await compareArticles(url1.trim(), url2.trim());
      setResults(response);
    } catch (err) {
      setError(err?.message || "Comparison failed. Please check the URLs and try again.");
    } finally {
      setIsLoading(false);
    }
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
                Compare coverage of the identical event across differing news outlets. Identify framing gaps, bias disparities, and key narrative differences.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 max-w-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={url1}
                  onChange={(e) => setUrl1(e.target.value)}
                  placeholder="Article URL #1"
                  className="w-full bg-[var(--bg-primary)] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50"
                />
                <input
                  value={url2}
                  onChange={(e) => setUrl2(e.target.value)}
                  placeholder="Article URL #2"
                  className="w-full bg-[var(--bg-primary)] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50"
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleCompare}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 font-bold text-sm text-white shadow-lg hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Comparing…" : "Compare"}
                </button>
                {error && <p className="text-sm text-red-300">{error}</p>}
              </div>
            </div>
          </motion.div>

          {/* Results */}
          {results && (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {[
                { label: "Article A", data: results.article_1 },
                { label: "Article B", data: results.article_2 },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[var(--bg-secondary)] border border-white/5 rounded-3xl p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                        {item.label}
                      </p>
                      <h2 className="mt-2 text-lg font-black text-white leading-snug">
                        {item.data.headline || "(No headline)"}
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 uppercase">Bias</p>
                      <p className="text-2xl font-black text-cyan-300">
                        {item.data.bias_score > 0 ? "+" : ""}{item.data.bias_score}
                      </p>
                      <p className="text-xs font-semibold text-gray-400">
                        {item.data.bias_level}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Linguistic</span>
                      <span className="text-sm font-semibold text-white">{item.data.linguistic_bias}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Framing</span>
                      <span className="text-sm font-semibold text-white">{item.data.framing_bias}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Entity</span>
                      <span className="text-sm font-semibold text-white">{item.data.entity_bias}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-[var(--bg-secondary)] border border-white/5 rounded-3xl p-6">
                <p className="text-sm font-mono uppercase tracking-widest text-gray-500">Bias Difference</p>
                <p className="mt-2 text-4xl font-black text-cyan-300">
                  {results.bias_difference > 0 ? "+" : ""}{results.bias_difference}
                </p>
                <p className="text-xs text-gray-400 mt-1">Absolute difference between the two sources.</p>
              </div>
            </motion.div>
          )}

        </motion.div>
      </main>
    </div>
  );
}
