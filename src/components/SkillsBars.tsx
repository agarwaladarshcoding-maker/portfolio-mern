"use client";

import React, { useEffect, useState } from "react";
import "./Skills.css";

type Skill = { name: string; level: number }; // level: 0-100 or -1 for learning

const CATEGORIES: Record<string, Skill[]> = {
  "Languages": [
    { name: "C++ (11/14/17)", level: 90 },
    { name: "Python", level: 95 },
    { name: "TypeScript", level: 85 },
    { name: "Rust", level: -1 },
  ],
  "Quant / Finance": [
    { name: "Stochastic Calculus", level: -1 },
    { name: "Options Pricing (Exotics)", level: 80 },
    { name: "Market Microstructure", level: 75 },
    { name: "Portfolio Theory", level: 85 },
  ],
  "AI / ML": [
    { name: "PyTorch", level: 90 },
    { name: "Reinforcement Learning", level: -1 },
    { name: "LLM Fine-Tuning", level: 85 },
  ],
  "Stack & Math": [
    { name: "CUDA", level: -1 },
    { name: "React/Next.js", level: 95 },
    { name: "Kubernetes/Docker", level: 75 },
    { name: "Linear Algebra / Stats", level: 90 },
  ]
};

export function SkillsBars() {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    // Simple 1-time view trigger for animation
    setTimeout(() => setInView(true), 500);
  }, []);

  return (
    <div className="skills-container">
      {Object.entries(CATEGORIES).map(([cat, skills]) => (
        <div key={cat} className="skill-category">
          <h3 className="cat-title font-heading">{cat}</h3>
          <div className="skills-list font-data">
            {skills.map(s => (
              <div key={s.name} className="skill-row">
                <span className="skill-name">{s.name}</span>
                {s.level === -1 ? (
                  <span className="learning-badge">
                    <span className="indicator" style={{ marginRight: '6px' }}>
                      <span className="indicator-ring" style={{ backgroundColor: 'var(--foreground)' }}></span>
                      <span className="indicator-dot" style={{ backgroundColor: 'var(--foreground)' }}></span>
                    </span>
                    LEARNING
                  </span>
                ) : (
                  <span className="skill-track">
                    <span 
                      className="skill-bar" 
                      style={{ 
                        width: inView ? `${s.level}%` : '0%',
                        transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)"
                      }} 
                    />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
