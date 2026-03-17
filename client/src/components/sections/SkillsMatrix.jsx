import { useEffect, useRef, useState } from "react";
import "./SkillsMatrix.css";
import CPStats from "./CPStats";

var SKILLS = {
  Languages: [
    { name: "Python",     level: 95 },
    { name: "C++",        level: 90 },
    { name: "JavaScript", level: 88 },
    { name: "SQL",        level: 80 },
    { name: "JAVA",       level: 70 },
    { name: "C",          level: 80 },
    // { name: "Rust",       level: -1 },  // ← level: -1 = learning
  ],
  "Quant & Finance": [
    { name: "Algo Trading",    level: 85 },
    { name: "Options Pricing", level: 75 },
    { name: "Statistical Arb", level: 80 },
    { name: "Backtesting",     level: 88 },
    { name: "Risk Models",     level: 72 },
    { name: "Stochastic Calculus", level: -1 },
  ],
  "AI / ML": [
    { name: "Scikit Learning",      level: 78 },
    { name: "NLP",                  level: 70 },
    { name: "Reinforcement Learning", level: -1 },
  ],
  Stack: [
    { name: "React",      level: 88 },
    { name: "Node.js",    level: 85 },
    { name: "MongoDB",    level: 82 },
    { name: "Docker",     level: 70 },
    { name: "AWS",        level: 65 },
    { name: "Pandas",     level: 90 },
    { name: "Numpy",      level: 80 },
    { name: "Matplotlib", level: 80 },
    { name: "MATLAB",     level: 20 },
    // { name: "Kubernetes", level: -1 },
  ],
  Mathematics: [
    { name: "Linear Algebra",       level: 90 },
    { name: "Engineering Calculus", level: 80 },
    { name: "Integral Calculus",    level: 80 },
    // { name: "Measure Theory",       level: -1 },
  ],
};

// ── Bar — renders normally OR as a "learning" row ──────────
function Bar(props) {
  // level -1 = currently learning, show tag instead of bar
  if (props.level === -1) {
    return (
      <div className="skill-row skill-row--learning">
        <div className="skill-row__header">
          <span className="skill-row__name">{props.name}</span>
          <span className="skill-row__learning-badge">
            <span className="skill-row__learning-dot" />
            learning
          </span>
        </div>
        <div className="skill-row__track">
          <div className="skill-row__learning-fill" />
        </div>
      </div>
    );
  }

  return (
    <div className="skill-row">
      <div className="skill-row__header">
        <span className="skill-row__name">{props.name}</span>
        <span className="skill-row__num">{props.level}</span>
      </div>
      <div className="skill-row__track">
        <div
          className="skill-row__fill"
          style={{
            width: props.animate ? props.level + "%" : "0%",
            transition: props.animate
              ? "width 1s cubic-bezier(0.16,1,0.3,1)"
              : "none",
          }}
        />
      </div>
    </div>
  );
}

export default function SkillsMatrix() {
  var [active,  setActive]  = useState("Languages");
  var [animate, setAnimate] = useState(false);
  var ref = useRef(null);

  useEffect(function() {
    var ob = new IntersectionObserver(
      function(entries) {
        if (entries[0].isIntersecting) { setAnimate(true); ob.disconnect(); }
      },
      { threshold: 0.3 }
    );
    if (ref.current) ob.observe(ref.current);
    return function() { ob.disconnect(); };
  }, []);

  useEffect(function() {
    setAnimate(false);
    var t = setTimeout(function() { setAnimate(true); }, 60);
    return function() { clearTimeout(t); };
  }, [active]);

  var groups = Object.keys(SKILLS);

  return (
    <section className="skills section" id="skills" ref={ref}>
      <div className="container">

        <div className="section-label">Skills</div>

        <div className="skills__header">
          <h2 className="skills__title">
            Tools of the<br />
            <em className="skills__title-em">trade.</em>
          </h2>
          <p className="skills__subtitle">
            I figure out whatever I don't yet know.
          </p>
        </div>

        <div className="skills__layout">
          <div className="skills__sidebar">
            {groups.map(function(g) {
              return (
                <button
                  key={g}
                  className={"skills__tab " + (active === g ? "skills__tab--active" : "")}
                  onClick={function() { setActive(g); }}
                >
                  {g}
                </button>
              );
            })}

            <blockquote className="skills__quote">
              "I code anything.<br />I figure out the rest."
            </blockquote>
          </div>

          <div className="skills__bars">
            {SKILLS[active].map(function(s) {
              return (
                <Bar key={s.name} name={s.name} level={s.level} animate={animate} />
              );
            })}
          </div>
        </div>

        <CPStats />

      </div>
    </section>
  );
}