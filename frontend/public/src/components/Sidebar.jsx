import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { 
  HiOutlineHome, 
  HiOutlineChartBar, 
  HiOutlineVariable, 
  HiOutlineScale, 
  HiOutlineCalendar, 
  HiOutlineDatabase,
  HiOutlineDocumentReport,
  HiOutlineMap,
  HiOutlineBookOpen,
  HiOutlineLogout,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineGlobeAlt,
  HiOutlineLightBulb
} from "react-icons/hi";

const navItems = [
  { group: "Analysis", items: [
    { name: "Home", path: "/home", icon: HiOutlineHome },
    { name: "Dashboard", path: "/dashboard", icon: HiOutlineChartBar },
    { name: "Bias Analyzer", path: "/bias-analyzer", icon: HiOutlineVariable },
    { name: "Source Compare", path: "/compare", icon: HiOutlineScale },
  ]},
  { group: "Research", items: [
    { name: 'Dashboard', path: '/analytics', icon: HiOutlineChartBar }, // Changed from "Analytics"
    { name: 'News Comparison', path: '/event', icon: HiOutlineGlobeAlt }, // Changed from "Event Timeline", icon changed
    { name: 'Reports', path: '/reports', icon: HiOutlineDocumentReport }, // New item, replaces "Global Map"
    { name: 'Article Database', path: '/datasets', icon: HiOutlineDatabase }, // Changed from "Datasets"
  ]},
  { group: "Resources", items: [
    { name: "Journal", path: "/journal", icon: HiOutlineBookOpen },
    { name: 'How it Works', path: '/methodology', icon: HiOutlineLightBulb }, // Changed from "Methodology", icon changed
  ]}
];

export default function Sidebar({ isCollapsed, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside 
      className={`h-screen bg-[#1a0f0a] text-[#fdf8f5] flex flex-col fixed left-0 top-0 z-50 border-r border-[#fdf8f5]/10 transition-all duration-400 ease-in-out shadow-2xl`}
      style={{ width: isCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width)' }}
    >
      {/* Logo & Toggle */}
      <div className={`border-b border-[#fdf8f5]/10 flex transition-all duration-300 ${isCollapsed ? 'flex-col items-center p-4 gap-4' : 'items-center justify-between px-6 py-6'}`}>
        <Link to="/home" className="flex items-center gap-4 min-w-0 group">
          <div className="w-10 h-10 min-w-[40px] rounded-2xl bg-[#fdf8f5] text-[#1a0f0a] flex items-center justify-center font-black text-xl shrink-0 italic shadow-[0_0_20px_rgba(253,248,245,0.2)] group-hover:scale-110 transition-transform">TL</div>
          {!isCollapsed && <span className="text-xl font-black tracking-tighter uppercase italic whitespace-nowrap overflow-visible">TruthLens</span>}
        </Link>
        <button 
          onClick={onToggle}
          className={`p-2 hover:bg-[#fdf8f5]/5 rounded-2xl text-[#8d7b68] transition-all hidden md:flex shrink-0 border border-transparent hover:border-[#fdf8f5]/20 ${isCollapsed ? 'mt-2' : ''}`}
        >
          {isCollapsed ? <HiOutlineChevronRight className="w-5 h-5" /> : <HiOutlineChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto space-y-10 custom-scrollbar transition-all duration-300 ${isCollapsed ? 'p-0' : 'p-6'}`}>
        {navItems.map((group, idx) => (
          <div key={idx} className={`space-y-4 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
            {!isCollapsed && (
              <h3 className="px-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#4d3c2e] whitespace-nowrap italic">
                {group.group}
              </h3>
            )}
            <div className={`space-y-2 w-full ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center transition-all group relative overflow-hidden ${
                      isCollapsed 
                        ? "w-full h-12 justify-center rounded-2xl" 
                        : "gap-4 px-4 py-3 rounded-2xl w-full"
                    } ${
                      isActive 
                        ? "bg-[#fdf8f5] text-[#1a0f0a] italic shadow-[0_0_30px_rgba(253,248,245,0.1)]" 
                        : "text-[#8d7b68] hover:text-[#fdf8f5] hover:bg-[#fdf8f5]/5"
                    }`}
                    title={isCollapsed ? item.name : ""}
                  >
                    <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#1a0f0a]' : 'group-hover:text-[#fdf8f5]'}`} />
                    {!isCollapsed && <span className="whitespace-nowrap italic tracking-tight text-[12px] font-black uppercase tracking-widest">{item.name}</span>}
                    {isActive && (
                        <motion.div 
                            layoutId="activeBar"
                            className={`absolute left-0 top-0 bottom-0 bg-[#1a0f0a] ${isCollapsed ? 'w-1' : 'w-1'}`}
                        />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Ticker / Scrolling Line */}
      {!isCollapsed && (
        <div className="px-6 py-4 bg-[#fdf8f5]/[0.02] border-t border-[#fdf8f5]/5 overflow-hidden">
          <motion.div 
            animate={{ x: [0, -400] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="whitespace-nowrap flex items-center gap-8"
          >
            {[
              "SYSTEM STATUS: OPTIMAL",
              "BIAS DETECTION: ACTIVE",
              "NEURAL ENGINE: SYNCHRONIZED",
              "DATA PIPELINE: LIVE"
            ].map((text, i) => (
              <span key={i} className="text-[8px] font-black text-[#4d3c2e] uppercase tracking-[0.3em] italic flex items-center gap-2">
                <div className="w-1 h-1 bg-[#fdf8f5] rounded-full animate-pulse" />
                {text}
              </span>
            ))}
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <div className={`border-t border-[#fdf8f5]/10 space-y-2 transition-all duration-300 ${isCollapsed ? 'p-0' : 'p-6'}`}>
        <button
          onClick={async () => {
            await logout();
            navigate("/login");
          }}
          className={`flex items-center text-[11px] font-black uppercase tracking-widest text-[#8d7b68] hover:text-[#1a0f0a] hover:bg-[#fdf8f5] transition-all group italic ${
            isCollapsed ? 'w-full h-12 justify-center rounded-2xl' : 'w-full gap-4 px-4 py-3 rounded-2xl'
          }`}
          title={isCollapsed ? "Logout" : ""}
        >
          <HiOutlineLogout className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap">Logout Analytics</span>}
        </button>
      </div>

      {/* Animated Scrolling Line */}
      <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-[#fdf8f5]/5 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            y: ['-100%', '100%'] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="w-full h-64 bg-gradient-to-b from-transparent via-[#fdf8f5]/30 to-transparent"
        />
      </div>
    </aside>
  );
}
