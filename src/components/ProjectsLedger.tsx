import React from "react";
import Link from "next/link";
import { PROJECTS } from "@/lib/projects";
import "./Ledger.css";

/**
 * ProjectsLedger Component
 *
 * Displays core projects in a high-density, terminal-like spreadsheet view.
 * Each row is a link to the dedicated project deep-dive page /projects/[slug].
 * Uses CSS Flexbox to ensure exact horizontal alignment between headers and rows
 * across variable screen sizes.
 */
export function ProjectsLedger() {
  return (
    <div className="ledger-container" id="projects">
      <div className="ledger-header font-data">
        <span className="col-name">System Target</span>
        <span className="col-lang">Lang</span>
        <span className="col-metrics">Key Metrics</span>
        <span className="col-desc">Architecture / Methods</span>
      </div>
      <div className="ledger-body">
        {PROJECTS.map((proj, i) => (
          <Link href={`/projects/${proj.slug}`} key={i} className="ledger-row-link">
            <div className="ledger-row">
              <span className="col-name font-heading row-title">{proj.title}</span>
              <span className="col-lang font-data"><span className="terminal-pill">{proj.lang}</span></span>
              <span className="col-metrics font-data highlight">{proj.metrics}</span>
              <span className="col-desc font-body text-sm">{proj.desc}</span>
              <span className="col-arrow font-data">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
