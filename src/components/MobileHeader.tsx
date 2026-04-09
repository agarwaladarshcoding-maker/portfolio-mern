"use client";

import React, { useState, useEffect } from "react";
import { navItems } from "@/constants/siteData";

/**
 * MobileHeader Component - CRITICAL HOTFIX
 * 
 * Enforced solid top-bar and 100% opaque full-screen overlay to prevent text bleed.
 * Slide-in from RIGHT implementation.
 */
export const MobileHeader = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Scroll lock implementation
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [isOpen]);

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* 1. Header Top-Bar - Solid background, strictly above content */}
            <header className="fixed top-0 left-0 w-full h-16 bg-[#0B0C10] z-[99998] md:hidden flex justify-between items-center px-6 border-b border-[#FACC15]/20">
                <div>
                    <span className="font-display font-black text-lg text-[#FACC15] tracking-tighter">
                       [ A.A ]
                    </span>
                </div>

                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="font-mono text-sm text-[#FACC15] uppercase tracking-widest px-2 py-1 relative z-[100000] border border-[#FACC15]/30"
                >
                    {isOpen ? "[ X ]" : "[ ... ]"}
                </button>
            </header>

            {/* 2. Full-Screen Solid Overlay - Immersion Lock */}
            <div
                className={`fixed inset-0 h-[100dvh] w-screen bg-[#0B0C10] z-[99999] flex flex-col items-center justify-center transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Visual Depth Accent */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-circuit-grid" />

                <nav className="relative z-10 flex flex-col items-center gap-10">
                    {navItems.map((item, idx) => (
                        <a
                            key={item.name}
                            href={item.href}
                            onClick={handleLinkClick}
                            className={`font-display text-4xl font-black text-[#FACC15] uppercase italic hover:text-white transition-colors tracking-tighter`}
                        >
                            {item.name}
                        </a>
                    ))}
                </nav>
                
                {/* Auth Footer */}
                <div className="absolute bottom-16 flex flex-col items-center gap-2 opacity-30">
                    <span className="font-mono text-[10px] tracking-[0.4em] uppercase">Auth: Adarsh_Agarwala</span>
                    <div className="w-24 h-[1px] bg-[#FACC15]" />
                </div>
            </div>
        </>
    );
};
