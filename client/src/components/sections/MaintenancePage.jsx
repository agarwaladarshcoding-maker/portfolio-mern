import { useEffect, useRef, useState } from "react";
import "./MaintenancePage.css";

/* ── Animated background dots ──────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W = (canvas.width  = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let raf;

    const PARTICLES = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (const p of PARTICLES) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,166,35,${p.alpha})`;
        ctx.fill();
      }
      // faint connecting lines
      for (let i = 0; i < PARTICLES.length; i++) {
        for (let j = i + 1; j < PARTICLES.length; j++) {
          const dx = PARTICLES[i].x - PARTICLES[j].x;
          const dy = PARTICLES[i].y - PARTICLES[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(PARTICLES[i].x, PARTICLES[i].y);
            ctx.lineTo(PARTICLES[j].x, PARTICLES[j].y);
            ctx.strokeStyle = `rgba(245,166,35,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }

    draw();

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="maint__canvas" />;
}

/* ── Blinking cursor ─────────────────────────────────────────── */
function Cursor() {
  return <span className="maint__cursor" aria-hidden="true">_</span>;
}

/* ── Animated progress bar ───────────────────────────────────── */
function ProgressBar({ percent = 72 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(percent), 400);
    return () => clearTimeout(t);
  }, [percent]);
  return (
    <div className="maint__progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">
      <div className="maint__progress-fill" style={{ width: `${width}%` }} />
      <span className="maint__progress-label">{percent}%</span>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
export default function MaintenancePage() {
  const [typed, setTyped] = useState("");
  const lines = [
    "$ initiating rebuild sequence...",
    "$ loading new features...",
    "$ polishing UI components...",
    "$ almost ready.",
  ];
  const full = lines.join("\n");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTyped(full.slice(0, i));
      i++;
      if (i > full.length) clearInterval(interval);
    }, 32);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="maint">
      <ParticleField />

      {/* radial glow */}
      <div className="maint__glow" aria-hidden="true" />

      <div className="maint__card">
        {/* top bar */}
        <div className="maint__topbar">
          <span className="maint__dot maint__dot--red" />
          <span className="maint__dot maint__dot--yellow" />
          <span className="maint__dot maint__dot--green" />
          <span className="maint__topbar-label">adarsh.dev — maintenance mode</span>
        </div>

        <div className="maint__body">
          {/* label */}
          <p className="maint__eyebrow">§ SYSTEM STATUS</p>

          {/* heading */}
          <h1 className="maint__title">
            Under<br />
            <span className="maint__title--accent">Construction</span>
          </h1>

          <p className="maint__sub">
            Building something better. Check back soon — it'll be worth the wait.
          </p>

          {/* progress */}
          <div className="maint__progress-wrap">
            <span className="maint__progress-text">Build progress</span>
            <ProgressBar percent={72} />
          </div>

          {/* terminal */}
          <div className="maint__terminal" aria-label="Build log">
            <pre className="maint__terminal-pre">
              {typed}
              {typed.length < full.length && <Cursor />}
            </pre>
          </div>

          {/* links */}
          <div className="maint__links">
            <a
              href="https://github.com/agarwaladarshcoding-maker"
              target="_blank"
              rel="noopener noreferrer"
              className="maint__link"
            >
              GitHub
            </a>
            <a
              href="mailto:adarsh@example.com"
              className="maint__link"
            >
              Contact
            </a>
          </div>
        </div>
      </div>

      <p className="maint__footer-note">
        // built with MERN · Mumbai, India · back shortly
      </p>
    </div>
  );
}
