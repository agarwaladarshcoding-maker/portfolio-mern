import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./GrindPost.css";

function formatDate(dateStr) {
  var d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function GrindPost() {
  // Works for both /grind/day-70 and /grind/69b270300fb...
  var slug = window.location.pathname.replace("/grind/", "");

  var [post,    setPost]    = useState(null);
  var [loading, setLoading] = useState(true);
  var [error,   setError]   = useState("");

  useEffect(function() {
    if (!slug) { setError("No post"); setLoading(false); return; }

    fetch("/api/grind/" + slug)
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (!d.success) throw new Error(d.error || "Post not found");
        setPost(d.data);

        // If URL still has MongoDB ID, redirect to clean slug URL
        if (d.data.slug && slug !== d.data.slug) {
          window.history.replaceState(null, "", "/grind/" + d.data.slug);
        }
      })
      .catch(function(err) { setError(err.message); })
      .finally(function() { setLoading(false); });
  }, [slug]);

  var tags = post && Array.isArray(post.tags) ? post.tags : [];

  return (
    <div className="gpost">

      <div className="gpost__topbar">
        <div className="container gpost__topbar-inner">
          <a href="/grind" className="gpost__back">← All entries</a>
          <span className="gpost__topbar-label">GRIND LOG</span>
          <a href="/" className="gpost__home">Home ↗</a>
        </div>
      </div>

      <div className="container gpost__body">

        {loading ? (
          <div className="gpost__loading"><span /><span /><span /></div>
        ) : error ? (
          <div className="gpost__error">
            <div className="gpost__error-code">404</div>
            <div className="gpost__error-msg">{error}</div>
            <a href="/grind" className="gpost__error-back">← Back to all entries</a>
          </div>
        ) : post ? (
          <>
            <div className="gpost__header">
              <div className="gpost__day-block">
                <span className="gpost__day-num">{post.dayNumber}</span>
                <span className="gpost__day-unit">day</span>
              </div>
              <div className="gpost__header-right">
                <span className="gpost__date">{formatDate(post.createdAt)}</span>
                {tags.length > 0 && (
                  <div className="gpost__tags">
                    {tags.map(function(tag) {
                      return <span key={tag} className="gpost__tag">{tag}</span>;
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="gpost__rule" />

            <h1 className="gpost__title">{post.title}</h1>

            <div className="gpost__content grind-md">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            <div className="gpost__footer">
              {post.linkedInUrl && (
                <a
                  href={post.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gpost__li-link"
                >
                  View LinkedIn post ↗
                </a>
              )}
              <a href="/grind" className="gpost__all-link">← Back to all entries</a>
            </div>
          </>
        ) : null}

      </div>
    </div>
  );
}