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

      <div className="max-w-7xl mx-auto px-8 py-24 relative z-10">
          
          {/* Hero Section */}
          <div className="text-center space-y-12 mb-40">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 px-6 py-2.5 glass-card bg-[#fdf8f5]/5 backdrop-blur-3xl border-[#fdf8f5]/10 rounded-2xl shadow-2xl"
              >
                  <span className="flex h-2.5 w-2.5 rounded-full bg-[#fdf8f5] animate-ping" />
                  <span className="text-[10px] font-black text-[#fdf8f5] uppercase tracking-[0.3em] italic">System Live: TruthLens v1.0</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-7xl md:text-[110px] font-black tracking-tighter text-[#fdf8f5] leading-[0.85] uppercase italic"
              >
                Discover the <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fdf8f5] via-[#8d7b68] to-[#261a14] not-italic">Truth in News.</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-[#d6c2b8] max-w-3xl mx-auto font-black uppercase tracking-tight leading-relaxed italic border-x border-[#fdf8f5]/10 px-10"
              >
                The advanced AI tool to detect news bias. Measure political leaning and find the objective truth in every story.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12"
              >
                  <Link to="/dashboard" className="btn-primary px-12 py-6 text-[11px] shadow-[0_0_50px_rgba(245,235,224,0.1)] transition-all group italic">
                      Start Analysis
                      <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                  <Link to="/login" className="px-12 py-6 text-[11px] font-black uppercase tracking-[0.3em] italic bg-[#fdf8f5]/5 backdrop-blur-md border border-[#fdf8f5]/10 text-[#fdf8f5] hover:bg-[#fdf8f5]/10 hover:border-[#fdf8f5]/30 rounded-2xl transition-all">
                      Login / Sign Up
                  </Link>
              </motion.div>
          </div>

          {/* Bento Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-48">
              
              <motion.div 
                className="md:col-span-8 glass-card p-12 bg-gradient-to-br from-[#fdf8f5]/5 to-transparent relative overflow-hidden group border-[#fdf8f5]/10 rounded-2xl shadow-2xl"
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#fdf8f5]/5 blur-[120px] pointer-events-none group-hover:bg-[#fdf8f5]/10 transition-all duration-1000" />
                  <HiOutlineGlobeAlt className="w-16 h-16 text-[#fdf8f5] mb-10 shadow-[0_0_20px_rgba(253,248,245,0.2)]" />
                  <h3 className="text-4xl font-black text-[#fdf8f5] mb-6 uppercase italic tracking-tighter">Global News Analysis</h3>
                  <p className="text-[#d6c2b8] font-black uppercase tracking-tight leading-relaxed max-w-xl italic opacity-80">
                      See how news stories differ across the world in real-time. We analyze thousands of articles daily to find bias.
                  </p>
                  <div className="mt-16 flex items-center gap-10">
                      <div className="flex -space-x-4">
                          {[1,2,3,4].map(i => (
                              <div key={i} className="w-12 h-12 rounded-2xl border-2 border-[#1a0f0a] bg-[#261a14] flex items-center justify-center text-[10px] font-black text-[#fdf8f5] italic">0{i}</div>
                          ))}
                      </div>
                      <p className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic">+14K Analysts Connected</p>
                  </div>
              </motion.div>

              <motion.div 
                className="md:col-span-4 saas-card p-12 flex flex-col justify-between group overflow-hidden bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-2xl shadow-2xl hover:border-[#fdf8f5]/30 transition-all"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#fdf8f5]/5 blur-3xl pointer-events-none" />
                  <div className="w-16 h-16 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 rounded-2xl flex items-center justify-center text-[#fdf8f5] mb-12 shadow-[0_0_15px_rgba(253,248,245,0.05)]">
                      <HiOutlineLightningBolt className="w-8 h-8" />
                  </div>
                  <div>
                      <h3 className="text-3xl font-black text-[#fdf8f5] mb-3 uppercase italic tracking-tighter">Smart Analysis</h3>
                      <p className="text-[11px] text-[#8d7b68] font-black uppercase tracking-widest leading-relaxed italic opacity-80 group-hover:text-[#d6c2b8] transition-colors">
                          Fast analysis of news language and topics using advanced AI.
                      </p>
                  </div>
              </motion.div>

              <motion.div 
                className="md:col-span-4 saas-card p-12 flex flex-col justify-between group bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-2xl shadow-2xl hover:border-[#fdf8f5]/30 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                  <div className="w-16 h-16 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 rounded-2xl flex items-center justify-center text-[#fdf8f5] mb-12 shadow-[0_0_15px_rgba(253,248,245,0.05)]">
                      <HiOutlineShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                      <h3 className="text-3xl font-black text-[#fdf8f5] mb-3 uppercase italic tracking-tighter">Source Checking</h3>
                      <p className="text-[11px] text-[#8d7b68] font-black uppercase tracking-widest leading-relaxed italic opacity-80 group-hover:text-[#d6c2b8] transition-colors">
                          Verification of news sources and their history of bias.
                      </p>
                  </div>
              </motion.div>

              <motion.div 
                className="md:col-span-8 glass-card p-12 bg-[#fdf8f5]/[0.02] text-[#fdf8f5] relative overflow-hidden group border-[#fdf8f5]/10 rounded-2xl shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#fdf8f5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12 h-full">
                      <div className="space-y-6">
                          <HiOutlinePresentationChartBar className="w-16 h-16 text-[#fdf8f5] shadow-[0_0_20px_rgba(253,248,245,0.2)]" />
                          <h3 className="text-4xl font-black leading-tight uppercase italic tracking-tighter">Measure News <br/>Differences.</h3>
                      </div>
                      <div className="flex-1 max-w-sm space-y-6">
                          <div className="h-3 w-full bg-[#fdf8f5]/5 rounded-2xl overflow-hidden border border-[#fdf8f5]/10">
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: "85%" }}
                                className="h-full bg-[#fdf8f5] shadow-[0_0_10px_rgba(253,248,245,0.4)]"
                                transition={{ duration: 1.5, ease: "easeOut" }}
                              />
                          </div>
                           <div className="h-3 w-full bg-[#fdf8f5]/5 rounded-2xl overflow-hidden border border-[#fdf8f5]/10">
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: "55%" }}
                                className="h-full bg-[#d6c2b8]"
                                transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                              />
                          </div>
                           <div className="h-3 w-full bg-[#fdf8f5]/5 rounded-2xl overflow-hidden border border-[#fdf8f5]/10">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center border-t border-[#fdf8f5]/10 pt-24 bg-gradient-to-b from-[#fdf8f5]/[0.02] to-transparent p-12">
              {[
                  { label: "Analyses Performed", val: "4.2M+" },
                  { label: "Sources Tracked", val: "12,400" },
                  { label: "Neural Accuracy", val: "99.2%" },
                  { label: "Data Nodes", val: "382" },
              ].map((stat, i) => (
                  <div key={i} className="space-y-4">
                      <h4 className="text-5xl font-black text-[#fdf8f5] italic tracking-tighter tabular-nums">{stat.val}</h4>
                      <p className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic">{stat.label}</p>
                  </div>
              ))}
          </div>

      </div>

    </div>
  );
}