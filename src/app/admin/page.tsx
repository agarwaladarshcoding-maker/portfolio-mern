import React from "react";
import Link from "next/link";

/**
 * Admin Placeholder Page
 * 
 * High-immersion terminal screen for a restricted system area.
 */
export default function AdminPage() {
  return (
    <div className="min-h-screen w-full bg-[#0B0C10] text-[#FACC15] flex items-center justify-center p-8 font-mono overflow-hidden relative">
      <div className="bg-grid-pan opacity-10" />
      
      <div className="relative z-10 w-full max-w-2xl border-[4px] border-[#FACC15] bg-black p-10 md:p-16 shadow-[0_0_50px_rgba(250,204,21,0.2)]">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-4 h-4 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
            ACCESS_DENIED
          </h1>
        </div>

        <div className="space-y-6 text-sm md:text-base leading-relaxed">
          <p className="text-[#FACC15]/80">
            [ ERROR_INFO ] : UNAUTHORIZED_UPLINK_DETECTED
          </p>
          <div className="bg-[#11131A] p-4 border border-[#FACC15]/20 font-mono text-xs md:text-sm text-red-500/80">
            &gt; IP_RECORDS_LOGGED... <br />
            &gt; SYSTEM_GATEKEEPER_ENGAGED <br />
            &gt; SECURE_UPLINK_REQUIRED_FOR_MANAGEMENT_LAYER
          </div>
          <p className="text-[#FACC15]/60 italic font-bold">
            "THIS AREA IS PROTECTED BY RSA_4096 ENCRYPTION AND BIOMETRIC AUTHENTICATION."
          </p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 bg-[#FACC15] text-black text-center py-4 font-black uppercase tracking-widest text-xs hover:bg-white transition-colors cursor-pointer"
          >
            [ ← RETURN_TO_CIVIL_SPACE ]
          </Link>
          <div className="flex-1 border-2 border-[#FACC15]/40 text-[#FACC15]/40 text-center py-4 font-black uppercase tracking-widest text-[10px] cursor-not-allowed">
            [ INITIATE_OVERRIDE_V2.1 ]
          </div>
        </div>

        <div className="mt-8 text-[8px] md:text-[10px] text-[#FACC15]/30 flex justify-between uppercase tracking-[0.3em]">
          <span>STATUS: LOCKED</span>
          <span>AUTH_SERVER: OFFLINE</span>
        </div>
      </div>
    </div>
  );
}
