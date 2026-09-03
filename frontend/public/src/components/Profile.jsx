"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useNotifications } from "../NotificationContext";
import { 
  HiOutlineUser, 
  HiOutlineLightningBolt, 
  HiOutlineShieldCheck, 
  HiOutlineTrendingUp, 
  HiOutlineBadgeCheck, 
  HiOutlineCog,
  HiOutlineKey,
  HiOutlineCheck,
  HiOutlineX
} from "react-icons/hi";

export default function Profile() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [showVault, setShowVault] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [customName, setCustomName] = useState(user?.username || "creative_ambition");
  const [customRole, setCustomRole] = useState(user?.role || "Lead Neural Analyst");
  const [copiedKey, setCopiedKey] = useState(false);

  const userStats = [
    { label: "Articles Verified", value: "1,204", icon: HiOutlineShieldCheck },
    { label: "Neural Contributions", value: "349", icon: HiOutlineLightningBolt },
    { label: "Reputation Index", value: "9,840", icon: HiOutlineTrendingUp },
  ];

  const recentActivity = [
    { id: 1, action: "Verified Article", target: "Global Market Trends", time: "2h ago", status: "Approved" },
    { id: 2, action: "Submitted Analysis", target: "Tech Giants EU Regulations", time: "5h ago", status: "Pending" },
    { id: 3, action: "Flagged Bias", target: "Healthcare Reform Bill", time: "1d ago", status: "Reviewed" },
    { id: 4, action: "System Ingestion", target: "Terminal Alpha-9", time: "1d ago", status: "Secure" },
  ];

  const handleCopyKey = () => {
    navigator.clipboard.writeText("tl_sec_live_9481a8c9e2b1093f448201a0");
    setCopiedKey(true);
    addNotification({
      title: "API Key Copied",
      message: "Node cryptographic key copied to clipboard.",
      type: "info"
    });
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setShowEditModal(false);
    addNotification({
      title: "Profile Params Updated",
      message: `Analyst identity updated to ${customName} (${customRole}).`,
      type: "success"
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-24 mesh-bg">
      
      {/* Profile Banner Card */}
      <motion.div 
        className="glass-card p-12 relative overflow-hidden group bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-none shadow-2xl"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#fdf8f5]/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-[#fdf8f5]/10 transition-all duration-1000 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
           <div className="relative">
              <div className="w-48 h-48 rounded-none p-1.5 bg-[#fdf8f5] shadow-2xl relative z-10 overflow-hidden transform group-hover:scale-105 transition-transform duration-700">
                  {user?.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt="Analyst" 
                      className="w-full h-full rounded-none object-cover grayscale brightness-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1a0f0a] text-[#fdf8f5] flex items-center justify-center font-black text-5xl italic">
                      {customName.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a]/40 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#fdf8f5] border-4 border-[#1a0f0a] rounded-none flex items-center justify-center shadow-2xl z-20">
                  <div className="w-3 h-3 bg-[#1a0f0a] animate-pulse" />
              </div>
           </div>

           <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <h1 className="text-5xl font-black text-[#fdf8f5] tracking-tighter uppercase italic drop-shadow-2xl">
                    {customName}
                  </h1>
                  <HiOutlineBadgeCheck className="w-10 h-10 text-[#fdf8f5] hidden md:block opacity-80" />
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
                  <span className="px-5 py-2 bg-[#fdf8f5]/10 text-[#fdf8f5] border border-[#fdf8f5]/20 text-[10px] font-black uppercase tracking-[0.3em] italic shadow-xl">
                    {customRole}
                  </span>
                  <span className="text-[#8d7b68] font-black uppercase tracking-[0.3em] italic py-2 text-[10px] opacity-60 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#fdf8f5] opacity-20" />
                    Ingested Oct 2024
                  </span>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-12">
                  <button 
                    onClick={() => setShowEditModal(true)}
                    className="px-12 py-5 text-[11px] font-black uppercase tracking-[0.3em] bg-[#fdf8f5] text-[#1a0f0a] hover:bg-[#f5ebe0] border-none rounded-none italic shadow-2xl transition-all"
                  >
                    Update Identity Params
                  </button>
                  <button 
                    onClick={() => setShowVault(!showVault)}
                    className="px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] bg-[#1a0f0a]/40 border border-[#fdf8f5]/10 text-[#fdf8f5] hover:border-[#fdf8f5]/40 transition-all rounded-none flex items-center gap-4 italic shadow-2xl"
                  >
                     <HiOutlineKey className="w-5 h-5" />
                     {showVault ? "Hide Credentials" : "Credential Vault"}
                  </button>
              </div>
           </div>
        </div>
      </motion.div>

      {/* Credential Vault Modal / Pane */}
      <AnimatePresence>
        {showVault && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="saas-card p-10 bg-[#1a0f0a] border border-[#fdf8f5]/20 rounded-none shadow-2xl space-y-6"
          >
            <div className="flex justify-between items-center border-b border-[#fdf8f5]/10 pb-4">
              <div>
                <h3 className="text-xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">Cryptographic Node Keys</h3>
                <p className="text-[9px] text-[#8d7b68] uppercase tracking-widest italic">Use these headers to authenticate automated REST API ingestions.</p>
              </div>
              <button onClick={() => setShowVault(false)} className="text-[#8d7b68] hover:text-[#fdf8f5]">
                <HiOutlineX className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-[#261a14]/60 border border-[#fdf8f5]/10 space-y-2">
                <span className="text-[8px] font-black text-[#8d7b68] uppercase tracking-widest">Public Operator ID</span>
                <p className="text-xs font-mono font-black text-[#fdf8f5]">{user?.uid || "usr_node_live_0x42918"}</p>
              </div>
              <div className="p-6 bg-[#261a14]/60 border border-[#fdf8f5]/10 flex justify-between items-center">
                <div className="space-y-2">
                  <span className="text-[8px] font-black text-[#8d7b68] uppercase tracking-widest">Secret API Bearer Token</span>
                  <p className="text-xs font-mono font-black text-[#fdf8f5]">tl_sec_live_••••••••••••</p>
                </div>
                <button 
                  onClick={handleCopyKey}
                  className="px-4 py-2 bg-[#fdf8f5]/10 hover:bg-[#fdf8f5] hover:text-[#1a0f0a] text-[9px] font-black uppercase tracking-widest transition-colors"
                >
                  {copiedKey ? "COPIED!" : "COPY KEY"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 bg-[#1a0f0a]/80 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#261a14] border border-[#fdf8f5]/20 p-10 shadow-2xl space-y-8"
            >
              <div className="flex justify-between items-center border-b border-[#fdf8f5]/10 pb-4">
                <h3 className="text-2xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">Update Identity Parameters</h3>
                <button onClick={() => setShowEditModal(false)} className="text-[#8d7b68] hover:text-[#fdf8f5]">
                  <HiOutlineX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#8d7b68] uppercase tracking-widest italic">Analyst Handle</label>
                  <input 
                    type="text" 
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full bg-[#1a0f0a] border border-[#fdf8f5]/10 p-4 text-xs font-black text-[#fdf8f5] outline-none focus:border-[#fdf8f5]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#8d7b68] uppercase tracking-widest italic">Protocol Role</label>
                  <input 
                    type="text" 
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    className="w-full bg-[#1a0f0a] border border-[#fdf8f5]/10 p-4 text-xs font-black text-[#fdf8f5] outline-none focus:border-[#fdf8f5]"
                  />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 border border-[#fdf8f5]/20 text-[10px] font-black uppercase tracking-widest text-[#8d7b68]"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary px-8 py-3 text-[10px] uppercase tracking-widest"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {userStats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="saas-card p-12 group hover:border-[#fdf8f5]/30 transition-all cursor-default bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-none shadow-2xl relative overflow-hidden"
              >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#fdf8f5]/5 blur-[60px] pointer-events-none" />
                  <div className="w-16 h-16 rounded-none bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 text-[#fdf8f5] flex items-center justify-center text-3xl mb-10 group-hover:bg-[#fdf8f5] group-hover:text-[#1a0f0a] transition-all shadow-xl">
                      <stat.icon className="w-8 h-8" />
                  </div>
                  <div>
                      <p className="text-[10px] uppercase font-black text-[#8d7b68] tracking-[0.3em] mb-3 italic underline decoration-[#fdf8f5]/10 group-hover:text-[#d6c2b8] transition-colors">{stat.label}</p>
                      <h3 className="text-5xl font-black text-[#fdf8f5] italic tracking-tighter tabular-nums leading-none shadow-2xl">{stat.value}</h3>
                  </div>
              </motion.div>
          ))}
      </div>

      {/* Main Profile Bento Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Bio & Bio Metrics */}
          <motion.div className="lg:col-span-4 space-y-10">
              <div className="saas-card p-12 bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-none shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 bg-[#fdf8f5] h-full opacity-20 group-hover:opacity-100 transition-opacity" />
                  <h3 className="text-xl font-black text-[#fdf8f5] mb-10 border-b border-[#fdf8f5]/10 pb-6 uppercase italic tracking-tighter">Biometric Profile</h3>
                  <p className="text-[13px] text-[#d6c2b8] leading-relaxed font-black uppercase tracking-tight italic opacity-80 group-hover:opacity-100 transition-opacity">
                      Specializations in structural NLP analysis and political sentiment identification. Active contributor to the global Truth-Set corpus since initial cycle 2024.
                  </p>
                  
                  <div className="mt-14 space-y-10">
                      <div className="space-y-5">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.3em] text-[#8d7b68] italic">
                             <span>Clearance Level Audit</span>
                             <span className="text-[#fdf8f5] italic underline decoration-[#fdf8f5]/20">TIER_4_ANALYSIS</span>
                          </div>
                          <div className="h-2 w-full bg-[#fdf8f5]/5 rounded-none overflow-hidden relative border border-[#fdf8f5]/5 shadow-inner">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "85%" }}
                                className="h-full bg-[#fdf8f5] shadow-[0_0_15px_rgba(253,248,245,0.6)]"
                                transition={{ delay: 1, duration: 1.5 }}
                              />
                          </div>
                      </div>
                  </div>
              </div>

              <div className="glass-card p-12 text-center bg-[#fdf8f5]/[0.02] border-[#fdf8f5]/10 rounded-none relative overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#fdf8f5]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <HiOutlineUser className="w-14 h-14 text-[#fdf8f5]/20 mx-auto mb-8 transform group-hover:scale-110 transition-transform duration-700" />
                  <p className="text-[11px] font-black text-[#8d7b68] uppercase tracking-[0.3em] leading-relaxed italic">
                      Neural Verification Node:<br/>
                      <span className="text-[#fdf8f5] opacity-80 group-hover:opacity-100 transition-opacity">US-EAST-ALPHA-9_SECURE</span>
                  </p>
              </div>
          </motion.div>

          {/* Activity Timeline */}
          <motion.div className="lg:col-span-8 saas-card bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-none flex flex-col shadow-2xl overflow-hidden group">
              <div className="p-10 border-b border-[#fdf8f5]/5 flex items-center justify-between bg-[#fdf8f5]/[0.01]">
                  <div>
                      <h3 className="text-2xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">Neural Activity Stream</h3>
                      <p className="text-[10px] text-[#8d7b68] font-black uppercase tracking-[0.3em] mt-2 italic underline decoration-[#fdf8f5]/10">Real-time contribution vectors ingest.</p>
                  </div>
                  <span className="px-4 py-1.5 bg-[#fdf8f5] text-[#1a0f0a] text-[9px] font-black uppercase tracking-[0.3em] italic animate-pulse shadow-2xl">Live_Sync</span>
              </div>
              <div className="p-6 space-y-3 flex-1">
                  {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-6 hover:bg-[#fdf8f5]/[0.03] rounded-none transition-all cursor-pointer group/row relative overflow-hidden border border-transparent hover:border-[#fdf8f5]/10 shadow-sm hover:shadow-xl">
                           <div className="flex items-center gap-8 relative z-10">
                                <div className="w-2.5 h-2.5 bg-[#fdf8f5] group-hover/row:scale-150 transition-transform shadow-[0_0_12px_rgba(253,248,245,0.8)] opacity-40 group-hover/row:opacity-100" />
                                <div>
                                    <p className="text-base font-black text-[#fdf8f5] uppercase tracking-tighter italic leading-none">{activity.action} <span className="text-[#8d7b68] font-black normal-case not-italic opacity-60">@</span> {activity.target}</p>
                                    <p className="text-[10px] font-black text-[#4d3c2e] uppercase mt-2 tracking-[0.3em] italic group-hover/row:text-[#8d7b68] transition-colors">{activity.time}</p>
                                </div>
                           </div>
                           <span className={`px-5 py-2 text-[9px] font-black uppercase tracking-[0.3em] italic relative z-10 shadow-xl transition-all ${
                               activity.status === "Approved" || activity.status === "Secure" 
                               ? "bg-[#fdf8f5] text-[#1a0f0a]" 
                               : "bg-[#fdf8f5]/5 text-[#8d7b68] border border-[#fdf8f5]/10 group-hover/row:border-[#fdf8f5]/30 group-hover/row:text-[#fdf8f5]"
                           }`}>
                               {activity.status}
                           </span>
                           <div className="absolute inset-0 bg-gradient-to-r from-[#fdf8f5]/[0.02] to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity" />
                      </div>
                  ))}
              </div>
              <div className="p-10 border-t border-[#fdf8f5]/5 text-center bg-[#1a0f0a]/40 group-hover:bg-[#1a0f0a]/60 transition-colors">
                  <button 
                    onClick={() => navigate("/reports")}
                    className="text-[11px] font-black text-[#8d7b68] uppercase tracking-[0.4em] hover:text-[#fdf8f5] transition-all italic relative overflow-hidden group/btn px-12 py-2"
                  >
                      <span className="relative z-10">Fetch Complete Ingestion History</span>
                      <div className="absolute bottom-0 left-0 w-0 h-px bg-[#fdf8f5] group-hover/btn:w-full transition-all duration-700" />
                  </button>
              </div>
          </motion.div>
      </div>

    </div>
  );
}
