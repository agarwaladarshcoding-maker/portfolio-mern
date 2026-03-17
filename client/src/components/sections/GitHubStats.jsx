import { useState, useEffect } from "react";
import "./GitHubStats.css";

// ── Replace with your actual GitHub username ───────────────
var GH_USERNAME = "agarwaladarshcoding-maker";

// ── What each thing means ──────────────────────────────────
// contribution graph  → consistency. shows you actually ship every day
// streak              → discipline. same energy as the grind log
// total contributions → volume. how much you've actually built
// top languages       → stack. what you actually use, not what you claim
// repos               → breadth. how many things you've started and shipped

function ContributionGrid(props) {
  var weeks = props.weeks || [];
  if (!weeks.length) return null;

  // find max for intensity scaling
  var max = 1;
  weeks.forEach(function(w) {
    w.contributionDays.forEach(function(d) {
      if (d.contributionCount > max) max = d.contributionCount;
    });
  });

  function getLevel(count) {
    if (count === 0) return 0;
    var ratio = count / max;
    if (ratio < 0.15) return 1;
    if (ratio < 0.4)  return 2;
    if (ratio < 0.7)  return 3;
    return 4;
  }

  return (
    <div className="gh-grid">
      {weeks.map(function(week, wi) {
        return (
          <div key={wi} className="gh-grid__col">
            {week.contributionDays.map(function(day, di) {
              return (
                <div
                  key={di}
                  className={"gh-cell gh-cell--" + getLevel(day.contributionCount)}
                  title={day.contributionCount + " contributions on " + day.date}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function StatBox(props) {
  return (
    <div className="gh-statbox">
      <span className="gh-statbox__n">{props.value}</span>
      <span className="gh-statbox__l">{props.label}</span>
    </div>
  );
}

export default function GitHubStats() {
  var [data,    setData]    = useState(null);
  var [loading, setLoading] = useState(true);
  var [error,   setError]   = useState("");

  useEffect(function() {
    // Use github-contributions-api (no auth needed for public data)
    // Fallback: use the server-side proxy we'll add to avoid CORS
    fetch("/api/github/stats?username=" + GH_USERNAME)
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (!d.success) throw new Error(d.error || "Failed to load GitHub data");
        setData(d.data);
      })
      .catch(function(err) { setError(err.message); })
      .finally(function() { setLoading(false); });
  }, []);

  if (loading) {
    return (
      <section className="ghstats section" id="github">
        <div className="container">
          <div className="section-label">GitHub</div>
          <div className="ghstats__loading"><span /><span /><span /></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="ghstats section" id="github">
        <div className="container">
          <div className="section-label">GitHub</div>
          <div className="ghstats__error">{error}</div>
        </div>
      </section>
    );
  }

  var streak        = data.streak        || 0;
  var longestStreak = data.longestStreak || 0;
  var totalThisYear = data.totalThisYear || 0;
  var totalAllTime  = data.totalAllTime  || 0;
  var weeks         = data.weeks         || [];
  var languages     = data.languages     || [];
  var repos         = data.publicRepos   || 0;

  return (
    <section className="ghstats section" id="github">
      <div className="container">

        <div className="section-label">GitHub</div>

        <div className="ghstats__header">
          <div>
            <h2 className="ghstats__title">
              Code that<br />
              <em className="ghstats__title-em">actually ships.</em>
            </h2>
            <p className="ghstats__sub">
              Every square is a day I wrote something real.
            </p>
          </div>
          <a
            href={"https://github.com/" + GH_USERNAME}
            target="_blank"
            rel="noopener noreferrer"
            className="ghstats__profile-link"
          >
            @{GH_USERNAME} ↗
          </a>
        </div>

        {/* ── Stat row ── */}
        <div className="ghstats__stats">
          <StatBox
            value={streak}
            label="current streak (days)"
          />
          <StatBox
            value={longestStreak}
            label="longest streak ever"
          />
          <StatBox
            value={totalThisYear.toLocaleString()}
            label="contributions this year"
          />
          <StatBox
            value={totalAllTime.toLocaleString()}
            label="total all time"
          />
          <StatBox
            value={repos}
            label="public repos"
          />
        </div>

        <div className="ghstats__divider" />

        {/* ── Contribution grid ── */}
        <div className="ghstats__grid-wrap">
          <div className="ghstats__grid-header">
            <span className="ghstats__grid-label">contribution activity — last 12 months</span>
            <div className="ghstats__legend">
              <span className="ghstats__legend-label">less</span>
              <div className="gh-cell gh-cell--0" />
              <div className="gh-cell gh-cell--1" />
              <div className="gh-cell gh-cell--2" />
              <div className="gh-cell gh-cell--3" />
              <div className="gh-cell gh-cell--4" />
              <span className="ghstats__legend-label">more</span>
            </div>
          </div>
          <ContributionGrid weeks={weeks} />
        </div>

        <div className="ghstats__divider" />

        {/* ── Languages ── */}
        {languages.length > 0 && (
          <div className="ghstats__langs">
            <div className="ghstats__langs-label">top languages</div>
            <div className="ghstats__langs-bar">
              {languages.map(function(lang) {
                return (
                  <div
                    key={lang.name}
                    className="ghstats__lang-segment"
                    style={{ width: lang.percent + "%" }}
                    title={lang.name + " " + lang.percent + "%"}
                  />
                );
              })}
            </div>
            <div className="ghstats__langs-list">
              {languages.map(function(lang, i) {
                return (
                  <div key={lang.name} className="ghstats__lang-item">
                    <span
                      className="ghstats__lang-dot"
                      style={{ background: LANG_COLORS[i % LANG_COLORS.length] }}
                    />
                    <span className="ghstats__lang-name">{lang.name}</span>
                    <span className="ghstats__lang-pct">{lang.percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

var LANG_COLORS = [
  "#4a9eff", "#a78bfa", "#34d399", "#fbbf24",
  "#f87171", "#60a5fa", "#c084fc", "#4ade80",
];