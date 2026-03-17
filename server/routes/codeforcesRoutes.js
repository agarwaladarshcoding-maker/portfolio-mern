 const express = require("express");
const router  = express.Router();

// ── GET /api/codeforces/stats ──────────────────────────────
// Codeforces has a fully public REST API — no token needed
router.get("/stats", async function(req, res) {
  var handle = req.query.handle;
  if (!handle) return res.status(400).json({ success: false, error: "handle required" });

  try {
    // 1. User info — rating, rank, maxRating, maxRank
    var infoRes = await fetch(
      "https://codeforces.com/api/user.info?handles=" + handle,
      { headers: { "User-Agent": "portfolio-app" } }
    );
    var infoJson = await infoRes.json();
    if (infoJson.status !== "OK") throw new Error("CF user not found: " + handle);
    var u = infoJson.result[0];

    // 2. User rating history — to compute contest count + rating graph
    var ratingRes = await fetch(
      "https://codeforces.com/api/user.rating?handle=" + handle,
      { headers: { "User-Agent": "portfolio-app" } }
    );
    var ratingJson = await ratingRes.json();
    var ratingHistory = ratingJson.status === "OK" ? ratingJson.result : [];

    // 3. User submissions — to compute problems solved + tags
    var subRes = await fetch(
      "https://codeforces.com/api/user.status?handle=" + handle + "&from=1&count=10000",
      { headers: { "User-Agent": "portfolio-app" } }
    );
    var subJson = await subRes.json();
    var submissions = subJson.status === "OK" ? subJson.result : [];

    // Count unique solved problems
    var solvedSet = {};
    var tagCount  = {};
    submissions.forEach(function(s) {
      if (s.verdict === "OK" && s.problem) {
        var key = s.problem.contestId + "_" + s.problem.index;
        solvedSet[key] = true;
        if (Array.isArray(s.problem.tags)) {
          s.problem.tags.forEach(function(tag) {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
          });
        }
      }
    });

    var problemsSolved = Object.keys(solvedSet).length;

    // Top 5 tags
    var topTags = Object.entries(tagCount)
      .sort(function(a, b) { return b[1] - a[1]; })
      .slice(0, 5)
      .map(function(e) { return { tag: e[0], count: e[1] }; });

    // Rating graph — last 20 contests
    var ratingGraph = ratingHistory.slice(-20).map(function(r) {
      return {
        contestName: r.contestName,
        rating:      r.newRating,
        change:      r.newRating - r.oldRating,
        date:        new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 10),
      };
    });

    return res.json({
      success: true,
      data: {
        handle:         u.handle,
        rating:         u.rating         || 0,
        maxRating:      u.maxRating       || 0,
        rank:           u.rank            || "unrated",
        maxRank:        u.maxRank         || "unrated",
        problemsSolved: problemsSolved,
        contestCount:   ratingHistory.length,
        topTags:        topTags,
        ratingGraph:    ratingGraph,
        avatar:         u.avatar          || "",
        url:            "https://codeforces.com/profile/" + handle,
        dailyActivity:  buildDailyActivity(submissions),
        streak:         computeStreak(submissions),
      }
    });

  } catch (err) {
    console.error("[Codeforces]", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});


// ── Build GitHub-style daily activity grid (last 52 weeks) ─
function buildDailyActivity(submissions) {
  // Aggregate any submission (not just OK) per day to match "practice" intent
  var dayMap = {};
  submissions.forEach(function(s) {
    var date = new Date(s.creationTimeSeconds * 1000)
      .toISOString().slice(0, 10);
    dayMap[date] = (dayMap[date] || 0) + 1;
  });

  // Build a 52-week grid (364 days) ending today
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var result = [];
  for (var i = 363; i >= 0; i--) {
    var d = new Date(today);
    d.setDate(d.getDate() - i);
    var key = d.toISOString().slice(0, 10);
    result.push({ date: key, count: dayMap[key] || 0 });
  }
  return result;
}

// ── Compute current and longest daily practice streak ──────
function computeStreak(submissions) {
  var practiceSet = {};
  submissions.forEach(function(s) {
    var date = new Date(s.creationTimeSeconds * 1000)
      .toISOString().slice(0, 10);
    practiceSet[date] = true;
  });

  // Sort unique dates descending
  var dates = Object.keys(practiceSet).sort().reverse();
  if (!dates.length) return { current: 0, longest: 0 };

  var today = new Date().toISOString().slice(0, 10);
  var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  // Current streak: consecutive days ending today or yesterday
  var current = 0;
  var checkDate = practiceSet[today] ? today : (practiceSet[yesterday] ? yesterday : null);
  if (checkDate) {
    var cursor = new Date(checkDate);
    while (practiceSet[cursor.toISOString().slice(0, 10)]) {
      current++;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  // Longest streak overall
  var longest = 0;
  var run = 0;
  var prev = null;
  // iterate ascending
  var asc = Object.keys(practiceSet).sort();
  asc.forEach(function(d) {
    if (!prev) { run = 1; }
    else {
      var diff = (new Date(d) - new Date(prev)) / 86400000;
      run = diff === 1 ? run + 1 : 1;
    }
    if (run > longest) longest = run;
    prev = d;
  });

  return { current: current, longest: longest };
}

module.exports = router;