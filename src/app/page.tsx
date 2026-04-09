import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { projects, blogEntries, skills } from "@/constants/siteData";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { ViewportLock } from "@/components/ViewportLock";

/**
 * Home Component (Page Root)
 * 
 * Assembles the main portfolio index.
 * Refined for Phase 5: Terminal Uplink & Site Refactoring.
 */
export default function Home() {
  return (
    <main className="h-[100dvh] w-full overflow-y-auto md:snap-y md:snap-mandatory scroll-smooth relative no-scrollbar bg-[#0B0C10]">
      <ViewportLock />
      
      {/* SECTION 1: HERO (INDEX) */}
      <section id="hero" className="min-h-[100dvh] md:h-[100dvh] w-full shrink-0 md:snap-start md:snap-always relative overflow-hidden">
        <Hero />
      </section>

      {/* SECTION 2: ABOUT (SYSTEM OVERVIEW) */}
      <section id="about" className="min-h-[100dvh] md:h-[100dvh] w-full shrink-0 md:snap-start md:snap-always relative overflow-hidden">
        <About />
      </section>

      {/* SECTION 3: SKILLS (TECHNICAL TOOLKIT) */}
      <section id="skills" className="min-h-[100dvh] md:h-[100dvh] w-full shrink-0 md:snap-start md:snap-always relative overflow-hidden bg-[#0B0C10]">
        <div className="bg-circuit-grid opacity-20" />
        <div className="relative z-10 h-full w-full flex flex-col justify-start md:justify-center px-6 pt-24 pb-24 md:pb-40 overflow-y-auto no-scrollbar">
          <div className="w-full max-w-7xl mx-auto">
            {/* Centered Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-4xl font-black text-[#FACC15] uppercase italic leading-tight">
                // TECHNICAL_TOOLKIT
              </h2>
              <p className="font-mono text-xs md:text-sm text-gray-400 mt-2">
                &gt; Building quant systems, data pipelines, and low-latency engines from first principles.
              </p>
            </div>

            {/* Top Row: 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {skills.slice(0, 3).map((panel, idx) => (
                <div 
                  key={idx}
                  className="bg-[#11131A] border border-[#FACC15]/15 p-6 flex flex-col gap-3 hover:border-[#FACC15]/60 hover:shadow-[0_0_20px_rgba(250,204,21,0.1)] transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-mono text-base md:text-lg font-bold uppercase text-[#FACC15] tracking-tight group-hover:text-white transition-colors">
                      {panel.title}
                    </h3>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FACC15]/20 group-hover:bg-[#FACC15] group-hover:shadow-[0_0_8px_#FACC15] transition-all" />
                  </div>
                  <p className="font-sans text-sm text-gray-400 leading-relaxed">
                    {panel.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto pt-2">
                    {panel.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 font-mono text-xs text-gray-300 bg-[#1a1d27] border border-white/5 px-2 py-1 rounded-md"
                      >
                        <span className="text-xs">{tag.icon}</span>
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Row: 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.slice(3, 5).map((panel, idx) => (
                <div 
                  key={idx + 3}
                  className="bg-[#11131A] border border-[#FACC15]/15 p-6 flex flex-col gap-3 hover:border-[#FACC15]/60 hover:shadow-[0_0_20px_rgba(250,204,21,0.1)] transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-mono text-base md:text-lg font-bold uppercase text-[#FACC15] tracking-tight group-hover:text-white transition-colors">
                      {panel.title}
                    </h3>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FACC15]/20 group-hover:bg-[#FACC15] group-hover:shadow-[0_0_8px_#FACC15] transition-all" />
                  </div>
                  <p className="font-sans text-sm text-gray-400 leading-relaxed">
                    {panel.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto pt-2">
                    {panel.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 font-mono text-xs text-gray-300 bg-[#1a1d27] border border-white/5 px-2 py-1 rounded-md"
                      >
                        <span className="text-xs">{tag.icon}</span>
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: PROJECTS (DARK TERMINAL) — OPERATION LEDGER */}
      <section id="projects" className="min-h-[100dvh] md:h-[100dvh] w-full shrink-0 md:snap-start md:snap-always relative overflow-hidden bg-[#0B0C10]">
        <div className="bg-circuit-grid" />
        <div className="relative z-10 h-full w-full flex flex-col justify-start md:justify-center px-6 pt-24 pb-24 md:pb-40 overflow-y-auto no-scrollbar">
          <div className="w-full max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-black text-[#FACC15] mb-6 uppercase italic leading-tight">
              // PROJECT_ARCHIVE
            </h2>

            {/* Ledger Grid */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...projects].sort((a, b) => a.priority - b.priority).slice(0, 6).map((project) => (
                <div
                  key={project.slug}
                  className="group relative bg-[#11131A] border border-[#FACC15]/20 hover:border-[#FACC15] p-6 flex flex-col gap-4 cursor-pointer hover:-translate-y-1 transition-all duration-150 hover:shadow-[0_8px_30px_rgba(250,204,21,0.15)]"
                >
                  {/* GitHub top-right badge */}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-3 right-3 font-mono text-xs text-[#FACC15] border border-[#FACC15]/40 hover:bg-[#FACC15] hover:text-black px-2 py-0.5 rounded transition-none uppercase tracking-widest"
                    >
                      [ CODE ]
                    </a>
                  )}

                  {/* Card Header */}
                  <div className="flex flex-col gap-0.5 pr-16">
                    <span className="font-mono text-xs text-[#FACC15]/30 tracking-widest">
                      ID: {project.display_id}
                    </span>
                    <h3 className="font-mono text-base font-bold uppercase tracking-tight text-[#FACC15] leading-snug">
                      {project.title}
                    </h3>
                  </div>

                  <p className="font-sans text-sm text-gray-400 leading-relaxed line-clamp-2">
                    {project.short_description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.stack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-xs text-[#FACC15]/50 border border-[#FACC15]/15 px-2 py-0.5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-2 border-t border-white/5">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="font-mono text-xs text-[#FACC15] font-bold uppercase tracking-wider hover:underline ml-auto"
                    >
                      INITIALIZE →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full mt-5 flex justify-start">
              <Link
                href="/projects/archive"
                className="font-mono text-[11px] text-[#FACC15] border border-[#FACC15]/60 px-4 py-2 hover:bg-[#FACC15] hover:text-black transition-all"
              >
                [ ACCESS_FULL_SYSTEM_ARCHIVE ]
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: BLOG (DEEP MIDNIGHT) — THE GRIND */}
      <section id="blog" className="min-h-[100dvh] md:h-[100dvh] w-full shrink-0 md:snap-start md:snap-always relative overflow-hidden bg-[#0B0C10]">
        <div className="bg-circuit-grid" />
        <div className="relative z-10 h-full w-full flex flex-col justify-start md:justify-center px-6 pt-24 pb-24 md:pb-40 overflow-y-auto no-scrollbar">
          <div className="w-full max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-black text-[#FACC15] mb-8 uppercase italic leading-tight">
              // THE_GRIND_LOGS
            </h2>

            <div className="w-full flex flex-col lg:flex-row gap-5">
              {/* 2/3 Main Card for Latest Entry */}
              <div className="lg:w-2/3 group relative border border-[#FACC15]/20 bg-[#11131A] p-6 overflow-hidden flex flex-col justify-end min-h-[280px]">
                {/* Massive Background Text */}
                <div className="absolute -top-6 -right-4 text-[120px] md:text-[160px] font-black text-[#FACC15] opacity-5 select-none leading-none">
                  DAY {blogEntries[0]?.day}
                </div>
                
                <div className="relative z-10">
                  <div className="font-mono text-[#FACC15]/50 text-xs mb-2 tracking-widest">
                    [ LATEST_LOG ] — DAY {blogEntries[0]?.day}
                  </div>
                  <h3 className="font-mono text-xl md:text-2xl font-bold text-[#FACC15] leading-snug mb-3">
                    {blogEntries[0]?.title}
                  </h3>
                  <div className="flex gap-2">
                    {blogEntries[0]?.topics?.map((t) => (
                      <span key={t} className="font-mono text-[10px] border border-[#FACC15]/30 text-[#FACC15]/60 px-2 py-0.5 uppercase">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 1/3 Sidebar for Terminal Inputs */}
              <div className="lg:w-1/3 border border-[#FACC15]/20 bg-[#11131A] p-5 flex flex-col justify-between min-h-[280px]">
                <div>
                  <div className="font-mono text-xs text-[#FACC15]/70 mb-4 tracking-widest border-b border-[#FACC15]/10 pb-2 uppercase">
                    [ TERMINAL_INPUT ]
                  </div>
                  <label className="block font-mono text-xs text-white/50 mb-2">
                    &gt; REQUEST_TOPIC:
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. Memory Arenas..."
                    className="w-full bg-[#0B0C10] border border-[#FACC15]/30 focus:border-[#FACC15] outline-none text-[#FACC15] font-mono text-sm px-3 py-2 mb-4 rounded-none placeholder:text-[#FACC15]/20"
                  />
                  <button className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-[#FACC15] text-[#FACC15] hover:text-black border border-[#FACC15] font-mono text-xs font-bold py-2.5 uppercase tracking-widest transition-none cursor-pointer">
                    [ SEND_COMMAND ]
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-[#FACC15]/10">
                  <Link
                    href="/blog"
                    className="block w-full text-center font-mono text-[10px] text-[#FACC15]/50 hover:text-[#FACC15] transition-colors uppercase tracking-widest"
                  >
                    // OPEN_CENTRAL_ARCHIVE →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: CONTACT (DARK TERMINAL) */}
      <section id="contact" className="min-h-[100dvh] md:h-[100dvh] w-full shrink-0 md:snap-start md:snap-always relative overflow-hidden bg-[#0B0C10]">
        <div className="bg-circuit-grid" />
        <div className="relative z-10 h-full w-full flex flex-col justify-start md:justify-center px-6 pt-24 pb-24 md:pb-40 overflow-y-auto no-scrollbar">
          <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-black text-[#FACC15] mb-6 uppercase italic leading-tight">
              // ENCRYPTED_COMMS
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
