"use client"
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNotifications } from "../NotificationContext";
import { HiOutlineCog, HiOutlineAdjustments, HiOutlineShieldCheck, HiOutlineMail, HiOutlineChip, HiOutlineCheck } from "react-icons/hi";

export default function Settings() {
  const { addNotification } = useNotifications();
  const [highFidelity, setHighFidelity] = useState(true);
  const [liveTicker, setLiveTicker] = useState(false);
  const [model, setModel] = useState("Neural Core v4.2 // Default");
  const [sensitivity, setSensitivity] = useState(0.78);
  const [savedStatus, setSavedStatus] = useState(false);

  const handleToggleFidelity = () => {
    const next = !highFidelity;
    setHighFidelity(next);
    addNotification({
      title: "Display Config Updated",
      message: `High-fidelity rendering set to ${next ? "ENABLED" : "DISABLED"}.`,
      type: "info"
    });
  };

  const handleToggleTicker = () => {
    const next = !liveTicker;
    setLiveTicker(next);
    addNotification({
      title: "Ticker Stream Updated",
      message: `Global footer news ticker set to ${next ? "ACTIVE" : "STANDBY"}.`,
      type: "info"
    });
  };

  const handleModelChange = (e) => {
    const val = e.target.value;
    setModel(val);
    addNotification({
      title: "Model Topology Switched",
      message: `Primary intelligence engine switched to ${val}.`,
      type: "system"
    });
  };

  const handleSensitivityChange = (e) => {
    const val = parseFloat(e.target.value);
    setSensitivity(val);
  };

  const handleSaveProtocol = () => {
    setSavedStatus(true);
    addNotification({
      title: "Parameters Synchronized",
      message: `Neural configuration persisted to node store successfully.`,
      type: "success"
    });
    setTimeout(() => setSavedStatus(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-24 mesh-bg">
      
      {/* Header */}
      <div className="border-b border-[#fdf8f5]/10 pb-8 sm:pb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8">
        <div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter text-[#fdf8f5] flex items-center gap-3 sm:gap-6 uppercase italic">
            <HiOutlineCog className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#fdf8f5] shadow-2xl shrink-0" />
            <span>Core Configuration</span>
          </h2>
          <p className="text-[#8d7b68] text-[9px] sm:text-[10px] mt-3 sm:mt-4 font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] italic underline decoration-[#fdf8f5]/10">
            Fine-tune neural engine parameters, interface protocols, and security bounds.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSaveProtocol}
            className="btn-primary w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-[9px] sm:text-[10px] flex items-center justify-center gap-3 italic shadow-2xl"
          >
            {savedStatus ? (
              <>
                <HiOutlineCheck className="w-5 h-5 text-[#1a0f0a]" />
                SYNCHRONIZED
              </>
            ) : (
              "SAVE PROTOCOLS"
            )}
          </button>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-10">
          
          {/* General Section */}
          <motion.div 
            className="saas-card overflow-hidden bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-none shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
              <div className="p-4 sm:p-6 md:p-10 border-b border-[#fdf8f5]/5 bg-[#fdf8f5]/[0.01] flex items-center gap-3 sm:gap-4 text-[#fdf8f5]">
                  <HiOutlineAdjustments className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] italic underline decoration-[#fdf8f5]/10">Interface Parameters // Node OS</h3>
              </div>
              <div className="p-4 sm:p-6 md:p-10 space-y-4 sm:space-y-8">
                  <div 
                    onClick={handleToggleFidelity}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 md:p-8 glass-card bg-[#fdf8f5]/[0.02] border-[#fdf8f5]/5 rounded-none shadow-xl hover:border-[#fdf8f5]/20 transition-all cursor-pointer group"
                  >
                      <div>
                          <p className="text-base sm:text-lg font-black text-[#fdf8f5] uppercase italic tracking-tighter group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform">High-Fidelity Rendering</p>
                          <p className="text-[9px] sm:text-[10px] text-[#8d7b68] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] italic mt-1 sm:mt-2">Enable advanced backdrop blurs and neural mesh gradients.</p>
                      </div>
                      <div className={`w-14 sm:w-16 h-7 sm:h-8 rounded-none relative transition-all shadow-[0_0_20px_rgba(253,248,245,0.4)] shrink-0 self-end sm:self-auto ${
                        highFidelity ? "bg-[#fdf8f5]" : "bg-[#fdf8f5]/10 border border-[#fdf8f5]/20"
                      }`}>
                          <div className={`w-5 sm:w-6 h-5 sm:h-6 rounded-none absolute top-1 transition-all ${
                            highFidelity ? "right-1 bg-[#1a0f0a]" : "left-1 bg-[#8d7b68]"
                          }`} />
                      </div>
                  </div>

                  <div 
                    onClick={handleToggleTicker}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 md:p-8 glass-card bg-[#fdf8f5]/[0.01] border-[#fdf8f5]/5 rounded-none hover:border-[#fdf8f5]/20 transition-all cursor-pointer group"
                  >
                      <div>
                          <p className="text-base sm:text-lg font-black text-[#fdf8f5] uppercase italic tracking-tighter group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform">Live Ingestion Ticker</p>
                          <p className="text-[9px] sm:text-[10px] text-[#8d7b68] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] italic mt-1 sm:mt-2">Display real-time news fragment streams in global footer.</p>
                      </div>
                      <div className={`w-14 sm:w-16 h-7 sm:h-8 rounded-none relative transition-all shrink-0 self-end sm:self-auto ${
                        liveTicker ? "bg-[#fdf8f5]" : "bg-[#fdf8f5]/10 border border-[#fdf8f5]/20"
                      }`}>
                          <div className={`w-5 sm:w-6 h-5 sm:h-6 rounded-none absolute top-1 transition-all ${
                            liveTicker ? "right-1 bg-[#1a0f0a]" : "left-1 bg-[#8d7b68]"
                          }`} />
                      </div>
                  </div>
              </div>
          </motion.div>

          {/* Engine Parameters Section */}
          <motion.div 
            className="saas-card overflow-hidden bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-none shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
              <div className="p-4 sm:p-6 md:p-10 border-b border-[#fdf8f5]/5 bg-[#fdf8f5]/[0.01] flex items-center gap-3 sm:gap-4 text-[#fdf8f5]">
                  <HiOutlineChip className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] italic underline decoration-[#fdf8f5]/10">Neural Logic Protocols</h3>
              </div>
              <div className="p-4 sm:p-6 md:p-10 space-y-8 sm:space-y-12">
                  <div className="space-y-4 sm:space-y-6">
                      <label className="text-[9px] sm:text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.2em] sm:tracking-[0.3em] italic">Primary Intelligence Model Integration</label>
                      <div className="relative group">
                        <select 
                          value={model}
                          onChange={handleModelChange}
                          className="w-full appearance-none bg-[#1a0f0a] border border-[#fdf8f5]/10 text-[#fdf8f5] px-4 sm:px-8 py-3.5 sm:py-5 text-[11px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.25em] italic rounded-none outline-none focus:border-[#fdf8f5] transition-all cursor-pointer shadow-xl"
                        >
                            <option>Neural Core v4.2 // Default</option>
                            <option>GPT-4o Protocol // Native</option>
                            <option>Claude 3.5 Sonnet // Analytical</option>
                            <option>Gemini 1.5 Pro // Experimental</option>
                        </select>
                        <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 pointer-events-none text-[#8d7b68] group-hover:text-[#fdf8f5] transition-colors">
                            ▼
                        </div>
                      </div>
                  </div>

                  <div className="space-y-6 sm:space-y-8">
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                         <label className="text-[9px] sm:text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.2em] sm:tracking-[0.3em] italic">Bias Sensitivity Threshold Audit</label>
                         <span className="text-[9px] sm:text-[11px] font-black text-[#fdf8f5] bg-[#fdf8f5]/10 border border-[#fdf8f5]/20 px-3 sm:px-4 py-1.5 sm:py-2 italic uppercase tracking-[0.2em] sm:tracking-[0.25em] shadow-xl self-start sm:self-auto">
                           {sensitivity.toFixed(2)} / {sensitivity > 0.7 ? "STRICT_MODE" : sensitivity > 0.4 ? "BALANCED" : "LENIENT"}
                         </span>
                      </div>
                      <div className="h-8 sm:h-10 flex items-center group/range">
                          <input 
                            type="range" 
                            min="0.1" 
                            max="1.0" 
                            step="0.01" 
                            value={sensitivity}
                            onChange={handleSensitivityChange}
                            className="w-full h-1 bg-[#fdf8f5]/10 rounded-none appearance-none cursor-pointer accent-[#fdf8f5] group-hover/range:bg-[#fdf8f5]/20 transition-all" 
                          />
                      </div>
                  </div>
              </div>
          </motion.div>

          {/* Security & Notifications */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
              <div className="saas-card p-6 sm:p-8 md:p-12 flex flex-col justify-between bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-none group hover:border-[#fdf8f5]/40 transition-all shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#fdf8f5]/5 blur-[60px]" />
                  <div className="flex items-center gap-4 sm:gap-8 mb-6 sm:mb-10 relative z-10">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 rounded-none flex items-center justify-center text-[#fdf8f5] group-hover:bg-[#fdf8f5] group-hover:text-[#1a0f0a] transition-all shadow-xl shrink-0">
                          <HiOutlineShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">Neural Guard</h3>
                        <p className="text-[9px] sm:text-[10px] text-[#d6c2b8] font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] mt-1 sm:mt-2 italic opacity-60">Status: PROTECTED</p>
                      </div>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#8d7b68] font-black uppercase tracking-tight italic mb-8 sm:mb-12 opacity-80 leading-relaxed">Automated Multi-Factor credentials and analytical session management protocols.</p>
                  <button 
                    onClick={() => addNotification({ title: "Encryption Keys Verified", message: "Node RSA-4096 signature is valid and active.", type: "success" })}
                    className="w-full py-3.5 sm:py-5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] bg-[#1a0f0a] border border-[#fdf8f5]/10 text-[#8d7b68] hover:text-[#fdf8f5] hover:border-[#fdf8f5] hover:bg-[#fdf8f5]/10 transition-all rounded-none italic shadow-xl"
                  >
                    Review Encryption Keys
                  </button>
              </div>

              <div className="saas-card p-6 sm:p-8 md:p-12 flex flex-col justify-between bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-none group hover:border-[#fdf8f5]/40 transition-all shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#fdf8f5]/5 blur-[60px]" />
                  <div className="flex items-center gap-4 sm:gap-8 mb-6 sm:mb-10 relative z-10">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 rounded-none flex items-center justify-center text-[#fdf8f5] group-hover:bg-[#fdf8f5] group-hover:text-[#1a0f0a] transition-all shadow-xl shrink-0">
                          <HiOutlineMail className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">Intel Dispatch</h3>
                        <p className="text-[9px] sm:text-[10px] text-[#d6c2b8] font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] mt-1 sm:mt-2 italic opacity-60">Cadence: DIURNAL</p>
                      </div>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#8d7b68] font-black uppercase tracking-tight italic mb-8 sm:mb-12 opacity-80 leading-relaxed">Configure diurnal automated summaries and critical delta alerts directly to your node.</p>
                  <button 
                    onClick={() => addNotification({ title: "Intel Dispatch Configured", message: "Diurnal digests set to deliver at 08:00 UTC.", type: "info" })}
                    className="w-full py-3.5 sm:py-5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] bg-[#1a0f0a] border border-[#fdf8f5]/10 text-[#8d7b68] hover:text-[#fdf8f5] hover:border-[#fdf8f5] hover:bg-[#fdf8f5]/10 transition-all rounded-none italic shadow-xl"
                  >
                    Protocol Frequency
                  </button>
              </div>
          </motion.div>
      </div>

    </div>
  );
}
