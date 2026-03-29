import React from "react";
import connectDB from "@/lib/db";
import Grind from "@/models/Grind";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import "@/components/Grind.css"; // Reuse styling for markdown and tags

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  let log = null;
  try {
    const { slug } = await params;
    await connectDB();
    log = await Grind.findOne({ slug }).lean();
  } catch (err) {
    console.warn("DB connection failed in generateMetadata:", err);
  }
  
  if (!log) return { title: "Not Found" };
  
  return {
    title: `Day ${log.dayCount} | The Grind`,
    description: log.title,
  };
}

export default async function GrindPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let log = null;
  
  try {
    await connectDB();
    log = await Grind.findOne({ slug, published: true }).lean();
  } catch (err) {
    console.warn("DB connection failed in GrindPost:", err);
  }

  if (!log) {
    notFound();
  }

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  }).format(new Date(log.date as Date));

  return (
    <article style={{ paddingTop: '5rem', paddingBottom: '5rem', position: 'relative', zIndex: 10 }}>
      
      {/* Breadcrumb nav */}
      <Link href="/grind" className="font-data" style={{ 
        color: 'var(--accent)', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' 
      }}>
        &lt; RETURN_ARCHIVE()
      </Link>

      <div className="grind-header">
        <h1 className="hero-title font-heading" style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>
          Day {log.dayCount}
        </h1>
        <h2 className="font-body" style={{ color: 'var(--fg-muted)', fontSize: '1.2rem', marginBottom: '1rem' }}>
          {log.title}
        </h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <span className="grind-date font-data">{formattedDate}</span>
          
          {log.tags && log.tags.length > 0 && (
            <div className="grind-tags" style={{ marginBottom: 0 }}>
              {log.tags.map((tag: string, i: number) => (
                <span key={i} className="tech-badge font-data">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grind-body font-body markdown-render" style={{ marginTop: '2rem' }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {log.body as string}
        </ReactMarkdown>
      </div>
    </article>
  );
}
