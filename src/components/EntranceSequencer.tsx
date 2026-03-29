"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Boot messages simulating an HFT kernel boot sequence.
 * Chosen for density and speed — each line appears in rapid succession.
 */
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
 * - Fixed to viewport, pure black, z-index 99999
 * - Fires immediately on mount with no delay
 * - All messages render in ~1.2s total (150ms interval × 8 messages)
 * - Fades out over 400ms then unmounts
 * - Sets cookie so it only runs once per session
 */
export function EntranceSequencer() {
  const [lines, setLines] = useState<string[]>([]);
  // We start 'idle' to prevent hydration mismatches, then switch to 'running' or 'done' immediately on mount.
  const [phase, setPhase] = useState<"idle" | "running" | "fading" | "done">("idle");
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    // Check if they've already seen it this session
    if (document.cookie.includes("hasSeenBootV2=true")) {
      setPhase("done");
      return;
    }

    // Mark session
    document.cookie = "hasSeenBootV2=true; path=/; max-age=86400;";
    setPhase("running");

    let index = 0;
    const INTERVAL = 130;

    const tick = () => {
      if (index < MESSAGES.length) {
        setLines((prev) => [...prev, MESSAGES[index]]);
        index++;
        timer = window.setTimeout(tick, INTERVAL);
      } else {
        window.setTimeout(() => setPhase("fading"), 300);
        window.setTimeout(() => setPhase("done"), 750);
      }
    };

    let timer = window.setTimeout(tick, 50);

    return () => window.clearTimeout(timer);
  }, []);

  if (phase === "done" || phase === "idle") return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        backgroundColor: "#000000",
        color: "#C5A059",           // --accent (dark mode copper)
        fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
        fontSize: "clamp(0.7rem, 1.5vw, 0.9rem)",
        lineHeight: 1.8,
        padding: "clamp(1.5rem, 4vw, 3rem)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        overflow: "hidden",
        pointerEvents: "none",
        // Fade transition
        opacity: phase === "fading" ? 0 : 1,
        transition: phase === "fading" ? "opacity 0.4s ease-out" : "none",
        willChange: "opacity",
      }}
    >
      {/* Optional dim header line */}
      <div style={{ opacity: 0.35, marginBottom: "1.5rem", fontSize: "0.75em", letterSpacing: "0.1em" }}>
        ADARSH-SYS v1.0 — BOOT SEQUENCE
      </div>

      {/* Lines appear one-by-one */}
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            whiteSpace: "pre",
            color: line.includes("[BOOT]") || line.includes("[STATUS]") || line.includes("[SYS]")
              ? "#C5A059"     // accent for key milestones
              : "rgba(242,242,242,0.75)", // muted white for detail lines
          }}
        >
          {line}
        </div>
      ))}

      {/* Blinking cursor at the end */}
      {phase === "running" && (
        <div style={{ marginTop: "0.25rem", animation: "blink-animation 1s step-end infinite", color: "#C5A059" }}>
          _
        </div>
      )}
    </div>
  );
}
