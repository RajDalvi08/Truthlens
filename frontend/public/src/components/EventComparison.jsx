import React, { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "./Navigation";
import { compareEvent } from "../services/api";

export default function EventComparison() {
  const [url, setUrl] = useState("");
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

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError("Please provide an article URL to compare across outlets.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResults(null);

    try {
      const response = await compareEvent(url.trim());
      setResults(response);
    } catch (err) {
      setError(err?.message || "Failed to analyze the event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[#FDEBD0]">
      <Navigation />

      <main className="flex-1 overflow-auto p-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-900/10 via-[var(--bg-primary)] to-[var(--bg-primary)] z-0 pointer-events-none"></div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto space-y-8 relative z-10"
        >
          <motion.div 
            variants={itemVariants}
            className="bg-[var(--bg-secondary)] border border-white/5 rounded-3xl p-8 relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div>
              <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                Event Comparison
              </h1>
              <p className="text-emerald-400 font-mono uppercase tracking-widest mt-2 text-sm">Cross-Outlet Narrative Alignment</p>
              <p className="text-gray-400 mt-4 max-w-2xl leading-relaxed">
                Enter an article URL to compare how different outlets cover the same story.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 max-w-3xl">
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Article URL to compare across outlets"
                className="w-full bg-[var(--bg-primary)] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
              />

              <div className="flex items-center gap-4">
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-sm text-white shadow-lg hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Analyzing…" : "Compare Event"}
                </button>
                {error && <p className="text-sm text-red-300">{error}</p>}
              </div>
            </div>
          </motion.div>

          {results && (
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="bg-[var(--bg-secondary)] border border-white/5 rounded-3xl p-6">
                <p className="text-xs font-mono uppercase tracking-widest text-gray-500">Event</p>
                <h2 className="mt-2 text-2xl font-black text-white">{results.event || "Unknown Event"}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.articles?.map((article, idx) => (
                  <div key={idx} className="bg-[var(--bg-secondary)] border border-white/5 rounded-3xl p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{article.source || "Unknown"}</p>
                        <h3 className="mt-2 text-lg font-black text-white leading-snug">{article.headline || "(No headline)"}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase">Bias</p>
                        <p className="text-2xl font-black text-emerald-300">
                          {article.bias_score > 0 ? "+" : ""}{article.bias_score}
                        </p>
                        <p className="text-xs font-semibold text-gray-400">{article.bias_level}</p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Linguistic</span>
                        <span className="text-sm font-semibold text-white">{article.linguistic_bias}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Framing</span>
                        <span className="text-sm font-semibold text-white">{article.framing_bias}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Entity</span>
                        <span className="text-sm font-semibold text-white">{article.entity_bias}</span>
                      </div>
                    </div>

                    {article.bias_visual && (
                      <div className="mt-4">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Visual</p>
                        <div className="mt-2" dangerouslySetInnerHTML={{ __html: article.bias_visual }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
