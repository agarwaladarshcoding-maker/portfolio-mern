// ============================================================
// NeuralLoader.jsx — The Opening Statement
// ============================================================
// This is the first thing visitors see. It runs for ~3.5 seconds,
// makes a bold impression, then fades out to reveal the portfolio.
//
// WHAT IT RENDERS:
//   A canvas-based animation of a neural network assembling itself:
//   1. Nodes appear at random positions (with slight grid-snap)
//   2. Edges form between nearby nodes with a traveling pulse
//   3. A progress percentage counts up
//   4. A status line types out: "INITIALIZING SYSTEMS..."
//   5. Fade to black, then onComplete() fires
//
// PERFORMANCE NOTES:
//   - Uses requestAnimationFrame for smooth 60fps rendering
//   - Canvas 2D (not WebGL) — universally supported, simpler
//   - All objects are plain arrays (no React state in render loop)
//   - Cleanup on unmount prevents memory leaks
// ============================================================

import { useEffect, useRef, useCallback } from "react";
import "./NeuralLoader.css";

// ── Configuration Constants ───────────────────────────────
const CONFIG = {
  NODE_COUNT: 60,           // Total nodes to spawn
  MAX_EDGE_DISTANCE: 160,   // Max distance (px) for two nodes to connect
  NODE_SPAWN_INTERVAL: 60,  // ms between each node appearing
  ANIMATION_DURATION: 3500, // ms total before onComplete fires
  ACCENT_COLOR: "#00FF94",
  DIM_COLOR: "#00ff9430",
  BG_COLOR: "#080808",
  NODE_RADIUS: 2.5,
  PULSE_SPEED: 2.5,         // px per frame along edge
};

