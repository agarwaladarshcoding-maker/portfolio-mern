import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./ProjectDetail.css";

export default function ProjectDetail() {
  var id = window.location.pathname.split("/projects/")[1];

  var [project, setProject] = useState(null);
  var [loading, setLoading] = useState(true);
  var [error,   setError]   = useState("");

  useEffect(function() {
    if (!id) { setError("No project ID"); setLoading(false); return; }

    fetch("/api/projects/" + id)
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (!d.success) throw new Error(d.error || "Not found");
        setProject(d.data);
      })
      .catch(function(err) { setError(err.message); })
      .finally(function() { setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="pdetail">
      <Topbar />
      <div className="pdetail__body">
        <div className="pdetail__loading"><span /><span /><span /></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="pdetail">
      <Topbar />
      <div className="pdetail__body">
        <div className="pdetail__error">
          <div className="pdetail__error-code">404</div>
          <div className="pdetail__error-msg">{error}</div>
          <a href="/projects" className="pdetail__error-back">← Back to projects</a>
        </div>
      </div>
    </div>
  );

  if (!project) return null;

  var techStack   = Array.isArray(project.techStack) ? project.techStack : [];
  var hasMetrics  = project.metrics && Object.keys(project.metrics).length > 0;

  // Priority: longDescription > description > nothing
  var bodyContent = (project.longDescription && project.longDescription.trim())
    || (project.description && project.description.trim())
    || null;

  return (
    <div className="pdetail">
      <Topbar />

      <div className="pdetail__body">

        {/* ── Meta: category + stack ── */}
        <div className="pdetail__header-meta">
          {project.category && (
            <span className="pdetail__cat">{project.category}</span>
          )}
          {techStack.map(function(t) {
            return <span key={t} className="pdetail__tech">{t}</span>;
          })}
        </div>

        {/* ── Title ── */}
        <h1 className="pdetail__title">{project.title}</h1>

        {/* ── Tagline in amber left-border block ── */}
        {project.tagline && (
          <p className="pdetail__tagline">{project.tagline}</p>
        )}

        {/* ── Brag metrics ── */}
        {hasMetrics && (
          <div className="pdetail__metrics">
            {Object.entries(project.metrics).map(function(entry) {
              return (
                <div key={entry[0]} className="pdetail__metric">
                  <span className="pdetail__metric-val">{entry[1]}</span>
                  <span className="pdetail__metric-key">{entry[0]}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Links ── */}
        <div className="pdetail__links">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pdetail__link pdetail__link--primary"
            >
              View on GitHub ↗
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pdetail__link pdetail__link--ghost"
            >
              Live demo ↗
            </a>
          )}
        </div>

        <div className="pdetail__rule" />

        {/* ── Full write-up ── */}
        {bodyContent ? (
          <div className="pdetail__content grind-md">
            <ReactMarkdown>{bodyContent}</ReactMarkdown>
          </div>
        ) : (
          <p className="pdetail__no-content">Full write-up coming soon.</p>
        )}

        {/* ── Footer ── */}
        <div className="pdetail__footer">
          <a href="/projects" className="pdetail__footer-back">
            ← Back to all projects
          </a>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pdetail__link pdetail__link--ghost"
            >
              GitHub ↗
            </a>
          )}
        </div>

      </div>
    </div>
  );
}

function Topbar() {
  return (
    <div className="pdetail__topbar">
      <div className="container pdetail__topbar-inner">
        <a href="/projects" className="pdetail__back">← All projects</a>
        <span className="pdetail__topbar-label">PROJECT</span>
        <a href="/" className="pdetail__home">Home ↗</a>
      </div>
    </div>
  );
}