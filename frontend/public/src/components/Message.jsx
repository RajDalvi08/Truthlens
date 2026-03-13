import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Navigation from "./Navigation";

const contacts = [
  { id: 1, name: "System Admin", status: "online", lastMessage: "Protocol updated.", avatar: "SA" },
  { id: 2, name: "Data Bot Alpha", status: "offline", lastMessage: "Batch #8492 complete.", avatar: "DB" },
  { id: 3, name: "Analyst_Cypher", status: "online", lastMessage: "Found a discrepancy in the Fox feed.", avatar: "AC" },
  { id: 4, name: "Global News Aggregator", status: "online", lastMessage: "Receiving live updates.", avatar: "GN" },
];

const initialMessages = [
  { id: 1, sender: "Analyst_Cypher", text: "Did you review the latest sentiment models?", time: "10:42 AM", isMine: false },
  { id: 2, sender: "Me", text: "Yes, the neural accuracy is holding at 99.2%.", time: "10:45 AM", isMine: true },
  { id: 3, sender: "Analyst_Cypher", text: "Excellent. Pushing the new fact-checking algorithm to production.", time: "10:46 AM", isMine: false },
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
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[#FDEBD0]">
      <Navigation />

      <main className="flex-1 flex p-6 gap-6 h-screen overflow-hidden">
        
        {/* Contacts Sidebar */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-80 flex flex-col bg-[var(--bg-secondary)] border border-white/5 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]"
        >
          <div className="p-6 border-b border-white/5 bg-[var(--bg-elevated)]/50 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white tracking-wide">Secure Comms</h2>
            <p className="text-xs text-cyan-500 mt-1 uppercase tracking-widest">Encrypted Network</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {contacts.map(contact => (
              <motion.div 
                key={contact.id}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveContact(contact)}
                className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-4 border ${
                  activeContact.id === contact.id ? "bg-[#18181b] border-cyan-500/30" : "bg-transparent border-transparent"
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                    {contact.avatar}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[var(--bg-secondary)] ${
                    contact.status === "online" ? "bg-emerald-500" : "bg-gray-500"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-sm font-medium text-white truncate">{contact.name}</h3>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{contact.lastMessage}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Chat Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col bg-[var(--bg-secondary)] border border-white/5 rounded-2xl overflow-hidden relative shadow-[0_0_30px_rgba(0,0,0,0.5)]"
        >
          {/* Subtle Background Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/5 via-transparent to-transparent pointer-events-none"></div>

          {/* Chat Header */}
          <div className="p-6 border-b border-white/5 bg-[var(--bg-elevated)]/80 backdrop-blur-md flex items-center justify-between z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(217,70,239,0.3)]">
                {activeContact.avatar}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{activeContact.name}</h3>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Secure Connection
                </p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-cyan-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </button>
          </div>

          {/* Messages List */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 overflow-y-auto p-6 space-y-6 z-10 custom-scrollbar"
          >
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                variants={messageVariants}
                className={`flex flex-col ${msg.isMine ? "items-end" : "items-start"}`}
              >
                <div className={`max-w-[70%] p-4 rounded-2xl relative ${
                  msg.isMine 
                    ? "bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-[0_5px_15px_rgba(6,182,212,0.2)]" 
                    : "bg-[#18181b] border border-white/5 text-gray-200 rounded-tl-none"
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[10px] text-gray-500 mt-2 px-1">{msg.time}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Chat Input */}
          <div className="p-4 border-t border-white/5 bg-[var(--bg-elevated)]/80 backdrop-blur-md z-10">
            <form onSubmit={handleSendMessage} className="flex gap-4">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Transmit encrypted message..."
                className="flex-1 bg-[var(--bg-primary)] border border-white/10 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-600"
              />
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(6,182,212,0.4)" }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 rounded-xl font-bold flex items-center justify-center shadow-lg"
              >
                Send
              </motion.button>
            </form>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
