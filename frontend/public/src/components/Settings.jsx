"use client"
import React from "react";
import { motion } from "framer-motion";
import { HiOutlineCog, HiOutlineAdjustments, HiOutlineShieldCheck, HiOutlineMail, HiOutlineChip } from "react-icons/hi";

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-24 mesh-bg">
      
      {/* Header */}
      <div className="border-b border-[#fdf8f5]/10 pb-12 flex items-end justify-between">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-[#fdf8f5] flex items-center gap-6 uppercase italic">
            <HiOutlineCog className="w-12 h-12 text-[#fdf8f5] shadow-2xl" />
            App Settings
          </h2>
          <p className="text-[#8d7b68] text-[10px] mt-4 font-black uppercase tracking-[0.25em] italic underline decoration-[#fdf8f5]/10">Adjust the application settings and preferences.</p>
        </div>
        <div className="hidden md:flex flex-col items-end">
            <span className="text-[9px] font-black text-[#4d3c2e] uppercase tracking-[0.3em] italic">Version 1.0</span>
            <span className="text-[9px] font-black text-[#fdf8f5] uppercase tracking-[0.3em] italic opacity-50">CONNECTED</span>
        </div>
      </div>

      <div className="space-y-10">
          
          {/* General Section */}
          <motion.div 
            className="saas-card overflow-hidden bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-2xl shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
              <div className="p-10 border-b border-[#fdf8f5]/5 bg-[#fdf8f5]/[0.01] flex items-center gap-4 text-[#fdf8f5]">
                  <HiOutlineAdjustments className="w-6 h-6" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] italic underline decoration-[#fdf8f5]/10">App Appearance</h3>
              </div>
              <div className="p-10 space-y-8">
                  <div className="flex items-center justify-between p-8 glass-card bg-[#fdf8f5]/[0.02] border-[#fdf8f5]/5 rounded-2xl shadow-xl hover:border-[#fdf8f5]/20 transition-all group">
                      <div>
                          <p className="text-lg font-black text-[#fdf8f5] uppercase italic tracking-tighter group-hover:translate-x-2 transition-transform">Visual Effects</p>
                          <p className="text-[10px] text-[#8d7b68] font-black uppercase tracking-[0.2em] italic mt-2">Turn on advanced blurs and background animations.</p>
                      </div>
                      <div className="w-16 h-8 bg-[#fdf8f5] rounded-2xl relative cursor-pointer shadow-[0_0_20px_rgba(253,248,245,0.4)]">
                          <div className="w-6 h-6 bg-[#1a0f0a] rounded-2xl absolute top-1 right-1" />
                      </div>
                  </div>

                  <div className="flex items-center justify-between p-8 glass-card bg-[#fdf8f5]/[0.01] border-[#fdf8f5]/5 rounded-2xl opacity-40 grayscale group">
                      <div>
                          <p className="text-lg font-black text-[#fdf8f5] uppercase italic tracking-tighter">Live News Ticker</p>
                          <p className="text-[10px] text-[#8d7b68] font-black uppercase tracking-[0.2em] italic mt-2">Show a real-time news feed at the bottom of the page.</p>
                      </div>
                      <div className="w-16 h-8 bg-[#fdf8f5]/10 rounded-2xl relative cursor-not-allowed border border-[#fdf8f5]/5">
                          <div className="w-6 h-6 bg-[#fdf8f5]/20 rounded-2xl absolute top-1 left-1" />
                      </div>
                  </div>
              </div>
          </motion.div>

          {/* Engine Parameters Section */}
          <motion.div 
            className="saas-card overflow-hidden bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-2xl shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
              <div className="p-10 border-b border-[#fdf8f5]/5 bg-[#fdf8f5]/[0.01] flex items-center gap-4 text-[#fdf8f5]">
                  <HiOutlineChip className="w-6 h-6" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] italic underline decoration-[#fdf8f5]/10">AI Settings</h3>
              </div>
              <div className="p-10 space-y-12">
                  <div className="space-y-6">
                      <label className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic">Main AI Model</label>
                      <div className="relative group">
                        <select className="w-full appearance-none bg-[#1a0f0a] border border-[#fdf8f5]/10 text-[#fdf8f5] px-8 py-5 text-xs font-black uppercase tracking-[0.25em] italic rounded-2xl outline-none focus:border-[#fdf8f5] transition-all cursor-pointer shadow-xl">
                            <option>TruthLens Default</option>
                            <option>OpenAI GPT-4o</option>
                            <option>Anthropic Claude 3.5</option>
                        </select>
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-[#8d7b68] group-hover:text-[#fdf8f5] transition-colors">
                            ▼
                        </div>
                      </div>
                  </div>

                  <div className="space-y-8">
                      <div className="flex justify-between items-end">
                         <label className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic">Bias Sensitivity Level</label>
                         <span className="text-[11px] font-black text-[#fdf8f5] bg-[#fdf8f5]/10 border border-[#fdf8f5]/20 px-4 py-2 italic uppercase tracking-[0.25em] shadow-xl">High Sensitivity</span>
                      </div>
                      <div className="h-10 flex items-center group/range">
                          <input type="range" className="w-full h-1 bg-[#fdf8f5]/10 rounded-2xl appearance-none cursor-pointer accent-[#fdf8f5] group-hover/range:bg-[#fdf8f5]/20 transition-all" />
                      </div>
                  </div>
              </div>
          </motion.div>

          {/* Security & Notifications */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
              <div className="saas-card p-12 flex flex-col justify-between bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-2xl group hover:border-[#fdf8f5]/40 transition-all shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#fdf8f5]/5 blur-[60px]" />
                  <div className="flex items-center gap-8 mb-10 relative z-10">
                      <div className="w-16 h-16 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 rounded-2xl flex items-center justify-center text-[#fdf8f5] group-hover:bg-[#fdf8f5] group-hover:text-[#1a0f0a] transition-all shadow-xl">
                          <HiOutlineShieldCheck className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">Account Security</h3>
                        <p className="text-[10px] text-[#d6c2b8] font-black uppercase tracking-[0.25em] mt-2 italic opacity-60">Status: LOCKED</p>
                      </div>
                  </div>
                  <p className="text-[11px] text-[#8d7b68] font-black uppercase tracking-tight italic mb-12 opacity-80 leading-relaxed">Manage your account security and login sessions.</p>
                  <button className="w-full py-5 text-[10px] font-black uppercase tracking-[0.3em] bg-[#1a0f0a] border border-[#fdf8f5]/10 text-[#8d7b68] hover:text-[#fdf8f5] hover:border-[#fdf8f5] hover:bg-[#fdf8f5]/10 transition-all rounded-2xl italic shadow-xl">Review Encryption Keys</button>
              </div>

              <div className="saas-card p-12 flex flex-col justify-between bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-2xl group hover:border-[#fdf8f5]/40 transition-all shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#fdf8f5]/5 blur-[60px]" />
                  <div className="flex items-center gap-8 mb-10 relative z-10">
                      <div className="w-16 h-16 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 rounded-2xl flex items-center justify-center text-[#fdf8f5] group-hover:bg-[#fdf8f5] group-hover:text-[#1a0f0a] transition-all shadow-xl">
                          <HiOutlineMail className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">Email Notifications</h3>
                        <p className="text-[10px] text-[#d6c2b8] font-black uppercase tracking-[0.25em] mt-2 italic opacity-60">Frequency: DAILY</p>
                      </div>
                  </div>
                  <p className="text-[11px] text-[#8d7b68] font-black uppercase tracking-tight italic mb-12 opacity-80 leading-relaxed">Get daily summaries and alerts sent to your email.</p>
                  <button className="w-full py-5 text-[10px] font-black uppercase tracking-[0.3em] bg-[#1a0f0a] border border-[#fdf8f5]/10 text-[#8d7b68] hover:text-[#fdf8f5] hover:border-[#fdf8f5] hover:bg-[#fdf8f5]/10 transition-all rounded-2xl italic shadow-xl">Protocol Frequency</button>
              </div>
          </motion.div>
      </div>

    </div>
  );
}
