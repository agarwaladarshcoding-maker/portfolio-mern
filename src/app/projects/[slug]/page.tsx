import { getProjectBySlug, projects } from "@/constants/siteData";
import Link from "next/link";
import { notFound } from "next/navigation";

// Generate static params for all projects at build time
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// Generate dynamic metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} | Adarsh Agarwala`,
    description: project.short_description,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="min-h-screen w-full bg-[#0B0C10] text-white relative overflow-y-auto overflow-x-hidden">
      <div className="bg-circuit-grid opacity-20 pointer-events-none fixed inset-0" />
      {/* Top Command Bar */}
      <div className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 bg-[#0B0C10]/80 backdrop-blur-md border-b border-[#FACC15]/5">
        {/* Left: Abort */}
        <Link
          href="/#projects"
          className="flex items-center gap-2 font-mono text-xs text-[#FACC15] border border-[#FACC15]/40 px-4 py-2 rounded-full hover:bg-[#FACC15] hover:text-black transition-colors duration-150"
        >
          ← ABORT_AND_RETURN
        </Link>

        {/* Right: GitHub */}
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-mono text-xs text-black bg-[#FACC15] border border-[#FACC15] px-4 py-2 rounded-full hover:bg-transparent hover:text-[#FACC15] transition-colors duration-150 uppercase tracking-widest font-bold"
          >
            [ VIEW_ON_GITHUB ] ↗
          </a>
        )}
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 pt-16 md:pt-24 pb-20 md:pb-32">
        {/* Header */}
        <div className="mb-12 border-b border-[#FACC15]/20 pb-8">
          <p className="font-mono text-xs text-[#FACC15]/60 mb-2">
            ID: {project.display_id} /{" "}
            <span className={project.status === "ACTIVE" ? "text-green-400" : "text-red-400"}>
              {project.status}
            </span>
          </p>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight mb-4">
            {project.title}
          </h1>
          {/* Stack Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-xs text-[#FACC15] border border-[#FACC15]/40 px-3 py-1 bg-[#FACC15]/5"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Abstract / Short Description */}
        <div className="mb-12 border-l-2 border-[#FACC15] pl-6">
          <p className="font-mono text-xs uppercase text-[#FACC15]/60 mb-2 tracking-widest">
            ABSTRACT
          </p>
          <p className="text-lg text-[#F2F2F2]/90 leading-relaxed">
            {project.short_description}
          </p>
        </div>

        {/* Full Description */}
        <section className="mb-12">
          <h2 className="font-mono text-xs uppercase text-[#FACC15]/60 tracking-widest mb-4">
            // SYSTEM_OVERVIEW
          </h2>
          <p className="text-base text-[#F2F2F2]/80 leading-relaxed">
            {project.detailed_description}
          </p>
        </section>

        {/* Key Highlights */}
        <section className="mb-12">
          <h2 className="font-mono text-xs uppercase text-[#FACC15]/60 tracking-widest mb-4">
            // KEY_HIGHLIGHTS
          </h2>
          <ul className="space-y-3">
            {project.key_highlights.map((highlight, i) => (
              <li key={i} className="flex gap-3 font-mono text-sm text-[#F2F2F2]/80">
                <span className="text-[#FACC15] shrink-0 mt-0.5">▸</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* What It Proves */}
        <section className="mb-12 bg-[#FACC15]/5 border border-[#FACC15]/20 p-6">
          <h2 className="font-mono text-xs uppercase text-[#FACC15]/60 tracking-widest mb-3">
            // SIGNAL_TO_RECRUITER
          </h2>
          <p className="text-sm text-[#F2F2F2]/80 leading-relaxed">
            {project.what_it_proves}
          </p>
        </section>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-[#FACC15] border-2 border-[#FACC15] px-6 py-3 hover:bg-[#FACC15] hover:text-black transition-none"
            >
              [ GITHUB ]
            </a>
          )}
          <Link
            href="/#projects"
            className="font-mono text-sm text-white/60 border-2 border-white/20 px-6 py-3 hover:border-white/60 transition-none"
          >
            [ ← BACK_TO_LEDGER ]
          </Link>
        </div>
      </div>
    </div>
  );
}
