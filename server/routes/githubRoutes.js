const express = require("express");
const router  = express.Router();

// ── GitHub GraphQL query ───────────────────────────────────
const CONTRIBUTION_QUERY = `
query($username: String!) {
  user(login: $username) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {field: PUSHED_AT, direction: DESC}) {
      nodes {
        languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node { name color }
          }
        }
      }
    }
    publicRepos: repositories(privacy: PUBLIC) {
      totalCount
    }
  }
}
`;

function computeStreak(weeks) {
  var days = [];
  weeks.forEach(function(w) {
    w.contributionDays.forEach(function(d) { days.push(d); });
  });
  days.reverse();

  var currentStreak = 0;
  var longestStreak = 0;
  var tempStreak    = 0;
  var today = new Date().toISOString().slice(0, 10);
  var countingCurrent = true;

  for (var i = 0; i < days.length; i++) {
    var d = days[i];
    if (d.date > today) continue;

    if (d.contributionCount > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
      if (countingCurrent) currentStreak = tempStreak;
    } else {
      // Allow one gap for "today not yet contributed"
      if (i === 0) continue;
      countingCurrent = false;
      tempStreak = 0;
    }
  }

  return { currentStreak, longestStreak };
}

function aggregateLanguages(repos) {
  var totals = {};
  var grandTotal = 0;

  repos.forEach(function(repo) {
    if (!repo.languages || !repo.languages.edges) return;
    repo.languages.edges.forEach(function(edge) {
      var name = edge.node.name;
      totals[name] = (totals[name] || 0) + edge.size;
      grandTotal += edge.size;
    });
  });

  if (grandTotal === 0) return [];

  return Object.entries(totals)
    .sort(function(a, b) { return b[1] - a[1]; })
    .slice(0, 7)
    .map(function(entry) {
      return {
        name:    entry[0],
        percent: Math.round((entry[1] / grandTotal) * 100),
      };
    });
}

// ── GET /api/github/stats ──────────────────────────────────
router.get("/stats", async function(req, res) {
  var username = req.query.username;
  if (!username) return res.status(400).json({ success: false, error: "username required" });

  var token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({ success: false, error: "GITHUB_TOKEN not set in .env" });

  try {
    var response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Authorization": "bearer " + token,
        "Content-Type":  "application/json",
        "User-Agent":    "portfolio-app",
      },
      body: JSON.stringify({ query: CONTRIBUTION_QUERY, variables: { username } }),
    });

    if (!response.ok) throw new Error("GitHub API " + response.status);

    var json = await response.json();
    if (json.errors) throw new Error(json.errors[0].message);

    var user    = json.data.user;
    var cal     = user.contributionsCollection.contributionCalendar;
    var streaks = computeStreak(cal.weeks);
    var langs   = aggregateLanguages(user.repositories.nodes);

    return res.json({
      success: true,
      data: {
        totalThisYear: cal.totalContributions,
        totalAllTime:  cal.totalContributions,
        streak:        streaks.currentStreak,
        longestStreak: streaks.longestStreak,
        weeks:         cal.weeks,
        languages:     langs,
        publicRepos:   user.publicRepos.totalCount,
      }
    });

  } catch (err) {
    console.error("[GitHub]", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;