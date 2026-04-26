import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineDatabase, HiOutlineCloudUpload, HiOutlineCog, HiOutlineShare, HiOutlineSearch, HiOutlineTrash, HiOutlineDownload } from "react-icons/hi";
import { getAnalysisStats, getRecentAnalyses, deleteAnalysis, analyzeArticle } from "../services/analysisService";
import { jsPDF } from "jspdf";
import { useAuth } from "../AuthContext";

export default function DatasetManager() {
  const [stats, setStats] = useState(null);
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  
  // New States for Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadUrl, setUploadUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadData = async () => {
    if (!user?.uid) return;
    try {
      const [statsData, articlesData] = await Promise.all([
        getAnalysisStats(user.uid),
        getRecentAnalyses(100, user.uid)
      ]);
      setStats(statsData);
      setArticles(articlesData);
    } catch (error) {
      console.error("Failed to load dataset stats:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this record from the database?")) {
        try {
            await deleteAnalysis(id, user.uid);
            setArticles(articles.filter(a => a.id !== id));
            setStats(prev => ({...prev, totalArticles: prev.totalArticles - 1}));
        } catch (error) {
            console.error("Failed to delete", error);
        }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadUrl.trim() || !user?.uid) return;
    setIsUploading(true);
    try {
      await analyzeArticle({ url: uploadUrl, userId: user.uid });
      setUploadUrl("");
      setIsUploadOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to analyze article. The site may be blocking access.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSyncCloud = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 2000);
  };

  const handleDownload = (article) => {
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("TruthLens Intelligence Report", 20, 20);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    let y = 40;
    const addLine = (label, value) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, 20, y);
      doc.setFont("helvetica", "normal");
      
      const textLines = doc.splitTextToSize(String(value || "N/A"), 130);
      doc.text(textLines, 60, y);
      y += 8 * textLines.length;
    };
    
    addLine("Record ID", article.id);
    addLine("Source", article.source);
    addLine("Timestamp", article.timestamp ? new Date(article.timestamp).toLocaleString() : "N/A");
    addLine("Headline", article.headline);
    addLine("Bias Score", article.bias_score);
    addLine("Bias Level", article.bias_level);
    addLine("Sentiment", article.sentiment_score);
    
    y += 10;
    
    // Add Summary if it exists
    if (article.summary) {
        doc.setFont("helvetica", "bold");
        doc.text("Executive Summary:", 20, y);
        y += 10;
        doc.setFont("helvetica", "normal");
        
        const summaryLines = doc.splitTextToSize(String(article.summary), 170);
        summaryLines.forEach(line => {
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
            doc.text(line, 20, y);
            y += 7;
        });
        y += 5; // spacing
    }
    
    // Add Full Text if it exists
    if (article.text) {
        if (y > 260) { doc.addPage(); y = 20; }
        doc.setFont("helvetica", "bold");
        doc.text("Full Article Content:", 20, y);
        y += 10;
        doc.setFont("helvetica", "normal");
        
        const textLines = doc.splitTextToSize(String(article.text), 170);
        textLines.forEach(line => {
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
            doc.text(line, 20, y);
            y += 7;
        });
    }

    if (!article.text && !article.summary) {
        doc.setFont("helvetica", "italic");
        doc.text("No article content or summary available.", 20, y);
    }
    
    doc.save(`truthlens_record_${article.id || 'export'}.pdf`);
  };

  const filteredArticles = articles.filter(a => 
      (a.headline || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
      (a.source || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-24 mesh-bg">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#fdf8f5]/10 pb-12">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-[#fdf8f5] flex items-center gap-6 uppercase italic">
            <HiOutlineDatabase className="w-12 h-12 text-[#fdf8f5] shadow-2xl" />
            Article Database
          </h2>
          <p className="text-[#8d7b68] text-[10px] mt-4 font-black uppercase tracking-[0.25em] italic underline decoration-[#fdf8f5]/10 leading-relaxed">Manage and explore the collection of analyzed articles.</p>
        </div>
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="btn-primary flex items-center justify-center gap-4 px-10 py-5 text-[11px] shadow-2xl transition-all italic"
        >
          <HiOutlineCloudUpload className="w-6 h-6" />
          Upload New Articles
        </button>
      </div>

      {/* Grid of Datasets */}
      <div className="grid grid-cols-1 gap-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="saas-card group relative overflow-hidden flex flex-col justify-between bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-2xl shadow-2xl"
          >
             <div className="absolute top-0 right-0 w-48 h-48 bg-[#fdf8f5]/5 blur-[80px] group-hover:bg-[#fdf8f5]/10 transition-all duration-1000 pointer-events-none" />
             
             <div className="p-10">
                <div className="flex justify-between items-start mb-10">
                    <div className="w-16 h-16 bg-[#fdf8f5] text-[#1a0f0a] rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(253,248,245,0.15)]">
                        <HiOutlineDatabase className="w-8 h-8" />
                    </div>
                    <span className="px-5 py-2 bg-[#fdf8f5]/5 text-[#fdf8f5] border border-[#fdf8f5]/20 text-[9px] font-black uppercase tracking-[0.3em] italic">DATABASE V1</span>
                </div>
                
                <h3 className="text-3xl font-black text-[#fdf8f5] mb-6 uppercase italic tracking-tighter">TruthLens Main Database</h3>
                <p className="text-sm text-[#d6c2b8] font-black uppercase tracking-tight mb-12 leading-relaxed opacity-80 italic max-w-2xl">A collection of all news articles analyzed by the system. Updated automatically with every new scan.</p>
                
                <div className="flex flex-wrap items-center gap-10 text-[9px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 bg-[#fdf8f5] opacity-50" />
                        {stats?.totalArticles || 0} ANALYZED ARTICLES
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 bg-[#fdf8f5] opacity-50" />
                        v1.0 Analysis Package
                    </div>
                </div>
             </div>

             <div className="p-6 bg-[#fdf8f5]/[0.02] border-t border-[#fdf8f5]/5 grid grid-cols-2 gap-6 relative z-10">
                <button 
                  onClick={() => setIsConfigOpen(true)}
                  className="flex items-center justify-center gap-4 py-4 text-[10px] font-black uppercase tracking-[0.25em] italic bg-[#1a0f0a] border border-[#fdf8f5]/10 text-[#8d7b68] hover:text-[#fdf8f5] hover:border-[#fdf8f5] transition-all rounded-2xl shadow-xl"
                >
                    <HiOutlineCog className="w-5 h-5" />
                    Configure Database
                </button>
                <button 
                  onClick={handleSyncCloud}
                  disabled={isSyncing}
                  className="flex items-center justify-center gap-4 py-4 text-[10px] font-black uppercase tracking-[0.25em] italic bg-[#1a0f0a] border border-[#fdf8f5]/10 text-[#8d7b68] hover:text-[#fdf8f5] hover:border-[#fdf8f5] transition-all rounded-2xl shadow-xl disabled:opacity-50"
                >
                    <HiOutlineShare className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? "Synchronizing..." : "Synchronize Cloud"}
                </button>
             </div>
          </motion.div>
      </div>

      {/* Article Records Viewer */}
      <motion.div 
          className="saas-card overflow-hidden bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.6)] mt-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
      >
          <div className="p-10 bg-[#fdf8f5]/[0.02] border-b border-[#fdf8f5]/10 flex flex-col md:flex-row md:items-center justify-between gap-10">
             <div>
                 <h3 className="text-2xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">Database Records</h3>
                 <p className="text-[10px] text-[#8d7b68] font-black uppercase tracking-[0.2em] mt-2 italic">Raw data viewer</p>
             </div>
             <div className="relative w-full md:w-[400px]">
                <HiOutlineSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8d7b68] w-5 h-5" />
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="SEARCH DATABASE..." 
                  className="w-full bg-[#1a0f0a] border border-[#fdf8f5]/10 pl-16 pr-8 py-4 text-[10px] font-black uppercase tracking-[0.25em] rounded-2xl outline-none focus:border-[#fdf8f5] transition-all text-[#fdf8f5] placeholder:text-[#4d3c2e] italic"
                />
             </div>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="bg-[#fdf8f5]/[0.03] text-[9px] font-black uppercase tracking-[0.35em] text-[#8d7b68] italic">
                      <th className="px-10 py-6">ID / Headline</th>
                      <th className="px-10 py-6">Source</th>
                      <th className="px-10 py-6">Timestamp</th>
                      <th className="px-10 py-6 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-[#fdf8f5]/5 bg-[#fdf8f5]/[0.01]">
                   <AnimatePresence>
                     {filteredArticles.map((item) => (
                        <motion.tr 
                           key={item.id} 
                           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                           className="group hover:bg-[#fdf8f5]/[0.05] transition-all duration-300"
                        >
                           <td className="px-10 py-8">
                              <div className="text-[8px] font-black text-[#4d3c2e] tracking-widest mb-1">{item.id}</div>
                              <p className="text-sm font-black text-[#d6c2b8] group-hover:text-[#fdf8f5] group-hover:italic transition-all uppercase tracking-tight line-clamp-1">
                                 {item.headline || "Corpus Fragment"}
                              </p>
                           </td>
                           <td className="px-10 py-8">
                              <span className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.2em] italic">{item.source || "UNKNOWN"}</span>
                           </td>
                           <td className="px-10 py-8">
                              <span className="text-[10px] font-black text-[#4d3c2e] uppercase tabular-nums tracking-[0.2em] italic">{item.timestamp ? new Date(item.timestamp).toLocaleString() : "N/A"}</span>
                           </td>
                           <td className="px-10 py-8 text-right">
                               <div className="flex items-center justify-end gap-2">
                                   <button onClick={() => handleDownload(item)} className="p-3 bg-[#1a0f0a] border border-[#fdf8f5]/10 text-[#8d7b68] hover:text-[#fdf8f5] hover:border-[#fdf8f5]/30 transition-all shadow-xl" title="Download PDF Report">
                                       <HiOutlineDownload className="w-5 h-5" />
                                   </button>
                                   <button onClick={() => handleDelete(item.id)} className="p-3 bg-[#1a0f0a] border border-[#ef4444]/20 text-[#ef4444]/60 hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all shadow-xl" title="Delete Record">
                                       <HiOutlineTrash className="w-5 h-5" />
                                   </button>
                               </div>
                           </td>
                        </motion.tr>
                     ))}
                   </AnimatePresence>
                </tbody>
             </table>
             {filteredArticles.length === 0 && (
                <div className="p-20 text-center text-[10px] font-black text-[#4d3c2e] uppercase tracking-[0.3em] italic">No records found.</div>
             )}
          </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {isUploadOpen && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f0a]/90 backdrop-blur-sm p-4"
            >
               <motion.div 
                  initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                  className="bg-[#261a14] border border-[#fdf8f5]/10 p-10 max-w-lg w-full rounded-2xl shadow-2xl relative"
               >
                  <div className="flex justify-between items-center mb-8">
                     <h3 className="text-2xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">Ingest Article</h3>
                     <button onClick={() => setIsUploadOpen(false)} className="text-[10px] font-black text-[#8d7b68] hover:text-[#fdf8f5] uppercase tracking-widest transition-colors italic">
                        [CLOSE]
                     </button>
                  </div>
                  <form onSubmit={handleUploadSubmit} className="space-y-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.2em]">Article URL</label>
                        <input 
                          type="url" 
                          required
                          value={uploadUrl}
                          onChange={(e) => setUploadUrl(e.target.value)}
                          placeholder="https://news.example.com/article"
                          className="w-full bg-[#1a0f0a] border border-[#fdf8f5]/10 p-4 text-sm font-black text-[#fdf8f5] focus:outline-none focus:border-[#fdf8f5]/40 transition-colors placeholder:text-[#4d3c2e] placeholder:italic"
                        />
                     </div>
                     <button 
                        type="submit" 
                        disabled={isUploading}
                        className="w-full btn-primary py-4 text-[11px] font-black uppercase tracking-widest disabled:opacity-50"
                     >
                        {isUploading ? "Analyzing Neural Stream..." : "Initiate Scan"}
                     </button>
                  </form>
               </motion.div>
            </motion.div>
        )}

        {isConfigOpen && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f0a]/90 backdrop-blur-sm p-4"
            >
               <motion.div 
                  initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                  className="bg-[#261a14] border border-[#fdf8f5]/10 p-10 max-w-lg w-full rounded-2xl shadow-2xl relative"
               >
                  <h3 className="text-2xl font-black text-[#fdf8f5] mb-8 uppercase italic tracking-tighter">Database Configuration</h3>
                  
                  <div className="space-y-6 mb-10">
                     <div className="flex items-center justify-between p-4 bg-[#1a0f0a] border border-[#fdf8f5]/10">
                        <div>
                           <p className="text-xs font-black text-[#fdf8f5] uppercase tracking-wider">Cloud Auto-Sync</p>
                           <p className="text-[9px] text-[#8d7b68] uppercase tracking-widest mt-1">Automatically back up records</p>
                        </div>
                        <div className="w-12 h-6 bg-[#10b981]/20 border border-[#10b981] relative cursor-pointer">
                           <div className="absolute right-1 top-1 bottom-1 w-4 bg-[#10b981]" />
                        </div>
                     </div>

                     <div className="flex items-center justify-between p-4 bg-[#1a0f0a] border border-[#fdf8f5]/10">
                        <div>
                           <p className="text-xs font-black text-[#fdf8f5] uppercase tracking-wider">Deep Scan Mode</p>
                           <p className="text-[9px] text-[#8d7b68] uppercase tracking-widest mt-1">Enable strict semantic analysis</p>
                        </div>
                        <div className="w-12 h-6 bg-[#fdf8f5]/5 border border-[#fdf8f5]/20 relative cursor-pointer">
                           <div className="absolute left-1 top-1 bottom-1 w-4 bg-[#8d7b68]" />
                        </div>
                     </div>
                  </div>

                  <button 
                     onClick={() => setIsConfigOpen(false)}
                     className="w-full bg-[#fdf8f5] text-[#1a0f0a] py-4 text-[11px] font-black uppercase tracking-widest hover:bg-[#d6c2b8] transition-colors italic"
                  >
                     Save Settings
                  </button>
               </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
