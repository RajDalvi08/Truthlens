"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const contacts = [
  { id: 1, name: "System Admin", status: "online", lastMessage: "System updated.", avatar: "SA" },
  { id: 2, name: "Data Bot", status: "offline", lastMessage: "Data sync complete.", avatar: "DB" },
  { id: 3, name: "Cypher", status: "online", lastMessage: "Issue with the latest feed.", avatar: "AC" },
  { id: 4, name: "News Aggregator", status: "online", lastMessage: "Receiving live updates.", avatar: "GN" },
];

const initialMessages = [
  { id: 1, sender: "Analyst_Cypher_0x", text: "Did you review the latest neural sentiment models?", time: "10:42 AM", isMine: false },
  { id: 2, sender: "Me", text: "Yes, the neural accuracy is holding at 99.2% delta.", time: "10:45 AM", isMine: true },
  { id: 3, sender: "Analyst_Cypher_0x", text: "Excellent. Pushing the new fact-checking algorithm to production nodes.", time: "10:46 AM", isMine: false },
];

export default function Message() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState("");
  const [activeContact, setActiveContact] = useState(contacts[2]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "Me",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true
    };

    setMessages([...messages, newMessage]);
    setInputText("");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="max-w-7xl mx-auto flex gap-10 h-[calc(100vh-180px)] animate-in fade-in duration-1000 mesh-bg">
        
        {/* Contacts Sidebar */}
        <motion.div 
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-96 flex flex-col bg-[#261a14]/60 border border-[#fdf8f5]/10 rounded-none overflow-hidden shadow-2xl relative"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-[#fdf8f5]/5 pointer-events-none" />
          <div className="p-10 border-b border-[#fdf8f5]/10 bg-[#fdf8f5]/[0.02]">
            <h2 className="text-3xl font-black text-[#fdf8f5] tracking-tighter uppercase italic leading-none mb-3">Direct Messages</h2>
            <p className="text-[10px] text-[#8d7b68] uppercase tracking-[0.35em] font-black italic underline decoration-[#fdf8f5]/10">Secure Chat</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar relative z-10">
            {contacts.map(contact => (
              <motion.div 
                key={contact.id}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(253,248,245,0.05)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveContact(contact)}
                className={`p-6 rounded-none cursor-pointer transition-all flex items-center gap-6 border-2 relative overflow-hidden group ${
                  activeContact.id === contact.id ? "bg-[#fdf8f5]/5 border-[#fdf8f5]/20 shadow-xl" : "bg-transparent border-transparent"
                }`}
              >
                {activeContact.id === contact.id && (
                    <div className="absolute left-0 top-0 w-1.5 h-full bg-[#fdf8f5]" />
                )}
                <div className="relative">
                  <div className={`w-14 h-14 rounded-none flex items-center justify-center font-black text-xs border-2 transition-all duration-500 ${
                    activeContact.id === contact.id ? "bg-[#fdf8f5] text-[#1a0f0a] border-[#fdf8f5]" : "bg-[#fdf8f5]/5 text-[#8d7b68] border-[#fdf8f5]/10 group-hover:border-[#fdf8f5]/30 group-hover:text-[#fdf8f5]"
                  }`}>
                    {contact.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-none border-2 border-[#1a0f0a] shadow-xl ${
                    contact.status === "online" ? "bg-[#fdf8f5] animate-pulse" : "bg-[#4d3c2e]"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-[11px] font-black text-[#fdf8f5] uppercase tracking-widest truncate italic">{contact.name}</h3>
                  </div>
                  <p className="text-[10px] text-[#8d7b68] font-black truncate uppercase tracking-widest leading-none opacity-60 italic">{contact.lastMessage}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Chat Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col bg-[#261a14]/60 border border-[#fdf8f5]/10 rounded-none overflow-hidden relative shadow-2xl"
        >
          {/* Subtle Background Mesh & Textures */}
          <div className="absolute inset-0 bg-[#fdf8f5]/[0.01] pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

          {/* Chat Header */}
          <div className="p-10 border-b border-[#fdf8f5]/10 bg-[#fdf8f5]/[0.02] flex items-center justify-between z-10 shadow-xl">
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 rounded-none bg-[#fdf8f5] text-[#1a0f0a] flex items-center justify-center font-black text-sm shadow-2xl relative border-2 border-[#fdf8f5]">
                {activeContact.avatar}
              </div>
              <div>
                <h3 className="text-3xl font-black text-[#fdf8f5] uppercase italic tracking-tighter leading-none mb-3">{activeContact.name}</h3>
                <p className="text-[10px] text-[#8d7b68] font-black uppercase tracking-[0.3em] flex items-center gap-3 italic">
                  <span className="w-2.5 h-2.5 rounded-none bg-[#fdf8f5] animate-pulse shadow-[0_0_10px_rgba(253,248,245,0.6)]" />
                  CONNECTED
                </p>
              </div>
            </div>
            <button className="text-[#8d7b68] hover:text-[#fdf8f5] transition-all p-4 border border-transparent hover:border-[#fdf8f5]/20 hover:bg-[#fdf8f5]/5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </button>
          </div>

          {/* Messages List */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 overflow-y-auto p-12 space-y-12 z-10 custom-scrollbar bg-[#1a0f0a]/30"
          >
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                variants={messageVariants}
                className={`flex flex-col ${msg.isMine ? "items-end" : "items-start"}`}
              >
                <div className={`max-w-[70%] p-8 rounded-none relative transition-all shadow-2xl border-2 ${
                  msg.isMine 
                    ? "bg-[#fdf8f5] text-[#1a0f0a] border-[#fdf8f5] font-black uppercase italic tracking-tight" 
                    : "bg-[#261a14] border-[#fdf8f5]/10 text-[#d6c2b8] font-black uppercase tracking-tight"
                }`}>
                  <p className="text-[13px] leading-relaxed tracking-wide italic">{msg.text}</p>
                  {msg.isMine && (
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#fdf8f5] rotate-45 border-r border-t border-[#fdf8f5]" />
                  )}
                  {!msg.isMine && (
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#261a14] rotate-45 border-l border-b border-[#fdf8f5]/10" />
                  )}
                </div>
                <span className="text-[9px] font-black text-[#4d3c2e] mt-4 uppercase tracking-[0.4em] tabular-nums italic opacity-60">{msg.time}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Chat Input */}
          <div className="p-8 border-t border-[#fdf8f5]/10 bg-[#fdf8f5]/[0.02] z-10 shadow-2xl">
            <form onSubmit={handleSendMessage} className="flex gap-6">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="TYPE A MESSAGE..."
                className="flex-1 bg-[#1a0f0a] border border-[#fdf8f5]/10 rounded-none px-8 py-5 text-xs font-black text-[#fdf8f5] focus:outline-none focus:border-[#fdf8f5] transition-all placeholder:text-[#4d3c2e] uppercase tracking-[0.2em] italic shadow-inner"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-[#fdf8f5] text-[#1a0f0a] px-14 rounded-none font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl hover:bg-[#f5ebe0] transition-all italic border-none"
              >
                SEND
              </motion.button>
            </form>
          </div>
        </motion.div>
    </div>
  );
}
