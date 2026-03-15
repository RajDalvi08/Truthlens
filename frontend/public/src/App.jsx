import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./Navbar.jsx";
import Home from "./components/Home.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Analytics from "./components/Analytics.jsx";
import Message from "./components/Message.jsx";
import Revenue from "./components/Revenue.jsx";
import ChangeAccount from "./components/ChangeAccount.jsx";
import Profile from "./components/Profile.jsx";
import Methodology from "./components/Methodology.jsx";
import CaseStudies from "./components/CaseStudies.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import BiasAnalyzer from "./components/BiasAnalyzer.jsx";
import DatasetManager from "./components/DatasetManager.jsx";
import SourceComparison from "./components/SourceComparison.jsx";
import EventComparison from "./components/EventComparison.jsx";
import Reports from "./components/Reports.jsx";
import Settings from "./components/Settings.jsx";
import Journal from "./components/Journal.jsx";
import GlobePage from "./components/GlobePage.jsx";
import { AuthProvider } from "./AuthContext";
import { ThemeContext } from "./ThemeContext";

function App() {
  const [DarkTheme, setDarkTheme] = useState(true);
  const location = useLocation();

  const hideNavbar = ["/", "/login", "/register"].includes(location.pathname);

  return (
    <AuthProvider>
      <ThemeContext.Provider value={{ DarkTheme, setDarkTheme }}>
        <div className={`min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-cyan-500/30 transition-colors duration-300 relative ${DarkTheme ? '' : 'light'}`}>
          <div className="neural-bg" />
          {!hideNavbar && <Navbar />}

          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/bias-analyzer" element={<BiasAnalyzer />} />
              <Route path="/datasets" element={<DatasetManager />} />
              <Route path="/compare" element={<SourceComparison />} />
              <Route path="/event" element={<EventComparison />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/message" element={<Message />} />
              <Route path="/revenue" element={<Revenue />} />
              <Route path="/changeaccount" element={<ChangeAccount />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/methodology" element={<Methodology />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/globe" element={<GlobePage />} />
            </Routes>
          </AnimatePresence>
        </div>
      </ThemeContext.Provider>
    </AuthProvider>
  );
}

export default App;