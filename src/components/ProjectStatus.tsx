import React from "react";

interface ProjectStatusProps {
  status: string;
}

/**
 * ProjectStatus Badge
 * 
 * A terminal-themed status indicator with a pulsing dot.
 * Used in both the ProjectsLedger (home) and ProjectPage (deep-dive).
 */
export function ProjectStatus({ status }: ProjectStatusProps) {
  return (
    <div className="status-badge font-data" aria-label={`Research status: ${status}`}>
      <span className="status-dot" aria-hidden="true" />
      {status}
    </div>
  );
}
