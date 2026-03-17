import { useState, useEffect } from "react";
import "./Projects.css";

var CATEGORY_LABEL = {
  "quant":    "Quant Finance",
  "ai-ml":    "AI / ML",
  "software": "Software",
};

export default function Projects() {
  var [projects,  setProjects]  = useState([]);
  var [loading,   setLoading]   = useState(true);
  var [error,     setError]     = useState("");
  var [hoveredId, setHoveredId] = useState(null);

  useEffect(function() {
    fetch("/api/projects")
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (!d.success) throw new Error(d.error || "Failed");
        setProjects(d.data || []);
      })
      .catch(function(err) { setError(err.message); })
      .finally(function() { setLoading(false); });
  }, []);

  return (
    <section className="projects section" id="projects">
      <div className="container">

        <div className="section-label">Projects</div>

        <div className="projects__header">
          <h2 className="projects__title">
            Things I've<br />
            <em className="projects__title-em">built.</em>
          </h2>
          <a href="/projects" className="projects__view-all">
            View all projects →
          </a>
        </div>

        <div className="projects__divider" />

        {loading ? (
          <div className="projects__loading"><span /><span /><span /></div>
        ) : error ? (
          <div className="projects__error">{error}</div>
        ) : projects.length === 0 ? (
          <div className="projects__empty">Projects coming soon.</div>
        ) : (
          <div className="projects__grid">
            {projects.slice(0, 6).map(function(p, i) {
              var isHovered = hoveredId === p._id;
              return (
                <a
                  key={p._id}
                  href={"/projects/" + p._id}
                  className={"project-card glass-card floating-element ag-interact " + (isHovered ? "project-card--hovered" : "")}
                  style={{ transitionDuration: '0.1s' }}
                  onMouseEnter={function() { setHoveredId(p._id); }}
                  onMouseLeave={function() { setHoveredId(null); }}
                >
                  {/* Top row */}
                  <div className="project-card__top-row">
                    <span className="project-card__num">{String(i + 1).padStart(2, "0")}</span>
                    {p.category && (
                      <span className="project-card__cat">
                        {CATEGORY_LABEL[p.category] || p.category}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="project-card__name">{p.title}</h3>

                  {/* Tagline */}
                  <p className="project-card__tagline">{p.tagline}</p>

                  {/* Spacer */}
                  <div className="project-card__spacer" />

                  {/* Tech stack */}
                  {Array.isArray(p.techStack) && p.techStack.length > 0 && (
                    <div className="project-card__stack">
                      {p.techStack.slice(0, 4).map(function(t) {
                        return <span key={t} className="project-card__tech">{t}</span>;
                      })}
                    </div>
                  )}

                  {/* Footer: hover CTA */}
                  <div className="project-card__footer">
                    <span className="project-card__cta">
                      Read case study
                      <span className="project-card__cta-arrow">→</span>
                    </span>
                    {p.githubUrl && (
                      <span className="project-card__gh">GitHub ↗</span>
                    )}
                  </div>

                  {/* Amber left border that grows on hover */}
                  <div className="project-card__accent" />
                </a>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}