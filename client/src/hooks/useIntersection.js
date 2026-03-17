// ============================================================
// useIntersection.js — IntersectionObserver Hook
// ============================================================
// Used for scroll-triggered reveal animations throughout the site.
// When a section enters the viewport, we add an animation class.
//
// WHY A CUSTOM HOOK INSTEAD OF A LIBRARY?
//   The IntersectionObserver API is well-supported, fast (native
//   browser API, no JS computation), and all we need is a simple
//   "has this element entered the viewport?" boolean. A library
//   would add unnecessary bundle weight.
// ============================================================

import { useState, useEffect, useRef } from "react";

/**
 * useIntersection
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - 0-1, how much of element must be visible
 * @param {string} options.rootMargin - margin around root (like CSS margin)
 * @param {boolean} options.triggerOnce - if true, stop observing after first intersection
 * @returns {{ ref, isIntersecting }}
 */
const useIntersection = ({
  threshold = 0.15,
  rootMargin = "0px 0px -60px 0px", // Trigger slightly before element reaches bottom of viewport
  triggerOnce = true,                // Default: animate once, not every time you scroll back
} = {}) => {
  const ref = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          // If triggerOnce, disconnect after the first intersection.
          // No point continuing to observe an element that's already animated.
          if (triggerOnce) observer.disconnect();
        } else if (!triggerOnce) {
          // Only reset if we want repeat animations
          setIsIntersecting(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    // Cleanup: disconnect observer when component unmounts
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isIntersecting };
};

export default useIntersection;