"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Database,
  Wrench,
  Layout,
  Terminal,
} from "lucide-react";

const skillCategories = [
  {
    name: "Frontend",
    icon: Layout,
    skills: [
      { name: "HTML", level: 95 },
      { name: "CSS", level: 90 },
      { name: "JavaScript", level: 92 },
      { name: "React", level: 95 },
      { name: "Next.js", level: 90 },
      { name: "Tailwind CSS", level: 95 },
    ],
  },
  {
    name: "Backend",
    icon: Terminal,
    skills: [
      { name: "Node.js", level: 88 },
      { name: "Express.js", level: 85 },
    ],
  },
  {
    name: "Database",
    icon: Database,
    skills: [
      { name: "MongoDB", level: 85 },
      { name: "Supabase", level: 80 },
    ],
  },
  {
    name: "Tools",
    icon: Wrench,
    skills: [
      { name: "Git", level: 90 },
      { name: "GitHub", level: 92 },
      { name: "VS Code", level: 95 },
      { name: "Figma", level: 75 },
    ],
  },
];

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section id="skills" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ef745c]/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#ef745c] font-medium">Skills</span>
          <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-heading)] mt-2">
            My <span className="gradient-text">Tech Stack</span>
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {skillCategories.map((category, index) => (
            <motion.button
              key={category.name}
              onClick={() => setActiveCategory(index)}
              className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all ${
                activeCategory === index
                  ? "bg-gradient-to-r from-[#ef745c] to-[#34073d] text-white"
                  : "glass-card text-[#a1a1aa] hover:text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <category.icon size={18} />
              {category.name}
            </motion.button>
          ))}
        </div>

        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillCategories[activeCategory].skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="glass-card rounded-2xl p-6 hover:border-[#ef745c]/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium">{skill.name}</span>
                <span className="text-[#ef745c] text-sm">{skill.level}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                  className="h-full bg-gradient-to-r from-[#ef745c] to-[#34073d] rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            "React",
            "Next.js",
            "TypeScript",
            "Node.js",
            "MongoDB",
            "PostgreSQL",
            "AWS",
            "Docker",
          ].map((tech) => (
            <div
              key={tech}
              className="glass-card rounded-xl p-4 text-center hover:border-[#ef745c]/30 transition-colors"
            >
              <span className="text-[#a1a1aa]">{tech}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}