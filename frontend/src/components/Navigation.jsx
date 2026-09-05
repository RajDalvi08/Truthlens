import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./NavIconTemplate/Nav";
import { FiChevronLeft, FiSettings, FiFileText, FiActivity, FiDatabase } from "react-icons/fi";
import { TbArrowsExchange } from "react-icons/tb";
import { VscGraphLine } from "react-icons/vsc";
import { RiDashboard2Fill, RiAccountCircle2Line } from "react-icons/ri";

const Navigation = () => {
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className={`relative flex flex-col ${nav ? "w-[80px]" : "w-[260px]"
        } min-h-screen p-3 text-[var(--text-primary)] transition-all duration-300
      bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] shadow-[4px_0_24px_var(--shadow-glow)]`}
    >
      {/* MENU BUTTON */}
      <div
        onClick={() => setNav(!nav)}
        className="absolute right-3 top-3 h-9 w-9 flex items-center justify-center cursor-pointer z-10"
      >
        <FiChevronLeft
          className={`text-lg transition-transform duration-300 ${nav ? "rotate-180" : ""
            }`}
        />
      </div>

      {/* HEADER */}
      <header
        className={`flex flex-col items-center gap-2 py-6 mb-3 rounded-xl 
        bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-inner backdrop-blur-xl`}
      >
        <img
          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=687&auto=format&fit=crop"
          alt="profile"
          className={`rounded-full object-cover ${nav ? "w-10 h-10" : "w-12 h-12"
            }`}
        />
        {!nav && <span className="text-sm">creative_ambition</span>}
      </header>

      {/* NAV ITEMS */}
      <Nav title="Dashboard" Icon={RiDashboard2Fill} collapsed={nav} onClick={() => navigate("/dashboard")} />
      <Nav title="Analytics" Icon={VscGraphLine} collapsed={nav} onClick={() => navigate("/analytics")} />
      <Nav title="Bias Analyzer" Icon={FiActivity} collapsed={nav} onClick={() => navigate("/bias-analyzer")} />
      <Nav title="Article Database" Icon={FiDatabase} collapsed={nav} onClick={() => navigate("/datasets")} />
      <Nav title="Source Comparison" Icon={TbArrowsExchange} collapsed={nav} onClick={() => navigate("/compare")} />
      <Nav title="Reports" Icon={FiFileText} collapsed={nav} onClick={() => navigate("/reports")} />

      {/* DIVIDER */}
      <div className="h-[1px] w-4/5 bg-[var(--border-medium)] mx-auto my-2" />

      <Nav title="Settings" Icon={FiSettings} collapsed={nav} onClick={() => navigate("/settings")} />
      <Nav title="Change Account" Icon={RiAccountCircle2Line} collapsed={nav} onClick={() => navigate("/changeaccount")} />

      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent opacity-80" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-fuchsia-900/10 via-transparent to-transparent opacity-80" />
    </div>
  );
};

export default Navigation;