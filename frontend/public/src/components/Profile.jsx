import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineUser, HiOutlineLightningBolt, HiOutlineShieldCheck, HiOutlineTrendingUp, HiOutlineBadgeCheck, HiOutlineCog, HiOutlineCamera, HiOutlineSave, HiOutlineX } from "react-icons/hi";
import { useAuth } from "../AuthContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { getStats, getRecentAnalyses } from "../services/api";

const userStatsTemplate = [
  { label: "Articles Analyzed", key: "totalArticles", icon: HiOutlineShieldCheck },
  { label: "Avg Bias Score", key: "avgBias", icon: HiOutlineLightningBolt },
  { label: "Neutral Ratio", key: "neutralRatio", unit: "%", icon: HiOutlineTrendingUp },
];

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  const fileInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user?.username || "");
  const [editedBio, setEditedBio] = useState(user?.bio || "Specializations in analyzing news language and political sentiment identification. Active contributor to the global truth-set database since 2024.");
  const [profilePhoto, setProfilePhoto] = useState(user?.photoURL || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=687&auto=format&fit=crop");
  const [isUploading, setIsUploading] = useState(false);
  
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      setEditedUsername(user.username || "");
      setEditedBio(user.bio || "Specializations in analyzing news language and political sentiment identification. Active contributor to the global truth-set database since 2024.");
      if (user.photoURL) setProfilePhoto(user.photoURL);
      
      const fetchData = async () => {
        try {
          setIsLoadingData(true);
          const [statsData, activityData] = await Promise.all([
            getStats(user.uid),
            getRecentAnalyses(10, user.uid)
          ]);
          setStats(statsData);
          setActivities(activityData);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file && user?.uid) {
      setIsUploading(true);
      try {
        const storageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        
        await updateUserProfile({ photoURL: downloadURL });
        setProfilePhoto(downloadURL);
      } catch (error) {
        console.error("Photo upload failed:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile({
        username: editedUsername,
        bio: editedBio
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
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
           <div className="relative group/avatar">
              <div 
                className="w-48 h-48 rounded-none p-1.5 bg-[#fdf8f5] shadow-2xl relative z-10 overflow-hidden transform group-hover/avatar:scale-105 transition-transform duration-700 cursor-pointer"
                onClick={handlePhotoClick}
              >
                  <img 
                    src={profilePhoto} 
                    alt="User Profile" 
                    className="w-full h-full rounded-none object-cover grayscale brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a]/40 to-transparent" />
                  
                  <div className="absolute inset-0 bg-[#1a0f0a]/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                      <HiOutlineCamera className="w-10 h-10 text-[#fdf8f5] animate-bounce" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#fdf8f5] italic">Update Lens</span>
                  </div>

                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[#fdf8f5]">
                       <div className="w-10 h-10 border-2 border-current border-t-transparent animate-spin" />
                    </div>
                  )}
              </div>
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />

              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#fdf8f5] border-4 border-[#1a0f0a] rounded-none flex items-center justify-center shadow-2xl z-20">
                  <div className="w-3 h-3 bg-[#1a0f0a] animate-pulse" />
              </div>
           </div>

           <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {isEditing ? (
                    <input 
                      value={editedUsername}
                      onChange={(e) => setEditedUsername(e.target.value)}
                      className="bg-[#1a0f0a] border border-[#fdf8f5]/20 px-4 py-2 text-3xl font-black text-[#fdf8f5] uppercase italic outline-none focus:border-[#fdf8f5]"
                    />
                  ) : (
                    <h1 className="text-5xl font-black text-[#fdf8f5] tracking-tighter uppercase italic drop-shadow-2xl">{user?.username || "creative_ambition"}</h1>
                  )}
                  <HiOutlineBadgeCheck className="w-10 h-10 text-[#fdf8f5] hidden md:block opacity-80" />
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
                  <span className="px-5 py-2 bg-[#fdf8f5]/10 text-[#fdf8f5] border border-[#fdf8f5]/20 text-[10px] font-black uppercase tracking-[0.3em] italic shadow-xl">Level 42 Researcher</span>
                  <span className="text-[#8d7b68] font-black uppercase tracking-[0.3em] italic py-2 text-[10px] opacity-60 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#fdf8f5] opacity-20" />
                    Joined Oct 2024
                  </span>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-12">
                   {isEditing ? (
                     <>
                       <button 
                         onClick={handleSaveProfile}
                         className="px-12 py-5 text-[11px] font-black uppercase tracking-[0.3em] bg-[#fdf8f5] text-[#1a0f0a] hover:bg-[#f5ebe0] border-none rounded-none italic shadow-2xl transition-all flex items-center gap-3"
                       >
                         <HiOutlineSave className="w-5 h-5" /> Save Changes
                       </button>
                       <button 
                         onClick={() => setIsEditing(false)}
                         className="px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] bg-[#1a0f0a]/40 border border-[#fdf8f5]/10 text-[#fdf8f5] hover:border-[#fdf8f5]/40 transition-all rounded-none flex items-center gap-4 italic shadow-2xl"
                       >
                         <HiOutlineX className="w-5 h-5" /> Cancel
                       </button>
                     </>
                   ) : (
                     <button 
                       onClick={() => setIsEditing(true)}
                       className="px-12 py-5 text-[11px] font-black uppercase tracking-[0.3em] bg-[#fdf8f5] text-[#1a0f0a] hover:bg-[#f5ebe0] border-none rounded-none italic shadow-2xl transition-all"
                     >
                       Edit Profile
                     </button>
                   )}
                   {!isEditing && (
                     <button className="px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] bg-[#1a0f0a]/40 border border-[#fdf8f5]/10 text-[#fdf8f5] hover:border-[#fdf8f5]/40 transition-all rounded-none flex items-center gap-4 italic shadow-2xl">
                        <HiOutlineCog className="w-5 h-5" />
                        Security Settings
                     </button>
                   )}
              </div>
           </div>
        </div>
      </motion.div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {userStatsTemplate.map((stat, i) => (
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
                      <h3 className="text-5xl font-black text-[#fdf8f5] italic tracking-tighter tabular-nums leading-none shadow-2xl">
                        {isLoadingData ? "..." : (stats?.[stat.key] || 0)}{stat.unit || ""}
                      </h3>
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
                  <h3 className="text-xl font-black text-[#fdf8f5] mb-10 border-b border-[#fdf8f5]/10 pb-6 uppercase italic tracking-tighter">User Bio</h3>
                  {isEditing ? (
                    <textarea 
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      className="w-full h-32 bg-[#1a0f0a] border border-[#fdf8f5]/20 p-4 text-[13px] text-[#d6c2b8] font-black uppercase tracking-tight italic outline-none focus:border-[#fdf8f5] resize-none"
                    />
                  ) : (
                    <p className="text-[13px] text-[#d6c2b8] leading-relaxed font-black uppercase tracking-tight italic opacity-80 group-hover:opacity-100 transition-opacity">
                        {user?.bio || "Specializations in analyzing news language and political sentiment identification. Active contributor to the global truth-set database since 2024."}
                    </p>
                  )}
                  
                  <div className="mt-14 space-y-10">
                      <div className="space-y-5">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.3em] text-[#8d7b68] italic">
                             <span>Account Level</span>
                             <span className="text-[#fdf8f5] italic underline decoration-[#fdf8f5]/20">SENIOR ANALYST</span>
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
                      Server Location:<br/>
                      <span className="text-[#fdf8f5] opacity-80 group-hover:opacity-100 transition-opacity">US-EAST-SERVER-9</span>
                  </p>
              </div>
          </motion.div>

          {/* Activity Timeline */}
          <motion.div className="lg:col-span-8 saas-card bg-[#261a14]/60 border-[#fdf8f5]/10 rounded-none flex flex-col shadow-2xl overflow-hidden group">
              <div className="p-10 border-b border-[#fdf8f5]/5 flex items-center justify-between bg-[#fdf8f5]/[0.01]">
                  <div>
                      <h3 className="text-2xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">Recent Activity</h3>
                      <p className="text-[10px] text-[#8d7b68] font-black uppercase tracking-[0.3em] mt-2 italic underline decoration-[#fdf8f5]/10">History of your analysis reports.</p>
                  </div>
                  <span className="px-4 py-1.5 bg-[#fdf8f5] text-[#1a0f0a] text-[9px] font-black uppercase tracking-[0.3em] italic animate-pulse shadow-2xl">Live</span>
              </div>
              <div className="p-6 space-y-3 flex-1">
                  {isLoadingData ? (
                    <div className="p-10 text-center text-[#8d7b68] font-black uppercase tracking-[0.3em] italic opacity-50">
                        Synchronizing analysis history...
                    </div>
                  ) : activities.length > 0 ? activities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-6 hover:bg-[#fdf8f5]/[0.03] rounded-none transition-all cursor-pointer group/row relative overflow-hidden border border-transparent hover:border-[#fdf8f5]/10 shadow-sm hover:shadow-xl">
                           <div className="flex items-center gap-8 relative z-10">
                                <div className="w-2.5 h-2.5 bg-[#fdf8f5] group-hover/row:scale-150 transition-transform shadow-[0_0_12px_rgba(253,248,245,0.8)] opacity-40 group-hover/row:opacity-100" />
                                <div>
                                    <p className="text-base font-black text-[#fdf8f5] uppercase tracking-tighter italic leading-none">Analyzed Article <span className="text-[#8d7b68] font-black normal-case not-italic opacity-60">@</span> {activity.headline || activity.source || "Unknown Source"}</p>
                                    <p className="text-[10px] font-black text-[#4d3c2e] uppercase mt-2 tracking-[0.3em] italic group-hover/row:text-[#8d7b68] transition-colors">
                                        {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString() : "Recent"}
                                    </p>
                                </div>
                           </div>
                           <span className={`px-5 py-2 text-[9px] font-black uppercase tracking-[0.3em] italic relative z-10 shadow-xl transition-all bg-[#fdf8f5]/5 text-[#8d7b68] border border-[#fdf8f5]/10 group-hover/row:border-[#fdf8f5]/30 group-hover/row:text-[#fdf8f5]`}>
                               {activity.bias_level || "Analyzed"}
                           </span>
                           <div className="absolute inset-0 bg-gradient-to-r from-[#fdf8f5]/[0.02] to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity" />
                      </div>
                  )) : (
                    <div className="p-10 text-center text-[#8d7b68] font-black uppercase tracking-[0.3em] italic opacity-50">
                        No articles analyzed yet.
                    </div>
                  )}
              </div>
              <div className="p-10 border-t border-[#fdf8f5]/5 text-center bg-[#1a0f0a]/40 group-hover:bg-[#1a0f0a]/60 transition-colors">
                  <button className="text-[11px] font-black text-[#8d7b68] uppercase tracking-[0.4em] hover:text-[#fdf8f5] transition-all italic relative overflow-hidden group/btn px-12 py-2">
                      <span className="relative z-10">View Full History</span>
                      <div className="absolute bottom-0 left-0 w-0 h-px bg-[#fdf8f5] group-hover/btn:w-full transition-all duration-700" />
                  </button>
              </div>
          </motion.div>
      </div>

    </div>
  );
}
