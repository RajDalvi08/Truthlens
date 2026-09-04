"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineBookOpen, HiOutlineSearch, HiOutlineNewspaper, HiOutlineLightningBolt, HiOutlineMail, HiOutlineExternalLink } from "react-icons/hi";

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
    tag: "Political Coverage Analysis",
    image: "https://images.unsplash.com/photo-1555529902-52611e03dc92?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Algorithmic Echo Chambers in Automated News Synthesis",
    abstract: "Evaluating the tendency of generative models to reinforce pre-existing biases when synthesizing complex geopolitical events.",
    author: "James T. Faraday",
    date: "Oct 10, 2026",
    readTime: "12 min read",
    tag: "AI Model Research",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200"
  },
  {
    id: 3,
    title: "Source Omission as a Framing Tactic in Conflict Reporting",
    abstract: "A quantitative look at how the exclusion of specific local sources alters the perceived reality of international conflicts.",
    author: "Sarah Chen, PhD",
    date: "Oct 08, 2026",
    readTime: "15 min read",
    tag: "Media Bias Studies",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200"
  },
];

export default function Journal() {
  const [activeTab, setActiveTab] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState("idle");

  const filteredArticles = recentArticles.filter((article) => {
    const matchesCategory = activeTab === "All Categories" || article.tag === activeTab;
    const searchLower = searchQuery.toLowerCase();
    return matchesCategory && (
      article.title.toLowerCase().includes(searchLower) || 
      article.abstract.toLowerCase().includes(searchLower)
    );
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

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-24 mesh-bg">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[#fdf8f5]/10 pb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#fdf8f5] flex items-center gap-5 uppercase italic">
            <HiOutlineBookOpen className="w-10 h-10 md:w-12 md:h-12 text-[#fdf8f5] shadow-[0_0_20px_rgba(253,248,245,0.2)]" />
            Research & Insights
          </h1>
          <p className="text-[#8d7b68] text-[10px] mt-4 font-black max-w-xl uppercase tracking-[0.25em] italic underline decoration-[#fdf8f5]/10 leading-relaxed">
            In-depth research and insights into news bias and storytelling.
          </p>
        </div>
        <div className="relative w-full md:w-96 flex-shrink-0">
           <HiOutlineSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8d7b68] w-6 h-6" />
           <input 
             type="text" 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="SEARCH ARTICLES..." 
             className="w-full bg-[#1a0f0a] border border-[#fdf8f5]/10 pl-16 pr-8 py-5 text-[11px] font-black uppercase tracking-[0.25em] rounded-2xl outline-none focus:border-[#fdf8f5] transition-all text-[#fdf8f5] placeholder:text-[#4d3c2e] italic"
           />
        </div>
      </div>

      {/* Featured Insight - Large Bento */}
      <AnimatePresence mode="wait">
        {filteredArticles.length > 0 ? (
          <motion.div 
            key={filteredArticles[0].id}
            className="glass-card shadow-2xl overflow-hidden group cursor-pointer bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-2xl"
            whileHover={{ y: -8, borderColor: 'rgba(253,248,245,0.3)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex flex-col lg:flex-row h-full">
                <div className="lg:w-1/2 h-64 lg:h-auto min-h-[300px] overflow-hidden relative flex-shrink-0">
                    <img 
                        src={filteredArticles[0].image}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0 saturate-50"
                        alt="Featured"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a] via-transparent to-transparent opacity-80" />
                    <span className="absolute top-8 left-8 bg-[#fdf8f5] text-[#1a0f0a] px-6 py-2.5 font-black uppercase italic tracking-[0.3em] text-[10px] shadow-2xl">FEATURED ARTICLE</span>
                </div>
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between flex-grow">
                    <div>
                        <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] mb-6 italic underline decoration-[#fdf8f5]/10">
                            <span>{filteredArticles[0].tag}</span>
                            <span className="text-[#fdf8f5]/20 hidden sm:inline">•</span>
                            <span>{filteredArticles[0].readTime}</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-[#fdf8f5] leading-tight mb-6 uppercase tracking-tighter italic group-hover:text-[#fdf8f5]/90 transition-colors">
                            {filteredArticles[0].title}
                        </h2>
                        <p className="text-[#d6c2b8] leading-relaxed font-black uppercase tracking-tight mb-8 opacity-80 line-clamp-4">
                            {filteredArticles[0].abstract}
                        </p>
                    </div>
                    <div className="flex items-center justify-between pt-8 border-t border-[#fdf8f5]/10 mt-auto">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-[#fdf8f5] text-[#1a0f0a] flex items-center justify-center text-sm font-black italic shadow-xl">
                              {(filteredArticles[0].author || "U").split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                                <p className="text-sm font-black text-[#fdf8f5] uppercase italic tracking-tighter">{filteredArticles[0].author}</p>
                                <p className="text-[10px] text-[#4d3c2e] font-black uppercase tracking-[0.25em] mt-1">{filteredArticles[0].date}</p>
                            </div>
                        </div>
                        <HiOutlineExternalLink className="w-8 h-8 text-[#8d7b68] group-hover:text-[#fdf8f5] group-hover:rotate-45 transition-all duration-500" />
                    </div>
                </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-20 text-center glass-card border-[#fdf8f5]/10 bg-[#261a14]/60 rounded-2xl"
          >
            <h3 className="text-3xl font-black text-[#fdf8f5] uppercase italic tracking-tighter opacity-20">No matching articles found</h3>
            <p className="text-[10px] text-[#8d7b68] mt-4 font-black uppercase tracking-widest italic">Try adjusting your search or category filters.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Ticker */}
      <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar border-b border-[#fdf8f5]/10">
          {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`whitespace-nowrap pl-8 pr-12 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 relative group/btn ${
                    activeTab === cat 
                    ? "bg-[#fdf8f5] text-[#1a0f0a] italic shadow-2xl" 
                    : "bg-[#fdf8f5]/5 text-[#8d7b68] border border-[#fdf8f5]/10 hover:border-[#fdf8f5]/40"
                }`}
              >
                <span className="relative z-10">{cat}</span>
              </button>
          ))}
      </div>

      {/* Article Grid & Sidebar Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-10">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {filteredArticles.length > 1 && filteredArticles.slice(1).map((article, i) => (
                    <motion.article 
                        key={article.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="saas-card group hover:border-[#fdf8f5]/40 transition-all cursor-pointer flex flex-col bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-2xl shadow-xl"
                    >
                        <div className="h-60 overflow-hidden relative">
                            <img src={article.image} className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" alt={article.title} />
                            <div className="absolute inset-0 bg-[#1a0f0a]/60 group-hover:bg-[#1a0f0a]/20 transition-all duration-700" />
                        </div>
                        <div className="p-6 lg:p-8 flex-1 flex flex-col justify-between bg-[#fdf8f5]/[0.02]">
                            <div>
                                <span className="text-[9px] font-black text-[#8d7b68] uppercase tracking-[0.3em] mb-4 block italic underline decoration-[#fdf8f5]/10 transition-colors group-hover:text-[#fdf8f5]">{article.tag}</span>
                                <h3 className="text-xl lg:text-2xl font-black text-[#fdf8f5] leading-tight group-hover:italic transition-all mb-4 uppercase tracking-tighter line-clamp-2">
                                    {article.title}
                                </h3>
                                <p className="text-[10px] lg:text-[11px] text-[#d6c2b8] line-clamp-3 font-black uppercase tracking-tight mb-6 opacity-80 leading-snug italic">
                                    {article.abstract}
                                </p>
                            </div>
                            <div className="flex items-center justify-between pt-6 border-t border-[#fdf8f5]/10 mt-auto">
                                <span className="text-[10px] font-black text-[#4d3c2e] uppercase tracking-[0.25em] italic">{article.date}</span>
                                <span className="text-[10px] font-black text-[#4d3c2e] uppercase tracking-[0.25em] italic">{article.readTime}</span>
                            </div>
                        </div>
                    </motion.article>
                ))}
             </div>
          </div>

          {/* Side Panels */}
          <div className="lg:col-span-4 space-y-8 lg:space-y-10">
              <div className="saas-card p-8 lg:p-10 bg-[#1a0f0a]/80 text-[#fdf8f5] relative overflow-hidden border-[#fdf8f5]/10 rounded-2xl shadow-2xl flex flex-col">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#fdf8f5]/5 blur-[100px]" />
                  <div className="relative z-10 flex-grow">
                      <h3 className="text-xl lg:text-2xl font-black mb-8 flex items-center gap-4 uppercase italic tracking-tighter border-b border-[#fdf8f5]/10 pb-4">
                          <HiOutlineLightningBolt className="text-[#fdf8f5] w-6 h-6 lg:w-7 lg:h-7" />
                          Trending Metrics
                      </h3>
                      <div className="space-y-10">
                         {[
                            { label: "High Bias Network", val: "Global Syndicate", sub: "12k articles" },
                            { label: "Narrative Shift", val: "Resource Scarcity", sub: "45% increase" },
                            { label: "Strict Mode Filter", val: "Healthcare Policy", sub: "0.68 deviation" },
                         ].map((item, i) => (
                            <div key={i} className="group cursor-default">
                                <p className="text-[9px] font-black text-[#4d3c2e] uppercase tracking-[0.3em] mb-2 italic">{item.label}</p>
                                <p className="text-lg font-black text-[#fdf8f5] group-hover:italic group-hover:translate-x-2 transition-all uppercase tracking-tighter">{item.val}</p>
                                <p className="text-[10px] text-[#8d7b68] font-black uppercase tracking-widest mt-1 opacity-60 underline decoration-[#fdf8f5]/10">{item.sub}</p>
                            </div>
                         ))}
                      </div>
                  </div>
              </div>

              <div className="glass-card p-8 lg:p-10 text-center bg-[#fdf8f5]/[0.02] border-[#fdf8f5]/10 rounded-2xl relative overflow-hidden shadow-2xl group flex flex-col justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#fdf8f5]/5 to-transparent pointer-events-none" />
                  <HiOutlineNewspaper className="w-12 h-12 lg:w-16 lg:h-16 text-[#fdf8f5]/10 mx-auto mb-6 group-hover:scale-110 transition-transform duration-1000" />
                  <h3 className="text-xl lg:text-2xl font-black text-[#fdf8f5] mb-3 uppercase italic tracking-tighter">Newsletter Signup</h3>
                  <p className="text-[10px] text-[#8d7b68] font-black mb-8 leading-relaxed uppercase tracking-[0.2em] italic opacity-80">Weekly summary of bias research and news analysis.</p>
                  
                  {subStatus === "success" ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[11px] font-black text-[#fdf8f5] uppercase tracking-[0.3em] italic bg-[#fdf8f5]/10 py-5 shadow-2xl border border-[#fdf8f5]/20 animate-pulse"
                    >
                        Subscribed
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="space-y-4 relative z-10">
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="YOUR@EMAIL.COM"
                          className="w-full bg-[#1a0f0a] border border-[#fdf8f5]/10 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:border-[#fdf8f5] text-[#fdf8f5] transition-all placeholder:text-[#4d3c2e] italic"
                        />
                        <button className="btn-primary w-full py-5 text-[10px] font-black uppercase tracking-[0.3em] italic bg-[#fdf8f5] text-[#1a0f0a] hover:bg-[#f5ebe0] border-none rounded-2xl shadow-xl transition-all">Subscribe</button>
                    </form>
                  )}
              </div>
          </div>
      </div>

    </div>
  );
}
