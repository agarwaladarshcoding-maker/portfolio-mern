import { useState, useEffect, useRef } from "react";
import "./CPStats.css";

// ── Set your handles here ──────────────────────────────────
var CF_HANDLE   = "AdarshAg";   // ← replace

// ── Rank → colour ──────────────────────────────────────────
function rankColor(rank) {
  if (!rank) return "var(--ink-300)";
  var r = rank.toLowerCase();
  if (r.includes("legendary"))         return "#ff0000";
  if (r.includes("international"))     return "#ff3333";
  if (r.includes("grandmaster"))       return "#ff3333";
  if (r.includes("master"))            return "#ff8c00";
  if (r.includes("candidate"))         return "#dd44ff";
  if (r.includes("expert"))            return "#aa44ff";
  if (r.includes("specialist"))        return "#44aaff";
  if (r.includes("pupil"))             return "#77cc77";
  return "var(--ink-300)";
}

// ── Mini rating sparkline ──────────────────────────────────
function RatingGraph(props) {
  var canvasRef = useRef(null);
  var data = props.data || [];

  useEffect(function() {
    var canvas = canvasRef.current;
    if (!canvas || !data.length) return;
    var ctx = canvas.getContext("2d");
    var W = canvas.width, H = canvas.height;
    var pad = 8;

    var ratings = data.map(function(d) { return d.rating; });
    var minR = Math.min.apply(null, ratings);
    var maxR = Math.max.apply(null, ratings);
    var range = maxR - minR || 1;

    ctx.clearRect(0, 0, W, H);

    // grid lines
    ctx.strokeStyle = "rgba(45,64,88,0.6)";
    ctx.lineWidth = 0.5;
    [0.25, 0.5, 0.75].forEach(function(t) {
      var y = pad + (1 - t) * (H - pad * 2);
      ctx.beginPath();
      ctx.moveTo(pad, y);
      ctx.lineTo(W - pad, y);
      ctx.stroke();
    });

    function getX(i) { return pad + (i / (data.length - 1)) * (W - pad * 2); }
    function getY(r) { return pad + (1 - (r - minR) / range) * (H - pad * 2); }

    // fill under line
    var grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "rgba(245,166,35,0.18)");
    grad.addColorStop(1, "rgba(245,166,35,0)");
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(ratings[0]));
    data.forEach(function(d, i) { if (i > 0) ctx.lineTo(getX(i), getY(d.rating)); });
    ctx.lineTo(getX(data.length - 1), H);
    ctx.lineTo(getX(0), H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // line
    ctx.beginPath();
    ctx.strokeStyle = "rgba(245,166,35,0.9)";
    ctx.lineWidth = 1.5;
    ctx.lineJoin = "round";
    data.forEach(function(d, i) {
      if (i === 0) ctx.moveTo(getX(i), getY(d.rating));
      else ctx.lineTo(getX(i), getY(d.rating));
    });
    ctx.stroke();

    // dots for positive/negative changes
    data.forEach(function(d, i) {
      ctx.beginPath();
      ctx.arc(getX(i), getY(d.rating), 2.5, 0, Math.PI * 2);
      ctx.fillStyle = d.change >= 0 ? "#4caf7d" : "#e05c5c";
      ctx.fill();
    });

  }, [data]);

  if (!data.length) return null;

  return (
    <div className="cp-graph">
      <div className="cp-graph__header">
        <span className="cp-graph__label">rating history — last {data.length} contests</span>
        <span className="cp-graph__range">
          {Math.min.apply(null, data.map(function(d){return d.rating;}))}
          {" → "}
          {Math.max.apply(null, data.map(function(d){return d.rating;}))}
        </span>
      </div>
      <canvas ref={canvasRef} width={560} height={100} className="cp-graph__canvas" />
    </div>
  );
}

// ── Streak bar ─────────────────────────────────────────────
function StreakBar(props) {
  return (
    <div className="cp-streak">
      <div className="cp-streak__item">
        <span className="cp-streak__n">{props.current}</span>
        <span className="cp-streak__l">current streak</span>
      </div>
      <div className="cp-streak__divider" />
      <div className="cp-streak__item">
        <span className="cp-streak__n">{props.longest}</span>
        <span className="cp-streak__l">longest streak</span>
      </div>
      {props.extra != null && (
        <>
          <div className="cp-streak__divider" />
          <div className="cp-streak__item">
            <span className="cp-streak__n">{props.extra}</span>
            <span className="cp-streak__l">{props.extraLabel}</span>
          </div>
        </>
      )}
    </div>
  );
}

