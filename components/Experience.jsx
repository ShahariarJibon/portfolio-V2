"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

const experiences = [
  {
    period: "2023 - Present",
    title: "Freelance Full-Stack Developer",
    company: "Self-employed",
    location: "Remote",
    description:
      "Building custom web applications, SaaS products, and AI-powered solutions for clients worldwide. Focus on Next.js, React, and cloud technologies.",
    technologies: ["Next.js", "React", "Node.js", "AWS", "OpenAI"],
  },
  {
    period: "2022 - 2023",
    title: "SaaS Product Development",
    company: "Personal Projects",
    location: "Remote",
    description:
      "Launched multiple SaaS products including AI tools, productivity apps, and developer utilities. Focused on product-market fit and scalable architecture.",
    technologies: ["Next.js", "Stripe", "Supabase", "Vercel"],
  },
  {
    period: "2021 - 2022",
    title: "Open Source Contributor",
    company: "Various Projects",
    location: "Remote",
    description:
      "Contributed to popular open source projects, maintained packages, and built developer tools. Gained experience in collaborative development and code review.",
    technologies: ["TypeScript", "React", "Node.js", "GraphQL"],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 md:py-32 relative">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#ef745c] font-medium">Experience</span>
          <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-heading)] mt-2">
            My <span className="gradient-text">Journey</span>
          </h2>
        </motion.div>

        <div className="relative">
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.15, 1] }}
            className="absolute left-4 md:left-1/2 top-0 w-px bg-gradient-to-b from-[#ef745c] via-[#34073d] to-transparent origin-top"
          />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.period}
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: index * 0.2, ease: [0.25, 0.1, 0.15, 1] }}
              className={`relative flex items-start gap-8 mb-12 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div className="hidden md:block w-1/2" />
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.2 + 0.3, type: "spring" }}
                className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#ef745c] ring-4 ring-[#0a0a0b] z-10"
              />
              <div className="w-[calc(100%-2rem)] md:w-1/2 ml-12 md:ml-0">
                <div className="glass-card rounded-2xl p-6 hover:border-[#ef745c]/30 transition-colors">
                  <div className="flex items-center gap-2 text-sm text-[#ef745c] mb-2">
                    <Calendar size={14} />
                    {exp.period}
                  </div>
                  <h3 className="text-xl font-semibold font-[family-name:var(--font-heading)] mb-1">
                    {exp.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[#a1a1aa] text-sm mb-4">
                    <span>{exp.company}</span>
                    <span>•</span>
                    <MapPin size={14} />
                    {exp.location}
                  </div>
                  <p className="text-[#71717a] text-sm mb-4">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 rounded-md bg-[#ef745c]/10 text-[#ef745c] text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}