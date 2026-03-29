import { PROJECTS, getProjectBySlug } from "@/lib/projects";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import "@/components/Grind.css";
import "./project-page.css";

// ── GitHub SVG icon (reused in two places) ──────────────────────────────────
const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ marginRight: "0.5rem", flexShrink: 0 }}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
  </svg>
);

// ── Static params for build-time generation ──────────────────────────────────
export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

// ── Metadata — params MUST be awaited in Next.js 15/16 ──────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Not Found" };
  return {
    title: `${project.title} | Adarsh Agarwala`,
    description: project.tagline,
    openGraph: { title: project.title, description: project.tagline },
  };
}

// ── Page component ────────────────────────────────────────────────────────────
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="project-page">

      {/* ── Back navigation ── */}
      <Link href="/" className="font-data back-link">
        &lt; RETURN_INDEX()
      </Link>

      {/* ══════════════════════════════════════════
          HERO HEADER
          ══════════════════════════════════════════ */}
      <header className="project-header">

        {/* Tags row */}
        <div className="project-meta font-data">
          <span className="terminal-pill">{project.lang}</span>
          {project.tags.map((t) => (
            <span key={t} className="tech-badge">{t}</span>
          ))}
        </div>

        <h1 className="project-title font-heading">{project.title}</h1>
        <p className="project-tagline font-body">{project.tagline}</p>

        {/* Top GitHub CTA */}
        <div className="project-cta">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-github font-data"
          >
            <GithubIcon /> VIEW_ON_GITHUB()
          </a>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          OBJECTIVE
          ══════════════════════════════════════════ */}
      <section className="project-section">
        <h2 className="project-section-title font-heading">
          <span className="section-prefix font-data">&gt; </span>Objective
        </h2>
        <div className="abstract-block">
          <p className="abstract-text font-body">{project.objective}</p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ARCHITECTURE / DESCRIPTION
          ══════════════════════════════════════════ */}
      <section className="project-section">
        <h2 className="project-section-title font-heading">
          <span className="section-prefix font-data">&gt; </span>Architecture
        </h2>
        <div className="markdown-render">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {project.architecture}
          </ReactMarkdown>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TECH STACK TABLE
          ══════════════════════════════════════════ */}
      <section className="project-section">
        <h2 className="project-section-title font-heading">
          <span className="section-prefix font-data">&gt; </span>Tech Stack
        </h2>
        <div className="spec-table font-data">
          {project.techStack.map((item) => (
            <div key={item.label} className="spec-row">
              <span className="spec-label">{item.label}</span>
              <span className="spec-value">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PERFORMANCE METRICS GRID
          ══════════════════════════════════════════ */}
      <section className="project-section">
        <h2 className="project-section-title font-heading">
          <span className="section-prefix font-data">&gt; </span>Performance Metrics
        </h2>
        <div className="metrics-grid">
          {project.performance.map((item) => (
            <div key={item.label} className="metric-card">
              <div className="metric-value font-data">{item.value}</div>
              <div className="metric-label font-body">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ENGINEERING CHALLENGES
          ══════════════════════════════════════════ */}
      <section className="project-section">
        <h2 className="project-section-title font-heading">
          <span className="section-prefix font-data">&gt; </span>Engineering Challenges
        </h2>
        <div className="markdown-render">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {project.challenges}
          </ReactMarkdown>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BOTTOM CTA
          ══════════════════════════════════════════ */}
      <div className="project-bottom-cta">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-github font-data"
        >
          <GithubIcon /> VIEW_ON_GITHUB()
        </a>
        <Link href="/" className="btn-archive font-data">
          &lt; BACK_TO_INDEX()
        </Link>
      </div>

    </article>
  );
}
