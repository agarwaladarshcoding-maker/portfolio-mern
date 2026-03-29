import React from "react";
import connectDB from "@/lib/db";
import Grind from "@/models/Grind";
import Link from "next/link";
import "@/components/Grind.css"; // Reuse existing Grind CSS

// metadata inherited

export default async function GrindArchive() {
  let logs: any[] = [];
  try {
    await connectDB();
    // Sort descending to show newest first
    logs = await Grind.find({ published: true }).sort({ date: -1 }).lean();
  } catch (error) {
    console.warn("Database connection or query failed:", error);
  }

  return (
    <div style={{ paddingTop: '5rem', paddingBottom: '5rem', position: 'relative', zIndex: 10 }}>
      <h1 className="hero-title font-heading" style={{ marginBottom: '1rem' }}>The Grind</h1>
      <p className="font-body" style={{ color: 'var(--fg-muted)', marginBottom: '3rem' }}>
        Chronological archive of consistent daily systematic logging.
      </p>

      {(!logs || logs.length === 0) ? (
        <div className="font-data" style={{ color: 'var(--accent-muted)' }}>
          [SYSTEM] No logs found in the immutable ledger.
        </div>
      ) : (
        <div className="grind-archive-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {logs.map((log: any) => {
            const formattedDate = new Intl.DateTimeFormat('en-US', {
              month: 'short', day: '2-digit', year: 'numeric'
            }).format(new Date(log.date as Date));

            return (
              <Link 
                href={`/grind/${log.slug}`} 
                key={log._id.toString()}
                style={{ textDecoration: 'none' }}
              >
                <div 
                  className="grind-container hover-translate" 
                  style={{ 
                    marginTop: 0, 
                    cursor: 'pointer',
                  }}
                >
                  <div className="grind-title-wrapper" style={{ marginBottom: '0.2rem' }}>
                    <h3 className="grind-title font-heading" style={{ fontSize: '1.2rem' }}>
                      Day {log.dayCount} / <span style={{ fontFamily: 'var(--font-mono)' }}>{log.title}</span>
                    </h3>
                    <span className="grind-date font-data">{formattedDate}</span>
                  </div>
                  
                  {log.tags && log.tags.length > 0 && (
                    <div className="grind-tags" style={{ marginBottom: '0', marginTop: '0.5rem' }}>
                      {log.tags.map((tag: string, i: number) => (
                        <span key={i} className="tech-badge font-data" style={{ fontSize: '0.65rem' }}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
