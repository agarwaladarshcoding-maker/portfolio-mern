"use client";

import { navItems } from "@/constants/siteData";
import { usePathname } from "next/navigation";

/**
 * FloatingNav Component - Phase 3.1
 * 
 * A sleek "pill" navigation bar anchored to the bottom of the screen.
 * Designed for high-contrast visibility and seamless section jumping.
 */
export const FloatingNav = () => {
  const pathname = usePathname();

  if (pathname !== "/") return null;

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] hidden md:flex items-center gap-1 sm:gap-4 bg-[#0B0C10]/80 backdrop-blur-md border border-[#FACC15]/50 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-2xl transition-all">
      {navItems.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className="text-[#FACC15] font-mono text-[10px] sm:text-xs uppercase hover:bg-[#FACC15] hover:!text-black px-2 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors duration-150"
        >
          {item.name}
        </a>
      ))}
    </nav>
  );
};
