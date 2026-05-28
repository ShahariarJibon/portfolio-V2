"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GitBranch, Star, GitCommit, Users, GitPullRequest, GitFork } from "lucide-react";

const ICON_MAP = { GitCommit, Users, Star, GitBranch, GitPullRequest, GitFork };

function getIcon(name) {
  return ICON_MAP[name] || GitCommit;
}

export default function GitHubStats() {
  const [data, setData] = useState({ stats: [], languages: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activity")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ef745c]/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#ef745c] font-medium">GitHub</span>
          <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-heading)] mt-2">
            Open Source <span className="gradient-text">Activity</span>
          </h2>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-6 text-center animate-pulse">
                <div className="w-7 h-7 mx-auto mb-3 bg-white/[0.03] rounded" />
                <div className="h-8 w-20 mx-auto mb-2 bg-white/[0.03] rounded" />
                <div className="h-4 w-24 mx-auto bg-white/[0.03] rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {data.stats.length > 0 && (
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {data.stats.map((stat, index) => {
                  const Icon = getIcon(stat.icon_name);
                  return (
                    <motion.div
                      key={stat.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="glass-card rounded-2xl p-6 text-center hover:border-[#ef745c]/30 transition-colors"
                    >
                      <Icon className="text-[#ef745c] mx-auto mb-3" size={28} />
                      <span className="text-3xl font-bold gradient-text block">
                        {stat.value}
                      </span>
                      <span className="text-[#71717a] text-sm">{stat.label}</span>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {data.languages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-card rounded-2xl p-8"
              >
                <h3 className="text-xl font-semibold mb-6">Most Used Languages</h3>
                <div className="space-y-4">
                  {data.languages.map((lang) => (
                    <div key={lang.id}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-[#a1a1aa]">{lang.name}</span>
                        <span className="text-[#ef745c]">{lang.percentage}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${lang.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: lang.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-10"
            >
              <a
                href="https://github.com/ShahariarJibon"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#24292e] text-white hover:bg-[#2f363d] transition-colors"
              >
                <GitBranch size={18} />
                View GitHub Profile
              </a>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
