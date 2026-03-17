import { useState, useEffect } from "react";
import "./Navbar.css";

const LINKS = [
  { label: "Home",     href: "#home"     },
  { label: "Grind",    href: "#grind"    },
  { label: "Projects", href: "#projects" },
  { label: "Skills",   href: "#skills"   },
  { label: "Contact",  href: "#contact"  },
];

function getInitialTheme() {
  var stored = localStorage.getItem("portfolio_theme");
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("portfolio_theme", theme);
}

export default function Navbar() {
  var [scrolled, setScrolled] = useState(false);
  var [active,   setActive]   = useState("home");
  var [open,     setOpen]     = useState(false);
  var [theme,    setTheme]    = useState(getInitialTheme);

  useEffect(function() { applyTheme(theme); }, [theme]);

  function toggleTheme() {
    setTheme(function(t) { return t === "dark" ? "light" : "dark"; });
  }

  useEffect(function() {
    var onScroll = function() { setScrolled(window.scrollY > 50); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return function() { window.removeEventListener("scroll", onScroll); };
  }, []);

  useEffect(function() {
    var ids = LINKS.map(function(l) { return l.href.replace("#", ""); });
    var observer = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return function() { observer.disconnect(); };
  }, []);

  return (
    <nav className={"navbar " + (scrolled ? "navbar--scrolled" : "")}>
      <div className="navbar__inner container">

        <a href="#home" className="navbar__logo">
          <span className="navbar__logo-serif">A</span>
          <span className="navbar__logo-rest">darsh</span>
          <span className="navbar__logo-dot">.</span>
        </a>

        <div className="navbar__links">
          {LINKS.map(function(link) {
            var isActive = active === link.href.replace("#", "");
            return (
              <a
                key={link.href}
                href={link.href}
                className={"navbar__link " + (isActive ? "navbar__link--active" : "")}
              >
                {link.label}
              </a>
            );
          })}
          {/* Now — links to separate page */}
          <a href="/now" className="navbar__link navbar__link--now">
            <span className="navbar__now-dot" />
            Now
          </a>
        </div>

        <div className="navbar__actions">
          <button
            className="navbar__theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? "○" : "●"}
          </button>

          <a href="/resume.pdf" download className="navbar__resume">
            Resume ↓
          </a>

          <a
            href="https://github.com/agarwaladarshcoding-maker"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__btn"
          >
            GitHub ↗
          </a>
        </div>

        <button
          className={"navbar__burger " + (open ? "navbar__burger--open" : "")}
          onClick={function() { setOpen(!open); }}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {open && (
        <div className="navbar__mobile">
          {LINKS.map(function(link) {
            return (
              <a
                key={link.href}
                href={link.href}
                className="navbar__mobile-link"
                onClick={function() { setOpen(false); }}
              >
                {link.label}
              </a>
            );
          })}
          <a href="/now" className="navbar__mobile-link" onClick={function() { setOpen(false); }}>
            Now
          </a>
          <a href="/resume.pdf" download className="navbar__mobile-link">
            Resume ↓
          </a>
        </div>
      )}
    </nav>
  );
}