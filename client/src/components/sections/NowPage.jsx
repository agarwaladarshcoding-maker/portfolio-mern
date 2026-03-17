import { useState, useEffect } from "react";
import "./NowPage.css";

export default function NowPage() {
  var [data,    setData]    = useState(null);
  var [loading, setLoading] = useState(true);

  useEffect(function() {
    fetch("/api/now")
      .then(function(r) { return r.json(); })
      .then(function(d) { if (d.success) setData(d.data); })
      .finally(function() { setLoading(false); });
  }, []);

  var building    = data?.building    || [];
  var learning    = data?.learning    || [];
  var reading     = data?.reading     || [];
  var thinking    = data?.thinking    || "";
  var location    = data?.location    || "Mumbai, India";
  var lastUpdated = data?.lastUpdated || "";
  var instagram   = data?.instagram   || "";
  var isEmpty     = !loading && !building.length && !learning.length && !reading.length && !thinking;

  return (
    <div className="now">

      {/* ── Topbar ── */}
      <div className="now__topbar">
        <div className="container now__topbar-inner">
          <a href="/" className="now__back">← Back to site</a>
          <span className="now__topbar-label">NOW</span>
          {lastUpdated
            ? <span className="now__topbar-date">Updated {lastUpdated}</span>
            : <span className="now__topbar-date" />
          }
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="now__hero">
        <div className="container now__hero-inner">
          <div className="now__hero-left">
            <div className="now__eyebrow">
              <span className="now__pulse" />
              <span>Live snapshot · {lastUpdated || "updated monthly"}</span>
            </div>
            <h1 className="now__title">
              Right now,<br />
              <em className="now__title-em">in {location}.</em>
            </h1>
            <p className="now__intro">
              What I'm actually working on, thinking about, and reading.
              Not a highlight reel — a real snapshot.
              Inspired by{" "}
              <a href="https://nownownow.com" target="_blank" rel="noopener noreferrer" className="now__inline-link">
                nownownow.com
              </a>.
            </p>
          </div>
          <div className="now__hero-watermark" aria-hidden="true"><em>N.</em></div>
        </div>
        <div className="now__hero-rule" />
      </div>

      <div className="container now__body">

        {loading ? (
          <div className="now__skeleton">
            <div className="now__skeleton-grid">
              {[1,2,3,4].map(function(i) {
                return (
                  <div key={i} className="now__skeleton-block">
                    <div className="now__skeleton-label" />
                    <div className="now__skeleton-line" />
                    <div className="now__skeleton-line now__skeleton-line--short" />
                    <div className="now__skeleton-line" />
                  </div>
                );
              })}
            </div>
          </div>

        ) : isEmpty ? (
          /* ── Clean "coming soon" — no admin link visible to public ── */
          <div className="now__coming-soon">
            <div className="now__coming-rule" />
            <p className="now__coming-text">
              This page is updated monthly with what I'm currently building,
              learning, and thinking about.
            </p>
            <p className="now__coming-sub">
              Check back soon — something is always in progress.
            </p>
            <a href="/#grind" className="now__coming-link">
              Read the daily grind log instead →
            </a>
          </div>

        ) : (
          <div className="now__content">

            {/* Stats row */}
            <div className="now__stats-row">
              {building.length > 0 && (
                <div className="now__stat">
                  <span className="now__stat-n">{building.length}</span>
                  <span className="now__stat-l">things building</span>
                </div>
              )}
              {learning.length > 0 && (
                <div className="now__stat">
                  <span className="now__stat-n">{learning.length}</span>
                  <span className="now__stat-l">topics learning</span>
                </div>
              )}
              {reading.length > 0 && (
                <div className="now__stat">
                  <span className="now__stat-n">{reading.length}</span>
                  <span className="now__stat-l">books reading</span>
                </div>
              )}
            </div>

            <div className="now__divider" />

            <div className="now__grid">

              {building.length > 0 && (
                <div className="now__block">
                  <div className="now__block-header">
                    <span className="now__block-icon">▸</span>
                    <span className="now__block-label">Currently building</span>
                  </div>
                  <div className="now__build-list">
                    {building.map(function(item, i) {
                      return (
                        <div key={i} className="now__build-item">
                          <div className="now__build-num">{String(i+1).padStart(2,"0")}</div>
                          <div className="now__build-body">
                            <span className="now__build-title">{item.title}</span>
                            {item.detail && <span className="now__build-detail">{item.detail}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {learning.length > 0 && (
                <div className="now__block">
                  <div className="now__block-header">
                    <span className="now__block-icon">▸</span>
                    <span className="now__block-label">Currently learning</span>
                  </div>
                  <ul className="now__learn-list">
                    {learning.map(function(item, i) {
                      return (
                        <li key={i} className="now__learn-item">
                          <span className="now__learn-dot" />
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {reading.length > 0 && (
                <div className="now__block">
                  <div className="now__block-header">
                    <span className="now__block-icon">▸</span>
                    <span className="now__block-label">Currently reading</span>
                  </div>
                  <div className="now__reading-list">
                    {reading.map(function(book, i) {
                      return (
                        <div key={i} className="now__book">
                          <span className="now__book-num">{String(i+1).padStart(2,"0")}</span>
                          <div className="now__book-body">
                            <span className="now__book-title">{book.title}</span>
                            {book.author && <span className="now__book-author">{book.author}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {thinking && (
                <div className="now__block now__block--wide">
                  <div className="now__block-header">
                    <span className="now__block-icon">▸</span>
                    <span className="now__block-label">Currently thinking about</span>
                  </div>
                  <blockquote className="now__thinking">
                    <span className="now__thinking-quote">"</span>
                    {thinking}
                    <span className="now__thinking-quote">"</span>
                  </blockquote>
                </div>
              )}

            </div>

            {instagram && (
              <>
                <div className="now__divider" />
                <div className="now__instagram">
                  <div className="now__ig-left">
                    <div className="now__ig-eyebrow">
                      <span className="now__pulse" />
                      Documenting the journey in public
                    </div>
                    <p className="now__ig-text">
                      The startup, the quant work, the daily grind — all of it on Instagram.
                      Raw, unfiltered, real.
                    </p>
                  </div>
                  <a
                    href={"https://instagram.com/" + instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="now__ig-btn"
                  >
                    Follow @{instagram} ↗
                  </a>
                </div>
              </>
            )}

          </div>
        )}
      </div>
    </div>
  );
}