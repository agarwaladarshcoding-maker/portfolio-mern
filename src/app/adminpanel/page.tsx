"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { adminService } from "@/services/adminService";
import { Project, BlogEntry, SkillPanel } from "@/constants/siteData";

const MASTER_PASSPHRASE = "NEO_TOKYO_ADMIN";

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState("SKILLS_SYS");

  // Load state from localStorage
  useEffect(() => {
    const session = localStorage.getItem("neo_tokyo_admin_session");
    if (session === "active") setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase === MASTER_PASSPHRASE) {
      setIsAuthenticated(true);
      setError(false);
      localStorage.setItem("neo_tokyo_admin_session", "active");
    } else {
      setError(true);
      setPassphrase("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("neo_tokyo_admin_session");
  };

  // ── AUTHENTICATION GATE (STARK TERMINAL) ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0C10] text-[#FACC15] flex items-center justify-center font-mono p-4">
        <div className="w-full max-w-md border-2 border-[#FACC15] p-8 bg-black">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-3 h-3 rounded-full bg-[#FACC15] ${error ? "animate-pulse shadow-[0_0_10px_red] bg-red-500" : ""}`} />
            <h1 className="text-xl font-black uppercase">SECURITY_UPLINK_GATE</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] uppercase text-[#FACC15]/60 tracking-widest">MASTER_PASSPHRASE:</label>
              <input 
                type="password"
                value={passphrase}
                onChange={(e) => {
                  setPassphrase(e.target.value);
                  if (error) setError(false);
                }}
                className={`w-full bg-[#11131A] border-2 outline-none px-4 py-3 font-mono text-sm text-[#FACC15] placeholder:text-[#FACC15]/20 transition-colors
                  ${error ? "border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.2)]" : "border-[#FACC15]/30 focus:border-[#FACC15]"}`}
                placeholder="ENTER_KEY..."
                autoFocus
              />
              {error && <p className="text-[10px] text-red-500 uppercase tracking-tighter mt-1 italic">[ ERROR ]: INVALID_CREDENTIALS</p>}
            </div>
            <button 
              type="submit"
              className="w-full bg-[#FACC15] text-black font-black py-4 hover:bg-white transition-colors uppercase text-xs tracking-widest shadow-[0_0_20px_rgba(250,204,21,0.2)]"
            >
              [ DECRYPT_&_ACCESS ]
            </button>
            <div className="flex justify-end text-[10px] text-[#FACC15]/40 uppercase">
              <Link href="/" className="hover:text-[#FACC15] underline">ABORT_COLLECTION</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ── CMS DASHBOARD (COMMAND CENTER) ──
  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#FACC15] font-mono flex flex-col md:flex-row overflow-hidden">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 border-b-2 md:border-b-0 md:border-r-2 border-[#FACC15]/20 bg-black p-6 flex flex-col gap-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#FACC15] animate-pulse" />
          <h2 className="text-lg font-black uppercase tracking-tight">ADMIN_V6.1</h2>
        </div>

        <nav className="flex flex-col gap-2">
          {["SKILLS_SYS", "PROJECT_DB", "GRIND_LOGS", "INCOMING_COMMS"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`p-3 text-left text-xs font-black uppercase transition-all flex items-center gap-3
                ${activeTab === tab ? "bg-[#FACC15] text-black shadow-[4px_4px_0px_white]" : "hover:bg-[#FACC15]/10 text-[#FACC15]/60"} `}
            >
              <span className="opacity-40">[{tab.charAt(0)}]</span>
              {tab}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-[#FACC15]/10 flex flex-col gap-2">
          <Link href="/" className="text-[10px] text-[#FACC15]/40 hover:text-[#FACC15] uppercase">[ VIEW_LIVE_SITE ]</Link>
          <button onClick={handleLogout} className="text-[10px] text-red-500/60 hover:text-red-500 text-left uppercase">[ TERMINATE_SESSION ]</button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10 relative">
        <div className="bg-grid-pan opacity-5" />
        
        <header className="relative z-10 mb-10 flex justify-between items-end border-b border-[#FACC15]/10 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">// {activeTab}</h1>
            <p className="text-[10px] text-[#FACC15]/50 tracking-[0.3em]">MANAGING_SYSTEM_DATA_READOUT</p>
          </div>
          <div className="text-[10px] text-right text-[#FACC15]/40 hidden sm:block">
            UPLINK_STABLE: 1.2 GB/S<br />
            LAST_RECON_DATA_SYNC: {new Date().toLocaleTimeString()}
          </div>
        </header>

        <div className="relative z-10 max-w-6xl">
          {activeTab === "SKILLS_SYS" && <SkillsModule />}
          {activeTab === "PROJECT_DB" && <ProjectModule />}
          {activeTab === "GRIND_LOGS" && <BlogModule />}
          {activeTab === "INCOMING_COMMS" && <CommsModule />}
        </div>
      </main>
    </div>
  );
}

// ──────── MODULES ────────

function SkillsModule() {
  const [skills, setSkills] = useState<SkillPanel[]>([]);
  useEffect(() => setSkills(adminService.getSkills()), []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
      {skills.map((panel, idx) => (
        <div key={idx} className="border border-[#FACC15]/30 bg-[#11131A] p-6 space-y-4">
          <h3 className="font-black text-[#FACC15] uppercase border-b border-[#FACC15]/20 pb-2">{panel.title}</h3>
          <div className="flex flex-wrap gap-2">
            {panel.tags.map((tag, i) => (
              <span key={i} className="bg-[#FACC15]/10 border border-[#FACC15]/20 px-2 py-1 text-[10px] text-[#FACC15]/80 font-mono">
                {tag.icon} {tag.label}
              </span>
            ))}
            <button className="text-[10px] text-[#FACC15]/40 hover:text-[#FACC15] font-black uppercase">[ + ADD_TAG ]</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectModule() {
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => setProjects(adminService.getProjects()), []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center bg-[#11131A] p-4 border-l-4 border-[#FACC15]">
        <span className="text-xs font-black uppercase">ACTIVE_PROJECT_ARCHIVE</span>
        <button className="bg-[#FACC15] text-black text-[10px] font-black px-4 py-2 hover:bg-white transition-colors">[ + NEW_ENTRY ]</button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.map((p, i) => (
          <div key={p.slug} className="border border-[#FACC15]/20 bg-black/50 p-4 flex flex-col md:flex-row gap-6 items-start hover:border-[#FACC15]/50 transition-all">
            <div className="w-full md:w-48 space-y-2">
              <span className="text-[9px] text-[#FACC15]/40 block uppercase tracking-widest">ID: {p.display_id}</span>
              <h4 className="font-black text-sm text-[#FACC15] uppercase tracking-tight">{p.title}</h4>
              <div className="flex gap-2 text-[8px] text-[#FACC15]/60 uppercase">
                <span className="bg-[#FACC15]/5 px-2 py-1 border border-[#FACC15]/10">PRIORITY: {i + 1}</span>
                <span className="bg-[#FACC15]/5 px-2 py-1 border border-[#FACC15]/10">STATUS: {p.status}</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <p className="text-[11px] text-[#FACC15]/70 line-clamp-2 leading-relaxed">{p.short_description}</p>
              <div className="flex gap-4">
                <button className="text-[9px] font-black uppercase text-[#FACC15]/80 hover:text-white underline underline-offset-4 decoration-[#FACC15]/20 hover:decoration-[#FACC15]">[ EDIT_DATA ]</button>
                <button className="text-[9px] font-black uppercase text-red-500/60 hover:text-red-500">[ REMOVE_UPLINK ]</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogModule() {
  const [blogs, setBlogs] = useState<BlogEntry[]>([]);
  useEffect(() => setBlogs(adminService.getBlogs()), []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-[#11131A] p-4 border-l-4 border-white/40 flex justify-between items-center">
        <span className="text-xs font-black uppercase">SYSTEM_LOGS: GRIND_SERIES</span>
        <button className="bg-white/20 text-[#FACC15] text-[10px] font-black px-4 py-2 border border-[#FACC15]/20 hover:bg-[#FACC15] hover:text-black transition-all">[ + INITIALIZE_NEW_LOG ]</button>
      </div>

      <div className="overflow-x-auto border border-[#FACC15]/10">
        <table className="w-full text-left text-[11px] font-mono border-collapse">
          <thead>
            <tr className="bg-[#11131A] border-b border-[#FACC15]/10 text-[#FACC15]/50 uppercase tracking-widest font-black">
              <th className="p-4">DAY</th>
              <th className="p-4">TITLE_ID</th>
              <th className="p-4">STATUS</th>
              <th className="p-4">LINKS</th>
              <th className="p-4 text-right">CONTROLS</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map(b => (
              <tr key={b.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                <td className="p-4 font-black">DAY_0{b.day}</td>
                <td className="p-4 text-[#FACC15]/90">{b.title}</td>
                <td className="p-4">
                  <span className="bg-[#FACC15]/10 px-2 py-1 text-[9px] text-[#FACC15] uppercase tracking-tighter">PUBLISHED</span>
                </td>
                <td className="p-4 text-[#FACC15]/40">[ LinkedIn_Uplink ]</td>
                <td className="p-4 text-right">
                  <button className="hover:text-[#FACC15] transition-colors">[ EDIT ]</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CommsModule() {
  const [comms, setComms] = useState<any[]>([]);
  useEffect(() => setComms(adminService.getComms()), []);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {comms.map(c => (
          <div key={c.id} className="border-l-2 border-[#FACC15] bg-[#11131A] p-6 space-y-4">
            <div className="flex justify-between items-center text-[9px] font-black uppercase text-[#FACC15]/40 tracking-widest">
              <span>SOURCE: {c.type}</span>
              <span>{new Date(c.timestamp).toLocaleDateString()}</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-[#FACC15] uppercase">{c.name}</h4>
              <p className="text-[10px] text-[#FACC15]/60 italic font-bold">RE: {c.purpose}</p>
            </div>
            <p className="text-[11px] text-[#FACC15]/80 leading-relaxed font-mono bg-black/40 p-4 border border-[#FACC15]/10">
              "{c.message}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
