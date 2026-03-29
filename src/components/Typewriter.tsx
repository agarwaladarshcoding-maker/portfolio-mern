"use client";
import { useState, useEffect } from "react";

/**
 * Typewriter Component
 * 
 * A client-side visual effect component that cycles through an array of strings.
 * It mimics an actual terminal typing effect with cursor blinks, deletion pauses,
 * and varying string speeds.
 * 
 * @param {string[]} words - Array of strings to cycle through (e.g., ["developer", "engineer"])
 * @param {number} delay - Base typing speed in milliseconds per character
 */
export function Typewriter({ words, delay = 100 }: { words: string[]; delay?: number }) {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(delay);

  useEffect(() => {
    let ticker = setTimeout(() => {
      if (!words || words.length === 0) return;
      const i = loopNum % words.length;
      const fullText = words[i];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? delay / 1.5 : delay);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(delay * 2);
      }
    }, typingSpeed);

    return () => clearTimeout(ticker);
  }, [text, isDeleting, loopNum, words, delay, typingSpeed]);

  return (
    <span className="font-data" style={{ display: "inline-block" }}>
      {text}
      <span className="cursor-blink" style={{ color: "var(--accent)" }}>_</span>
    </span>
  );
}
