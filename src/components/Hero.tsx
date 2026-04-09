"use client";

import React from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { Mail, Globe, Layout, UserRoundCheck, Code } from "lucide-react";

/**
 * Hero Component - Cinematic Full-Bleed Layout
 * 
 * Aesthetic: Deep Midnight
 * Layout: Full-bleed image background with left-aligned minimal content.
 * Shading is localized to the left to ensure the face (right) remains brightly visible.
 */
export function Hero() {
  return (
    <div className="h-[100dvh] w-full snap-start snap-always relative overflow-hidden bg-[#0B0C10]">
      
      {/* 1. The Circuit Grid Background - Consistent with other sections */}
      <div className="bg-circuit-grid opacity-20" />

      {/* 2. The Cinematic Background Photo */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] ease-out scale-105"
        style={{ backgroundImage: "url('/profile2.png')" }}
      />

      {/* 3. The Gradient Overlay - Dims the grid and photo on the left for text clarity */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C10] via-[#0B0C10]/80 to-transparent z-10" />

      {/* 3. Minimal Content (z-20) */}
      <div className="relative z-20 h-full w-full flex flex-col justify-end pb-24 md:pb-32 px-8 md:px-16 lg:px-24 overflow-y-auto no-scrollbar">
        <motion.div
           initial={{ x: -30, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           transition={{ duration: 1, ease: "easeOut" }}
           className="max-w-2xl"
        >
          <span className="font-mono text-[#FACC15] text-xs md:text-sm tracking-[0.5em] uppercase mb-2 block font-bold">
            // STATUS: IDENTITY_VERIFIED
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-4 tracking-tighter italic uppercase">
            {siteConfig.name} <span className="text-[#FACC15] block md:inline text-xl md:text-2xl not-italic tracking-normal mt-2 md:mt-0 font-mono">(HE/HIM)</span>
          </h1>
          
          <div className="h-[2px] w-24 bg-[#FACC15] mb-6" />

          <h2 className="font-mono text-[#FACC15] text-lg md:text-2xl font-black tracking-widest uppercase mb-8">
            SYSTEMS & QUANT ENGINEER
          </h2>

          {/* Minimal Social Row */}
          <div className="flex gap-6 items-center">
            {[
              { icon: <Mail size={24} />, href: `mailto:${siteConfig.email}` },
              { icon: <UserRoundCheck size={24} />, href: siteConfig.socials.linkedin },
              { icon: <Layout size={24} />, href: siteConfig.socials.github },
              { icon: <Code size={24} />, href: siteConfig.socials.leetcode },
              { icon: <Globe size={24} />, href: siteConfig.socials.instagram }
            ].map((item, idx) => (
              <motion.a
                key={idx}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="text-white/60 hover:text-[#FACC15] transition-all"
              >
                {item.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Technical Border */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#FACC15] via-[#FACC15]/20 to-transparent z-30" />
    </div>
  );
}
