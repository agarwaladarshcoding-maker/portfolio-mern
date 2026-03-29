"use client";

import { useState } from "react";
import "./StartupBubble.css";

const UPDATES = [
  "Building something in stealth mode. 🤫",
  "At the intersection of AI × quantitative finance.",
  "Zero institutional backing. Just code & conviction.",
  "Expected to ship: when it's ready. 🚀",
];

type Status = "idle" | "submitting" | "success" | "error";

/**
 * StartupBubble
 *
 * A floating "coming soon" teaser widget.
 * Sits in the bottom-right corner of the screen.
 * Click to expand — shows rotating startup teasers + verified email signup.
 * Uses /api/subscribe which validates domain and sends Resend verification link.
 */
export function StartupBubble() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [msgIndex, setMsgIndex] = useState(0);

  const cycleMessage = () => setMsgIndex((i) => (i + 1) % UPDATES.length);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Check your inbox to confirm.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <>
      {/* ── Pill trigger ── */}
      <button
        onClick={() => setOpen(!open)}
        className={`bubble-trigger font-data ${open ? "bubble-trigger--open" : ""}`}
        aria-label="Startup updates — coming soon"
        title="Something's cooking"
      >
        <span className="bubble-dot" />
        <span>{open ? "×  COLLAPSE" : "🚀  SOMETHING'S COOKING"}</span>
      </button>

      {/* ── Expanded panel ── */}
      {open && (
        <div className="bubble-panel">
          {/* Header */}
          <div className="bubble-header font-data">
            <span style={{ color: "var(--accent)", letterSpacing: "0.1em", fontSize: "0.7rem" }}>
              STEALTH_MODE v0.1 — BUILD LOG
            </span>
          </div>

          {/* Rotating teaser message */}
          <div
            className="bubble-message font-heading"
            onClick={cycleMessage}
            title="Click for more"
          >
            {UPDATES[msgIndex]}
            <span className="bubble-tap font-data"> ↻</span>
          </div>

          {/* Updates list */}
          <div className="bubble-updates font-data">
            <div className="bubble-update-row">
              <span className="bubble-ok">[OK]</span>
              Concept validated with 3 potential users
            </div>
            <div className="bubble-update-row">
              <span className="bubble-ok">[OK]</span>
              Core engine architecture designed
            </div>
            <div className="bubble-update-row">
              <span className="bubble-wip">[WIP]</span>
              MVP build in progress...
            </div>
            <div className="bubble-update-row">
              <span className="bubble-pending">[SOON]</span>
              Beta launch — invite only
            </div>
          </div>

          {/* Email signup */}
          {status === "success" ? (
            <div className="bubble-success font-data">
              <div style={{ color: "var(--accent)", marginBottom: "0.3rem" }}>✓ CHECK_INBOX()</div>
              <div style={{ opacity: 0.7, fontSize: "0.82rem" }}>{message}</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bubble-form">
              <p className="bubble-cta font-body">
                Get notified when we launch. Verify your email — no fake addresses.
              </p>
              <div className="bubble-input-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") { setStatus("idle"); setMessage(""); }
                  }}
                  placeholder="your@email.com"
                  required
                  disabled={status === "submitting"}
                  className="bubble-input font-data"
                />
                <button
                  type="submit"
                  disabled={status === "submitting" || !email.trim()}
                  className="bubble-submit font-data"
                >
                  {status === "submitting" ? "..." : "→"}
                </button>
              </div>
              {status === "error" && (
                <div className="bubble-error font-data">{message}</div>
              )}
            </form>
          )}

          <div className="bubble-footer font-data">
            <span>— Adarsh Agarwala</span>
            <span style={{ opacity: 0.4 }}>Building in public. Eventually.</span>
          </div>
        </div>
      )}
    </>
  );
}
