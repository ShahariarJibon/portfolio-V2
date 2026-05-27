"use client";

import { motion } from "framer-motion";
import { ExternalLink, GitBranch, ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "AI TRANSLATOR",
    image: "/images/vasha.png",
    description:
      "Real-time AI-powered translation platform with support for 100+ languages, voice input, and document translation.",
    tags: ["JavaScript", "HTML", "CSS", "API"],
    demo: "https://shahariarjibon.github.io/Translator-VASHA/",
    github: "https://github.com/ShahariarJibon/Translator-VASHA",
  },
  {
    title: "PixeLoom- Online Photo Editor",
    image: "/images/imagedo.png",
    description:
      "A powerful web-based photo editing application with filters, adjustments, layers, and export capabilities.",
    tags: ["React", "Canvas API", "Tailwind"],
    demo: "https://online-image-editor-zeta.vercel.app/",
    github: "https://github.com/ShahariarJibon/Online-Image-Editor",
  },
  {
    title: "Territory Multiplayer game",
    image: "/images/territory.png",
    description:
      "Real-time multiplayer game with WebSocket, game state synchronization, and competitive matchmaking.",
    tags: ["Node.js", "Socket.io", "React", "Redis"],
    demo: "https://territory-game-multiplayer-production.up.railway.app/",
    github: "https://github.com/ShahariarJibon/Territory-Game-Multiplayer",
  },
  {
    title: "LunaQR - QR Generator",
    image: "/images/lunaqr.png",
    description:
      "A sleek and modern QR code generator that creates customizable QR codes for URLs, text, and more with instant download.",
    tags: ["React", "QR Code API", "Tailwind"],
    demo: "https://luna-qr.vercel.app/",
    github: "https://github.com/ShahariarJibon/LunaQR",
  },
];

export default function Projects() {
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
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group rounded-3xl overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.12)] transition-all duration-500"
            >
              <a
                href={project.demo || project.github || "#"}
                target={project.demo || project.github ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="block h-48 md:h-56 relative overflow-hidden bg-black"
              >
                <img
                  src={project.image}
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
                <p className="text-[#666666] text-sm mb-4 leading-relaxed line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 border border-white/[0.06] text-xs text-[#888888]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-6">
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-white hover:text-[#888888] transition-colors duration-300"
                    >
                      <ExternalLink size={14} />
                      Live Demo
                    </a>
                  )}
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#888888] hover:text-white transition-colors duration-300"
                  >
                    <GitBranch size={14} />
                    Code
                  </a>
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
            href="https://github.com/ShahariarJibon?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
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