import { useState, useEffect } from "react";
import "./GrindLog.css";

function formatDate(dateStr) {
  var d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function PostCard(props) {
  var post = props.post;
  var tags = Array.isArray(post.tags) ? post.tags : [];

  return (
    <article className="gl-card">
      <div className="gl-card__index">
        <span className="gl-card__num">{post.dayNumber}</span>
        <span className="gl-card__unit">day</span>
      </div>

      <div className="gl-card__body">
        <div className="gl-card__meta">
          <span className="gl-card__date">{formatDate(post.createdAt)}</span>
          {tags.length > 0 && (
            <div className="gl-card__tags">
              {tags.map(function(t) {
                return <span key={t} className="gl-card__tag">{t}</span>;
              })}
            </div>
          )}
        </div>

        {/* Title links to single post page */}
        <a href={"/grind/" + post._id}>
          <h3 className="gl-card__title">{post.title}</h3>
        </a>

        {/* Plain truncated preview — no markdown */}
        <p className="gl-card__content">
          {post.content
            .replace(/\*\*(.+?)\*\*/g, "$1")
            .replace(/\*(.+?)\*/g, "$1")
            .replace(/#{1,6}\s+/g, "")
            .replace(/`(.+?)`/g, "$1")
            .replace(/>\s+/g, "")
            .replace(/[-*+]\s+/g, "")
            .trim()
          }
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-6)", marginTop: "var(--sp-2)" }}>
          {post.linkedInUrl && (
            <a
              href={post.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gl-card__link"
            >
              LinkedIn post ↗
            </a>
          )}
          <a href={"/grind/" + post._id} className="gl-card__link">
            Read full →
          </a>
        </div>
      </div>
    </article>
  );
}

export default function GrindLog() {
  var [posts,   setPosts]   = useState([]);
  var [loading, setLoading] = useState(true);
  var [error,   setError]   = useState("");
  var [page,    setPage]    = useState(1);
  var [hasMore, setHasMore] = useState(false);
  var [stats,   setStats]   = useState(null);
  var [filter,  setFilter]  = useState("all");
  var [allTags, setAllTags] = useState([]);
  var LIMIT = 10;

  useEffect(function() {
    fetch("/api/grind/stats")
      .then(function(r) { return r.json(); })
      .then(function(d) { if (d.success) setStats(d.data); })
      .catch(function() {});
  }, []);

  useEffect(function() {
    setLoading(true);
    fetch("/api/grind?limit=" + LIMIT + "&page=" + page)
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (!d.success) throw new Error(d.error || "Failed");
        if (page === 1) {
          setPosts(d.data);
          var tagSet = {};
          d.data.forEach(function(p) {
            if (Array.isArray(p.tags)) {
              p.tags.forEach(function(t) { tagSet[t] = true; });
            }
          });
          setAllTags(Object.keys(tagSet));
        } else {
          setPosts(function(prev) { return prev.concat(d.data); });
        }
        setHasMore(d.data.length === LIMIT);
      })
      .catch(function(err) { setError(err.message); })
      .finally(function() { setLoading(false); });
  }, [page]);

  var streak = stats ? stats.currentStreak : (posts.length > 0 ? posts[0].dayNumber : 0);

  var filteredPosts = filter === "all"
    ? posts
    : posts.filter(function(p) {
        return Array.isArray(p.tags) && p.tags.includes(filter);
      });

  return (
    <div className="grind-log">

      <div className="gl-topbar">
        <div className="container gl-topbar__inner">
          <a href="/" className="gl-back">← Back to site</a>
          <span className="gl-topbar__label">GRIND LOG</span>
          <span className="gl-topbar__id">AG-{new Date().getFullYear()}-LOG</span>
        </div>
      </div>

      <div className="container gl-body">

        <div className="gl-header">
          <div className="gl-header__left">
            <div className="gl-header__label">§ THE GRIND</div>
            <h1 className="gl-header__title">
              Day <em>{streak || "—"}</em> of infinity.
            </h1>
            <p className="gl-header__sub">Every entry. Every day. No days off.</p>
          </div>

          {stats && (
            <div className="gl-header__stats">
              <div className="gl-stat">
                <span className="gl-stat__n">{streak}</span>
                <span className="gl-stat__l">day streak</span>
              </div>
              <div className="gl-stat">
                <span className="gl-stat__n">{stats.totalPublished}</span>
                <span className="gl-stat__l">total logged</span>
              </div>
            </div>
          )}
        </div>

        <div className="gl-rule" />

        {allTags.length > 0 && (
          <div className="gl-filters">
            <button
              className={"gl-filter " + (filter === "all" ? "gl-filter--active" : "")}
              onClick={function() { setFilter("all"); }}
            >
              All
            </button>
            {allTags.map(function(tag) {
              return (
                <button
                  key={tag}
                  className={"gl-filter " + (filter === tag ? "gl-filter--active" : "")}
                  onClick={function() { setFilter(tag); }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}

        {loading && page === 1 ? (
          <div className="gl-loading"><span /><span /><span /></div>
        ) : error ? (
          <div className="gl-error">{error}</div>
        ) : filteredPosts.length === 0 ? (
          <div className="gl-empty">No entries yet.</div>
        ) : (
          <div className="gl-feed">
            {filteredPosts.map(function(post) {
              return <PostCard key={post._id} post={post} />;
            })}
          </div>
        )}

        {hasMore && !loading && filter === "all" && (
          <div className="gl-more">
            <button className="gl-more-btn" onClick={function() { setPage(function(p) { return p + 1; }); }}>
              Load more entries
            </button>
          </div>
        )}

        {loading && page > 1 && (
          <div className="gl-loading"><span /><span /><span /></div>
        )}

      </div>
    </div>
  );
}