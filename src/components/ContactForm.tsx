"use client";

import React, { useState } from "react";
import { coordinates } from "@/constants/siteData";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    purpose: "General_Inquiry",
    message: "",
  });

  const handleTransmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `[UPLINK] ${formData.purpose} - from ${formData.name}`;
    const body = encodeURIComponent(formData.message);
    const mailtoUrl = `mailto:agarwalaadarsh.work@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-0 border-[2px] border-[#FACC15]/20 bg-[#11131A] overflow-hidden">
      {/* LEFT PANEL: SYSTEM COORDINATES */}
      <div className="md:w-1/2 p-4 md:p-8 border-b-[2px] md:border-b-0 md:border-r-[2px] border-[#FACC15]/20 relative overflow-hidden group">
        {/* SVG Circuit Schematic Background */}
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 100H300V200H100V100Z" stroke="#FACC15" strokeWidth="1" strokeOpacity="0.3" />
            <path d="M400 50V150H600V50H400Z" stroke="#FACC15" strokeWidth="1" strokeOpacity="0.3" />
            <path d="M200 300H500V500H200V300Z" stroke="#FACC15" strokeWidth="1" strokeOpacity="0.3" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col gap-2">
          <div className="space-y-1">
            <span className="font-mono text-[9px] text-[#FACC15]/40 block tracking-widest leading-none uppercase">[ STATUS: ONLINE ]</span>
            <h3 className="font-mono text-lg font-black uppercase text-[#FACC15] tracking-tight leading-none">COORDINATES</h3>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {coordinates.slice(0, 3).map((coord, idx) => (
              <div key={idx} className="flex flex-col leading-tight">
                <span className="font-mono text-[9px] text-[#FACC15]/30 uppercase tracking-widest">
                  {coord.label}
                </span>
                <a
                  href={coord.href}
                  className="font-mono text-xs font-bold text-[#FACC15] hover:text-white transition-colors duration-150 decoration-[#FACC15]/30 hover:underline underline-offset-2 decoration-1"
                >
                  {coord.value}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: THE SECURE UPLINK */}
      <div className="md:w-1/2 p-4 md:p-8 bg-black text-[#FACC15] flex flex-col gap-4">
        <div className="space-y-1">
          <span className="font-mono text-[9px] text-[#FACC15]/50 block tracking-widest uppercase">[ SECURITY: ENCRYPTED ]</span>
          <h3 className="font-mono text-lg font-black uppercase tracking-tight">SECURE_UPLINK</h3>
        </div>

        <form onSubmit={handleTransmit} className="space-y-3">
          <div className="space-y-1">
            <label className="block font-mono text-[9px] uppercase tracking-widest text-[#FACC15]/70">NAME_ID:</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#11131A] border border-[#FACC15]/30 focus:border-[#FACC15] outline-none px-3 py-2 font-mono text-xs text-[#FACC15] placeholder:text-[#FACC15]/20"
              placeholder="ENTER..."
            />
          </div>

          <div className="space-y-1">
            <label className="block font-mono text-[9px] uppercase tracking-widest text-[#FACC15]/70">PURPOSE:</label>
            <select
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full bg-[#11131A] border border-[#FACC15]/30 focus:border-[#FACC15] outline-none px-3 py-2 font-mono text-xs text-[#FACC15] appearance-none cursor-pointer"
            >
              <option value="Quant_Research">Quant_Dev</option>
              <option value="Startup_Collab">Startup</option>
              <option value="General_Inquiry">Inquiry</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block font-mono text-[9px] uppercase tracking-widest text-[#FACC15]/70">MESSAGE:</label>
            <textarea
              required
              rows={2}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-[#11131A] border border-[#FACC15]/30 focus:border-[#FACC15] outline-none px-3 py-2 font-mono text-xs text-[#FACC15] placeholder:text-[#FACC15]/20 resize-none"
              placeholder="YOUR_MESSAGE..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#FACC15] text-black font-mono font-black text-xs uppercase tracking-[0.2em] py-3 hover:bg-white transition-colors duration-150 cursor-pointer"
          >
            [ TRANSMIT ]
          </button>
        </form>

        <div className="mt-auto pt-4 border-t border-[#FACC15]/10 flex justify-between items-center text-[8px] font-mono text-[#FACC15]/40 tracking-[0.2em]">
          <span>VER: 4.2.0_SECURE</span>
          <span>© ADARSH_AGARWALA</span>
        </div>
      </div>
    </div>
  );
};
