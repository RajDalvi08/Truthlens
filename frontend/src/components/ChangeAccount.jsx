"use client"
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNotifications } from "../NotificationContext";
import { HiOutlineCheck, HiOutlineUserAdd } from "react-icons/hi";

const defaultAccounts = [
  { id: 1, username: "creative_ambition", role: "Super Admin Protocol", avatar: "CA", active: true },
  { id: 2, username: "John Doe Analyst", role: "Pro Lead Analyst", avatar: "JD", active: false },
  { id: 3, username: "System_AI_Node", role: "Bot Integration v4", avatar: "AI", active: false },
];

export default function ChangeAccount() {
  const [accountList, setAccountList] = useState(defaultAccounts);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newHandle, setNewHandle] = useState("");
  const [newToken, setNewToken] = useState("");
  const { addNotification } = useNotifications();

  const handleSelectAccount = (acc) => {
    setAccountList(prev => prev.map(a => ({
      ...a,
      active: a.id === acc.id
    })));
    addNotification({
      title: "Identity Protocol Switched",
      message: `Active session identity set to ${acc.username} (${acc.role}).`,
      type: "system"
    });
  };

  const handleAddIdentity = (e) => {
    e.preventDefault();
    if (!newHandle.trim()) return;

    const newAcc = {
      id: Date.now(),
      username: newHandle.trim(),
      role: "Authorized Node Analyst",
      avatar: newHandle.trim().substring(0, 2).toUpperCase(),
      active: true
    };

    setAccountList(prev => prev.map(a => ({ ...a, active: false })).concat(newAcc));
    setNewHandle("");
    setNewToken("");
    setIsAddingNew(false);

    addNotification({
      title: "New Identity Instantiated",
      message: `Operator profile ${newAcc.username} authorized and set as active node.`,
      type: "success"
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  const formVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: { opacity: 1, height: "auto", marginTop: 40, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-20 animate-in fade-in duration-1000 pb-32 mesh-bg flex flex-col items-center">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full relative z-10"
        >
          <div className="text-center mb-8 sm:mb-20 border-b border-[#fdf8f5]/10 pb-8 sm:pb-20">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#fdf8f5] tracking-tighter uppercase italic leading-[0.9]">Identity <br/> <span className="text-[#8d7b68]">Matrix</span></h1>
            <p className="text-[#d6c2b8] mt-4 sm:mt-8 font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[10px] sm:text-[11px] italic underline decoration-[#fdf8f5]/10 leading-relaxed max-w-xl mx-auto">Select active terminal profile or instantiate a new neural network identity anchor.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-10">
            {accountList.map((acc) => (
              <motion.div 
                key={acc.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03, borderColor: "#fdf8f5" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectAccount(acc)}
                className={`cursor-pointer bg-[#261a14]/60 border rounded-none p-6 sm:p-10 flex flex-col items-center text-center transition-all duration-500 relative overflow-hidden group shadow-2xl ${
                  acc.active ? "border-[#fdf8f5] shadow-[0_0_40px_rgba(253,248,245,0.1)]" : "border-[#fdf8f5]/10"
                }`}
              >
                {/* Active Indicator */}
                {acc.active && (
                  <div className="absolute top-0 w-full h-1.5 bg-[#fdf8f5] shadow-[0_0_15px_rgba(253,248,245,0.4)]" />
                )}
                
                <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-none flex items-center justify-center text-xl sm:text-2xl font-black mb-4 sm:mb-8 border-2 transition-all duration-500 transform group-hover:rotate-6 ${
                  acc.active ? "bg-[#fdf8f5] text-[#1a0f0a] border-[#fdf8f5] shadow-2xl" : "bg-[#fdf8f5]/5 text-[#8d7b68] border-[#fdf8f5]/10 group-hover:border-[#fdf8f5]/30 group-hover:text-[#fdf8f5]"
                }`}>
                  {acc.avatar}
                </div>
                <h3 className={`font-black uppercase tracking-tighter text-xl sm:text-2xl mb-1 sm:mb-2 italic ${acc.active ? "text-[#fdf8f5]" : "text-[#d6c2b8] opacity-80 group-hover:opacity-100"}`}>{acc.username}</h3>
                <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] italic ${acc.active ? "text-[#8d7b68]" : "text-[#4d3c2e] group-hover:text-[#8d7b68]"}`}>{acc.role}</p>
                {acc.active && (
                  <span className="mt-3 sm:mt-4 px-3 py-1 bg-[#fdf8f5] text-[#1a0f0a] text-[8px] font-black uppercase tracking-widest italic">
                    ACTIVE NODE
                  </span>
                )}
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#fdf8f5]/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>

          <div className="mt-10 sm:mt-20 text-center flex flex-col items-center w-full">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="w-full sm:w-auto px-6 sm:px-14 py-3.5 sm:py-5 rounded-none border-2 border-[#fdf8f5]/20 text-[#fdf8f5] hover:bg-[#fdf8f5] hover:text-[#1a0f0a] transition-all font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[10px] sm:text-[11px] flex items-center justify-center gap-4 sm:gap-6 italic shadow-2xl"
            >
              <span>{isAddingNew ? "TERMINATE PROTOCOL" : "INSTANTIATE NEW IDENTITY"}</span>
              <motion.span animate={{ rotate: isAddingNew ? 45 : 0 }} className="text-xl leading-none">
                +
              </motion.span>
            </motion.button>
            
            <motion.div 
              variants={formVariants}
              initial="hidden"
              animate={isAddingNew ? "visible" : "hidden"}
              className="w-full max-w-lg bg-[#1a0f0a] border border-[#fdf8f5]/10 p-6 sm:p-12 rounded-none shadow-2xl relative overflow-hidden text-left mt-6 sm:mt-10"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#fdf8f5]/5 blur-[80px] rounded-none pointer-events-none" />
              <div className="absolute left-0 top-0 w-2 h-full bg-[#fdf8f5] opacity-50" />
              
              <h3 className="text-xl sm:text-3xl font-black text-[#fdf8f5] mb-6 sm:mb-12 uppercase italic tracking-tighter border-b border-[#fdf8f5]/10 pb-4 sm:pb-6 leading-none">New Authorization</h3>
              
              <form className="space-y-6 sm:space-y-10 relative z-10" onSubmit={handleAddIdentity}>
                <div className="space-y-2 sm:space-y-4">
                  <label className="block text-[9px] sm:text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.2em] sm:tracking-[0.3em] italic underline decoration-[#fdf8f5]/10">Network Handle Alpha</label>
                  <input 
                    type="text" 
                    required
                    value={newHandle}
                    onChange={(e) => setNewHandle(e.target.value)}
                    placeholder="E.G. NODE_OPERATOR_0x7..."
                    className="w-full bg-[#fdf8f5]/[0.02] border border-[#fdf8f5]/10 rounded-none px-4 sm:px-8 py-3.5 sm:py-5 text-[#fdf8f5] focus:outline-none focus:border-[#fdf8f5] transition-all text-xs font-black uppercase tracking-widest placeholder:text-[#4d3c2e] italic shadow-inner"
                  />
                </div>
                <div className="space-y-2 sm:space-y-4">
                  <label className="block text-[9px] sm:text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.2em] sm:tracking-[0.3em] italic underline decoration-[#fdf8f5]/10">Access Token Redaction</label>
                  <input 
                    type="password" 
                    value={newToken}
                    onChange={(e) => setNewToken(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full bg-[#fdf8f5]/[0.02] border border-[#fdf8f5]/10 rounded-none px-4 sm:px-8 py-3.5 sm:py-5 text-[#fdf8f5] focus:outline-none focus:border-[#fdf8f5] transition-all text-xs placeholder:text-[#4d3c2e] italic shadow-inner"
                  />
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 sm:py-6 mt-4 sm:mt-8 bg-[#fdf8f5] text-[#1a0f0a] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[10px] sm:text-[11px] rounded-none shadow-2xl hover:bg-[#f5ebe0] transition-colors italic"
                >
                  AUTHORIZE IDENTITY
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
    </div>
  );
}
