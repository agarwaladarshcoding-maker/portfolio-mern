import { useState, useEffect } from "react";
import "./BackToTop.css";

export default function BackToTop() {
  var [visible, setVisible] = useState(false);

  useEffect(function() {
    var onScroll = function() {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return function() { window.removeEventListener("scroll", onScroll); };
  }, []);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      className={"btt " + (visible ? "btt--visible" : "")}
      onClick={scrollTop}
      aria-label="Back to top"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 11V3M3 7l4-4 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}