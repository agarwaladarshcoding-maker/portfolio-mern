import React from "react";
import connectDB from "@/lib/db";
import Grind from "@/models/Grind";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./Grind.css";

/**
 * GrindLatest Component (Server Component)
 * Queries the MongoDB for the single most recent Grind Log.
 */
export async function GrindLatest() {
  let latestLog = null;
  try {
    await connectDB();
    // Find highest dayCount or latest date
    latestLog = await Grind.findOne({ published: true }).sort({ date: -1 }).lean();
  } catch (error) {
    console.warn("Database connection or query failed:", error);
  }

  if (!latestLog) {
    return (
      <div className="grind-container">
        <div className="grind-header">
          <h3 className="grind-title font-heading">
            Day 0 of <span className="spin-infinity">∞</span>
          </h3>
        </div>
        <div className="grind-body font-body">
          <p>Initializing systematic routine. Connection to logging database established but no entries found.</p>
        </div>
      </div>
    );
  }

  // Define format
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }).format(new Date(latestLog.date as string | number | Date));

  return (
    <div className="grind-container">
      <div className="grind-header">
        <div className="grind-title-wrapper">
          <h3 className="grind-title font-heading">
            Day {latestLog.dayCount} of <span className="spin-infinity">∞</span>
          </h3>
          <span className="grind-date font-data">{formattedDate}</span>
        </div>
        <h4 className="grind-subtitle font-body">{latestLog.title}</h4>
        
        {latestLog.tags && latestLog.tags.length > 0 && (
          <div className="grind-tags">
            {latestLog.tags.map((tag: string, i: number) => (
              <span key={i} className="tech-badge font-data">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="grind-body font-body markdown-render">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {latestLog.body as string}
        </ReactMarkdown>
      </div>

      <div className="grind-footer">
        <a href="/grind" className="btn-archive font-data">&gt; VIEW_ARCHIVE()</a>
      </div>
    </div>
  );
}
