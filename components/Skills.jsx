"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Code2, Database, Wrench, Layout, Terminal, Server, Smartphone, Globe, Cloud, GitBranch, Braces, Cpu,
} from "lucide-react";

const ICON_MAP = { Code2, Database, Wrench, Layout, Terminal, Server, Smartphone, Globe, Cloud, GitBranch, Braces, Cpu };

function getIcon(name) {
  return ICON_MAP[name] || Code2;
}

const INITIAL_SKILLS_DATA = {
  categories: [
    {
      id: "cat-frontend",
      name: "Frontend",
      icon_name: "Layout",
      skills: [
        { id: "s-react", name: "React", level: 92 },
        { id: "s-js", name: "JavaScript", level: 90 },
        { id: "s-tailwind", name: "Tailwind CSS", level: 92 },
        { id: "s-html", name: "HTML", level: 95 },
        { id: "s-css", name: "CSS", level: 90 },
      ],
    },
    {
      id: "cat-languages",
      name: "Programming Languages",
      icon_name: "Code2",
      skills: [
        { id: "s-cpp", name: "C++", level: 88 },
        { id: "s-c", name: "C", level: 85 },
        { id: "s-java", name: "Java", level: 85 },
        { id: "s-js-lang", name: "JavaScript", level: 90 },
      ],
    },
  ],
  techTags: [
    { id: "t-react", name: "React" },
    { id: "t-js", name: "JavaScript" },
    { id: "t-tailwind", name: "Tailwind CSS" },
    { id: "t-html", name: "HTML" },
    { id: "t-css", name: "CSS" },
    { id: "t-cpp", name: "C++" },
    { id: "t-c", name: "C" },
    { id: "t-java", name: "Java" },
  ],
};

export default function Skills() {
  const [data, setData] = useState(INITIAL_SKILLS_DATA);
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    fetch("/api/skills")
      .then((r) => r.json())
      .then((d) => {
        if (d?.categories && d.categories.length > 0) {
          setData(d);
        }
      })
      .catch(() => {});
  }, []);

  if (!data.categories || data.categories.length === 0) return null;

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
          {data.categories.map((category, index) => {
            const Icon = getIcon(category.icon_name);
            return (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(index)}
                className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all ${
                  activeCategory === index
                    ? "bg-gradient-to-r from-[#ef745c] to-[#34073d] text-white"
                    : "glass-card text-[#a1a1aa] hover:text-white"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={18} />
                {category.name}
              </motion.button>
            );
          })}
        </div>

        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {(data.categories[activeCategory]?.skills || []).map((skill, index) => (
            <motion.div
              key={skill.id}
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

        {data.techTags && data.techTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {data.techTags.map((tag) => (
              <div
                key={tag.id}
                className="glass-card rounded-xl p-4 text-center hover:border-[#ef745c]/30 transition-colors"
              >
                <span className="text-[#a1a1aa] font-medium">{tag.name}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
