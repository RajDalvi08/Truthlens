import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Navigation from "./Navigation";

const userStats = [
  { label: "Articles Verified", value: "1,204", color: "from-emerald-400 to-teal-500" },
  { label: "Contributions", value: "349", color: "from-cyan-400 to-blue-500" },
  { label: "Reputation Score", value: "9,840", color: "from-fuchsia-400 to-purple-500" },
];

const recentActivity = [
  { id: 1, action: "Verified Article", target: "Global Market Trends", time: "2 hours ago", status: "Approved" },
  { id: 2, action: "Submitted Analysis", target: "Tech Giants EU Regulations", time: "5 hours ago", status: "Pending" },
  { id: 3, action: "Flagged Bias", target: "Healthcare Reform Bill", time: "1 day ago", status: "Reviewed" },
  { id: 4, action: "System Login", target: "Terminal Alpha", time: "1 day ago", status: "Secure" },
];

export default function Profile() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[#FDEBD0]">
      <Navigation />

      <main className="flex-1 overflow-auto p-8 relative">
        {/* Ambient Dark Tech Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[var(--bg-primary)] to-[var(--bg-primary)] z-0 pointer-events-none"></div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto space-y-8 relative z-10"
        >
          {/* Header Profile Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-[var(--bg-secondary)] border border-white/5 rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=687&auto=format&fit=crop" 
                alt="Profile" 
                className="relative w-32 h-32 rounded-full object-cover border-4 border-[var(--bg-elevated)] shadow-xl"
              />
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-2 border-[var(--bg-elevated)] rounded-full z-10"></div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                creative_ambition
              </h1>
              <p className="text-cyan-400 font-mono uppercase tracking-widest mt-1 text-sm">Level 42 Analyst</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(6,182,212,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-sm text-white shadow-lg"
                >
                  Edit Profile
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-xl border border-white/20 bg-transparent font-bold text-sm hover:border-white/40 transition-colors"
                >
                  System Settings
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userStats.map((stat, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                whileHover={{ y: -5, borderColor: "rgba(255,255,255,0.2)" }}
                className="bg-[var(--bg-elevated)] border border-white/5 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300"
              >
                <h3 className="text-sm text-gray-400 font-medium mb-2 uppercase tracking-wider">{stat.label}</h3>
                <span className={`text-4xl font-black tracking-tight bg-gradient-to-r ${stat.color} bg-clip-text text-transparent drop-shadow-md`}>
                  {stat.value}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* About / Bio */}
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-1 bg-[var(--bg-secondary)] border border-white/5 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Bio Data</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Specializations in structural NLP analysis and political sentiment identification. Active contributor since cycle 2024.
              </p>
              
              <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Clearance Level</h3>
              <div className="w-full bg-[var(--bg-elevated)] rounded-full h-2.5 mb-2 overflow-hidden border border-white/10">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2.5 rounded-full" style={{ width: "85%" }}></div>
              </div>
              <p className="text-xs text-right text-cyan-400 font-mono">Tier 4 / 85%</p>
            </motion.div>

            {/* Activity Feed */}
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-2 bg-[var(--bg-secondary)] border border-white/5 rounded-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-2">
                <h3 className="text-lg font-bold text-white">Network Activity Feed</h3>
                <span className="text-xs text-gray-500 font-mono">Live Sync</span>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <motion.div 
                    key={activity.id}
                    variants={itemVariants}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                    className="flex items-center justify-between p-4 rounded-xl border border-transparent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                      <div>
                        <p className="text-sm text-white font-medium">{activity.action} <span className="text-gray-400 font-normal">on</span> {activity.target}</p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 bg-[var(--bg-elevated)] rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      activity.status === "Approved" || activity.status === "Secure" 
                        ? "text-emerald-400 border-emerald-400/30" 
                        : "text-orange-400 border-orange-400/30"
                    }`}>
                      {activity.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

        </motion.div>
      </main>
    </div>
  );
}
