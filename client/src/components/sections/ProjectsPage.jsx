import { useState, useEffect } from "react";
import "./ProjectsPage.css";

export default function ProjectsPage() {
  var [projects, setProjects] = useState([]);
  var [loading,  setLoading]  = useState(true);
  var [error,    setError]    = useState("");
  var [filter,   setFilter]   = useState("all");
  var [allTags,  setAllTags]  = useState([]);

  useEffect(function() {
    fetch("/api/projects")
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (!d.success) throw new Error(d.error || "Failed");
        var data = d.data || [];
        setProjects(data);
        var tagSet = {};
        data.forEach(function(p) {
          if (Array.isArray(p.techStack)) {
            p.techStack.forEach(function(t) { tagSet[t] = true; });
          }
        });
        setAllTags(Object.keys(tagSet).slice(0, 10));
      })
      .catch(function(err) { setError(err.message); })
      .finally(function() { setLoading(false); });
  }, []);

  var filtered = filter === "all"
    ? projects
    : projects.filter(function(p) {
        return Array.isArray(p.techStack) && p.techStack.includes(filter);
      });

  return (
    <div className="ppage">

      <div className="ppage__topbar">
        <div className="container ppage__topbar-inner">
          <a href="/#projects" className="ppage__back">← Back to site</a>
          <span className="ppage__topbar-label">PROJECTS</span>
          <span className="ppage__topbar-id">AG-{new Date().getFullYear()}-WORK</span>
        </div>
      </div>

      <div className="container ppage__body">

        <div className="ppage__header">
          <div className="ppage__header-label">§ PROJECTS</div>
          <h1 className="ppage__title">
            Things I've<br /><em>built.</em>
          </h1>
          <p className="ppage__sub">
            All of it written from scratch. All of it shipped.
          </p>
        </div>

        <div className="ppage__rule" />

        {allTags.length > 0 && (
          <div className="ppage__filters">
            <button
              className={"ppage__filter " + (filter === "all" ? "ppage__filter--active" : "")}
              onClick={function() { setFilter("all"); }}
            >All</button>
            {allTags.map(function(t) {
              return (
                <button
                  key={t}
                  className={"ppage__filter " + (filter === t ? "ppage__filter--active" : "")}
                  onClick={function() { setFilter(t); }}
                >{t}</button>
              );
            })}
          </div>
        )}

        {loading ? (
          <div className="ppage__loading"><span /><span /><span /></div>
        ) : error ? (
          <div className="ppage__error">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="ppage__empty">No projects yet.</div>
        ) : (
          <div className="ppage__list">
            {filtered.map(function(p, i) {
              return (
                <a
                  key={p._id}
                  href={"/projects/" + p._id}
                  className="ppage__card"
                >
                  <div className="ppage__card-num">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="ppage__card-body">
                    <div className="ppage__card-top">
                      <h2 className="ppage__card-title">{p.title}</h2>
                      <span className="ppage__card-arrow">↗</span>
                    </div>
                    <p className="ppage__card-desc">
                      {p.description
                        ? p.description.slice(0, 200) + (p.description.length > 200 ? "…" : "")
                        : ""}
                    </p>
                    {Array.isArray(p.techStack) && p.techStack.length > 0 && (
                      <div className="ppage__card-stack">
                        {p.techStack.map(function(t) {
                          return <span key={t} className="ppage__card-tech">{t}</span>;
                        })}
                      </div>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}