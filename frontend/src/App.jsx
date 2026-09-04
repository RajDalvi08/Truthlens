import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar.jsx";
import TopHeader from "./components/TopHeader.jsx";
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
import { NotificationProvider } from "./NotificationContext";
import { SearchProvider } from "./SearchContext";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );
  const location = useLocation();

  // Track window resizing to dynamically update layout margins
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (desktop) {
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-close mobile sidebar when navigating routes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  // Hide sidebar on Auth pages AND Home page
  const isSidebarHidden = ["/", "/login", "/register", "/home"].includes(location.pathname);

  // Dynamic sidebar width for margin on desktop; 0px on mobile
  const sidebarMargin = isSidebarHidden || !isDesktop
    ? '0px' 
    : (isSidebarCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width)');

  return (
    <AuthProvider>
      <NotificationProvider>
        <SearchProvider>
          <div className="flex min-h-screen mesh-bg transition-colors duration-300 font-sans text-white relative overflow-x-hidden">
          
          {!isSidebarHidden && (
            <Sidebar 
              isCollapsed={isSidebarCollapsed} 
              onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
              isMobileOpen={isMobileSidebarOpen}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />
          )}

          <div 
            className="flex-1 flex flex-col layout-transition min-w-0" 
            style={{ marginLeft: sidebarMargin }}
          >
            {!isSidebarHidden && (
              <TopHeader 
                onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
              />
            )}

            <main className={`flex-1 ${!isSidebarHidden ? 'p-4 sm:p-6 md:p-8 lg:p-10' : ''} overflow-x-hidden`}>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected Routes */}
                  <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                  <Route path="/bias-analyzer" element={<ProtectedRoute><BiasAnalyzer /></ProtectedRoute>} />
                  <Route path="/datasets" element={<ProtectedRoute><DatasetManager /></ProtectedRoute>} />
                  <Route path="/compare" element={<ProtectedRoute><SourceComparison /></ProtectedRoute>} />
                  <Route path="/event" element={<ProtectedRoute><EventComparison /></ProtectedRoute>} />
                  <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/message" element={<ProtectedRoute><Message /></ProtectedRoute>} />
                  <Route path="/revenue" element={<ProtectedRoute><Revenue /></ProtectedRoute>} />
                  <Route path="/changeaccount" element={<ProtectedRoute><ChangeAccount /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/methodology" element={<ProtectedRoute><Methodology /></ProtectedRoute>} />
                  <Route path="/case-studies" element={<ProtectedRoute><CaseStudies /></ProtectedRoute>} />
                  <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
                  <Route path="/globe" element={<ProtectedRoute><GlobePage /></ProtectedRoute>} />
                </Routes>
              </AnimatePresence>
            </main>
          </div>
      </div>
        </SearchProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;