import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Subscriber from "@/models/Subscriber";

/**
 * GET /api/verify?token=<hex>
 * 
 * Validates the token, marks subscriber as verified, then redirects
 * to a success page.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token || token.length !== 64) {
    return new NextResponse(errorPage("Invalid or missing verification token."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  try {
    await connectDB();

    const subscriber = await Subscriber.findOne({ token });

    if (!subscriber) {
      return new NextResponse(errorPage("Token not found. It may have already been used."), {
        status: 404,
        headers: { "Content-Type": "text/html" },
      });
    }

    if (new Date() > new Date(subscriber.tokenExpires)) {
      return new NextResponse(errorPage("Verification link expired. Please subscribe again."), {
        status: 410,
        headers: { "Content-Type": "text/html" },
      });
    }

    // Mark as verified and clear the token
    subscriber.verified = true;
    subscriber.token = "";
    await subscriber.save();

    return new NextResponse(successPage(subscriber.email), {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (err) {
    console.error("Verify error:", err);
    return new NextResponse(errorPage("Server error. Please try again."), {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }
}

// ── Inline HTML responses (no redirect needed) ───────────────────────────────

function successPage(email: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Verified — Adarsh Agarwala</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { background: #0a0a0a; color: #f2f2f2; font-family: 'Courier New', monospace; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { max-width: 480px; padding: 3rem; text-align: center; border: 1px solid #2a2a2a; }
    .tag { color: #C5A059; font-size: 0.75rem; letter-spacing: 0.1em; margin-bottom: 1.5rem; }
    h1 { font-family: Georgia, serif; font-size: 2rem; margin: 0 0 1rem; }
    p { color: #888; line-height: 1.7; font-family: sans-serif; font-size: 0.95rem; }
    .check { font-size: 3rem; margin-bottom: 1rem; }
    a { color: #C5A059; }
  </style>
</head>
<body>
  <div class="card">
    <div class="check">✓</div>
    <div class="tag">[SUCCESS] EMAIL_VERIFIED</div>
    <h1>You're in.</h1>
    <p>${email} has been confirmed. You'll receive updates when something ships.<br/><br/>
    <a href="/">← Back to site</a></p>
  </div>
</body>
</html>`;
}

function errorPage(message: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Error — Adarsh Agarwala</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { background: #0a0a0a; color: #f2f2f2; font-family: 'Courier New', monospace; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { max-width: 480px; padding: 3rem; text-align: center; border: 1px solid #2a2a2a; }
    .tag { color: #C5A059; font-size: 0.75rem; letter-spacing: 0.1em; margin-bottom: 1.5rem; }
    h1 { font-family: Georgia, serif; font-size: 2rem; margin: 0 0 1rem; }
    p { color: #888; line-height: 1.7; font-family: sans-serif; }
    a { color: #C5A059; }
  </style>
</head>
<body>
  <div class="card">
    <div class="tag">[ERR] VERIFICATION_FAILED</div>
    <h1>Something went wrong.</h1>
    <p>${message}<br/><br/><a href="/">← Back to site</a></p>
  </div>
</body>
</html>`;
}
