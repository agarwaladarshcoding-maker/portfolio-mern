import { useState, useEffect } from "react";
import "./TheGrind.css";

function formatDate(dateStr) {
  var d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function stripMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/>\s+/g, "")
    .replace(/[-*+]\s+/g, "")
    .trim();
}

var PREVIEW_LENGTH = 320;

export default function TheGrind() {
  var [latest,  setLatest]  = useState(null);
  var [loading, setLoading] = useState(true);
  var [error,   setError]   = useState("");
  var [stats,   setStats]   = useState(null);

  useEffect(function() {
    fetch("/api/grind/stats")
      .then(function(r) { return r.json(); })
      .then(function(d) { if (d.success) setStats(d.data); })
      .catch(function() {});
  }, []);

  useEffect(function() {
    setLoading(true);
    fetch("/api/grind?limit=1&page=1")
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (!d.success) throw new Error(d.error || "Failed");
        setLatest(d.data && d.data.length > 0 ? d.data[0] : null);
      })
      .catch(function(err) { setError(err.message); })
      .finally(function() { setLoading(false); });
  }, []);

  var streak     = latest ? latest.dayNumber : (stats ? stats.currentStreak : 0);
  var totalPosts = stats ? stats.totalPublished : 0;
  var tags       = latest && Array.isArray(latest.tags) ? latest.tags : [];

  var previewText = latest ? stripMarkdown(latest.content).slice(0, PREVIEW_LENGTH) : "";
  var isTruncated = latest && stripMarkdown(latest.content).length > PREVIEW_LENGTH;

  return (
    <section className="grind section" id="grind">
      <div className="container">

        <div className="section-label">The Grind</div>

        <div className="grind__header">
          <div className="grind__header-left">
            <h2 className="grind__title">
              Day{" "}
              <em className="grind__title-em">{streak || "—"}</em>
              {" "}of{" "}
              <span className="grind__infinity">∞</span>
              <span className="grind__dot">.</span>
            </h2>
            <p className="grind__desc">
              Public accountability log. No excuses, no days off.
            </p>
          </div>

          <div className="grind__stats">
            <div className="grind__stat">
              <span className="grind__stat-n">{streak || "—"}</span>
              <span className="grind__stat-l">day streak</span>
            </div>
            <div className="grind__stat">
              <span className="grind__stat-n">{totalPosts || "—"}</span>
              <span className="grind__stat-l">total entries</span>
            </div>
          </div>
        </div>

        <div className="grind__divider" />

        {loading ? (
          <div className="grind__loading"><span /><span /><span /></div>
        ) : error ? (
          <div className="grind__error">{error}</div>
        ) : !latest ? (
          <div className="grind__empty">The grind begins now. Check back soon.</div>
        ) : (
          <article className="grind-card grind-card--featured glass-card floating-element ag-interact" style={{ transitionDuration: '0.1s' }}>

            <div className="grind-card__badge floating-element">Latest Entry</div>

            <div className="grind-card__top">
              <div className="grind-card__day-block">
                <span className="grind-card__day-num">{latest.dayNumber}</span>
                <span className="grind-card__day-unit">day</span>
              </div>
              <div className="grind-card__meta">
                <span className="grind-card__date">{formatDate(latest.createdAt)}</span>
                {tags.length > 0 && (
                  <div className="grind-card__tags">
                    {tags.map(function(tag) {
                      return <span key={tag} className="grind-card__tag">{tag}</span>;
                    })}
                  </div>
                )}
              </div>
            </div>

            <h3 className="grind-card__title">{latest.title}</h3>

            <p className="grind-card__preview">
              {previewText}
              {isTruncated && <span className="grind-card__ellipsis">…</span>}
            </p>

            <div className="grind-card__footer">
              {latest.linkedInUrl && (
                <a
                  href={latest.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grind-card__li-link"
                >
                  View LinkedIn post ↗
                </a>
              )}
              <div className="grind-card__footer-right">
                <a href={"/grind/" + latest._id} className="grind-card__read-full">
                  Read full entry →
                </a>
                <a href="/grind" className="grind-card__view-all">
                  View all {totalPosts} entries →
                </a>
              </div>
            </div>

          </article>
        )}

      </div>
    </section>
  );
}