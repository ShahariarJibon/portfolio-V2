"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, GitBranch, ArrowUpRight } from "lucide-react";

export default function Projects() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/works")
      .then((r) => r.json())
      .then((data) => setWorks((data.works || []).slice(0, 4)))
      .catch(() => setWorks([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#888888] text-xs tracking-[0.2em] uppercase">Projects</span>
            <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-heading)] mt-2 text-white">
              Featured <span className="text-[#888888]">Work</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-3xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                <div className="h-48 md:h-56 bg-white/[0.03] animate-pulse" />
                <div className="p-6 md:p-8 space-y-3">
                  <div className="h-6 w-3/4 bg-white/[0.03] animate-pulse rounded" />
                  <div className="h-4 w-full bg-white/[0.03] animate-pulse rounded" />
                  <div className="flex gap-2">
                    <div className="h-5 w-16 bg-white/[0.03] animate-pulse rounded" />
                    <div className="h-5 w-20 bg-white/[0.03] animate-pulse rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#888888] text-xs tracking-[0.2em] uppercase">
            Projects
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-heading)] mt-2 text-white">
            Featured <span className="text-[#888888]">Work</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {works.map((project, index) => (
            <motion.div
              key={project.id || project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group rounded-3xl overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.12)] transition-all duration-500"
            >
              <a
                href={project.demo_url || project.code_url || "#"}
                target={project.demo_url || project.code_url ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="block h-48 md:h-56 relative overflow-hidden bg-black"
              >
                <img
                  src={project.image_data || project.image_url}
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <ArrowUpRight className="text-white/70" size={40} />
                </div>
              </a>

              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-semibold font-[family-name:var(--font-heading)] mb-3 text-white group-hover:text-[#aaaaaa] transition-colors duration-500">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-[#666666] text-sm mb-4 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                )}
                {(project.tag_lines || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tag_lines.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 border border-white/[0.06] text-xs text-[#888888]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-6">
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-white hover:text-[#888888] transition-colors duration-300"
                    >
                      <ExternalLink size={14} />
                      Live Demo
                    </a>
                  )}
                  {project.code_url && (
                    <a
                      href={project.code_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#888888] hover:text-white transition-colors duration-300"
                    >
                      <GitBranch size={14} />
                      Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="/works"
            className="inline-flex items-center gap-2 px-8 py-3 border border-white/20 text-xs tracking-[0.2em] uppercase text-white hover:bg-white hover:text-black transition-all duration-500"
          >
            View All Projects
            <ArrowUpRight size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
