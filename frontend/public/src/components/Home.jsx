import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import React, { Suspense } from "react";

const NeuralParticles = React.lazy(() => import("./three/NeuralParticles"));

function Home() {
  const navigate = useNavigate();

  const handleViewDemo = () => {
    navigate("/dashboard");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden transition-colors duration-300"
    >
      {/* HERO SECTION */}
      <section className="relative w-full h-screen overflow-hidden flex items-center">
        {/* Three.js Particle Background */}
        <Suspense fallback={
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-[var(--bg-primary)] to-[var(--bg-primary)] z-0"></div>
        }>
          <NeuralParticles />
        </Suspense>

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/40 via-transparent to-[var(--bg-primary)]/80 z-[1] pointer-events-none"></div>
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGgyMHYyMEgwVTB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMTlMMjAgMTlNMCAwTDIwIDAiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTE5IDBMMTkgMjBNMCAwTDAgMjAiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] z-[2] opacity-50 pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 w-full px-6 md:px-16 lg:px-24">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl space-y-8"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
              <h2 className="text-xs md:text-sm tracking-[0.4em] uppercase font-bold 
              bg-gradient-to-r from-cyan-400 to-blue-500 
              bg-clip-text text-transparent inline-block drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                INITIALIZING TRUTH PROTOCOL
              </h2>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight text-white mb-2"
            >
              Decode the <br />
              <span className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(217,70,239,0.5)]">
                Hidden Narrative
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed font-light border-l-4 border-cyan-500 pl-4"
            >
              AI-powered platform for detecting bias in global news coverage. Advanced neural networks expose subtle biases, political leanings, and factual accuracy in real-time.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mt-8"
            >
              <motion.button 
                onClick={() => navigate("/bias-analyzer")}
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(217, 70, 239, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold rounded-xl shadow-lg relative overflow-hidden group"
              >
                <span className="relative z-10">Analyze Article</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              </motion.button>
              
              <motion.button
                onClick={handleViewDemo}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(6, 182, 212, 0.1)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent text-cyan-400 font-bold border-2 border-cyan-500/50 rounded-xl hover:border-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              >
                Explore Analytics
              </motion.button>
            </motion.div>

            {/* Live status ticker */}
            <motion.div variants={itemVariants} className="flex items-center gap-6 mt-6">
              {[
                { label: "Live Sources", value: "2,400+" },
                { label: "Articles/Day", value: "142K" },
                { label: "Model Accuracy", value: "99.2%" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gray-600 uppercase">{stat.label}:</span>
                  <span className="text-sm font-bold text-cyan-400">{stat.value}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="relative w-full py-24 px-6 md:px-10 bg-[var(--bg-secondary)] border-y border-[var(--border-subtle)] transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            { icon: "⚡", value: "99.2%", label: "Neural Accuracy", color: "from-cyan-400 to-blue-500", shadow: "rgba(6,182,212,0.2)" },
            { icon: "⏱️", value: "< 2s", label: "Processing Latency", color: "from-fuchsia-400 to-purple-500", shadow: "rgba(217,70,239,0.2)" },
            { icon: "🌐", value: "2M+", label: "Sources Scanned", color: "from-emerald-400 to-teal-500", shadow: "rgba(52,211,153,0.2)" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              whileHover={{ y: -5, boxShadow: `0 20px 40px ${stat.shadow}`, borderColor: "rgba(255,255,255,0.2)" }}
              className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl p-8 transition-all duration-300"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 mb-6 text-2xl">
                {stat.icon}
              </div>
              <h2 className={`text-5xl font-black tracking-tight bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                {stat.value}
              </h2>
              <p className="text-gray-400 font-medium tracking-wide uppercase text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="how-it-works" className="py-32 px-6 md:px-10 bg-[var(--bg-primary)] relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Heading */}
          <motion.div 
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Absolute <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">Clarity</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              Equipped with state-of-the-art NLP models, our system dissects content syntax, sentiment, and sourcing to reveal the true agenda.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[ 
              { icon: "🧬", title: "Sentiment Modeling", desc: "Detects emotional charge and subjective framing in real-time text analysis." },
              { icon: "🛡️", title: "Fact Verification", desc: "Cross-references claims against trusted global databases instantly." },
              { icon: "📊", title: "Bias Spectrum", desc: "Visualizes political and social leaning on an interactive multidimensional plane." },
              { icon: "📡", title: "Live Tracking", desc: "Monitors shifts in media narratives as breaking news unfolds globally." },
              { icon: "🔮", title: "Predictive Trends", desc: "Identifies emerging polarizing topics before they saturate the mainstream." },
              { icon: "✨", title: "Syntax Highlighting", desc: "Pinpoints manipulative language, loaded words, and logical fallacies." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(6,182,212,0.3)" }}
                className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-8 relative overflow-hidden group transition-all duration-300"
              >
                {/* Hover Glow Effect */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-500"></div>
                
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 mb-6 text-2xl shadow-inner relative z-10">
                  {item.icon}
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors relative z-10">
                  {item.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="relative w-full py-32 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[var(--bg-primary)] to-[var(--bg-primary)] z-0"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-[var(--bg-elevated)] to-[var(--bg-secondary)] border border-[var(--border-light)] p-12 md:p-16 rounded-3xl shadow-[0_0_50px_var(--shadow-glow)] relative overflow-hidden transition-colors duration-300"
          >
            {/* Cyber lines */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-50"></div>

            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Initiate System Override
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Join the network of analysts actively decoding media bias. Unrestricted access to real-time intelligence awaits.
            </p>
            
            <motion.button 
              onClick={() => navigate("/dashboard")}
              whileHover={{ scale: 1.05, textShadow: "0 0 8px rgba(255,255,255,0.8)" }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Establish Connection
            </motion.button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

export default Home;