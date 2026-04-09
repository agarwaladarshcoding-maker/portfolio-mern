"use client";

import React, { useState } from "react";
import "./contact.css";
import { sendContactEmail } from "./actions";

import { siteConfig } from "@/config/site";

const SOCIALS = [
  { label: "GitHub", handle: siteConfig.socials.githubHandle, url: siteConfig.socials.github },
  { label: "LinkedIn", handle: siteConfig.socials.linkedinHandle, url: siteConfig.socials.linkedin },
  { label: "LeetCode", handle: siteConfig.socials.leetcodeHandle, url: siteConfig.socials.leetcode },
  { label: "Codeforces", handle: siteConfig.socials.codeforcesHandle, url: siteConfig.socials.codeforces },
  { label: "Instagram", handle: siteConfig.socials.instagramHandle, url: siteConfig.socials.instagram },
  { label: "Email", handle: siteConfig.email, url: `mailto:${siteConfig.email}` },
];

/**
 * ContactPage — Client Component
 * 
 * Handles contact form submission via the sendContactEmail server action.
 * Shows terminal-style interaction statuses (TRANSMITTING..., [SUCCESS]..., [ERR]...).
 * Falls back to local mail client if system fails.
 */
export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // ── SERVER ACTION ─────────────────────────────────────────
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("subject", formData.subject);
      data.append("message", formData.message);

      const res = await sendContactEmail(data);
      if (res?.success) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.warn("Server action failed, using mailto fallback:", err);
      // ── FALLBACK ──────────────────────────────────────────────
      // If the email server is down, open the user's local mail client
      const body = `NAME: ${formData.name}\nEMAIL: ${formData.email}\n\n${formData.message}`;
      window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(body)}`;
      setStatus("sent");
    }
  };

  return (
    <div className="contact-page" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
      <div className="contact-grid">

        {/* ── Left: Info ── */}
        <aside className="contact-info">
          <h1 className="hero-title font-heading" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", marginBottom: '1.5rem' }}>
            Let&apos;s connect.
          </h1>
          <p className="font-body contact-intro" style={{ marginBottom: '3rem', fontSize: '1.1rem', lineHeight: 1.6, opacity: 0.85 }}>
            Whether you have a quant role, an interesting engineering problem, a startup idea,
            or just want to talk systems — my inbox is open.
          </p>

          <div className="socials-list" style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)' }}>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target={s.url.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="social-row font-data"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1.25rem 1rem',
                  borderBottom: '1px solid var(--border)',
                  textDecoration: 'none',
                  color: 'var(--foreground)',
                  transition: 'color 0.2s ease',
                }}
              >
                <span className="social-label" style={{ opacity: 0.6, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</span>
                <span className="social-handle" style={{ fontSize: '0.9rem' }}>{s.handle}</span>
                <span className="social-arrow" style={{ opacity: 0.4 }}>→</span>
              </a>
            ))}
          </div>
        </aside>

        {/* ── Right: Form ── */}
        <div className="contact-form-wrapper" style={{ border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
          <div className="terminal-bar font-data" style={{ padding: '0.75rem 1rem', background: 'var(--border)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span className="dot red" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
              <span className="dot yellow" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
              <span className="dot green" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
            </div>
            <span style={{ marginLeft: '1.2rem', opacity: 0.6, fontSize: "0.75rem", fontFamily: 'var(--font-mono)' }}>
              adarsh@macbook ~ % send-message
            </span>
          </div>

          <div style={{ padding: '2.5rem' }}>
            {status === "sent" ? (
              <div className="form-success font-data" style={{ border: '1px solid var(--accent)', padding: '2rem', textAlign: 'center' }}>
                <div style={{ color: "var(--accent)", fontSize: "1.2rem", marginBottom: "0.8rem", fontWeight: 'bold' }}>
                  [SUCCESS] MESSAGE_TRANSMITTED
                </div>
                <div style={{ opacity: 0.8, fontSize: "0.95rem" }}>
                  The relay acknowledged your payload. 24–48 hour response window estimated.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="field-group">
                  <label className="field-label font-data" style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.5rem', opacity: 0.8 }}>NAME</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Adarsh Agarwala"
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '0.6rem 0', color: 'var(--foreground)', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '1rem' }}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label font-data" style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.5rem', opacity: 0.8 }}>EMAIL</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@domain.com"
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '0.6rem 0', color: 'var(--foreground)', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '1rem' }}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label font-data" style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.5rem', opacity: 0.8 }}>SUBJECT</label>
                  <input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Inquiry / Quant / etc."
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '0.6rem 0', color: 'var(--foreground)', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '1rem' }}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label font-data" style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.5rem', opacity: 0.8 }}>MESSAGE</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell me what you're building..."
                    rows={5}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '1rem 0', color: 'var(--foreground)', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '1rem', resize: 'vertical', lineHeight: 1.5 }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-send font-data"
                  style={{
                    background: 'var(--accent)',
                    color: 'var(--background)',
                    border: '1px solid var(--accent)',
                    padding: '1rem 2rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    alignSelf: 'flex-start',
                    marginTop: '0.5rem',
                  }}
                >
                  {status === "sending" ? "TRANSMITTING..." : "> EXECUTE_SEND()"}
                </button>

                {status === "error" && (
                  <div style={{ color: "var(--accent)", fontSize: "0.85rem", marginTop: "1rem", fontFamily: "var(--font-mono)" }}>
                    [ERR] SYSTEM_REJECTED_MESSAGE. PLEASE RETRY OR USE EMAIL_DIRECT.
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
