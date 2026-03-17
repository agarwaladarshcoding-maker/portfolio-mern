// ============================================================
// useGrindPosts.js — Data Hook for The Grind Timeline
// ============================================================
// Encapsulates ALL data-fetching logic for the grind section.
// The TheGrind component calls this hook and gets back
// clean, ready-to-render data — it never touches the API directly.
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { grindAPI } from "../services/api";

const useGrindPosts = () => {
  const [posts, setPosts]     = useState([]);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [activeTag, setActiveTag] = useState(null);  // Current filter tag
  const [page, setPage]       = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const POSTS_PER_PAGE = 10;

  // --- fetchStats ---
  // Fetches aggregate stats (total days, topics, etc.) once on mount.
  const fetchStats = useCallback(async () => {
    try {
      const data = await grindAPI.getStats();
      setStats(data.data);
    } catch (err) {
      console.error("Failed to fetch grind stats:", err.message);
      // Non-fatal — the timeline can still render without stats
    }
  }, []);

  // --- fetchPosts ---
  // Fetches posts with current filter/page state.
  // Called on mount and whenever tag or page changes.
  const fetchPosts = useCallback(async (tag, pageNum, append = false) => {
    try {
      setLoading(true);
      setError(null);

      const options = {
        limit: POSTS_PER_PAGE,
        page: pageNum,
        ...(tag && { tag }), // Only include tag param if a filter is active
      };

      const data = await grindAPI.getAll(options);

      setPosts((prev) =>
        append
          ? [...prev, ...data.data]  // "Load more" — append to existing
          : data.data                 // Fresh filter — replace
      );

      // If we got fewer results than the page size, we've reached the end
      setHasMore(data.data.length === POSTS_PER_PAGE);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Initial load ---
  useEffect(() => {
    fetchStats();
    fetchPosts(null, 1, false);
  }, [fetchStats, fetchPosts]);

  // --- Filter by tag ---
  const filterByTag = useCallback((tag) => {
    setActiveTag(tag);
    setPage(1);
    fetchPosts(tag, 1, false);
  }, [fetchPosts]);

  // --- Load more (pagination) ---
  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(activeTag, nextPage, true); // append=true
  }, [page, activeTag, fetchPosts]);

  return {
    posts,
    stats,
    loading,
    error,
    activeTag,
    hasMore,
    filterByTag,
    loadMore,
  };
};

export default useGrindPosts;