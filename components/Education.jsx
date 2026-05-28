"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";

const education = [
  {
    institution: "Your University",
    degree: "Bachelor of Science in Computer Science",
    year: "2025 - Ongoing",
    achievements: ["Dean's List", "Tech Club Lead"],
  },
];

export default function Education() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/achievements")
      .then((r) => r.json())
      .then((data) => setAchievements(data.achievements || []))
      .catch(() => setAchievements([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#ef745c] font-medium">Background</span>
          <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-heading)] mt-2">
            Education & <span className="gradient-text">Achievements</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <GraduationCap className="text-[#ef745c]" />
              Education
            </h3>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.institution}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <span className="text-[#ef745c] text-sm">{edu.year}</span>
                  <h4 className="text-xl font-semibold mt-1 mb-1">
                    {edu.institution}
                  </h4>
                  <p className="text-[#a1a1aa]">{edu.degree}</p>
                  <div className="flex gap-2 mt-4">
                    {edu.achievements.map((ach) => (
                      <span
                        key={ach}
                        className="px-3 py-1 rounded-full bg-[#ef745c]/10 text-[#ef745c] text-sm"
                      >
                        {ach}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Award className="text-[#ef745c]" />
              Key Achievements
            </h3>
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card rounded-2xl p-6 flex items-start gap-4 animate-pulse">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.03]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-3/4 bg-white/[0.03] rounded" />
                      <div className="h-4 w-full bg-white/[0.03] rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : achievements.length === 0 ? null : (
              <div className="space-y-6">
                {achievements.map((ach, index) => (
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="glass-card rounded-2xl p-6 flex items-start gap-4 hover:border-[#ef745c]/30 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ef745c]/20 to-[#34073d]/20 flex items-center justify-center flex-shrink-0">
                      <Award className="text-[#ef745c]" size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium">{ach.title}</h4>
                      <p className="text-[#71717a] text-sm mt-1">
                        {ach.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
