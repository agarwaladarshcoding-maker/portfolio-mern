import { GbmCanvas } from "@/components/GbmCanvas";
import { Typewriter } from "@/components/Typewriter";
import { ProjectsLedger } from "@/components/ProjectsLedger";
import { SkillsBars } from "@/components/SkillsBars";
import { StatsConsole } from "@/components/StatsConsole";
import { GrindLatest } from "@/components/GrindLatest";

/**
 * Home Component (Page Root)
 * 
 * Assembles the main portfolio index.
 * It strictly combines server-rendered sections and specialized client-rendered animations 
 * (like GbmCanvas for Geometric Brownian Motion background and Typewriter).
 */
export default function Home() {
  const ROLES = [
    "quant developer",
    "ml engineer",
    "startup builder",
    "algo trader",
  ];

  return (
    <>
      <GbmCanvas />
      
      <section style={{ paddingTop: '5rem', paddingBottom: '5rem', position: 'relative', zIndex: 10 }}>
        <div className="badge">
          <span className="indicator" style={{ marginRight: '8px', marginLeft: 0 }}>
            <span className="indicator-ring"></span>
            <span className="indicator-dot"></span>
          </span>
          Available for Opportunities
        </div>

        <h1 className="hero-title font-heading">Adarsh Agarwala</h1>
        
        <div className="hero-subtitle">
          <Typewriter words={ROLES} delay={120} />
        </div>

        <div className="abstract-block">
          <div className="abstract-title">Abstract.</div>
          <p className="abstract-text font-body">
            I am a student and software engineer based in India, specializing in the intersection of high-performance computing, systematic trading, and machine learning infrastructure. I thrive in low-latency environments and am currently focused on building robust, scalable systems. <strong style={{ color: 'var(--accent)' }}>I code anything. I figure out everything else.</strong> My work blends rigorous mathematical modeling with pragmatic, deployable engineering.
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: '5rem', position: 'relative', zIndex: 10 }}>
        <h2 className="section-heading font-heading" style={{ marginTop: '0rem' }}>The Grind</h2>
        <GrindLatest />
        
        <h2 className="section-heading font-heading">Core Projects</h2>
        <ProjectsLedger />
        
        <h2 className="section-heading font-heading">Technical Matrix</h2>
        <SkillsBars />

        <h2 className="section-heading font-heading">Diagnostic Console</h2>
        <StatsConsole />
      </section>
    </>
  );
}
