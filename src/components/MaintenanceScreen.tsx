"use client";

import React from "react";

/**
 * MaintenanceScreen
 * 
 * A high-density, terminal-themed placeholder for when the site is being deployed.
 * Consistent with the "quant terminal" aesthetic of the portfolio.
 */
export function MaintenanceScreen() {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 99999,
      backgroundColor: "#000000",
      color: "#C5A059",
      fontFamily: "var(--font-mono, monospace)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      textAlign: "center",
    }}>
      <div style={{
        fontSize: "0.75rem",
        letterSpacing: "0.3em",
        marginBottom: "2rem",
        opacity: 0.6,
        textTransform: "uppercase"
      }}>
        [ SYSTEM_RECALIBRATION_IN_PROGRESS ]
      </div>

      <div style={{
        fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
        fontFamily: "var(--font-heading, serif)",
        marginBottom: "1.5rem",
        maxWidth: "600px"
      }}>
        Upgrading the Matching Engine architecture for lower latency.
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "1rem",
        fontSize: "0.8rem",
        width: "100%",
        maxWidth: "400px",
        marginBottom: "3rem",
        textAlign: "left",
        opacity: 0.8
      }}>
        <div>&gt; KERNEL_CORE:</div> <div style={{ color: "#27c93f" }}>STABLE</div>
        <div>&gt; HFT_GATEWAY:</div> <div style={{ color: "#27c93f" }}>UPGRADED</div>
        <div>&gt; RENDERING_SYS:</div> <div style={{ color: "#ffbd2e" }}>WIP</div>
        <div>&gt; DATA_MATRICES:</div> <div style={{ color: "#ffbd2e" }}>SYNCING</div>
      </div>

      <div style={{
        padding: "1rem 1.5rem",
        border: "1px solid var(--accent, #C5A059)",
        fontSize: "0.85rem",
        letterSpacing: "0.05em",
        animation: "pulse-border 2s infinite ease-in-out"
      }}>
        ESTIMATED_Uptime: T-MINUS_SOON
      </div>

      <a href="https://linkedin.com/in/adarshagarwala" target="_blank" rel="noopener" style={{
        marginTop: "3rem",
        color: "var(--accent, #C5A059)",
        textDecoration: "none",
        fontSize: "0.8rem",
        opacity: 0.5,
        borderBottom: "1px solid currentColor"
      }}>
        Follow development for updates &rarr;
      </a>

      <style>{`
        @keyframes pulse-border {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
