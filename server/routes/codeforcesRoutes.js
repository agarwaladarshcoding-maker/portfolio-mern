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
      }
    });

  } catch (err) {
    console.error("[Codeforces]", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;