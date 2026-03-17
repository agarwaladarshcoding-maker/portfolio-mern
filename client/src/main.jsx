// ============================================================
// main.jsx — Vite Entry Point
// ============================================================
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/globals.css";
import "./styles/animations.css";
import "./styles/grind-md.css";

createRoot(document.getElementById("root")).render(
  // StrictMode: In development, React double-invokes renders
  // and effects to help catch side effects. Has zero impact
  // on the production build.
  <StrictMode>
    <App />
  </StrictMode>
);