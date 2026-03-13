import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Navigation from "./Navigation";

const accounts = [
  { id: 1, username: "creative_ambition", role: "Super Admin", avatar: "CA", active: true },
  { id: 2, username: "John Doe", role: "Pro Analyst", avatar: "JD", active: false },
  { id: 3, username: "System_AI", role: "Bot Integration", avatar: "AI", active: false },
];

export default function ChangeAccount() {
  const [isAddingNew, setIsAddingNew] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const formVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: { opacity: 1, height: "auto", marginTop: 32, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[#FDEBD0]">
      <Navigation />

      <main className="flex-1 overflow-auto p-8 relative flex flex-col items-center justify-center">
        {/* Ambient Dark Tech Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-fuchsia-900/10 via-[var(--bg-primary)] to-[var(--bg-primary)] z-0 pointer-events-none"></div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-3xl relative z-10"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Identity Matrix</h1>
            <p className="text-gray-400 mt-2 font-light">Select active terminal profile or instantiate a new network identity.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((acc) => (
              <motion.div 
                key={acc.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05, borderColor: acc.active ? "rgba(6,182,212,0.8)" : "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.95 }}
                className={`cursor-pointer bg-[var(--bg-secondary)] border rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 relative overflow-hidden group ${
                  acc.active ? "border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]" : "border-white/5"
                }`}
              >
                {/* Active Indicator Glow */}
                {acc.active && (
                  <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                )}
                
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-4 shadow-inner relative z-10 ${
                  acc.active ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]" : "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-400"
                }`}>
                  {acc.avatar}
                </div>
                <h3 className={`font-bold ${acc.active ? "text-white" : "text-gray-300"}`}>{acc.username}</h3>
                <p className={`text-xs mt-1 ${acc.active ? "text-cyan-400 font-mono uppercase tracking-wider" : "text-gray-500"}`}>{acc.role}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center flex flex-col items-center">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(217,70,239,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="px-8 py-3 rounded-xl border border-fuchsia-500/50 text-fuchsia-400 hover:bg-fuchsia-500/10 transition-colors font-bold flex items-center gap-2"
            >
              <span>{isAddingNew ? "Cancel" : "Add Identity"}</span>
              <motion.span animate={{ rotate: isAddingNew ? 45 : 0 }} className="text-xl leading-none">
                +
              </motion.span>
            </motion.button>
            
            <motion.div 
              variants={formVariants}
              initial="hidden"
              animate={isAddingNew ? "visible" : "hidden"}
              className="w-full max-w-md bg-[var(--bg-elevated)] border border-white/10 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden text-left"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-600/10 blur-3xl rounded-full"></div>
              
              <h3 className="text-xl font-bold text-white mb-6 relative z-10">New Authorization</h3>
              
              <form className="space-y-4 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-1.5">Network Handle</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Node_Operator_7"
                    className="w-full bg-[var(--bg-primary)] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all placeholder:text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-1.5">Access Token</label>
                  <input 
                    type="password" 
                    placeholder="••••••••••••••••"
                    className="w-full bg-[var(--bg-primary)] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all placeholder:text-gray-700"
                  />
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 mt-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(217,70,239,0.4)]"
                >
                  Authorize Profile
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
