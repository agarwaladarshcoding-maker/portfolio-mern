"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { adminService } from "@/services/adminService";
import { Project } from "@/constants/siteData";

export default function ProjectArchive() {
  const [projects, setProjects] = useState<Project[]>([]);
  
  useEffect(() => {
    setProjects(adminService.getProjects());
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#FACC15] font-mono p-4 md:p-20 relative overflow-x-hidden">
      <div className="bg-grid-pan opacity-5" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-16 space-y-6">
          <Link 
            href="/" 
            className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#FACC15]/40 hover:text-[#FACC15] border border-[#FACC15]/20 px-4 py-2 bg-black hover:bg-[#FACC15]/5 transition-all"
          >
            [ ← RETURN_TO_SYSTEM_ROOT ]
          </Link>
          
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">// PROJECT_ARCHIVE</h1>
            <p className="text-[10px] text-[#FACC15]/50 tracking-[0.3em] uppercase">FULL_PROJECT_LEDGER_DATA_READOUT</p>
          </div>
        </header>

        <section className="space-y-12">
          {/* ARCHIVE TABLE */}
          <div className="overflow-x-auto border border-[#FACC15]/20 bg-black/40 backdrop-blur-sm shadow-[0_0_50px_rgba(250,204,21,0.05)]">
            <table className="w-full text-left text-[11px] sm:text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#11131A] border-b border-[#FACC15]/20 text-[#FACC15]/50 uppercase tracking-widest font-black">
                  <th className="p-6">ID_STAMP</th>
                  <th className="p-6">PROJECT_TITLE</th>
                  <th className="p-6">TECH_STACK</th>
                  <th className="p-6">STATUS</th>
                  <th className="p-6 text-right">UPLINK</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p, idx) => (
                  <tr key={p.slug} className="border-b border-white/[0.03] hover:bg-[#FACC15]/5 group transition-colors duration-200">
                    <td className="p-6 font-black opacity-40 group-hover:opacity-100">{p.display_id}</td>
                    <td className="p-6 max-w-xs">
                      <div className="space-y-1">
                        <h3 className="text-sm font-black text-[#FACC15] uppercase tracking-tight">{p.title}</h3>
                        <p className="text-[10px] text-[#FACC15]/60 line-clamp-1">{p.short_description}</p>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-wrap gap-2 max-w-sm">
                        {p.stack.map(s => (
                          <span key={s} className="bg-black/40 border border-[#FACC15]/10 px-2 py-1 text-[8px] text-[#FACC15]/70">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-2 py-1 text-[9px] font-black tracking-tighter uppercase
                        ${p.status === 'ACTIVE' ? 'bg-[#FACC15]/10 text-[#FACC15]' : 'bg-white/5 text-white/40'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <Link 
                        href={`/projects/${p.slug}`} 
                        className="text-[10px] font-black uppercase text-[#FACC15] hover:text-white underline underline-offset-4 decoration-[#FACC15]/20"
                      >
                        [ DEEP_DIVE ]
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="pt-10 flex flex-col md:flex-row justify-between items-center text-[10px] text-[#FACC15]/40 uppercase tracking-[0.2em] font-black border-t border-[#FACC15]/10 mt-20">
            <div>© ADARSH_AGARWALA // {new Date().getFullYear()}</div>
            <div className="mt-4 md:mt-0 font-mono italic">"NEO_TOKYO_TERMINAL_V6.1_VERIFIED"</div>
          </footer>
        </section>
      </div>
    </div>
  );
}
