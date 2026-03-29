import React from "react";
import "./Console.css";
import { GithubGraph } from "./GithubGraph";

/**
 * Fetch caching definition.
 * All API variables are cached statically for 1 hour to prevent rate-limits and CORS
 * blocking on the server side SSR.
 */
const REVALIDATE = 3600;

/**
 * Parses Codeforces user rating and rank via public API.
 */

async function getCodeforcesData() {
  try {
    const res = await fetch("https://codeforces.com/api/user.info?handles=AdarshAg", { next: { revalidate: REVALIDATE } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.result?.[0] || null;
  } catch (e) {
    return null;
  }
}

async function getCodeforcesRecent() {
  try {
    // Check latest 5 submissions to find the most recent successful one
    const res = await fetch("https://codeforces.com/api/user.status?handle=AdarshAg&from=1&count=5", { next: { revalidate: REVALIDATE } });
    if (!res.ok) return null;
    const data = await res.json();
    const solved = data.result?.find((sub: any) => sub.verdict === "OK");
    return solved?.problem?.name || null;
  } catch (e) {
    return null;
  }
}

async function getLeetCodeData() {
  try {
    const res = await fetch("https://leetcode-stats-api.herokuapp.com/AdarshAgarwala", { next: { revalidate: REVALIDATE } });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

async function getLeetCodeRecent() {
  try {
    const query = `
      query { 
        recentAcSubmissionList(username: "AdarshAgarwala", limit: 1) { 
          title 
        } 
      }
    `;
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
      next: { revalidate: REVALIDATE }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.recentAcSubmissionList?.[0]?.title || null;
  } catch (e) {
    return null;
  }
}

/**
 * StatsConsole (Next.js Async Server Component)
 * 
 * Securely fetches analytics from LeetCode, Codeforces, and handles GitHub Activity Graphing 
 * without exposing client-side fetches or suffering from CORS.
 */
export async function StatsConsole() {
  const [cfData, cfRecent, lcData, lcRecent] = await Promise.all([
    getCodeforcesData(),
    getCodeforcesRecent(),
    getLeetCodeData(),
    getLeetCodeRecent()
  ]);

  const lcTotal = lcData?.totalSolved ?? 160; 
  const lcRank = lcData?.ranking ? "Top " + Math.round(lcData.ranking / 1000) + "k" : "Top 15%";
  
  const cfRating = cfData?.rating ?? 1450;
  const cfRank = cfData?.rank ?? "Specialist";
  const recentCF = cfRecent ?? "Barrier Call Simulation";

  const recentLC = lcRecent ?? "Two Sum";

  return (
    <div className="console-panel font-data">
      <div className="console-header">
        <span className="dot red"></span>
        <span className="dot yellow"></span>
        <span className="dot green"></span>
        <span className="console-title">adarsh@macbook-pro ~ % stat-fetcher --live</span>
      </div>
      <div className="console-body">
        
        <div className="console-section" style={{ marginBottom: "2rem" }}>
          <div className="console-label">&gt; GitHub.getContributionStats()</div>
          <div className="console-row" style={{ marginBottom: "0.5rem" }}>
            <div>Username: <a href="https://github.com/adarshagarwala" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}><span className="highlight">@adarshagarwala</span></a></div>
            <div>Core Focus: <span className="highlight">C++, Python, React</span></div>
          </div>
          <div className="heat-map-container" style={{ display: 'block' }}>
            <GithubGraph />
          </div>
        </div>

        <div className="console-section">
          <div className="console-label">&gt; CompetitiveProgramming.fetch()</div>
          <div className="console-grid">
            
            <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <span className="stat-plat">LeetCode</span>
              <span className="stat-user"><a href="https://leetcode.com/AdarshAgarwala" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>@AdarshAgarwala</a></span>
              <span className="stat-val highlight">{lcTotal} Solved</span>
              <span className="stat-rank">{lcRank} Global</span>
              
              <div style={{ marginTop: 'auto', paddingTop: '0.8rem', fontSize: '0.75rem', opacity: 0.8 }}>
                Latest AC:<br/>
                <span className="highlight" style={{ fontSize: '0.8rem', display: 'block', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{recentLC}</span>
              </div>
            </div>

            <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <span className="stat-plat">Codeforces</span>
              <span className="stat-user"><a href="https://codeforces.com/profile/AdarshAg" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>@AdarshAg</a></span>
              <span className="stat-val highlight">Rating: {cfRating}</span>
              <span className="stat-rank">{cfRank}</span>
              
              <div style={{ marginTop: 'auto', paddingTop: '0.8rem', fontSize: '0.75rem', opacity: 0.8 }}>
                Latest AC:<br/>
                <span className="highlight" style={{ fontSize: '0.8rem', display: 'block', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{recentCF}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
