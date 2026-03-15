"use client"
import React from "react";
import { motion } from "framer-motion";
import { HiOutlineDocumentText, HiOutlinePlus, HiOutlineDownload, HiOutlineDotsVertical, HiOutlineCalendar } from "react-icons/hi";

export default function Reports() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-24 mesh-bg">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#fdf8f5]/10 pb-12">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-[#fdf8f5] flex items-center gap-6 uppercase italic">
            <HiOutlineDocumentText className="w-12 h-12 text-[#fdf8f5] shadow-2xl" />
            Audit Repository
          </h2>
          <p className="text-[#8d7b68] text-[10px] mt-4 font-black uppercase tracking-[0.25em] italic underline decoration-[#fdf8f5]/10 leading-relaxed">Historical bias synthesis and neural compliance documentation archives.</p>
        </div>
        <button className="btn-primary flex items-center justify-center gap-4 px-10 py-5 text-[11px] shadow-2xl transition-all italic">
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
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8d7b68] italic underline decoration-[#fdf8f5]/5">Available Intel Packages // Archive Node 01</h3>
            <span className="text-[9px] font-black text-[#4d3c2e] uppercase italic tracking-[0.3em]">Latent Depth: 4.2 Pb</span>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-[#1a0f0a]/80 text-[10px] font-black uppercase tracking-[0.3em] text-[#8d7b68] italic border-b border-[#fdf8f5]/5">
                        <th className="px-10 py-6">Intel Package</th>
                        <th className="px-10 py-6">Ingestion Date</th>
                        <th className="px-10 py-6 text-center">Status</th>
                        <th className="px-10 py-6 text-right">Protocol</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#fdf8f5]/5">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i} className="group hover:bg-[#fdf8f5]/[0.03] cursor-pointer transition-colors relative">
                            <td className="px-10 py-8 relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-none bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 flex items-center justify-center text-[#fdf8f5] group-hover:bg-[#fdf8f5] group-hover:text-[#1a0f0a] transition-all shadow-xl">
                                        <HiOutlineDocumentText className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="text-base font-black text-[#fdf8f5] group-hover:italic transition-all uppercase tracking-tighter leading-none mb-2">
                                            Q1 Media Bias Synthesis Report
                                        </p>
                                        <p className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.2em] italic opacity-60">Neural_Bundle • PDF • 2.4 MB</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-10 py-8 text-[11px] font-black text-[#d6c2b8] tracking-[0.15em] italic">
                                2026-03-{10+i}
                            </td>
                            <td className="px-10 py-8 text-center">
                                <span className="px-5 py-2 rounded-none bg-[#f5ebe0] text-[#1a0f0a] text-[9px] font-black uppercase tracking-[0.3em] italic shadow-xl">
                                    Verified
                                </span>
                            </td>
                            <td className="px-10 py-8 text-right relative z-10">
                                <div className="flex items-center justify-end gap-6 text-[#4d3c2e] group-hover:text-[#fdf8f5] transition-colors">
                                    <button className="p-3 hover:bg-[#fdf8f5]/10 rounded-none transition-colors border border-transparent hover:border-[#fdf8f5]/20 shadow-xl">
                                        <HiOutlineDownload className="w-6 h-6" />
                                    </button>
                                    <button className="p-3 hover:bg-[#fdf8f5]/10 rounded-none transition-colors border border-transparent hover:border-[#fdf8f5]/20 shadow-xl">
                                        <HiOutlineDotsVertical className="w-6 h-6" />
                                    </button>
                                </div>
                            </td>
                            <div className="absolute inset-y-0 left-0 w-1 bg-[#fdf8f5] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        <div className="p-10 bg-[#1a0f0a] border-t border-[#fdf8f5]/5 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fdf8f5]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <button className="text-[11px] font-black text-[#8d7b68] uppercase tracking-[0.3em] hover:text-[#fdf8f5] transition-all flex items-center justify-center gap-4 mx-auto italic relative z-10">
                <HiOutlineCalendar className="w-5 h-5" />
                Access Full Archive Depth
            </button>
        </div>
      </motion.div>

    </div>
  );
}
