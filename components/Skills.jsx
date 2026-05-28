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

export default function Skills() {
  const [data, setData] = useState({ categories: [], techTags: [] });
  const [activeCategory, setActiveCategory] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/skills")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="skills" className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ef745c]/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#ef745c] font-medium">Skills</span>
            <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-heading)] mt-2">My <span className="gradient-text">Tech Stack</span></h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[1, 2, 3, 4].map((i) => <div key={i} className="w-28 h-10 rounded-full bg-white/[0.03] animate-pulse" />)}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-2xl bg-white/[0.03] animate-pulse" />)}
          </div>
        </div>
      </section>
    );
  }

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
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {data.techTags.map((tag) => (
              <div
                key={tag.id}
                className="glass-card rounded-xl p-4 text-center hover:border-[#ef745c]/30 transition-colors"
              >
                <span className="text-[#a1a1aa]">{tag.name}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
