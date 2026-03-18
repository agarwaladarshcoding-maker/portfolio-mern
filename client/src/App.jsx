import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import NeuralLoader from "./components/loading/NeuralLoader";
import Navbar from "./components/Layout/Navbar";
import Hero from "./components/sections/Hero";
import TheGrind from "./components/sections/TheGrind";
import Projects from "./components/sections/Projects";
import SkillsMatrix from "./components/sections/SkillsMatrix";
import GitHubStats from "./components/sections/GitHubStats";
import Contact from "./components/sections/Contact";
import NowTeaser from "./components/sections/NowTeaser";
import AdminPanel from "./components/admin/AdminPanel";
import GrindLog from "./components/sections/GrindLog";
import GrindPost from "./components/sections/GrindPost";
import ProjectsPage from "./components/sections/ProjectsPage";
import ProjectDetail from "./components/sections/ProjectDetail";
import NowPage from "./components/sections/NowPage";
import NotFound from "./components/sections/NotFound";
import BackToTop from "./components/ui/BackToTop";
import AntigravityBackground from "./components/ui/AntigravityBackground";
import MaintenancePage from "./components/sections/MaintenancePage";
import "./styles/globals.css";
import "./styles/animations.css";
import "./styles/grind-md.css";

// ─────────────────────────────────────────────────────────────
// MAINTENANCE MODE — flip to false when you're ready to go live
// Admin panel (/admin) is always accessible regardless.
// ─────────────────────────────────────────────────────────────
var MAINTENANCE_MODE = true;

var HAS_LOADED = sessionStorage.getItem("portfolio_loaded") === "1";

const AppInner = () => {
  const { setLoadingDone } = useApp();
  const [skipLoader]    = useState(HAS_LOADED);
  const [loaderExiting, setLoaderExiting] = useState(false);
  const [showContent,   setShowContent]   = useState(HAS_LOADED);

  var path = window.location.pathname;

  // Admin is always reachable so you can manage content during maintenance
  if (path === "/admin") return <AdminPanel />;

  // Show maintenance page for everyone else until you're ready
  if (MAINTENANCE_MODE) return <MaintenancePage />;

  if (path.startsWith("/grind/") && path.length > 7)     return <GrindPost />;
  if (path === "/grind")                                  return <GrindLog />;
  if (path.startsWith("/projects/") && path.length > 10) return <ProjectDetail />;
  if (path === "/projects")                               return <ProjectsPage />;
  if (path === "/now")                                    return <NowPage />;
  if (path !== "/")                                       return <NotFound />;

  const handleLoadComplete = () => {
    setLoaderExiting(true);
    setTimeout(function() {
      setLoadingDone();
      setShowContent(true);
      sessionStorage.setItem("portfolio_loaded", "1");
    }, 800);
  };

  return (
    <div className="app">
      {!skipLoader && !showContent && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          opacity: loaderExiting ? 0 : 1,
          transition: "opacity 800ms cubic-bezier(0.7,0,0.84,0)",
          pointerEvents: loaderExiting ? "none" : "all",
        }}>
          <NeuralLoader onComplete={handleLoadComplete} />
        </div>
      )}

      {showContent && (
        <main style={{ opacity: 0, animation: "fadeIn 600ms cubic-bezier(0.16,1,0.3,1) 100ms both" }}>
          <Navbar />
          <Hero />
          <TheGrind />
          <Projects />
          <SkillsMatrix />
          <GitHubStats />
          <Contact />

          {/* Now teaser — only shows when /now has content */}
          <NowTeaser />

          <footer className="app__footer">
            <div className="container app__footer-inner">
              <span className="app__footer-copy">// built with MERN · Mumbai, India</span>
              <div className="app__footer-links">
                <a href="/now"      className="app__footer-link">Now</a>
                <a href="/grind"    className="app__footer-link">Grind log</a>
                <a href="/projects" className="app__footer-link">All projects</a>
              </div>
              <span className="app__footer-motto">never stopping. always building.</span>
            </div>
          </footer>

          <BackToTop />
        </main>
      )}
    </div>
  );
};

const App = () => <AppProvider><AppInner /></AppProvider>;
export default App;