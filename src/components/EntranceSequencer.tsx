"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES = [
  "[BOOT]   Loading kernel core...                        OK",
  "[MEM]    Initializing RAII memory pools...             DONE",
  "[NET]    Binding UDP multicast socket 239.0.0.1:5900  DONE",
  "[CHECK]  GBM path simulations (100k paths)...         OPTIMIZED",
  "[HW]     L1 cache miss rate tuning...                 0.4%",
  "[STATUS] HFT matching engine...                       ONLINE",
  "[ROUTE]  Order entry gateway → NY4 co-lo              CONNECTED",
  "[SYS]    AdarshAgarwala::main() starting...",
];

/**
 * EntranceSequencer
 * 
 * Rebuilt with Framer Motion for the "Linear x Bloomberg" design overhaul.
 * Features rapid, variable-speed terminal logging and a smooth slide-up exit.
 */
export function EntranceSequencer() {
  const [lines, setLines] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    
    // Skip if already seen this session
    if (typeof document !== 'undefined' && document.cookie.includes("hasSeenBootV3=true")) {
      setIsComplete(true);
      return;
    }

    // Set session cookie
    document.cookie = "hasSeenBootV3=true; path=/; max-age=86400;";

    let currentLine = 0;
    
    const showNextLine = () => {
      if (currentLine < MESSAGES.length) {
        setLines(prev => [...prev, MESSAGES[currentLine]]);
        currentLine++;
        
        // Variable rapid speed for authentic terminal feel
        const nextInterval = Math.random() * 80 + 30; // 30ms to 110ms
        setTimeout(showNextLine, nextInterval);
      } else {
        // Hold for 1.5s then trigger exit
        setTimeout(() => {
          setIsComplete(true);
        }, 1500);
      }
    };

    const initialDelay = setTimeout(showNextLine, 200);

    return () => clearTimeout(initialDelay);
  }, []);

  if (!hasMounted) return null;

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          key="boot-sequencer"
          initial={{ y: 0 }}
          exit={{ 
            y: "-100%",
            transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] } 
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "#000000",
            color: "var(--accent)",
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.7rem, 1.5vw, 0.9rem)",
            lineHeight: 1.8,
            padding: "clamp(1.5rem, 4vw, 3rem)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <div style={{ opacity: 0.35, marginBottom: "1.5rem", fontSize: "0.75em", letterSpacing: "0.1em" }}>
            ADARSH-SYS v2.0 — HFT KERNEL LOADED
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.05 }}
                style={{
                  whiteSpace: "pre",
                  color: line.includes("[BOOT]") || line.includes("[STATUS]") || line.includes("[SYS]")
                    ? "var(--accent)"
                    : "rgba(242,242,242,0.7)",
                }}
              >
                {line}
              </motion.div>
            ))}
            
            {/* Blinking cursor */}
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear", times: [0.5, 0.5] }}
              style={{ color: "var(--accent)", marginTop: "0.2rem" }}
            >
              _
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
