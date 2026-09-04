"use client"
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiOutlineDocumentText, HiOutlinePlus, HiOutlineDownload, HiOutlineCalendar, HiOutlineExternalLink } from "react-icons/hi";
import { getRecentAnalyses } from "../services/analysisService";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadReports() {
      try {
        const data = await getRecentAnalyses(50);
        setReports(data);
      } catch (err) {
        console.error("Failed to load reports:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const handleDownload = (report) => {
    const jsonStr = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `truthlens-audit-${report.id || "report"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-24 mesh-bg">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#fdf8f5]/10 pb-12">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-[#fdf8f5] flex items-center gap-6 uppercase italic">
            <HiOutlineDocumentText className="w-12 h-12 text-[#fdf8f5] shadow-2xl" />
            Audit Repository
          </h2>
          <p className="text-[#8d7b68] text-[10px] mt-4 font-black uppercase tracking-[0.25em] italic underline decoration-[#fdf8f5]/10 leading-relaxed">
            Historical bias synthesis, neural compliance documentation, and exportable intelligence packages.
          </p>
        </div>
        <button 
          onClick={() => navigate("/bias-analyzer")}
          className="btn-primary flex items-center justify-center gap-4 px-10 py-5 text-[11px] shadow-2xl transition-all italic"
        >
          <HiOutlinePlus className="w-6 h-6" />
          Generate New Audit
        </button>
      </div>

      {/* Reports Table Bento */}
      <motion.div 
        className="saas-card overflow-hidden bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-none shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-10 border-b border-[#fdf8f5]/5 bg-[#fdf8f5]/[0.01] flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8d7b68] italic underline decoration-[#fdf8f5]/5">
              Available Intel Packages // Archive Node 01
            </h3>
            <span className="text-[9px] font-black text-[#4d3c2e] uppercase italic tracking-[0.3em]">
              Total Ingested: {reports.length} Reports
            </span>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-[#1a0f0a]/80 text-[10px] font-black uppercase tracking-[0.3em] text-[#8d7b68] italic border-b border-[#fdf8f5]/5">
                        <th className="px-10 py-6">Intel Package</th>
                        <th className="px-10 py-6">Source Vector</th>
                        <th className="px-10 py-6">Ingestion Date</th>
                        <th className="px-10 py-6 text-center">Bias Level</th>
                        <th className="px-10 py-6 text-right">Export</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#fdf8f5]/5">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="px-10 py-16 text-center">
                          <div className="w-8 h-8 border-3 border-[#fdf8f5] border-t-transparent animate-spin mx-auto mb-4" />
                          <p className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic">Retrieving Intel Archive...</p>
                        </td>
                      </tr>
                    ) : reports.length > 0 ? (
                      reports.map((report) => (
                        <tr key={report.id} className="group hover:bg-[#fdf8f5]/[0.03] cursor-pointer transition-colors relative">
                            <td className="px-10 py-8 relative z-10 max-w-md">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-none bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 flex items-center justify-center text-[#fdf8f5] group-hover:bg-[#fdf8f5] group-hover:text-[#1a0f0a] transition-all shadow-xl shrink-0">
                                        <HiOutlineDocumentText className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="text-base font-black text-[#fdf8f5] group-hover:italic transition-all uppercase tracking-tighter leading-tight mb-2">
                                            {report.title}
                                        </p>
                                        <p className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.2em] italic opacity-60">
                                            Score: {report.bias_score || (report.biasScore * 100).toFixed(1)} / 100 • JSON Package
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-10 py-8 text-[11px] font-black text-[#d6c2b8] tracking-[0.15em] italic">
                                {report.source || "Manual Ingestion"}
                            </td>
                            <td className="px-10 py-8 text-[11px] font-black text-[#d6c2b8] tracking-[0.15em] italic">
                                {report.date || new Date(report.timestamp).toLocaleDateString()}
                            </td>
                            <td className="px-10 py-8 text-center">
                                <span className={`px-4 py-1.5 rounded-none text-[9px] font-black uppercase tracking-[0.25em] italic shadow-xl ${
                                  (report.bias_score || 0) < 40
                                    ? "bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30"
                                    : (report.bias_score || 0) < 70
                                    ? "bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30"
                                    : "bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30"
                                }`}>
                                    {report.biasLevel || "Verified"}
                                </span>
                            </td>
                            <td className="px-10 py-8 text-right relative z-10">
                                <div className="flex items-center justify-end gap-4 text-[#4d3c2e] group-hover:text-[#fdf8f5] transition-colors">
                                    <button 
                                      onClick={() => handleDownload(report)}
                                      title="Export JSON"
                                      className="p-3 hover:bg-[#fdf8f5]/10 rounded-none transition-colors border border-transparent hover:border-[#fdf8f5]/20 shadow-xl"
                                    >
                                        <HiOutlineDownload className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                            <div className="absolute inset-y-0 left-0 w-1 bg-[#fdf8f5] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-10 py-16 text-center">
                          <p className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic opacity-50">
                            No audits found in database. Ingest articles in Bias Analyzer to populate.
                          </p>
                        </td>
                      </tr>
                    )}
                </tbody>
            </table>
        </div>
        
        <div className="p-10 bg-[#1a0f0a] border-t border-[#fdf8f5]/5 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fdf8f5]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <button 
              onClick={() => navigate("/dashboard")}
              className="text-[11px] font-black text-[#8d7b68] uppercase tracking-[0.3em] hover:text-[#fdf8f5] transition-all flex items-center justify-center gap-4 mx-auto italic relative z-10"
            >
                <HiOutlineCalendar className="w-5 h-5" />
                Return to Neural Dashboard
            </button>
        </div>
      </motion.div>

    </div>
  );
}
