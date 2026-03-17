import { useState, useEffect, useRef } from "react";
import "./CPStats.css";

// ── Set your handles here ──────────────────────────────────
var CF_HANDLE   = "AdarshAg";   // ← replace
var LC_USERNAME = "AdarshAgarwala";   // ← confirm

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

export default function CPStats() {
  var [cf,     setCF]     = useState(null);
  var [lc,     setLC]     = useState(null);
  var [cfErr,  setCFErr]  = useState("");
  var [lcErr,  setLCErr]  = useState("");
  var [cfLoad, setCFLoad] = useState(true);
  var [lcLoad, setLCLoad] = useState(true);

  useEffect(function() {
    fetch("/api/codeforces/stats?handle=" + CF_HANDLE)
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (!d.success) throw new Error(d.error);
        setCF(d.data);
      })
      .catch(function(e) { setCFErr(e.message); })
      .finally(function() { setCFLoad(false); });

    fetch("/api/leetcode/stats?username=" + LC_USERNAME)
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (!d.success) throw new Error(d.error);
        setLC(d.data);
      })
      .catch(function(e) { setLCErr(e.message); })
      .finally(function() { setLCLoad(false); });
  }, []);

  return (
    <div className="cp-stats">

      {/* ── Codeforces ── */}
      <div className="cp-panel">
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
          </>
        ) : null}
      </div>

      {/* ── LeetCode ── */}
      <div className="cp-panel">
        <div className="cp-panel__header">
          <div className="cp-panel__title-row">
            <span className="cp-panel__platform">LeetCode</span>
            <a
              href={"https://leetcode.com/" + LC_USERNAME}
              target="_blank"
              rel="noopener noreferrer"
              className="cp-panel__handle"
            >
              @{LC_USERNAME} ↗
            </a>
          </div>
        </div>

        {lcLoad ? (
          <div className="cp-loading"><span /><span /><span /></div>
        ) : lcErr ? (
          <div className="cp-error">{lcErr}</div>
        ) : lc ? (
          <>
            {/* Main solved count */}
            <div className="cp-main">
              <div className="cp-main__rating">
                <span className="cp-main__n">{lc.solved}</span>
                <span className="cp-main__label">problems solved</span>
              </div>
              <div className="cp-main__meta">
                <div className="cp-meta-row">
                  <span className="cp-meta-label">Easy</span>
                  <span className="cp-meta-val cp--easy">{lc.easy}</span>
                </div>
                <div className="cp-meta-row">
                  <span className="cp-meta-label">Medium</span>
                  <span className="cp-meta-val cp--med">{lc.medium}</span>
                </div>
                <div className="cp-meta-row">
                  <span className="cp-meta-label">Hard</span>
                  <span className="cp-meta-val cp--hard">{lc.hard}</span>
                </div>
                {lc.ranking > 0 && (
                  <div className="cp-meta-row">
                    <span className="cp-meta-label">Global rank</span>
                    <span className="cp-meta-val">#{lc.ranking.toLocaleString()}</span>
                  </div>
                )}
                <div className="cp-meta-row">
                  <span className="cp-meta-label">Active days</span>
                  <span className="cp-meta-val">{lc.totalActiveDays}</span>
                </div>
              </div>
            </div>

            {/* Progress bar — solved / total */}
            <div className="cp-progress">
              <div className="cp-progress__header">
                <span className="cp-progress__label">completion</span>
                <span className="cp-progress__pct">
                  {lc.totalQ ? Math.round((lc.solved / lc.totalQ) * 100) : 0}%
                  {" of "}{lc.totalQ}
                </span>
              </div>
              <div className="cp-progress__track">
                <div
                  className="cp-progress__easy"
                  style={{ width: lc.totalQ ? (lc.easy / lc.totalQ * 100) + "%" : "0%" }}
                />
                <div
                  className="cp-progress__med"
                  style={{ width: lc.totalQ ? (lc.medium / lc.totalQ * 100) + "%" : "0%" }}
                />
                <div
                  className="cp-progress__hard"
                  style={{ width: lc.totalQ ? (lc.hard / lc.totalQ * 100) + "%" : "0%" }}
                />
              </div>
              <div className="cp-progress__legend">
                <span className="cp--easy">■ Easy {lc.easy}</span>
                <span className="cp--med">■ Medium {lc.medium}</span>
                <span className="cp--hard">■ Hard {lc.hard}</span>
              </div>
            </div>

            {/* Streak */}
            <StreakBar
              current={lc.currentStreak}
              longest={lc.longestStreak}
              extra={lc.totalActiveDays}
              extraLabel="total active days"
            />
          </>
        ) : null}
      </div>

    </div>
  );
}