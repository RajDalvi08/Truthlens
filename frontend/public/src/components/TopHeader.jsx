import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";
import { useSearch } from "../SearchContext";
import { useNotifications } from "../NotificationContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HiOutlineSearch, 
  HiOutlineBell, 
  HiOutlineUserCircle,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
  HiOutlineLightningBolt
} from "react-icons/hi";

export default function TopHeader() {
  const { user, updateUserProfile, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const { notifications, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  
  // Profile Menu State
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editPhotoURL, setEditPhotoURL] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
        setIsEditingProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditClick = () => {
    setEditUsername(user?.username || "");
    setEditRole(user?.role || "Researcher");
    setEditPhotoURL(user?.avatar_url || user?.photoURL || "");
    setIsEditingProfile(true);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPhotoURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile({
        username: editUsername,
        role: editRole,
        avatar_url: editPhotoURL
      });
      setIsEditingProfile(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };
  return (
    <header className="h-[var(--header-height)] bg-[#261a14]/80 backdrop-blur-xl border-b border-[#fdf8f5]/10 flex items-center justify-between px-10 sticky top-0 z-40">
      {/* Search */}
      <div className="relative w-[450px]">
        <HiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8d7b68] w-5 h-5" />
        <input 
          type="text" 
          placeholder="SEARCH ANALYSIS..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1a0f0a] border border-[#fdf8f5]/10 rounded-2xl pl-14 pr-6 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-[#fdf8f5] transition-all shadow-2xl text-[#fdf8f5] placeholder:text-[#4d3c2e] italic"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-8">
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-3 transition-all relative border border-transparent hover:border-[#fdf8f5]/10 ${showNotifications ? 'text-[#fdf8f5] bg-[#fdf8f5]/5' : 'text-[#8d7b68] hover:text-[#fdf8f5] hover:bg-[#fdf8f5]/5'}`}
          >
            <HiOutlineBell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#fdf8f5] rounded-2xl border-2 border-[#1a0f0a] animate-pulse"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-[380px] bg-[#1a0f0a] border border-[#fdf8f5]/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
              >
                <div className="p-6 border-b border-[#fdf8f5]/5 bg-[#fdf8f5]/[0.02] flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#fdf8f5] italic">Intelligence Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-[9px] font-black text-[#8d7b68] hover:text-[#fdf8f5] uppercase tracking-widest transition-colors italic underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-6 border-b border-[#fdf8f5]/5 hover:bg-[#fdf8f5]/[0.03] transition-all cursor-pointer relative group ${n.unread ? 'bg-[#fdf8f5]/[0.02]' : ''}`}
                      >
                        <div className="flex gap-5">
                          <div className={`mt-1 flex-shrink-0 w-8 h-8 flex items-center justify-center ${
                            n.type === 'success' ? 'text-emerald-500' : 
                            n.type === 'info' ? 'text-sky-500' : 'text-amber-500'
                          }`}>
                            {n.type === 'success' ? <HiOutlineCheckCircle className="w-6 h-6" /> : 
                             n.type === 'info' ? <HiOutlineInformationCircle className="w-6 h-6" /> : 
                             <HiOutlineLightningBolt className="w-6 h-6" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <p className={`text-[11px] font-black uppercase tracking-wider ${n.unread ? 'text-[#fdf8f5]' : 'text-[#d6c2b8]'}`}>{n.title}</p>
                              <span className="text-[9px] font-black text-[#4d3c2e] uppercase italic flex-shrink-0">{n.time}</span>
                            </div>
                            <p className="text-[10px] text-[#8d7b68] leading-relaxed line-clamp-2 uppercase tracking-tight group-hover:text-[#d6c2b8] transition-colors">{n.message}</p>
                          </div>
                        </div>
                        {n.unread && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#fdf8f5]" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                      <p className="text-[10px] font-black text-[#4d3c2e] uppercase tracking-[0.3em] italic">No active notifications</p>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-[#fdf8f5]/[0.01] text-center">
                  <button className="text-[9px] font-black text-[#8d7b68] hover:text-[#fdf8f5] uppercase tracking-[0.4em] transition-all italic">
                    View Intelligence Archive
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-px bg-[#fdf8f5]/10" />

        <div className="flex items-center gap-5 pl-2 relative" ref={profileRef}>
          <div 
            className="flex items-center gap-5 cursor-pointer group p-1"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-[#fdf8f5] uppercase italic tracking-tighter leading-none group-hover:text-[#d6c2b8] transition-colors">{user?.username || "Guest User"}</p>
              <p className="text-[9px] text-[#8d7b68] font-black uppercase tracking-[0.25em] mt-1.5 italic underline decoration-[#fdf8f5]/10">{user?.role || "Researcher"}</p>
            </div>
            {user?.avatar_url || user?.photoURL ? (
              <img src={user.avatar_url || user.photoURL} alt="Profile" className="w-11 h-11 rounded-full border-2 border-[#fdf8f5]/20 object-cover shadow-2xl group-hover:border-[#fdf8f5]/50 transition-all" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#fdf8f5] text-[#1a0f0a] flex items-center justify-center font-black text-xs border border-[#fdf8f5]/30 shadow-2xl italic group-hover:bg-[#d6c2b8] transition-all">
                {user?.username?.substring(0, 2).toUpperCase() || "GU"}
              </div>
            )}
          </div>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-4 w-80 bg-[#1a0f0a] border border-[#fdf8f5]/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
              >
                {!isEditingProfile ? (
                  // View Mode
                  <div className="flex flex-col">
                    <div className="p-6 border-b border-[#fdf8f5]/10 flex items-center gap-5 bg-[#fdf8f5]/[0.02]">
                      {user?.avatar_url || user?.photoURL ? (
                        <img src={user.avatar_url || user.photoURL} className="w-14 h-14 rounded-full object-cover border border-[#fdf8f5]/20" alt="Avatar" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-[#fdf8f5] text-[#1a0f0a] font-black flex items-center justify-center text-xl italic border border-[#1a0f0a]">
                          {user?.username?.substring(0, 2).toUpperCase() || "GU"}
                        </div>
                      )}
                      <div>
                        <p className="text-base font-black text-[#fdf8f5] uppercase italic tracking-tighter">{user?.username || "Guest User"}</p>
                        <p className="text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.2em] italic">{user?.role || "Researcher"}</p>
                      </div>
                    </div>
                    <div className="p-2 flex flex-col">
                      <button 
                        onClick={handleEditClick}
                        className="p-4 text-[10px] font-black text-[#fdf8f5] uppercase tracking-[0.3em] italic hover:bg-[#fdf8f5]/10 text-left transition-colors flex items-center gap-3"
                      >
                        <HiOutlineUserCircle className="w-5 h-5" />
                        Edit Profile
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="p-4 text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] italic hover:bg-rose-500/10 text-left transition-colors flex items-center gap-3"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  // Edit Mode
                  <div className="p-6 bg-[#1a0f0a]">
                    <h3 className="text-xs font-black text-[#fdf8f5] uppercase tracking-[0.3em] italic border-b border-[#fdf8f5]/10 pb-4 mb-6">Edit Profile</h3>
                    
                    <div className="space-y-6">
                      <div className="flex justify-center">
                        <div 
                          className="relative w-20 h-20 group cursor-pointer border border-[#fdf8f5]/20 hover:border-[#fdf8f5]/50 transition-colors rounded-full overflow-hidden"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {editPhotoURL ? (
                            <img src={editPhotoURL} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="Preview" />
                          ) : (
                            <div className="w-full h-full bg-[#fdf8f5]/5 flex items-center justify-center text-[10px] font-black text-[#8d7b68] uppercase text-center p-2">
                              Upload<br/>Photo
                            </div>
                          )}
                          <div className="absolute inset-0 bg-[#1a0f0a]/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-[9px] font-black text-[#fdf8f5] uppercase">Change</span>
                          </div>
                          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#8d7b68] uppercase tracking-[0.2em]">Username</label>
                        <input 
                          type="text" 
                          value={editUsername} 
                          onChange={(e) => setEditUsername(e.target.value)}
                          className="w-full bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 p-3 text-[11px] font-black text-[#fdf8f5] uppercase tracking-wider focus:outline-none focus:border-[#fdf8f5]/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#8d7b68] uppercase tracking-[0.2em]">Role Title</label>
                        <input 
                          type="text" 
                          value={editRole} 
                          onChange={(e) => setEditRole(e.target.value)}
                          className="w-full bg-[#fdf8f5]/5 border border-[#fdf8f5]/10 p-3 text-[11px] font-black text-[#fdf8f5] uppercase tracking-wider focus:outline-none focus:border-[#fdf8f5]/40"
                        />
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-[#fdf8f5]/10">
                        <button 
                          onClick={() => setIsEditingProfile(false)}
                          className="flex-1 p-3 text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.2em] border border-[#fdf8f5]/10 hover:bg-[#fdf8f5]/5 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="flex-1 p-3 text-[10px] font-black text-[#1a0f0a] bg-[#fdf8f5] uppercase tracking-[0.2em] hover:bg-[#d6c2b8] transition-colors disabled:opacity-50"
                        >
                          {isSaving ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
