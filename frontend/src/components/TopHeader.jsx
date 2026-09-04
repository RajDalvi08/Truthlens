"use client"
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext";
import { useNotifications } from "../NotificationContext";
import { useSearch } from "../SearchContext";
import { 
  HiOutlineSearch, 
  HiOutlineBell, 
  HiOutlineUserCircle, 
  HiOutlineCheck, 
  HiOutlineTrash, 
  HiOutlineArrowRight,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineGlobeAlt,
  HiOutlineDatabase,
  HiOutlineDocumentText,
  HiOutlineScale,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineCurrencyDollar,
  HiOutlineSwitchHorizontal,
  HiOutlineX
} from "react-icons/hi";

const NAVIGATION_INDEX = [
  { name: "Bias Analyzer", path: "/bias-analyzer", category: "Tool", desc: "Submit text or URLs for real-time bias scoring" },
  { name: "Source Delta Compare", path: "/compare", category: "Tool", desc: "Compare two news articles side-by-side" },
  { name: "Event Meridian Timeline", path: "/event", category: "Tool", desc: "Multi-outlet event coverage comparison" },
  { name: "Neural Overview Dashboard", path: "/dashboard", category: "Dashboard", desc: "Real-time metrics, drift charts, narrative balance" },
  { name: "Narrative Intelligence Analytics", path: "/analytics", category: "Analytics", desc: "3D node cluster map and sentiment scatter" },
  { name: "Global Bias Map", path: "/globe", category: "Map", desc: "3D interactive geopolitical globe" },
  { name: "Audit Repository & Reports", path: "/reports", category: "Reports", desc: "Historical audit packages & JSON export" },
  { name: "Dataset Management", path: "/datasets", category: "Data", desc: "Curated corpora and neural dataset bundles" },
  { name: "Intelligence Journal", path: "/journal", category: "Research", desc: "Research articles and bias studies" },
  { name: "Neural Methodology", path: "/methodology", category: "Research", desc: "3-step architecture and scoring protocols" },
  { name: "Intelligence Case Studies", path: "/case-studies", category: "Research", desc: "Case studies on election, climate, and tech" },
  { name: "Financial Intelligence", path: "/revenue", category: "Management", desc: "Node subscriptions and revenue metrics" },
  { name: "Identity Matrix", path: "/changeaccount", category: "Account", desc: "Switch operator or instantiate new identities" },
  { name: "Core Configuration Settings", path: "/settings", category: "Settings", desc: "Interface and neural logic parameters" },
  { name: "Operator Profile", path: "/profile", category: "Account", desc: "Biometric profile and activity history" },
];

