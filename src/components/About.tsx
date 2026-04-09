"use client";

import React from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { aboutStatus } from "@/constants/siteData";

/**
 * About Component - Extreme Compression & Mobile Redesign
 * 
 * Aesthetic: Deep Midnight DOSSIER_COMPACT
 * Goal: Zero internal scrolling, perfect single-screen fit on mobile.
 * Mobile Scaling: text-xs md:text-sm body, text-xl md:text-2xl headers.
 */
export function About() {
  return (
    <div className="h-full w-full flex flex-col bg-[#0B0C10] relative overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 bg-circuit-grid opacity-20 pointer-events-none" />

      {/* Main Content Wrapper - Centered, reduced mobile padding (no navbar collision) */}
      <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-start md:justify-center px-6 md:px-12 pt-8 pb-24 md:pb-40 max-w-6xl mx-auto overflow-y-auto no-scrollbar">
        
        <div className="w-full flex flex-col lg:flex-row gap-4 md:gap-8 lg:gap-14 items-start lg:items-center">
            
            {/* Left Column (Condensed Narrative & Philosophy) */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="flex-[1.4] space-y-4 md:space-y-6"
            >
                <div className="space-y-1">
                  <h2 className="font-display text-xl md:text-2xl lg:text-5xl font-black text-[#FACC15] uppercase italic tracking-tighter leading-none">
                    // SUBJECT_IDENTITY_FILE
                  </h2>
                  <div className="h-[1px] w-12 bg-[#FACC15]/50" />
                </div>
                
                {/* Intro & Philosophy Stack - Aggressive font scaling for mobile */}
                <div className="space-y-3 md:space-y-4">
                  <p className="font-mono text-gray-300 text-xs md:text-sm lg:text-base leading-snug border-l-2 border-[#FACC15]/30 pl-4">
                    {aboutStatus.intro}
                  </p>

                  <div className="space-y-1.5 md:space-y-2">
                    <span className="font-mono text-[#FACC15]/40 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black">
                      [ CORE_PHILOSOPHY ]
                    </span>
                    <p className="font-mono text-white/80 text-xs md:text-sm italic leading-relaxed pl-4 border-l border-white/10">
                      &quot;{aboutStatus.corePhilosophy}&quot;
                    </p>
                  </div>
                </div>
                
                {/* Current Operations - 3 Line Terminal List */}
                <div className="pt-3 md:pt-4 border-t border-[#FACC15]/10 space-y-2 md:space-y-3">
                  <div className="font-mono text-[#FACC15] text-[10px] uppercase tracking-[0.4em] mb-2 md:mb-4 opacity-80 flex items-center gap-2 font-bold">
                    [ CURRENT_OPERATIONS ]
                  </div>
                  
                  <div className="space-y-1.5 md:space-y-2 font-mono text-xs md:text-sm text-gray-400">
                    {aboutStatus.operations.map((op, i) => (
                      <p key={i} className="flex gap-2">
                        <span className="text-[#FACC15] font-black shrink-0 tracking-tighter uppercase leading-tight">
                          &gt; {op.label}:
                        </span>
                        <span className="leading-tight">{op.value}</span>
                      </p>
                    ))}
                  </div>
                </div>
            </motion.div>

            {/* Right Column (Compact Metrics & Action) */}
            <motion.div
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="w-full lg:w-80 space-y-2 md:space-y-3"
            >
                <div className="bg-[#11131A] border border-[#FACC15]/20 p-3 md:p-5 rounded-lg space-y-4 md:space-y-6 font-mono shadow-2xl">
                    {/* 01_EDUCATION_DATA */}
                    <div className="space-y-1 md:space-y-2">
                        <span className="text-[9px] md:text-[10px] text-[#FACC15]/40 tracking-widest uppercase block font-bold">01_EDUCATION_DATA</span>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 md:gap-y-1 text-[10px] md:text-xs">
                          <span className="text-gray-500">GPA:</span>
                          <span className="text-white font-bold text-right italic">9.16</span>
                          <span className="text-gray-500">JEE:</span>
                          <span className="text-white font-bold text-right italic">99%ile</span>
                          <span className="text-gray-500">MATH:</span>
                          <span className="text-white font-bold text-right italic">97%ile</span>
                        </div>
                    </div>

                    {/* SYSTEM_DIAGNOSTICS */}
                    <div className="pt-3 md:pt-4 border-t border-white/5 space-y-1 md:space-y-2">
                        <span className="text-[9px] md:text-[10px] text-[#FACC15]/40 tracking-widest uppercase block font-bold">SYSTEM_DIAGNOSTICS</span>
                        <div className="grid grid-cols-2 gap-4 text-[9px] md:text-[10px]">
                            <div>
                                <p className="text-gray-600 uppercase mb-0.5">Uplink</p>
                                <p className="text-white font-bold uppercase tracking-tighter italic">STABLE</p>
                            </div>
                            <div>
                                <p className="text-gray-600 uppercase mb-0.5">Enc</p>
                                <p className="text-[#FACC15] font-bold tracking-tighter">AES-256</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* The Resume Button - High Contrast Action Call */}
                <a 
                    href={siteConfig.experience.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-2 md:py-4 bg-[#FACC15] text-black text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all hover:bg-white active:scale-95 shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                >
                    [ EXTRACT_RESUME.PDF ]
                </a>
            </motion.div>
        </div>
      </div>

    </div>
  );
}
