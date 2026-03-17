import { useEffect, useRef, useState } from "react";
import "./Hero.css";

const ROLES = [
  "quant developer",
  "ml engineer",
  "startup builder",
  "algo trader",
  "problem solver",
];

export default function Hero() {
  var [roleIndex, setRoleIndex] = useState(0);
  var [displayed, setDisplayed] = useState("");
  var [deleting,  setDeleting]  = useState(false);
  var [visible,   setVisible]   = useState(false);
  var timeoutRef = useRef(null);

  useEffect(function() {
    var t = setTimeout(function() { setVisible(true); }, 80);
    return function() { clearTimeout(t); };
  }, []);

  useEffect(function() {
    var current = ROLES[roleIndex];
    if (!deleting && displayed.length < current.length) {
      timeoutRef.current = setTimeout(function() {
        setDisplayed(current.slice(0, displayed.length + 1));
      }, 65);
    } else if (!deleting && displayed.length === current.length) {
      timeoutRef.current = setTimeout(function() { setDeleting(true); }, 2400);
    } else if (deleting && displayed.length > 0) {
      timeoutRef.current = setTimeout(function() {
        setDisplayed(current.slice(0, displayed.length - 1));
      }, 38);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIndex(function(i) { return (i + 1) % ROLES.length; });
    }
    return function() { clearTimeout(timeoutRef.current); };
  }, [displayed, deleting, roleIndex]);

  return (
    <section className="hero" id="home">

      {/* Research paper header bar */}
      <div className={"hero__header-bar " + (visible ? "hero__header-bar--visible" : "")}>
        <div className="container hero__header-inner">
          <span className="hero__header-doc">
            <span className="hero__header-label">RESEARCH NOTE</span>
            <span className="hero__header-sep">·</span>
            <span className="hero__header-id">AG-{new Date().getFullYear()}-001</span>
          </span>
          <span className="hero__header-status">
            <span className="hero__status-dot" />
            AVAILABLE FOR OPPORTUNITIES
          </span>
          <span className="hero__header-loc">Pune, INDIA</span>
        </div>
      </div>

      <div className="container hero__body">

        {/* Large serif name — like a research paper byline */}
        <div className={"hero__byline " + (visible ? "hero__byline--visible" : "")}>
          <span className="hero__byline-text">Subject:</span>
        </div>

        <h1 className={"hero__name floating-element ag-interact " + (visible ? "hero__name--visible" : "")} style={{ transitionDuration: '0.1s', transformStyle: 'preserve-3d' }}>
          <span className="hero__name-layer" style={{ transform: 'translateZ(40px)' }}>
            <em className="hero__name-em">Adarsh</em>
          </span>
          <br/>
          <span className="hero__name-layer" style={{ transform: 'translateZ(20px)' }}>
            <span className="hero__name-plain">Agarwala</span>
          </span>
        </h1>

        {/* Divider rule like a research paper */}
        <div className={"hero__rule " + (visible ? "hero__rule--visible" : "")} />

        {/* Typewriter role */}
        <div className={"hero__role " + (visible ? "hero__role--visible" : "")}>
          <span className="hero__role-prefix">Classification: </span>
          <span className="hero__role-value">
            {displayed}
            <span className="hero__cursor" />
          </span>
        </div>

        {/* Antigravity Glass Dashboard */}
        <div className={"hero__dashboard glass-card floating-element ag-interact " + (visible ? "hero__dashboard--visible" : "")} style={{ transitionDuration: '0.1s' }}>
          
          {/* Abstract */}
          <div className="hero__abstract">
            <div className="hero__abstract-label">Abstract</div>
            <p className="hero__abstract-text">
              Student, builder, and someone who figures things out.
              Currently working at the intersection of quantitative finance,
              machine learning, and startup building. I code anything.
              I take responsibility. I do not stop.
            </p>
          </div>

          {/* Keywords */}
          <div className="hero__keywords">
            <span className="hero__keywords-label">Keywords:</span>
            {["Algo Trading", "ML / AI", "Competitive Programming", "Startups", "Mumbai"].map(function(kw) {
              return <span key={kw} className="hero__keyword">{kw}</span>;
            })}
          </div>

          {/* CTAs */}
          <div className="hero__ctas">
            <a href="#grind" className="hero__cta hero__cta--primary floating-element">
              Read the grind log
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#contact" className="hero__cta hero__cta--ghost floating-element">
              Get in touch →
            </a>
          </div>

        </div>

      </div>

      {/* Big italic watermark */}
      <div className="hero__watermark" aria-hidden="true">
        <em>builder.</em>
      </div>

    </section>
  );
}