export default function TopHeader() {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAllAsRead, clearNotifications, markAsRead } = useNotifications();
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? NAVIGATION_INDEX.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectSearchResult = (path) => {
    setSearchQuery("");
    setIsSearchFocused(false);
    navigate(path);
  };

  return (
    <header className="h-[var(--header-height)] bg-[#261a14]/80 backdrop-blur-xl border-b border-[#fdf8f5]/10 flex items-center justify-between px-10 sticky top-0 z-40">
      
      {/* Interactive Global Search */}
      <div className="relative w-[450px]" ref={searchRef}>
        <HiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8d7b68] w-5 h-5 pointer-events-none" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          placeholder="QUERY ANALYSIS ENGINE OR NAVIGATE..." 
          className="w-full bg-[#1a0f0a] border border-[#fdf8f5]/10 rounded-none pl-14 pr-10 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-[#fdf8f5] transition-all shadow-2xl text-[#fdf8f5] placeholder:text-[#4d3c2e] italic"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8d7b68] hover:text-[#fdf8f5] transition-colors"
          >
            <HiOutlineX className="w-4 h-4" />
          </button>
        )}

        {/* Live Search Dropdown */}
        <AnimatePresence>
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute left-0 right-0 top-full mt-2 bg-[#1a0f0a] border border-[#fdf8f5]/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden max-h-96 overflow-y-auto custom-scrollbar"
            >
              <div className="p-4 bg-[#261a14] border-b border-[#fdf8f5]/10 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em] text-[#8d7b68] italic">
                <span>Direct Intelligence Links</span>
                <span>{searchResults.length} matches</span>
              </div>

              {searchResults.length > 0 ? (
                <div className="divide-y divide-[#fdf8f5]/5">
                  {searchResults.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSearchResult(item.path)}
                      className="w-full text-left p-4 hover:bg-[#fdf8f5]/[0.05] transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-[#fdf8f5]/5 text-[#8d7b68] border border-[#fdf8f5]/10 group-hover:text-[#fdf8f5] group-hover:border-[#fdf8f5]/30">
                            {item.category}
                          </span>
                          <p className="text-xs font-black text-[#fdf8f5] uppercase tracking-tight group-hover:italic">
                            {item.name}
                          </p>
                        </div>
                        <p className="text-[10px] text-[#8d7b68] mt-1 line-clamp-1 italic font-mono">
                          {item.desc}
                        </p>
                      </div>
                      <HiOutlineArrowRight className="w-4 h-4 text-[#8d7b68] group-hover:text-[#fdf8f5] group-hover:translate-x-1 transition-all shrink-0 ml-4" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic">
                    No matching modules found for "{searchQuery}"
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        
        {/* Notifications Button & Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`p-3 rounded-none transition-all relative border ${
              isNotifOpen 
                ? "bg-[#fdf8f5] text-[#1a0f0a] border-[#fdf8f5]" 
                : "text-[#8d7b68] hover:text-[#fdf8f5] hover:bg-[#fdf8f5]/5 border-transparent hover:border-[#fdf8f5]/10"
            }`}
            title="System Notifications"
          >
            <HiOutlineBell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 min-w-[18px] h-[18px] px-1 bg-[#ff9d6c] text-[#1a0f0a] text-[9px] font-black rounded-none flex items-center justify-center border border-[#1a0f0a] animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 top-full mt-3 w-96 bg-[#1a0f0a] border border-[#fdf8f5]/20 shadow-[0_25px_60px_rgba(0,0,0,0.9)] z-50 overflow-hidden"
              >
                {/* Header */}
                <div className="p-5 bg-[#261a14] border-b border-[#fdf8f5]/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-[#fdf8f5] uppercase italic tracking-widest">Neural Notifications</h4>
                    <p className="text-[9px] text-[#8d7b68] uppercase tracking-widest italic">{unreadCount} Unread Alerts</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={markAllAsRead}
                      title="Mark all as read"
                      className="p-1.5 hover:bg-[#fdf8f5]/10 text-[#8d7b68] hover:text-[#fdf8f5] transition-colors"
                    >
                      <HiOutlineCheck className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={clearNotifications}
                      title="Clear all"
                      className="p-1.5 hover:bg-[#fdf8f5]/10 text-[#8d7b68] hover:text-[#fdf8f5] transition-colors"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-[#fdf8f5]/5 custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`p-4 transition-colors cursor-pointer hover:bg-[#fdf8f5]/[0.04] flex items-start gap-4 ${
                          notif.unread ? "bg-[#fdf8f5]/[0.02]" : "opacity-60"
                        }`}
                      >
                        <div className={`w-2 h-2 mt-1.5 rounded-none shrink-0 ${
                          notif.type === "alert" 
                            ? "bg-[#ff9d6c] shadow-[0_0_8px_rgba(255,157,108,0.8)]" 
                            : notif.type === "success" 
                            ? "bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)]" 
                            : "bg-[#fdf8f5]"
                        }`} />
                        <div className="flex-1">
                          <div className="flex justify-between items-baseline mb-1">
                            <h5 className="text-[11px] font-black text-[#fdf8f5] uppercase tracking-tight italic">{notif.title}</h5>
                            <span className="text-[8px] text-[#8d7b68] font-black uppercase tracking-widest">{notif.time}</span>
                          </div>
                          <p className="text-[10px] text-[#d6c2b8] font-mono leading-relaxed">{notif.message}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] italic">No active notifications</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 bg-[#1a0f0a] border-t border-[#fdf8f5]/5 text-center">
                  <span className="text-[8px] font-black text-[#4d3c2e] uppercase tracking-[0.3em] italic">TruthLens Event Stream Active</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-px bg-[#fdf8f5]/10" />

        {/* User Profile & Menu */}
        <div className="relative" ref={userMenuRef}>
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-4 p-2 hover:bg-[#fdf8f5]/5 rounded-none transition-all group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-[#fdf8f5] uppercase italic tracking-tighter leading-none group-hover:text-[#ff9d6c] transition-colors">
                {user?.username || "GUEST_OPERATOR"}
              </p>
              <p className="text-[9px] text-[#8d7b68] font-black uppercase tracking-[0.25em] mt-1.5 italic underline decoration-[#fdf8f5]/10">
                {user?.role || "NEURAL_ANALYST"}
              </p>
            </div>
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Profile" className="w-10 h-10 rounded-none border-2 border-[#fdf8f5]/20 object-cover shadow-2xl" />
            ) : (
              <div className="w-10 h-10 rounded-none bg-[#fdf8f5] text-[#1a0f0a] flex items-center justify-center font-black text-xs border border-[#fdf8f5]/30 shadow-2xl italic group-hover:scale-105 transition-transform">
                {user?.username?.substring(0, 2).toUpperCase() || "GU"}
              </div>
            )}
          </button>

          {/* User Menu Dropdown */}
          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 top-full mt-3 w-64 bg-[#1a0f0a] border border-[#fdf8f5]/20 shadow-[0_25px_60px_rgba(0,0,0,0.9)] z-50 overflow-hidden"
              >
                <div className="p-5 bg-[#261a14] border-b border-[#fdf8f5]/10">
                  <p className="text-xs font-black text-[#fdf8f5] uppercase italic tracking-widest">{user?.username || "GUEST_OPERATOR"}</p>
                  <p className="text-[9px] text-[#8d7b68] uppercase tracking-widest italic font-mono mt-1">{user?.email || "analyst@truthlens.io"}</p>
                </div>

                <div className="p-2 space-y-1">
                  <Link 
                    to="/profile" 
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-[10px] font-black text-[#d6c2b8] hover:text-[#fdf8f5] hover:bg-[#fdf8f5]/10 uppercase tracking-widest italic transition-colors"
                  >
                    <HiOutlineUserCircle className="w-4 h-4" />
                    Biometric Profile
                  </Link>
                  <Link 
                    to="/changeaccount" 
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-[10px] font-black text-[#d6c2b8] hover:text-[#fdf8f5] hover:bg-[#fdf8f5]/10 uppercase tracking-widest italic transition-colors"
                  >
                    <HiOutlineSwitchHorizontal className="w-4 h-4" />
                    Identity Matrix
                  </Link>
                  <Link 
                    to="/revenue" 
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-[10px] font-black text-[#d6c2b8] hover:text-[#fdf8f5] hover:bg-[#fdf8f5]/10 uppercase tracking-widest italic transition-colors"
                  >
                    <HiOutlineCurrencyDollar className="w-4 h-4" />
                    Financial Intelligence
                  </Link>
                  <Link 
                    to="/settings" 
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-[10px] font-black text-[#d6c2b8] hover:text-[#fdf8f5] hover:bg-[#fdf8f5]/10 uppercase tracking-widest italic transition-colors"
                  >
                    <HiOutlineCog className="w-4 h-4" />
                    Core Settings
                  </Link>
                </div>

                <div className="p-2 border-t border-[#fdf8f5]/10">
                  <button 
                    onClick={async () => {
                      setIsUserMenuOpen(false);
                      await logout();
                      navigate("/login");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-[#ff9d6c] hover:bg-[#ff9d6c]/10 uppercase tracking-widest italic transition-colors"
                  >
                    <HiOutlineLogout className="w-4 h-4" />
                    Disconnect Node
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}
