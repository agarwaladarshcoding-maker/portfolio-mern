import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import connectDB from "@/lib/db";
import Subscriber from "@/models/Subscriber";
import { Resend } from "resend";

// Lazily initialize Resend to avoid build-time errors when API key is missing
const getResend = () => new Resend(process.env.RESEND_API_KEY || "dummy_key");


// ── Disposable email domain blocklist (common ones) ──────────────────────────
const BLOCKED_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "tempmail.com", "throwam.com",
  "fakeinbox.com", "sharklasers.com", "guerrillamailblock.com", "grr.la",
  "guerrillamail.info", "guerrillamail.biz", "guerrillamail.de",
  "guerrillamail.net", "guerrillamail.org", "spam4.me", "yopmail.com",
  "yopmail.fr", "cool.fr.nf", "jetable.fr.nf", "nospam.ze.tc",
  "nomail.xl.cx", "mega.zik.dj", "speed.1s.fr", "courriel.fr.nf",
  "moncourrier.fr.nf", "monemail.fr.nf", "monmail.fr.nf", "trashmail.com",
  "trashmail.at", "trashmail.io", "trashmail.me", "trashmail.net",
  "trashmail.org", "dispostable.com", "mailnull.com", "spamgourmet.com",
  "maildrop.cc", "discard.email", "spamthisplease.com", "dodgit.com",
  "spamhereplease.com", "mailnull.com", "spammotel.com", "icks.org",
]);

function isDomainBlocked(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? BLOCKED_DOMAINS.has(domain) : true;
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // ── Validation ──────────────────────────────────────────────
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const normalised = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalised)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    if (isDomainBlocked(normalised)) {
      return NextResponse.json(
        { error: "Disposable/temporary email addresses are not allowed. Use your real email." },
        { status: 400 }
      );
    }

    // ── DB ───────────────────────────────────────────────────────
    await connectDB();

    const existing = await Subscriber.findOne({ email: normalised });
    if (existing?.verified) {
      return NextResponse.json(
        { error: "This email is already subscribed and verified." },
        { status: 409 }
      );
    }

    // Generate a secure 32-byte hex token
    const token = randomBytes(32).toString("hex");
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    if (existing) {
      // Re-send verification for unverified subscriber
      existing.token = token;
      existing.tokenExpires = tokenExpires;
      await existing.save();
    } else {
      await Subscriber.create({ email: normalised, token, tokenExpires });
    }

    // ── Send verification email ──────────────────────────────────
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const verifyUrl = `${siteUrl}/api/verify?token=${token}`;

    const resend = getResend();
    const { error } = await resend.emails.send({
      from: "Adarsh Agarwala <onboarding@resend.dev>", // update after domain verification
      to: normalised,
      subject: "Verify your email — Startup Updates",
      html: `
        <div style="font-family: 'Courier New', monospace; background: #0a0a0a; color: #f2f2f2; padding: 40px; max-width: 540px;">
          <div style="color: #C5A059; font-size: 12px; letter-spacing: 0.1em; margin-bottom: 24px;">
            ADARSH-SYS v1.0 — MAIL RELAY
          </div>
          <h1 style="font-family: Georgia, serif; font-size: 28px; color: #f2f2f2; margin: 0 0 12px;">
            Confirm your subscription.
          </h1>
          <p style="color: #aaa; line-height: 1.7; margin: 0 0 32px; font-family: sans-serif; font-size: 15px;">
            You asked to receive updates on what I'm building. Before I add you to the list, 
            I need to verify this is actually you — no bots, no fake addresses.
          </p>
          <a href="${verifyUrl}" style="
            display: inline-block;
            background: #C5A059;
            color: #0a0a0a;
            padding: 14px 28px;
            text-decoration: none;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            letter-spacing: 0.05em;
            font-weight: bold;
          ">&gt; VERIFY_EMAIL()</a>
          <p style="color: #555; font-size: 12px; margin-top: 32px; font-family: monospace;">
            Link expires in 24 hours. If you didn't sign up, ignore this.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send verification email." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Verification email sent. Check your inbox." });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
