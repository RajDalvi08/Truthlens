import React from "react";
import { useAuth } from "../AuthContext";
import { 
  HiOutlineSearch, 
  HiOutlineBell, 
  HiOutlineUserCircle
} from "react-icons/hi";

export default function TopHeader() {
  const { user } = useAuth();

  return (
    <header className="h-[var(--header-height)] bg-[#261a14]/80 backdrop-blur-xl border-b border-[#fdf8f5]/10 flex items-center justify-between px-10 sticky top-0 z-40">
      {/* Search */}
      <div className="relative w-[450px]">
        <HiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8d7b68] w-5 h-5" />
        <input 
          type="text" 
          placeholder="QUERY ANALYSIS ENGINE..." 
          className="w-full bg-[#1a0f0a] border border-[#fdf8f5]/10 rounded-none pl-14 pr-6 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-[#fdf8f5] transition-all shadow-2xl text-[#fdf8f5] placeholder:text-[#4d3c2e] italic"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-8">
        <button className="p-3 text-[#8d7b68] hover:text-[#fdf8f5] hover:bg-[#fdf8f5]/5 rounded-none transition-all relative border border-transparent hover:border-[#fdf8f5]/10">
          <HiOutlineBell className="w-6 h-6" />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#fdf8f5] rounded-none border-2 border-[#1a0f0a] animate-pulse"></span>
        </button>

        <div className="h-8 w-px bg-[#fdf8f5]/10" />

        <div className="flex items-center gap-5 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-[#fdf8f5] uppercase italic tracking-tighter leading-none">{user?.username || "GUEST_OPERATOR"}</p>
            <p className="text-[9px] text-[#8d7b68] font-black uppercase tracking-[0.25em] mt-1.5 italic underline decoration-[#fdf8f5]/10">{user?.role || "NEURAL_ANALYST"}</p>
          </div>
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="Profile" className="w-11 h-11 rounded-none border-2 border-[#fdf8f5]/20 object-cover shadow-2xl" />
          ) : (
            <div className="w-11 h-11 rounded-none bg-[#fdf8f5] text-[#1a0f0a] flex items-center justify-center font-black text-xs border border-[#fdf8f5]/30 shadow-2xl italic">
              {user?.username?.substring(0, 2).toUpperCase() || "GU"}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
