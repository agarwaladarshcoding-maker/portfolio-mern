const express = require("express");
const router  = express.Router();

const LC_QUERY = `
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    submitStats: submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
      }
    }
    profile {
      ranking
    }
    submissionCalendar
  }
  allQuestionsCount {
    difficulty
    count
  }
}
`;

// ── Compute streak from LeetCode submission calendar ───────
// submissionCalendar is a JSON string: { "unix_timestamp": count, ... }
function computeLCStreak(calendarStr) {
  var calendar = {};
  try { calendar = JSON.parse(calendarStr); } catch(e) { return { current: 0, longest: 0, totalActiveDays: 0 }; }

  var today     = new Date();
  today.setHours(0, 0, 0, 0);
  var todayTs   = Math.floor(today.getTime() / 1000);
  var DAY       = 86400;

  // collect all active day timestamps, sorted descending
  var activeDays = Object.keys(calendar)
    .map(Number)
    .filter(function(ts) { return calendar[ts] > 0; })
    .sort(function(a, b) { return b - a });

  if (!activeDays.length) return { current: 0, longest: 0, totalActiveDays: 0 };

  // normalize all to start-of-day
  var activeDaySet = {};
  activeDays.forEach(function(ts) {
    var day = Math.floor(ts / DAY) * DAY;
    activeDaySet[day] = true;
  });

  var days = Object.keys(activeDaySet).map(Number).sort(function(a,b){ return b-a; });

  // current streak — going back from today
  var current  = 0;
  var todayDay = Math.floor(todayTs / DAY) * DAY;
  var cursor   = todayDay;
  while (activeDaySet[cursor]) {
    current++;
    cursor -= DAY;
  }
  // if today not done yet, check yesterday as start
  if (current === 0) {
    cursor = todayDay - DAY;
    while (activeDaySet[cursor]) {
      current++;
      cursor -= DAY;
    }
  }

  // longest streak
  var longest = 1;
  var temp    = 1;
  for (var i = 1; i < days.length; i++) {
    if (days[i - 1] - days[i] === DAY) {
      temp++;
      if (temp > longest) longest = temp;
    } else {
      temp = 1;
    }
  }

  return { current, longest, totalActiveDays: days.length };
}

// ── GET /api/leetcode/stats ────────────────────────────────
router.get("/stats", async function(req, res) {
  var username = req.query.username;
  if (!username) return res.status(400).json({ success: false, error: "username required" });

  try {
    var response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer":      "https://leetcode.com",
        "User-Agent":   "Mozilla/5.0",
      },
      body: JSON.stringify({ query: LC_QUERY, variables: { username } }),
    });

    if (!response.ok) throw new Error("LeetCode API " + response.status);

    var json = await response.json();
    if (!json.data || !json.data.matchedUser) throw new Error("User not found: " + username);

    var stats   = json.data.matchedUser.submitStats.acSubmissionNum;
    var totals  = json.data.allQuestionsCount;
    var rank    = json.data.matchedUser.profile.ranking;
    var calStr  = json.data.matchedUser.submissionCalendar || "{}";
    var streaks = computeLCStreak(calStr);

    function getCount(arr, diff) {
      var f = arr.find(function(x) { return x.difficulty === diff; });
      return f ? f.count : 0;
    }

    return res.json({
      success: true,
      data: {
        solved:         getCount(stats,  "All"),
        easy:           getCount(stats,  "Easy"),
        medium:         getCount(stats,  "Medium"),
        hard:           getCount(stats,  "Hard"),
        totalQ:         getCount(totals, "All"),
        ranking:        rank,
        currentStreak:  streaks.current,
        longestStreak:  streaks.longest,
        totalActiveDays:streaks.totalActiveDays,
        url:            "https://leetcode.com/" + username,
      }
    });

  } catch (err) {
    console.error("[LeetCode]", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;