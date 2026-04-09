"use client";

import { useEffect } from "react";

/**
 * ViewportLock Component
 * 
 * Applies the .lock-viewport class to the body when mounted,
 * and removes it when unmounted. Use this on the Home Page
 * to enforce the snap-scroll "Iron-Clad" architecture.
 */
export function ViewportLock() {
  useEffect(() => {
    document.body.classList.add("lock-viewport");
    return () => {
      document.body.classList.remove("lock-viewport");
    };
  }, []);

  return null;
}
