"use client";

import { GitHubCalendar } from 'react-github-calendar';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * GithubGraph Component (Client-Side)
 * 
 * Implements react-github-calendar to show GitHub activity.
 * Tracks local system/toggle theme context (`next-themes`) to selectively
 * swap the graph's color gradient arrays for perfect visual alignment 
 * without page refreshes.
 */
export function GithubGraph() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ minHeight: '150px' }}>Loading graph...</div>;

  const isDark = resolvedTheme === 'dark';

  // Custom theme mapping for GithubCalendar
  const explicitTheme = {
    light: ['#ebedf0', '#f6c99b', '#d99753', '#b87333', '#8a501a'],
    dark: ['#1a1a1a', '#8a6d3b', '#a5864c', '#c5a059', '#e0be7d'],
  };

  return (
    <div style={{ marginTop: '0.5rem', width: '100%', overflowX: 'auto', paddingBottom: '1rem' }}>
      <GitHubCalendar
        username="agarwaladarshcoding-maker"
        colorScheme={isDark ? "dark" : "light"}
        theme={explicitTheme}
        fontSize={12}
        blockSize={10}
        blockMargin={3}
      />
    </div>
  );
}
