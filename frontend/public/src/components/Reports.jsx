import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "../SearchContext";
import { HiOutlineDocumentText, HiOutlinePlus, HiOutlineDownload, HiOutlineDotsVertical, HiOutlineCalendar, HiOutlineTrash } from "react-icons/hi";
import { getRecentAnalyses, deleteAnalysis } from "../services/analysisService";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [limit, setLimit] = useState(20);
  const [isDeepScanning, setIsDeepScanning] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { searchQuery } = useSearch();

  const loadReports = async (currentLimit) => {
    if (!user?.uid) return;
    try {
      const data = await getRecentAnalyses(currentLimit, user.uid);
      setReports(data);
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
      setIsDeepScanning(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadReports(limit);
    }
  }, [user]);

  const filteredReports = reports.filter(report => 
    (report.headline || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (report.source || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleDownload = (report, e) => {
    e.stopPropagation();
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
    
    addLine("Record ID", report.id);
    addLine("Source", report.source);
    addLine("Timestamp", report.timestamp ? new Date(report.timestamp).toLocaleString() : "N/A");
    addLine("Headline", report.headline);
    addLine("Bias Score", report.bias_score);
    addLine("Bias Level", report.bias_level);
    addLine("Sentiment", report.sentiment_score);
    
    y += 10;
    
    // Add Summary if it exists
    if (report.summary) {
        doc.setFont("helvetica", "bold");
        doc.text("Executive Summary:", 20, y);
        y += 10;
        doc.setFont("helvetica", "normal");
        
        const summaryLines = doc.splitTextToSize(String(report.summary), 170);
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
    if (report.text) {
        if (y > 260) { doc.addPage(); y = 20; }
        doc.setFont("helvetica", "bold");
        doc.text("Full Article Content:", 20, y);
        y += 10;
        doc.setFont("helvetica", "normal");
        
        const textLines = doc.splitTextToSize(String(report.text), 170);
        textLines.forEach(line => {
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
            doc.text(line, 20, y);
            y += 7;
        });
    }

    if (!report.text && !report.summary) {
        doc.setFont("helvetica", "italic");
        doc.text("No article content or summary available.", 20, y);
    }
    
    doc.save(`truthlens_report_${report.id || 'export'}.pdf`);
  };

  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteAnalysis(id, user.uid);
      setReports(reports.filter(r => r.id !== id));
      setActiveMenu(null);
    } catch (err) {
      console.error("Failed to delete report:", err);
    }
  };

  const handleLoadMore = () => {
    setIsDeepScanning(true);
    // Simulate deep database scan
    setTimeout(() => {
      const newLimit = limit + 100;
      setLimit(newLimit);
      loadReports(newLimit);
    }, 1500);
  };

  if (loading && !isDeepScanning) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] mesh-bg">
        <div className="w-12 h-12 border-4 border-[#fdf8f5] border-t-transparent rounded-2xl animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-24 mesh-bg">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#fdf8f5]/10 pb-12">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-[#fdf8f5] flex items-center gap-6 uppercase italic">
            <HiOutlineDocumentText className="w-12 h-12 text-[#fdf8f5] shadow-2xl" />
            Saved Reports
          </h2>
          <p className="text-[#8d7b68] text-[10px] mt-4 font-black uppercase tracking-[0.25em] italic underline decoration-[#fdf8f5]/10 leading-relaxed">Archive of all bias analysis and summary reports.</p>
        </div>
        <button 
          onClick={() => navigate("/bias-analyzer")}
          className="btn-primary flex items-center justify-center gap-4 px-10 py-5 text-[11px] shadow-2xl transition-all italic">
          <HiOutlinePlus className="w-6 h-6" />
          Create New Report
        </button>
      </div>

      {/* Reports Table Bento */}
      <motion.div 
        className="saas-card overflow-hidden bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-2xl shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-10 border-b border-[#fdf8f5]/5 bg-[#fdf8f5]/[0.01] flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8d7b68] italic underline decoration-[#fdf8f5]/5">Available Reports</h3>
            <span className="text-[9px] font-black text-[#4d3c2e] uppercase italic tracking-[0.3em]">Total Data: {reports.length * 2.4} KB</span>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-[#1a0f0a]/80 text-[10px] font-black uppercase tracking-[0.3em] text-[#8d7b68] italic border-b border-[#fdf8f5]/5">
                        <th className="px-10 py-6">Report Title</th>
                        <th className="px-10 py-6">Analysis Date</th>
                        <th className="px-10 py-6 text-center">Bias Result</th>
                        <th className="px-10 py-6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#fdf8f5]/5">
                    {filteredReports.map((report, i) => (
                        <tr key={report.id || i} className="group hover:bg-[#fdf8f5]/[0.03] cursor-pointer transition-colors relative">
                            <td className="px-10 py-10 relative z-10">
                                <div className="absolute inset-y-0 left-0 w-1 bg-[#fdf8f5] opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center gap-8">
                                    <div className="w-16 h-16 rounded-2xl bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 flex items-center justify-center text-[#fdf8f5] group-hover:bg-[#fdf8f5] group-hover:text-[#1a0f0a] transition-all shadow-xl flex-shrink-0">
                                        <HiOutlineDocumentText className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-base font-black text-[#fdf8f5] group-hover:italic transition-all uppercase tracking-tighter leading-tight mb-2 line-clamp-1">
                                            {report.headline || "Analysis Report"}
                                        </p>
                                        <p className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.2em] italic opacity-60">Report • {report.source || "News Outlet"}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-10 py-10 text-[11px] font-black text-[#d6c2b8] tracking-[0.15em] italic">
                                {report.timestamp ? new Date(report.timestamp).toLocaleDateString() : "Pending"}
                            </td>
                            <td className="px-10 py-10 text-center">
                                <span className={`px-6 py-2.5 rounded-2xl ${Math.abs(report.bias_score) < 0.2 ? 'bg-[#10b981] text-[#fdf8f5]' : 'bg-[#f5ebe0] text-[#1a0f0a]'} text-[10px] font-black uppercase tracking-[0.3em] italic shadow-xl`}>
                                    {Math.abs(report.bias_score) < 0.2 ? 'Balanced' : 'Flagged'}
                                </span>
                            </td>
                            <td className="px-10 py-10 text-right relative z-10 w-48">
                                <div className="flex items-center justify-end gap-4 text-[#4d3c2e]">
                                    <button 
                                        onClick={(e) => handleDownload(report, e)}
                                        className="p-4 hover:bg-[#fdf8f5]/10 rounded-2xl transition-colors border border-transparent hover:border-[#fdf8f5]/20 shadow-xl group-hover:text-[#fdf8f5]"
                                        title="Download Report"
                                    >
                                        <HiOutlineDownload className="w-6 h-6" />
                                    </button>
                                    <div className="relative">
                                        <button 
                                            onClick={(e) => toggleMenu(report.id || i, e)}
                                            className={`p-4 rounded-2xl transition-colors border border-transparent shadow-xl ${activeMenu === (report.id || i) ? 'bg-[#fdf8f5]/10 text-[#fdf8f5] border-[#fdf8f5]/20' : 'hover:bg-[#fdf8f5]/10 hover:border-[#fdf8f5]/20 group-hover:text-[#fdf8f5]'}`}
                                        >
                                            <HiOutlineDotsVertical className="w-6 h-6" />
                                        </button>
                                        <AnimatePresence>
                                            {activeMenu === (report.id || i) && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute right-0 mt-2 w-48 bg-[#1a0f0a] border border-[#fdf8f5]/10 shadow-2xl z-50 rounded-2xl overflow-hidden"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <button 
                                                        onClick={(e) => handleDelete(report.id, e)}
                                                        className="w-full text-left px-6 py-4 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] italic text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
                                                    >
                                                        <HiOutlineTrash className="w-5 h-5" />
                                                        Delete Archive
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        <div className="p-10 bg-[#1a0f0a] border-t border-[#fdf8f5]/5 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fdf8f5]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <button 
                onClick={handleLoadMore}
                disabled={isDeepScanning}
                className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 mx-auto italic relative z-10 ${
                    isDeepScanning ? "text-[#fdf8f5] animate-pulse" : "text-[#8d7b68] hover:text-[#fdf8f5]"
                }`}
            >
                {isDeepScanning ? (
                    <>
                        <div className="w-4 h-4 border-2 border-[#fdf8f5] border-t-transparent animate-spin" />
                        DEEP SCANNING ARCHIVE...
                    </>
                ) : (
                    <>
                        <HiOutlineCalendar className="w-5 h-5" />
                        Access Full Archive Depth
                    </>
                )}
            </button>
        </div>
      </motion.div>

    </div>
  );
}

