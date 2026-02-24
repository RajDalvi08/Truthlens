import Navbar from "./Navbar.jsx";

function App() {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://www.pexels.com/download/video/12345283/"
            type="video/mp4"
          />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-16">
          <div className="max-w-2xl space-y-6">
            <h2 className="text-sm tracking-[0.3em] uppercase font-light 
              bg-gradient-to-r from-[#A89A84] to-[#C5B79E] 
              bg-clip-text text-transparent">
              YOUR TRUTH JOURNEY
            </h2>

            <h1 className="text-5xl md:text-6xl font-serif leading-tight 
              bg-gradient-to-r from-[#A89A84] via-[#C5B79E] to-[#E8E3DA] 
              bg-clip-text text-transparent">
              From headline to hidden bias,
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed">
              We uncover the full story, so you see news as it truly is.
            </p>

            <button className="mt-4 px-6 py-3 bg-[#A89A84] text-black rounded-lg hover:bg-[#C5B79E] transition shadow-md">
              Analyze News
            </button>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="w-full py-38 px-10 bg-gradient-to-br from-[#f3c977] via-[#f2d9ac] to-[#ecc478]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Card 1 */}
          <div className="bg-gradient-to-br from-[#0f172a]/80 via-[#111827]/80 to-[#020617]/90 
            backdrop-blur-xl rounded-2xl p-10 hover:scale-105 transition duration-300 shadow-xl">
            <div className="w-14 h-14 flex items-center justify-center rounded-xl 
              bg-gradient-to-r from-[#A89A84] via-[#C5B79E] to-[#c7ae7f] mb-6 text-xl">
              🧠
            </div>
            <h2 className="text-5xl font-serif bg-gradient-to-r from-[#A89A84] via-[#C5B79E] to-[#E8E3DA] bg-clip-text text-transparent">
              99.2%
            </h2>
            <p className="text-gray-400 mt-3">Accuracy</p>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-br from-[#0f172a]/80 via-[#111827]/80 to-[#020617]/90 
            backdrop-blur-xl rounded-2xl p-10 hover:scale-105 transition duration-300 shadow-xl">
            <div className="w-14 h-14 flex items-center justify-center rounded-xl 
              bg-gradient-to-r from-[#A89A84] via-[#C5B79E] to-[#c7ae7f] mb-6 text-xl">
              ⚡
            </div>
            <h2 className="text-5xl font-serif bg-gradient-to-r from-[#A89A84] via-[#C5B79E] to-[#E8E3DA] bg-clip-text text-transparent">
              &lt; 2s
            </h2>
            <p className="text-gray-400 mt-3">Analysis Time</p>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-br from-[#0f172a]/80 via-[#111827]/80 to-[#020617]/90 
            backdrop-blur-xl rounded-2xl p-10 hover:scale-105 transition duration-300 shadow-xl">
            <div className="w-14 h-14 flex items-center justify-center rounded-xl 
              bg-gradient-to-r from-[#A89A84] via-[#C5B79E] to-[#c7ae7f] mb-6 text-xl">
              📈
            </div>
            <h2 className="text-5xl font-serif bg-gradient-to-r from-[#A89A84] via-[#C5B79E] to-[#E8E3DA] bg-clip-text text-transparent">
              1M+
            </h2>
            <p className="text-gray-400 mt-3">Articles Analyzed</p>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-32 px-10 bg-[#020617]">
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-serif 
              bg-gradient-to-r from-[#ccb794] via-[#C5B79E] to-[#E8E3DA] 
              bg-clip-text text-transparent mb-6">
              Powerful Insights, Clear Truth
            </h1>

            <p className="text-gray-400 max-w-2xl mx-auto">
              Our AI-powered system detects bias, verifies facts, and reveals the hidden narratives behind every headline.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🧠", title: "AI-Powered Analysis", desc: "Advanced machine learning detects subtle bias patterns" },
              { icon: "🛡️", title: "Trustworthy Results", desc: "Transparent scoring system you can rely on" },
              { icon: "📊", title: "Visual Insights", desc: "Beautiful charts and metrics at a glance" },
              { icon: "⚡", title: "Real-Time Detection", desc: "Instant analysis of news articles and content" },
              { icon: "📈", title: "Trend Analysis", desc: "Track bias patterns over time" },
              { icon: "✨", title: "Smart Highlights", desc: "Automatically highlights biased language" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-[#0f172a]/80 via-[#111827]/80 to-[#020617]/90 
                border border-white/10 rounded-2xl p-8 backdrop-blur-xl 
                hover:scale-105 hover:border-[#A89A84]/50 transition duration-300 shadow-2xl"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl 
                  bg-gradient-to-r from-[#8a744b] via-[#7a6842] to-[#a38c62] mb-5 text-xl">
                  {item.icon}
                </div>

                <h3 className="text-xl font-serif bg-gradient-to-r from-[#ccb794] via-[#C5B79E] to-[#E8E3DA] bg-clip-text text-transparent mb-2">
                  {item.title}
                </h3>

                <p className="text-gray-400 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

export default App;