// ── Codeforces Activity Heatmap (GitHub-style) ─────────────
function CFActivityGrid(props) {
  var days = props.days || [];
  if (!days.length) return null;

  // Find max to scale colour intensity
  var max = 1;
  days.forEach(function(d) { if (d.count > max) max = d.count; });

  function getLevel(count) {
    if (count === 0) return 0;
    var ratio = count / max;
    if (ratio < 0.2) return 1;
    if (ratio < 0.4) return 2;
    if (ratio < 0.7) return 3;
    return 4;
  }

  // Group days into weeks (7-day columns)
  var weeks = [];
  for (var i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  var totalActive = days.filter(function(d) { return d.count > 0; }).length;

  return (
    <div className="cf-activity">
      <div className="cf-activity__header">
        <span className="cf-activity__label">practice activity — last 52 weeks</span>
        <div className="cf-activity__legend">
          <span className="cf-activity__legend-label">less</span>
          {[0,1,2,3,4].map(function(l) {
            return <div key={l} className={"cf-cell cf-cell--" + l} />;
          })}
          <span className="cf-activity__legend-label">more</span>
        </div>
      </div>
      <div className="cf-activity__grid-wrap">
        <div className="cf-grid">
          {weeks.map(function(week, wi) {
            return (
              <div key={wi} className="cf-grid__col">
                {week.map(function(day, di) {
                  return (
                    <div
                      key={di}
                      className={"cf-cell cf-cell--" + getLevel(day.count)}
                      title={day.count + " submissions on " + day.date}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div className="cf-activity__footer">
        <span className="cf-activity__total">{totalActive} active days in the last year</span>
      </div>
    </div>
  );
}

export default function CPStats() {
  var [cf,     setCF]     = useState(null);
  var [cfErr,  setCFErr]  = useState("");
  var [cfLoad, setCFLoad] = useState(true);

  useEffect(function() {
    fetch("/api/codeforces/stats?handle=" + CF_HANDLE)
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (!d.success) throw new Error(d.error);
        setCF(d.data);
      })
      .catch(function(e) { setCFErr(e.message); })
      .finally(function() { setCFLoad(false); });
  }, []);

  return (
    <div className="cp-stats" style={{ background: 'transparent', border: 'none', gap: 'var(--sp-6)' }}>

      {/* ── Codeforces ── */}
      <div className="cp-panel glass-card floating-element ag-interact" style={{ transitionDuration: '0.1s' }}>
        <div className="cp-panel__header">
          <div className="cp-panel__title-row">
            <span className="cp-panel__platform">Codeforces</span>
            <a
              href={"https://codeforces.com/profile/" + CF_HANDLE}
              target="_blank"
              rel="noopener noreferrer"
              className="cp-panel__handle"
            >
              @{CF_HANDLE} ↗
            </a>
          </div>
        </div>

        {cfLoad ? (
          <div className="cp-loading"><span /><span /><span /></div>
        ) : cfErr ? (
          <div className="cp-error">{cfErr}</div>
        ) : cf ? (
          <>
            {/* Main rating */}
            <div className="cp-main">
              <div className="cp-main__rating">
                <span className="cp-main__n">{cf.rating}</span>
                <span className="cp-main__label">current rating</span>
              </div>
              <div className="cp-main__meta">
                <div className="cp-meta-row">
                  <span className="cp-meta-label">Rank</span>
                  <span className="cp-meta-val" style={{ color: rankColor(cf.rank) }}>
                    {cf.rank}
                  </span>
                </div>
                <div className="cp-meta-row">
                  <span className="cp-meta-label">Peak rating</span>
                  <span className="cp-meta-val">{cf.maxRating}</span>
                </div>
                <div className="cp-meta-row">
                  <span className="cp-meta-label">Peak rank</span>
                  <span className="cp-meta-val" style={{ color: rankColor(cf.maxRank) }}>
                    {cf.maxRank}
                  </span>
                </div>
                <div className="cp-meta-row">
                  <span className="cp-meta-label">Contests</span>
                  <span className="cp-meta-val">{cf.contestCount}</span>
                </div>
                <div className="cp-meta-row">
                  <span className="cp-meta-label">Problems solved</span>
                  <span className="cp-meta-val">{cf.problemsSolved}</span>
                </div>
              </div>
            </div>

            {/* Rating sparkline */}
            {cf.ratingGraph && cf.ratingGraph.length > 1 && (
              <RatingGraph data={cf.ratingGraph} />
            )}

            {/* Top tags */}
            {cf.topTags && cf.topTags.length > 0 && (
              <div className="cp-tags">
                <span className="cp-tags__label">strongest topics</span>
                <div className="cp-tags__list">
                  {cf.topTags.map(function(t) {
                    return (
                      <span key={t.tag} className="cp-tag">
                        {t.tag}
                        <span className="cp-tag__count">{t.count}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Practice activity heatmap */}
            {cf.dailyActivity && cf.dailyActivity.length > 0 && (
              <CFActivityGrid days={cf.dailyActivity} />
            )}

            {/* Practice streak */}
            {cf.streak && (
              <StreakBar
                current={cf.streak.current}
                longest={cf.streak.longest}
              />
            )}
          </>
        ) : null}
      </div>

    </div>
  );
}