// ── NeuralLoader Component ────────────────────────────────
const NeuralLoader = ({ onComplete }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // We store animation state in refs (not React state) because:
  // - Refs don't trigger re-renders
  // - The animation loop reads/writes them many times per second
  // - React state updates are batched and async — wrong tool here
  const nodesRef     = useRef([]);
  const edgesRef     = useRef([]);
  const pulsesRef    = useRef([]);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  const progressRef  = useRef(0);

  // --- createNode ---
  // Returns a node object with position, opacity, and spawn timing
  const createNode = useCallback((index, canvasWidth, canvasHeight) => {
    // Grid-snap with jitter — makes it feel structured but organic
    const gridSize = 80;
    const cols = Math.floor(canvasWidth / gridSize);
    const rows = Math.floor(canvasHeight / gridSize);

    const col = Math.floor(Math.random() * cols);
    const row = Math.floor(Math.random() * rows);

    return {
      id: index,
      // Snap to grid + random jitter within cell
      x: col * gridSize + gridSize / 2 + (Math.random() - 0.5) * 40,
      y: row * gridSize + gridSize / 2 + (Math.random() - 0.5) * 40,
      opacity: 0,               // Starts invisible, fades in
      targetOpacity: Math.random() * 0.5 + 0.5,  // 50-100% final opacity
      spawnTime: index * CONFIG.NODE_SPAWN_INTERVAL, // Staggered spawn
      radius: CONFIG.NODE_RADIUS + Math.random() * 1.5,
      pulsePhase: Math.random() * Math.PI * 2, // Random pulse phase offset
    };
  }, []);

  // --- buildEdges ---
  // After nodes are spawned, compute which nodes are close enough to connect
  const buildEdges = useCallback((nodes) => {
    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.MAX_EDGE_DISTANCE) {
          edges.push({
            from: nodes[i],
            to: nodes[j],
            distance: dist,
            // Opacity scales inversely with distance — closer = more visible
            opacity: 1 - dist / CONFIG.MAX_EDGE_DISTANCE,
            drawn: false,        // Has this edge appeared yet?
            drawProgress: 0,     // 0-1, how much of this line is drawn
          });
        }
      }
    }
    return edges;
  }, []);

  // --- The main draw loop ---
  const draw = useCallback((ctx, canvas, elapsed) => {
    // Progress is 0-1 over the animation duration
    const progress = Math.min(elapsed / CONFIG.ANIMATION_DURATION, 1);
    progressRef.current = progress;

    // --- Clear canvas with slight trail effect ---
    // Instead of ctx.clearRect (instant wipe), we paint a
    // semi-transparent background. This creates motion blur /
    // trail on moving elements like pulses.
    ctx.fillStyle = `${CONFIG.BG_COLOR}CC`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const nodes = nodesRef.current;
    const edges = edgesRef.current;

    // --- Update & draw nodes ---
    nodes.forEach((node) => {
      // Fade in based on elapsed time vs spawn time
      if (elapsed >= node.spawnTime) {
        node.opacity = Math.min(
          node.opacity + 0.04,
          node.targetOpacity
        );
      }

      if (node.opacity <= 0) return;

      // Outer glow ring
      const glow = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, node.radius * 6
      );
      glow.addColorStop(0, `${CONFIG.ACCENT_COLOR}${Math.floor(node.opacity * 60).toString(16).padStart(2, "0")}`);
      glow.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 6, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${CONFIG.ACCENT_COLOR}${Math.floor(node.opacity * 255).toString(16).padStart(2, "0")}`;
      ctx.fill();
    });

    // --- Update & draw edges ---
    // Edges appear gradually as progress increases
    const edgeRevealThreshold = progress * edges.length;

    edges.forEach((edge, index) => {
      if (index > edgeRevealThreshold) return; // Not yet revealed

      // Animate draw progress (line grows from from→to)
      if (edge.drawProgress < 1) {
        edge.drawProgress = Math.min(edge.drawProgress + 0.025, 1);
      }

      const startOpacity = Math.min(edge.from.opacity, edge.to.opacity);
      if (startOpacity <= 0) return;

      const endX = edge.from.x + (edge.to.x - edge.from.x) * edge.drawProgress;
      const endY = edge.from.y + (edge.to.y - edge.from.y) * edge.drawProgress;

      // Edge line
      ctx.beginPath();
      ctx.moveTo(edge.from.x, edge.from.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = `${CONFIG.ACCENT_COLOR}${Math.floor(edge.opacity * startOpacity * 80).toString(16).padStart(2, "0")}`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Spawn a traveling pulse along this edge occasionally
      if (edge.drawProgress >= 1 && Math.random() < 0.003) {
        pulsesRef.current.push({
          edge,
          t: 0,          // 0 = at 'from' node, 1 = at 'to' node
          opacity: 0.9,
        });
      }
    });

    // --- Draw & update pulses ---
    pulsesRef.current = pulsesRef.current.filter((pulse) => {
      pulse.t += CONFIG.PULSE_SPEED / pulse.edge.distance;
      pulse.opacity -= 0.012;

      if (pulse.t >= 1 || pulse.opacity <= 0) return false; // Remove

      const x = pulse.edge.from.x + (pulse.edge.to.x - pulse.edge.from.x) * pulse.t;
      const y = pulse.edge.from.y + (pulse.edge.to.y - pulse.edge.from.y) * pulse.t;

      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `${CONFIG.ACCENT_COLOR}${Math.floor(pulse.opacity * 255).toString(16).padStart(2, "0")}`;
      ctx.fill();

      return true;
    });

  }, []);

  // --- Animation loop ---
  const animate = useCallback((timestamp) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    draw(ctx, canvas, elapsed);

    if (elapsed < CONFIG.ANIMATION_DURATION + 500) {
      animFrameRef.current = requestAnimationFrame(animate);
    }
  }, [draw]);

  // --- Setup ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas to actual pixel dimensions (not CSS dimensions)
    // WHY? On Retina/HiDPI screens, CSS pixels != device pixels.
    // Without this, the canvas looks blurry.
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr); // Scale context to match device pixel ratio

    // Initialize nodes
    nodesRef.current = Array.from({ length: CONFIG.NODE_COUNT }, (_, i) =>
      createNode(i, rect.width, rect.height)
    );

    // Build edges between nearby nodes
    edgesRef.current = buildEdges(nodesRef.current);

    // Start the animation loop
    animFrameRef.current = requestAnimationFrame(animate);

    // Fire onComplete after the animation duration
    const timer = setTimeout(() => {
      onComplete?.();
    }, CONFIG.ANIMATION_DURATION);

    return () => {
      // Cleanup: cancel animation frame and timer on unmount
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      clearTimeout(timer);
    };
  }, [animate, createNode, buildEdges, onComplete]);

  return (
    <div ref={containerRef} className="neural-loader">
      {/* The canvas fills the entire viewport */}
      <canvas ref={canvasRef} className="neural-loader__canvas" />

      {/* Overlay UI — sits above the canvas */}
      <div className="neural-loader__overlay">

        {/* Top-left system identifier */}
        <div className="neural-loader__sys-id">
          <span className="neural-loader__label">SYS</span>
          <span className="neural-loader__value">PORTFOLIO_v1.0</span>
        </div>

        {/* Center: animated status text */}
        <div className="neural-loader__center">
          <div className="neural-loader__status-line">
            <span className="neural-loader__dot" />
            INITIALIZING NEURAL SUBSTRATE
          </div>
          <div className="neural-loader__subtext">
            MAPPING CONNECTIONS_
          </div>
        </div>

        {/* Bottom: progress bar */}
        <div className="neural-loader__footer">
          <div className="neural-loader__progress-bar">
            <div className="neural-loader__progress-fill" />
          </div>
          <div className="neural-loader__footer-labels">
            <span>NODES ACTIVE</span>
            <span className="neural-loader__percent">—</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralLoader;