"use client";

import React from "react";
import { siteConfig } from "@/config/site";
import { motion } from "framer-motion";

/**
 * Identity Component - Dossier Section
 * Restoration of previous "About/Edu/Exp" info as a standalone terminal section.
 */
export function Identity() {
  return (
    <section 
      id="identity" 
      className="min-h-screen w-full shrink-0 snap-start snap-always relative overflow-hidden bg-[#FACC15] text-black font-mono flex flex-col justify-center py-20 px-6"
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        
        {/* Dossier Header & About */}
        <div className="space-y-12">
          <div className="space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.3em] opacity-60">
              [ SUBJECT_IDENTITY_FILE ]
            </span>
            <h2 className="text-5xl md:text-7xl font-black uppercase italic leading-none">
              SYSTEM_OVERVIEW
            </h2>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <span className="w-8 h-1 bg-black" /> ABOUT_CORE
            </h3>
            <p className="text-lg md:text-xl font-medium leading-relaxed max-w-xl">
              {siteConfig.aboutMe}
            </p>
          </div>

          <div className="pt-8">
            <a
              href={siteConfig.experience.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-black text-[#FACC15] px-8 py-5 text-lg font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 shadow-[10px_10px_0px_rgba(0,0,0,0.2)] hover:translate-x-1 hover:-translate-y-1"
            >
              [ INITIALIZE_RESUME_DOWNLOAD ]
            </a>
          </div>
        </div>

        {/* Technical Data Blocks */}
        <div className="flex flex-col gap-12 justify-center">
          
          {/* Block 1: Education */}
          <div className="border-l-4 border-black pl-8 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] opacity-50">01_EDUCATION_DATA</h4>
            <div className="space-y-1">
              <p className="text-2xl font-black uppercase">{siteConfig.education.degree}</p>
              <p className="text-lg font-bold opacity-80">{siteConfig.education.school} // {siteConfig.education.years}</p>
            </div>
            <ul className="space-y-2 mt-4 text-sm font-bold uppercase opacity-70 italic">
              <li>{siteConfig.education.stats}</li>
              <li>{siteConfig.education.extra}</li>
            </ul>
          </div>

          {/* Block 2: Experience */}
          <div className="border-l-4 border-black pl-8 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] opacity-50">02_OPERATIONAL_EXP</h4>
            <div className="space-y-1">
              <p className="text-2xl font-black uppercase">CURRENT_STATUS</p>
              <p className="text-lg font-bold opacity-80">{siteConfig.experience.role}</p>
            </div>
          </div>

          {/* Block 3: System Stats */}
          <div className="bg-black/5 p-8 border-2 border-dashed border-black/20">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] mb-6">SYSTEM_DIAGNOSTICS</h4>
            <div className="grid grid-cols-2 gap-8 text-[10px] font-black uppercase opacity-60">
              <div className="space-y-1">
                <p>UPLINK_STATUS</p>
                <p className="text-black opacity-100">STABLE</p>
              </div>
              <div className="space-y-1">
                <p>ENCRYPTION</p>
                <p className="text-black opacity-100">AES-256</p>
              </div>
              <div className="space-y-1">
                <p>LOC_DATA</p>
                <p className="text-black opacity-100">IIIT_PUNE</p>
              </div>
              <div className="space-y-1">
                <p>CORE_VER</p>
                <p className="text-black opacity-100">4.2.0_IDENTITY</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Background Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none select-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="identityGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#identityGrid)" />
        </svg>
      </div>
    </section>
  );
}
