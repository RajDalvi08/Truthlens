import React, { useState, useContext } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useAuth } from "./AuthContext";
import { ThemeContext } from "./ThemeContext";

function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const { user, logout } = useAuth();
  const { DarkTheme, setDarkTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const navItemVariants = {
    hover: { scale: 1.05, textShadow: "0px 0px 8px rgb(6 182 212)" },
    tap: { scale: 0.95 }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="w-full h-20 flex items-center justify-between px-10 
      bg-[var(--glass-bg)] backdrop-blur-xl border-b border-[var(--glass-border)] sticky top-0 z-50 shadow-[0_4px_30px_var(--shadow-glow)] transition-colors duration-300"
    >
      {/* Logo */}
      <Link to="/home">
        <motion.div 
          whileHover={{ scale: 1.05, filter: "brightness(1.2)" }}
          whileTap={{ scale: 0.95 }}
          className="text-3xl italic font-black bg-gradient-to-r from-indigo-400 via-cyan-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(79,70,229,0.3)] cursor-pointer tracking-wider"
        >
          Truth<span className="text-white text-xl ml-1 font-light not-italic">Lens</span>
        </motion.div>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-10 relative font-medium text-sm tracking-wide">
        
        <Link to="/home">
          <motion.div 
            variants={navItemVariants} whileHover="hover" whileTap="tap"
            className="text-gray-300 hover:text-cyan-400 transition-colors"
          >
            Home
          </motion.div>
        </Link>

        {/* Analyze News Dropdown */}
        <div className="relative" onMouseLeave={() => setOpenMenu(null)}>
          <motion.button
            onMouseEnter={() => setOpenMenu("analyze")}
            variants={navItemVariants} whileHover="hover" whileTap="tap"
            className="flex items-center gap-1.5 text-gray-300 hover:text-cyan-400 transition-colors focus:outline-none"
          >
            Analyze News
            <motion.span
              animate={{ rotate: openMenu === "analyze" ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-[10px]"
            >
              ▼
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {openMenu === "analyze" && (
              <motion.div 
                variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                className="absolute top-full -mt-2 left-0 w-48 bg-[var(--bg-elevated)]/95 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)] rounded-xl border border-white/10 overflow-hidden z-[60] pt-2"
              >
                <ul className="text-sm">
                  {[
                    { name: "Dashboard", path: "/dashboard" }, 
                    { name: "Bias Analyzer", path: "/bias-analyzer" }, 
                    { name: "Source Comparison", path: "/compare" }, 
                    { name: "Event Comparison", path: "/event" }, 
                    { name: "Dataset Manager", path: "/datasets" }
                  ].map((item) => (
                    <Link key={item.name} to={item.path} onClick={() => setOpenMenu(null)}>
                      <motion.li 
                        whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.05)", color: "#22d3ee" }}
                        className="px-5 py-3 text-gray-400 cursor-pointer transition-colors border-l-2 border-transparent hover:border-cyan-400"
                      >
                        {item.name}
                      </motion.li>
                    </Link>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bias Insights Dropdown */}
        <div className="relative" onMouseLeave={() => setOpenMenu(null)}>
          <motion.button
            onMouseEnter={() => setOpenMenu("insights")}
            variants={navItemVariants} whileHover="hover" whileTap="tap"
            className="flex items-center gap-1.5 text-gray-300 hover:text-fuchsia-400 transition-colors focus:outline-none"
          >
            Bias Insights
            <motion.span
              animate={{ rotate: openMenu === "insights" ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-[10px]"
            >
              ▼
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {openMenu === "insights" && (
              <motion.div 
                variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                className="absolute top-full -mt-2 left-0 w-48 bg-[var(--bg-elevated)]/95 backdrop-blur-md shadow-[0_0_20px_rgba(217,70,239,0.15)] rounded-xl border border-white/10 overflow-hidden z-[60] pt-2"
              >
                <ul className="text-sm">
                  {[
                    { name: "Analytics", path: "/analytics" }, 
                    { name: "Reports", path: "/reports" }, 
                    { name: "Globe Map", path: "/globe" },
                    { name: "Case Studies", path: "/case-studies" },
                    { name: "Methodology", path: "/methodology" }
                  ].map((item) => (
                    <Link key={item.name} to={item.path} onClick={() => setOpenMenu(null)}>
                      <motion.li 
                        whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.05)", color: "#e879f9" }}
                        className="px-5 py-3 text-gray-400 cursor-pointer transition-colors border-l-2 border-transparent hover:border-fuchsia-400"
                      >
                        {item.name}
                      </motion.li>
                    </Link>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <HashLink 
          to="/home#how-it-works" 
          className="text-gray-300 hover:text-purple-400 transition-colors"
        >
          <motion.div variants={navItemVariants} whileHover="hover" whileTap="tap">
            How It Works
          </motion.div>
        </HashLink>

        <Link 
          to="/journal" 
          className="text-gray-300 hover:text-purple-400 transition-colors"
        >
          <motion.div variants={navItemVariants} whileHover="hover" whileTap="tap">
            Journal
          </motion.div>
        </Link>
        
        {/* Launch Base Dropdown */}
        <div className="relative" onMouseLeave={() => setOpenMenu(null)}>
          <motion.button 
            onMouseEnter={() => setOpenMenu("launch")}
            onClick={() => navigate(user ? "/bias-analyzer" : "/login")}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="ml-4 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-lg relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              Launch Base <span className="text-[10px]">▼</span>
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          </motion.button>

          <AnimatePresence>
            {openMenu === "launch" && (
              <motion.div 
                variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                className="absolute top-full mt-2 right-0 w-72 bg-[var(--bg-elevated)]/95 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.25)] border border-cyan-500/30 rounded-2xl overflow-hidden z-[60] p-3"
              >
                <div className="px-3 py-2 text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1 opacity-80">
                  Quick Actions
                </div>
                <div className="space-y-1">
                  {[
                    { name: "New URL Analysis", path: "/bias-analyzer", icon: "🔗", desc: "Scan a live news article" },
                    { name: "Compare Sources", path: "/compare", icon: "⚖️", desc: "Run side-by-side analysis" },
                    { name: "Upload Document", path: "/bias-analyzer", icon: "📄", desc: "Local PDF or text extraction" },
                    { name: "Live Global Tracker", path: "/dashboard", icon: "🌐", desc: "View real-time media trends" }
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => { setOpenMenu(null); navigate(user ? item.path : "/login"); }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-cyan-500/10 hover:border-cyan-500/20 border border-transparent cursor-pointer transition-all group/item"
                    >
                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-lg group-hover/item:scale-110 group-hover/item:bg-cyan-500/20 transition-all border border-cyan-500/20">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-white text-sm font-bold group-hover/item:text-cyan-300 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-gray-500 text-xs font-light mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Theme Toggle */}
        <motion.button
          onClick={() => setDarkTheme(!DarkTheme)}
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          className="ml-4 w-10 h-10 rounded-full border border-[var(--border-light)] bg-[var(--bg-input)] flex items-center justify-center text-lg transition-colors duration-300 hover:border-[var(--border-medium)]"
          title={DarkTheme ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <motion.span
            key={DarkTheme ? "moon" : "sun"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {DarkTheme ? "🌙" : "☀️"}
          </motion.span>
        </motion.button>

        {/* Auth Section */}
        {user ? (
          <div className="relative" onMouseLeave={() => setOpenMenu(null)}>
            <motion.button
              onMouseEnter={() => setOpenMenu("user")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-4 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] border-2 border-white/20"
            >
              {user.avatar}
            </motion.button>

            <AnimatePresence>
              {openMenu === "user" && (
                <motion.div
                  variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                  className="absolute top-full right-0 mt-2 w-56 bg-[var(--bg-elevated)]/95 backdrop-blur-md shadow-[0_0_25px_rgba(0,0,0,0.5)] rounded-xl border border-white/10 overflow-hidden z-[60]"
                >
                  <div className="px-5 py-4 border-b border-white/5">
                    <p className="text-white font-bold text-sm">{user.username}</p>
                    <p className="text-gray-500 text-xs font-mono mt-0.5">{user.email}</p>
                  </div>
                  <ul className="text-sm py-1">
                    <Link to="/profile" onClick={() => setOpenMenu(null)}>
                      <motion.li whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.05)" }} className="px-5 py-3 text-gray-400 cursor-pointer transition-colors">
                        Profile
                      </motion.li>
                    </Link>
                    <Link to="/changeaccount" onClick={() => setOpenMenu(null)}>
                      <motion.li whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.05)" }} className="px-5 py-3 text-gray-400 cursor-pointer transition-colors">
                        Switch Account
                      </motion.li>
                    </Link>
                    <Link to="/settings" onClick={() => setOpenMenu(null)}>
                      <motion.li whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.05)" }} className="px-5 py-3 text-gray-400 cursor-pointer transition-colors">
                        Settings
                      </motion.li>
                    </Link>
                    <motion.li
                      whileHover={{ x: 5, backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                      onClick={() => { logout(); setOpenMenu(null); navigate("/"); }}
                      className="px-5 py-3 text-gray-400 cursor-pointer transition-colors border-t border-white/5"
                    >
                      Disconnect
                    </motion.li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(217,70,239,0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="ml-4 px-5 py-2 border border-fuchsia-500/50 text-fuchsia-400 hover:bg-fuchsia-500/10 font-bold rounded-full transition-colors text-sm"
            >
              Sign In
            </motion.button>
          </Link>
        )}
      </div>
    </motion.nav>
  );
}

export default Navbar;