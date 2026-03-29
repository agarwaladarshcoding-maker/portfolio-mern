import React from "react";
import { cookies } from "next/headers";
import { loginAdmin, submitGrindPost, updateNowPage, logoutAdmin, broadcastUpdate } from "./actions";
import Now from "@/models/Now";
import Subscriber from "@/models/Subscriber";
import connectDB from "@/lib/db";
import { CANONICAL_NOW } from "@/lib/now-content";
import "@/components/Grind.css";

// metadata inherited

/**
 * AdminPage — Server Component
 */
export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;

  /* ── AUTH GATE ──────────────────────────────────────────── */
  if (session !== "authenticated") {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <form action={loginAdmin} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "320px" }}>
          <div>
            <h1 className="font-heading" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>System Auth</h1>
            <p className="font-data" style={{ fontSize: "0.8rem", color: "var(--fg-muted)" }}>
              Enter master key to access command center.
            </p>
          </div>
          <input
            type="password"
            name="password"
            placeholder="[MASTER_KEY]"
            required
            autoFocus
            style={{
              background: "var(--background)",
              border: "none",
              borderBottom: "2px solid var(--border)",
              color: "var(--foreground)",
              padding: "0.8rem 0",
              fontFamily: "var(--font-mono)",
              fontSize: "1rem",
              outline: "none",
              width: "100%",
            }}
          />
          <button type="submit" className="btn-archive font-data" style={{ padding: "0.8rem 1.5rem", alignSelf: "flex-start" }}>
            &gt; AUTHENTICATE()
          </button>
        </form>
      </div>
    );
  }

  /* ── DATA FETCHING ──────────────────────────────────────── */
  let currentNowText = CANONICAL_NOW;
  let subscriberStats = { total: 0, verified: 0 };

  try {
    await connectDB();
    
    const nowDoc = await Now.findOne().sort({ lastUpdated: -1 }).lean();
    if (nowDoc?.content) {
      currentNowText = nowDoc.content as string;
    }

    const total = await Subscriber.countDocuments();
    const verified = await Subscriber.countDocuments({ verified: true });
    subscriberStats = { total, verified };
  } catch (err) {
    console.warn("DB connection failed in AdminPage:", err);
  }

  /* ── COMMAND CENTER ─────────────────────────────────────── */
  return (
    <div style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
      <div style={{ marginBottom: "3rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="hero-title font-heading" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "0.3rem" }}>
            Command Center
          </h1>
          <div className="font-data" style={{ fontSize: "0.8rem", color: "var(--accent)" }}>
            &gt; SESSION_ACTIVE — admin authenticated
          </div>
        </div>
        <form action={logoutAdmin}>
          <button type="submit" className="font-data" style={{
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--fg-muted)",
            padding: "0.5rem 1rem",
            fontSize: "0.78rem",
            letterSpacing: "0.05em",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}>
            &gt; LOGOUT()
          </button>
        </form>
      </div>

      {/* Stats Dashboard */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
        <section className="grind-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem' }}>
          <div className="font-data" style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', marginBottom: '1rem' }}>NETWORK_STATS()</div>
          <div style={{ display: 'flex', gap: '3rem' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>{subscriberStats.total}</div>
              <div className="font-data" style={{ fontSize: '0.65rem', opacity: 0.6 }}>TOTAL_SUBS</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>{subscriberStats.verified}</div>
              <div className="font-data" style={{ fontSize: '0.65rem', color: 'var(--accent)', opacity: 0.8 }}>VERIFIED</div>
            </div>
          </div>
          {subscriberStats.total > 0 && (
            <div style={{ marginTop: '1.5rem', height: '4px', background: '#222', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--accent)', width: `${(subscriberStats.verified / subscriberStats.total) * 100}%` }} />
            </div>
          )}
        </section>

        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--accent)', padding: '1.5rem', opacity: 0.8 }}>
          <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>⚠️</span>
          <p className="font-data" style={{ fontSize: '0.75rem', margin: 0, lineHeight: 1.5 }}>
            <span style={{ color: 'var(--accent)' }}>SYSTEM_ALERT:</span> Direct broadcast relays are active. Verification tokens are forced for all inbound traffic. No invalid addresses allowed.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem", maxWidth: "800px" }}>

        {/* ── GRIND LOG FORM ──────────────────────────────── */}
        <section className="grind-container">
          <h2 className="font-heading" style={{ color: "var(--accent)", marginBottom: "0.5rem", fontSize: "1.4rem" }}>
            Push Grind Log
          </h2>
          <p className="font-data" style={{ fontSize: "0.8rem", color: "var(--fg-muted)", marginBottom: "1.5rem" }}>
            Markdown supported. Tags are comma-separated.
          </p>

          <form action={submitGrindPost} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ flex: "0 0 120px" }}>
                <label className="admin-label font-data">Day #</label>
                <input name="dayCount" type="number" min="1" placeholder="70" required className="admin-input" />
              </div>
              <div style={{ flex: "1 1 200px" }}>
                <label className="admin-label font-data">Title</label>
                <input name="title" type="text" placeholder="What I grinded on..." required className="admin-input" />
              </div>
            </div>
            <div>
              <label className="admin-label font-data">Tags</label>
              <input name="tags" type="text" placeholder="HFT, C++, algorithms" className="admin-input" />
            </div>
            <div>
              <label className="admin-label font-data">Body (Markdown)</label>
              <textarea
                name="body"
                placeholder={"## What I did today\n\n- Built X\n- Fixed Y\n\n## Learnings\n\n..."}
                required
                rows={10}
                className="admin-input"
                style={{ resize: "vertical", lineHeight: 1.6 }}
              />
            </div>
            <button type="submit" className="btn-archive font-data" style={{ alignSelf: "flex-start", padding: "0.7rem 1.5rem" }}>
              &gt; EXECUTE_INSERT()
            </button>
          </form>
        </section>

        {/* ── NOW PAGE UPDATER ────────────────────────────── */}
        <section className="grind-container">
          <h2 className="font-heading" style={{ color: "var(--accent)", marginBottom: "0.5rem", fontSize: "1.4rem" }}>
            Update /now
          </h2>
          <p className="font-data" style={{ fontSize: "0.8rem", color: "var(--fg-muted)", marginBottom: "1.5rem" }}>
            Full Markdown content.
          </p>
          <form action={updateNowPage} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <textarea
              key={currentNowText.slice(0, 40)}
              name="content"
              defaultValue={currentNowText}
              required
              rows={15}
              className="admin-input"
              style={{ resize: "vertical", lineHeight: 1.6, fontFamily: "var(--font-mono)" }}
            />
            <button type="submit" className="btn-archive font-data" style={{ alignSelf: "flex-start", padding: "0.7rem 1.5rem" }}>
              &gt; COMMIT_CHANGES()
            </button>
          </form>
        </section>

        {/* ── BROADCAST SYSTEM ───────────────────────────── */}
        <section className="grind-container">
          <h2 className="font-heading" style={{ color: "var(--accent)", marginBottom: "0.5rem", fontSize: "1.4rem" }}>
            Mass Broadcast
          </h2>
          <p className="font-data" style={{ fontSize: "0.8rem", color: "var(--fg-muted)", marginBottom: "1.5rem" }}>
            Sent to all verified subscribers through Resend relay. No undo.
          </p>

          <form action={broadcastUpdate} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div>
              <label className="admin-label font-data">Subject</label>
              <input name="subject" type="text" placeholder="Update #1: We are moving to Beta" required className="admin-input" />
            </div>
            <div>
              <label className="admin-label font-data">Message (Markdown content)</label>
              <textarea
                name="message"
                placeholder="Write your email content here."
                required
                rows={10}
                className="admin-input"
                style={{ resize: "vertical", lineHeight: 1.6 }}
              />
            </div>
            <button type="submit" className="btn-archive font-data" style={{ alignSelf: "flex-start", padding: "0.7rem 1.5rem" }}>
              &gt; DISPATCH_MASS_MAIL()
            </button>
          </form>
        </section>

      </div>

      <style>{`
        .admin-label {
          display: block;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--accent);
          opacity: 0.8;
          margin-bottom: 0.4rem;
        }
        .admin-input {
          display: block;
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--border);
          color: var(--foreground);
          padding: 0.6rem 0;
          font-family: var(--font-body);
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .admin-input:focus {
          border-bottom-color: var(--accent);
        }
        textarea.admin-input {
          border: 1px solid var(--border);
          padding: 0.8rem;
        }
        textarea.admin-input:focus {
          border-color: var(--accent);
        }
      `}</style>
    </div>
  );
}
