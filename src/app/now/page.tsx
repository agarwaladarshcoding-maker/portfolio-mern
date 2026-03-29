import React from "react";
import connectDB from "@/lib/db";
import Now from "@/models/Now";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "@/components/Grind.css";
import { CANONICAL_NOW } from "@/lib/now-content";

export const metadata = {
  title: "Now | Adarsh Agarwala",
  description: "What Adarsh Agarwala is building, learning, and thinking about right now.",
};

/**
 * NowPage — Server Component
 *
 * Fetches latest content from MongoDB. On DB failure or when no document
 * exists, falls back to the shared CANONICAL_NOW default (same content
 * shown in the admin panel pre-fill).
 */
export default async function NowPage() {
  let nowDoc = null;

  try {
    await connectDB();
    nowDoc = await Now.findOne().sort({ lastUpdated: -1 }).lean();
  } catch (error) {
    console.warn("Database connection or query failed:", error);
  }

  const timestamp = nowDoc
    ? new Date(nowDoc.lastUpdated).toISOString().replace("T", " ").replace(/\.\d+Z/, " UTC")
    : new Date().toISOString().replace("T", " ").replace(/\.\d+Z/, " UTC");

  const content = nowDoc?.content ?? CANONICAL_NOW;

  return (
    <article style={{ paddingBottom: "5rem", paddingTop: "3rem" }}>
      <h1
        className="hero-title font-heading"
        style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", marginBottom: "0.5rem" }}
      >
        What I&apos;m doing now.
      </h1>

      <div className="font-data" style={{ color: "var(--accent)", marginBottom: "3rem", fontSize: "0.9rem" }}>
        &gt; LAST_UPDATED: {timestamp}
      </div>

      <div className="markdown-render">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </article>
  );
}
