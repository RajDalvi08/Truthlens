import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Journal() {
  const [activeTab, setActiveTab] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState("idle"); // idle, loading, success

  const categories = [
    "All Categories",
    "Media Bias Studies",
    "Political Coverage Analysis",
    "AI Model Research",
    "Misinformation Detection",
    "Data Methodology"
  ];

  const recentArticles = [
    {
      id: 1,
      title: "The Subtle Shift: How Economic Vocabulary Varies Across Partisan Lines",
      abstract: "An analysis of 500k+ articles reveals distinct divergence in terminology when reporting identical inflation metrics.",
      author: "Dr. Elena Rostova",
      date: "Oct 12, 2026",
      readTime: "8 min read",
      tag: "Political Coverage Analysis"
    },
    {
      id: 2,
      title: "Algorithmic Echo Chambers in Automated News Synthesis",
      abstract: "Evaluating the tendency of generative models to reinforce pre-existing biases when synthesizing complex geopolitical events.",
      author: "James T. Faraday",
      date: "Oct 10, 2026",
      readTime: "12 min read",
      tag: "AI Model Research"
    },
    {
      id: 3,
      title: "Source Omission as a Framing Tactic in Conflict Reporting",
      abstract: "A quantitative look at how the exclusion of specific local sources alters the perceived reality of international conflicts.",
      author: "Sarah Chen, PhD",
      date: "Oct 08, 2026",
      readTime: "15 min read",
      tag: "Media Bias Studies"
    },
    {
      id: 4,
      title: "TruthLens NLP v4 Architecture: Improving Sarcasm Detection",
      abstract: "Technical breakdown of our recent methodology upgrades to better identify non-literal framing in opinion pieces.",
      author: "TruthLens Eng Team",
      date: "Oct 05, 2026",
      readTime: "6 min read",
      tag: "Data Methodology"
    }
  ];

  const caseStudies = [
    { title: "2024 Election News Coverage Bias", type: "National Event" },
    { title: "International Conflict Reporting Disparities", type: "Geopolitics" },
    { title: "Economic Policy Narrative Shifts", type: "Market Analysis" }
  ];

  const filteredArticles = recentArticles.filter((article) => {
    const matchesCategory = activeTab === "All Categories" || article.tag === activeTab;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      article.title.toLowerCase().includes(searchLower) || 
      article.abstract.toLowerCase().includes(searchLower) ||
      article.tag.toLowerCase().includes(searchLower);
    
    return matchesCategory && matchesSearch;
  });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubStatus("loading");
    setTimeout(() => {
      setSubStatus("success");
      setEmail("");
      setTimeout(() => setSubStatus("idle"), 3000);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-gray-300 font-sans selection:bg-cyan-500/30 overflow-x-hidden pt-24 pb-12 px-6">
      {/* Ambient Dark Tech Background Setup */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[var(--bg-primary)] to-[var(--bg-primary)] z-0 pointer-events-none"></div>
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGgyMHYyMEgwVTB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMTlMMjAgMTlNMCAwTDIwIDAiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTE5IDBMMTkgMjBNMCAwTDAgMjAiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-30 pointer-events-none z-0"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto relative z-10 space-y-16"
      >
        {/* 1. Header Section */}
        <motion.header variants={itemVariants} className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/10 pb-10">
          <div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] font-serif italic mb-4">
              TruthLens <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 not-italic">Journal</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl font-light border-l-2 border-cyan-500 pl-4 py-1">
              Research insights and analysis on global news bias and media narratives.
            </p>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <div className="relative group">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search research..." 
                className="w-full sm:w-64 bg-[var(--bg-secondary)] border border-white/10 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors pl-10"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400">🔍</span>
            </div>
          </div>
        </motion.header>

        {/* 2. Featured Article Section */}
        <motion.section variants={itemVariants} className="relative group cursor-pointer" onClick={() => alert("Loading full analysis...")}>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          <div className="bg-[var(--bg-secondary)] border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-xl flex flex-col md:flex-row gap-8 items-center shadow-2xl">
            {/* Image Placeholder */}
            <div className="w-full md:w-1/2 overflow-hidden rounded-2xl relative">
              <img 
                src="https://images.unsplash.com/photo-1555529902-52611e03dc92?q=80&w=1200&auto=format&fit=crop" 
                alt="Featured Research" 
                className="w-full h-[300px] object-cover mix-blend-luminosity opacity-80 group-hover:scale-105 transition-transform duration-700 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
            </div>
            
            <div className="w-full md:w-1/2 space-y-6">
              <div className="flex gap-4 items-center">
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Featured Research
                </span>
                <span className="text-gray-500 text-xs font-mono">Oct 15, 2026</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight font-serif group-hover:text-cyan-200 transition-colors">
                Bias Patterns in Global Political News Networking
              </h2>
              <p className="text-gray-400 leading-relaxed text-lg font-light">
                An extensive algorithmic review of 2,400 global publications detailing how selective context omission shapes public political sentiment faster than direct misinformation.
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    MV
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Dr. Marcus Vance</p>
                    <p className="text-xs text-gray-500 font-mono">Lead Data Scientist</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-cyan-400 font-bold hover:text-cyan-300 transition-colors group/btn">
                  Read Full Analysis <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 3. Research Categories */}
        <motion.section variants={itemVariants}>
          <div className="flex flex-wrap gap-3 border-b border-white/5 pb-6">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === cat 
                    ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]" 
                    : "bg-[var(--bg-elevated)] text-gray-400 border border-white/5 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Grid & Sidebar Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Column: 4. Journal Article Grid */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-white font-serif italic">
                {searchQuery ? "Search Results" : "Recent Publications"}
              </h3>
              <span className="text-sm text-gray-500 hover:text-white cursor-pointer transition-colors" onClick={() => { setActiveTab("All Categories"); setSearchQuery(""); }}>
                Clear Filters
              </span>
            </div>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <motion.article 
                      layout
                      key={article.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      whileHover={{ y: -5 }}
                      onClick={() => alert(`Opening article: ${article.title}`)}
                      className="bg-[var(--bg-secondary)] border border-white/5 rounded-2xl p-6 group cursor-pointer hover:border-white/20 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">{article.tag}</span>
                          <span className="text-gray-600 text-xs font-mono">{article.readTime}</span>
                        </div>
                        <h4 className="text-xl font-bold text-white leading-tight mb-3 group-hover:text-cyan-300 transition-colors">
                          {article.title}
                        </h4>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light overflow-hidden display-webkit-box WebkitLineClamp-3 WebkitBoxOrient-vertical">
                          {article.abstract}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                        <div>
                          <p className="text-xs font-bold text-gray-300">{article.author}</p>
                          <p className="text-[10px] text-gray-600 font-mono mt-0.5">{article.date}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                          <span className="rotate-45 block">↗</span>
                        </div>
                      </div>
                    </motion.article>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="col-span-full py-12 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl"
                  >
                    No articles found matching your filters.
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Pagination Placeholder */}
            {filteredArticles.length > 0 && (
              <div className="flex justify-center pt-8">
                  <button onClick={() => alert("Loading more data from server...")} className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 text-sm font-bold transition-colors">
                    Load Older Entries
                  </button>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-12">
            
            {/* 5. Trending Insights Panel */}
            <motion.aside variants={itemVariants} className="bg-[var(--bg-secondary)] border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
               <h3 className="text-lg font-black text-white border-b border-white/10 pb-4 mb-6 flex items-center gap-2">
                 <span className="text-indigo-400">⚡</span> Trending Analysis
               </h3>
               
               <div className="space-y-6">
                 <div>
                    <p className="text-xs text-indigo-400 font-mono mb-1">MOST ANALYZED NETWORK</p>
                    <p className="text-white font-bold">Global News Syndicate</p>
                    <p className="text-sm text-gray-500 mt-1">12,400 articles parsed this week</p>
                 </div>
                 <div className="h-px w-full bg-white/5"></div>
                 <div>
                    <p className="text-xs text-fuchsia-400 font-mono mb-1">EMERGING NARRATIVE</p>
                    <p className="text-white font-bold">Resource Scarcity Framing</p>
                    <p className="text-sm text-gray-500 mt-1">45% increase in fear-based terminology detected across economic reporting.</p>
                 </div>
                 <div className="h-px w-full bg-white/5"></div>
                 <div>
                    <p className="text-xs text-cyan-400 font-mono mb-1">TOP BIASED CATEGORY</p>
                    <p className="text-white font-bold">Domestic Healthcare Policy</p>
                    <p className="text-sm text-gray-500 mt-1">Average deviation from neutrality: 0.68</p>
                 </div>
               </div>
            </motion.aside>

            {/* 6. Methodology Highlight */}
            <motion.aside variants={itemVariants} className="bg-[var(--bg-elevated)] border border-white/5 rounded-2xl p-6">
               <h3 className="text-lg font-black text-white border-b border-white/10 pb-4 mb-4">Our Methodology</h3>
               <p className="text-sm text-gray-400 leading-relaxed mb-4">
                 TruthLens utilizes localized LLMs and fine-tuned Transformer models to score text along multi-dimensional vectors.
               </p>
               <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2"><span className="text-cyan-500">▹</span> NLP Bias Detection</li>
                  <li className="flex items-center gap-2"><span className="text-cyan-500">▹</span> Aspect-based Sentiment</li>
                  <li className="flex items-center gap-2"><span className="text-cyan-500">▹</span> Blind Dataset Evaluation</li>
               </ul>
               <button onClick={() => alert("Downloading Technical Paper PDF...")} className="mt-6 w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">
                  Read Technical Paper
               </button>
            </motion.aside>

            {/* 7. Case Study Highlights */}
            <motion.aside variants={itemVariants} className="bg-transparent border border-white/10 rounded-2xl p-6">
               <h3 className="text-lg font-black text-white mb-4">Core Case Studies</h3>
               <div className="space-y-3">
                 {caseStudies.map((study, i) => (
                    <div key={i} onClick={() => alert(`Opening Case Study: ${study.title}`)} className="group cursor-pointer">
                      <p className="text-xs text-gray-500 font-mono mb-0.5">{study.type}</p>
                      <p className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors border-l-2 border-transparent group-hover:border-white pl-2 -ml-2.5">
                        {study.title}
                      </p>
                    </div>
                 ))}
               </div>
            </motion.aside>

          </div>
        </div>

        {/* 8. Newsletter Subscription */}
        <motion.section variants={itemVariants} className="border-y border-white/10 py-16 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/10 to-transparent"></div>
           <div className="max-w-2xl mx-auto text-center relative z-10">
              <h2 className="text-3xl font-black text-white font-serif italic mb-4">Subscribe to Intel</h2>
              <p className="text-gray-400 mb-8 font-light">
                Receive our weekly digest of network anomalies, analytical deep-dives, and AI media research straight to your terminal.
              </p>
              
              {subStatus === "success" ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 rounded-xl px-5 py-4 font-bold"
                >
                  ✓ Securely connected. Welcome to the network.
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com" 
                    required
                    disabled={subStatus === "loading"}
                    className="flex-1 bg-[var(--bg-input)] border border-white/20 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-light disabled:opacity-50"
                  />
                  <button 
                    type="submit" 
                    disabled={subStatus === "loading"}
                    className="px-8 py-3.5 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-75 flex items-center justify-center min-w-[140px]"
                  >
                    {subStatus === "loading" ? (
                      <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </form>
              )}
           </div>
        </motion.section>

        {/* 9. Footer Note */}
        <motion.footer variants={itemVariants} className="text-center pb-8">
           <p className="text-sm text-gray-500 font-mono tracking-wide">
             <span className="text-white font-bold italic font-serif">TruthLens Journal</span> provides AI-assisted research insights into media bias and narrative framing across global news platforms.
           </p>
        </motion.footer>

      </motion.div>
    </div>
  );
}
