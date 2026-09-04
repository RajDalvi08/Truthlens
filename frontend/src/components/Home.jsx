"use client"
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiOutlineLightningBolt, HiOutlineShieldCheck, HiOutlineCubeTransparent, HiOutlineArrowRight, HiOutlineGlobeAlt, HiOutlinePresentationChartBar } from "react-icons/hi";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden animate-in fade-in duration-1000 mesh-bg">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#fdf8f5]/[0.03] blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#fdf8f5]/[0.02] blur-[150px] rounded-full" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-[#fdf8f5]/[0.01] blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20 md:py-24 relative z-10">
          
          {/* Hero Section */}
          <div className="text-center space-y-6 sm:space-y-10 md:space-y-12 mb-16 sm:mb-28 md:mb-40">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-2.5 glass-card bg-[#fdf8f5]/5 backdrop-blur-3xl border-[#fdf8f5]/10 rounded-2xl shadow-2xl"
              >
                  <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#fdf8f5] animate-ping" />
                  <span className="text-[9px] sm:text-[10px] font-black text-[#fdf8f5] uppercase tracking-[0.2em] sm:tracking-[0.3em] italic">System Live: TruthLens v1.0</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-6xl md:text-8xl lg:text-[110px] font-black tracking-tighter text-[#fdf8f5] leading-[0.9] sm:leading-[0.85] uppercase italic"
              >
                Discover the <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fdf8f5] via-[#8d7b68] to-[#261a14] not-italic">Truth in News.</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm sm:text-base md:text-xl text-[#d6c2b8] max-w-3xl mx-auto font-black uppercase tracking-tight leading-relaxed italic border-x border-[#fdf8f5]/10 px-4 sm:px-10"
              >
                The advanced AI tool to detect news bias. Measure political leaning and find the objective truth in every story.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-6 sm:pt-12 w-full max-w-md sm:max-w-none mx-auto"
              >
                  <Link to="/dashboard" className="btn-primary w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 text-[11px] shadow-[0_0_50px_rgba(245,235,224,0.1)] transition-all group italic flex items-center justify-center gap-2">
                      Start Analysis
                      <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 text-[11px] font-black uppercase tracking-[0.3em] italic bg-[#fdf8f5]/5 backdrop-blur-md border border-[#fdf8f5]/10 text-[#fdf8f5] hover:bg-[#fdf8f5]/10 hover:border-[#fdf8f5]/30 rounded-none sm:rounded-2xl transition-all text-center">
                      Login / Sign Up
                  </Link>
              </motion.div>
          </div>

          {/* Bento Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 pb-20 sm:pb-32 md:pb-48">
              
              <motion.div 
                className="md:col-span-8 glass-card p-6 sm:p-8 md:p-12 bg-gradient-to-br from-[#fdf8f5]/5 to-transparent relative overflow-hidden group border-[#fdf8f5]/10 rounded-2xl shadow-2xl"
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#fdf8f5]/5 blur-[120px] pointer-events-none group-hover:bg-[#fdf8f5]/10 transition-all duration-1000" />
                  <HiOutlineGlobeAlt className="w-10 sm:w-16 h-10 sm:h-16 text-[#fdf8f5] mb-6 sm:mb-10 shadow-[0_0_20px_rgba(253,248,245,0.2)]" />
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#fdf8f5] mb-4 sm:mb-6 uppercase italic tracking-tighter">Global News Analysis</h3>
                  <p className="text-[#d6c2b8] text-xs sm:text-sm md:text-base font-black uppercase tracking-tight leading-relaxed max-w-xl italic opacity-80">
                      See how news stories differ across the world in real-time. We analyze thousands of articles daily to find bias.
                  </p>
                  <div className="mt-8 sm:mt-16 flex flex-wrap items-center gap-4 sm:gap-10">
                      <div className="flex -space-x-3 sm:-space-x-4">
                          {[1,2,3,4].map(i => (
                              <div key={i} className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border-2 border-[#1a0f0a] bg-[#261a14] flex items-center justify-center text-[9px] sm:text-[10px] font-black text-[#fdf8f5] italic">0{i}</div>
                          ))}
                      </div>
                      <p className="text-[9px] sm:text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic">+14K Analysts Connected</p>
                  </div>
              </motion.div>

              <motion.div 
                className="md:col-span-4 saas-card p-6 sm:p-8 md:p-12 flex flex-col justify-between group overflow-hidden bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-2xl shadow-2xl hover:border-[#fdf8f5]/30 transition-all"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#fdf8f5]/5 blur-3xl pointer-events-none" />
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#fdf8f5] mb-6 sm:mb-12 shadow-[0_0_15px_rgba(253,248,245,0.05)]">
                      <HiOutlineLightningBolt className="w-6 sm:w-8 h-6 sm:h-8" />
                  </div>
                  <div>
                      <h3 className="text-2xl sm:text-3xl font-black text-[#fdf8f5] mb-2 sm:mb-3 uppercase italic tracking-tighter">Smart Analysis</h3>
                      <p className="text-[10px] sm:text-[11px] text-[#8d7b68] font-black uppercase tracking-widest leading-relaxed italic opacity-80 group-hover:text-[#d6c2b8] transition-colors">
                          Fast analysis of news language and topics using advanced AI.
                      </p>
                  </div>
              </motion.div>

              <motion.div 
                className="md:col-span-4 saas-card p-6 sm:p-8 md:p-12 flex flex-col justify-between group bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-2xl shadow-2xl hover:border-[#fdf8f5]/30 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#fdf8f5] mb-6 sm:mb-12 shadow-[0_0_15px_rgba(253,248,245,0.05)]">
                      <HiOutlineShieldCheck className="w-6 sm:w-8 h-6 sm:h-8" />
                  </div>
                  <div>
                      <h3 className="text-2xl sm:text-3xl font-black text-[#fdf8f5] mb-2 sm:mb-3 uppercase italic tracking-tighter">Source Checking</h3>
                      <p className="text-[10px] sm:text-[11px] text-[#8d7b68] font-black uppercase tracking-widest leading-relaxed italic opacity-80 group-hover:text-[#d6c2b8] transition-colors">
                          Verification of news sources and their history of bias.
                      </p>
                  </div>
              </motion.div>

              <motion.div 
                className="md:col-span-8 glass-card p-6 sm:p-8 md:p-12 bg-[#fdf8f5]/[0.02] text-[#fdf8f5] relative overflow-hidden group border-[#fdf8f5]/10 rounded-2xl shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#fdf8f5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 sm:gap-12 h-full">
                      <div className="space-y-4 sm:space-y-6">
                          <HiOutlinePresentationChartBar className="w-12 sm:w-16 h-12 sm:h-16 text-[#fdf8f5] shadow-[0_0_20px_rgba(253,248,245,0.2)]" />
                          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight uppercase italic tracking-tighter">Measure News <br className="hidden sm:inline" />Differences.</h3>
                      </div>
                      <div className="flex-1 w-full max-w-sm space-y-4 sm:space-y-6">
                          <div className="h-2.5 sm:h-3 w-full bg-[#fdf8f5]/5 rounded-2xl overflow-hidden border border-[#fdf8f5]/10">
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: "85%" }}
                                className="h-full bg-[#fdf8f5] shadow-[0_0_10px_rgba(253,248,245,0.4)]"
                                transition={{ duration: 1.5, ease: "easeOut" }}
                              />
                          </div>
                          <div className="h-2.5 sm:h-3 w-full bg-[#fdf8f5]/5 rounded-2xl overflow-hidden border border-[#fdf8f5]/10">
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: "55%" }}
                                className="h-full bg-[#d6c2b8]"
                                transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                              />
                          </div>
                          <div className="h-2.5 sm:h-3 w-full bg-[#fdf8f5]/5 rounded-2xl overflow-hidden border border-[#fdf8f5]/10">
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: "70%" }}
                                className="h-full bg-[#8d7b68]"
                                transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
                              />
                          </div>
                      </div>
                  </div>
              </motion.div>
          </div>

          {/* Social Proof / Network Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 text-center border-t border-[#fdf8f5]/10 pt-12 sm:pt-24 bg-gradient-to-b from-[#fdf8f5]/[0.02] to-transparent p-6 sm:p-12">
              {[
                  { label: "Analyses Performed", val: "4.2M+" },
                  { label: "Sources Tracked", val: "12,400" },
                  { label: "Neural Accuracy", val: "99.2%" },
                  { label: "Data Nodes", val: "382" },
              ].map((stat, i) => (
                  <div key={i} className="space-y-2 sm:space-y-4 p-4 glass-card sm:bg-transparent sm:border-0 sm:shadow-none">
                      <h4 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#fdf8f5] italic tracking-tighter tabular-nums">{stat.val}</h4>
                      <p className="text-[9px] sm:text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.2em] sm:tracking-[0.3em] italic">{stat.label}</p>
                  </div>
              ))}
          </div>

      </div>

    </div>
  );
}