"use client";

import { motion } from "framer-motion";
import { Award, Briefcase, Users } from "lucide-react";

const stats = [
  { icon: Briefcase, label: "Years Experience", value: "3+" },
  { icon: Award, label: "Projects Completed", value: "20+" },
  { icon: Users, label: "Happy Clients", value: "10+" },
];

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#ef745c] font-medium">About Me</span>
          <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-heading)] mt-2">
            Building the{" "}
            <span className="gradient-text">Future of Web</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ef745c]/10 rounded-full blur-3xl" />
              <h3 className="text-2xl font-semibold font-[family-name:var(--font-heading)] mb-4">
                My Journey
              </h3>
              <p className="text-[#a1a1aa] leading-relaxed mb-4">
                I&apos;m a passionate full-stack developer with a focus on
                building scalable SaaS products and innovative web
                applications. My journey began with a curiosity for creating
                things that live on the web.
              </p>
              <p className="text-[#a1a1aa] leading-relaxed mb-6">
                Over the years, I&apos;ve developed expertise in modern
                technologies like React, Next.js, Node.js, and cloud
                platforms. I love turning complex problems into elegant
                solutions.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  "SaaS Development",
                  "AI Integration",
                  "Browser Apps",
                  "Game Dev",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-[#ef745c]/10 text-[#ef745c] text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="glass-card rounded-2xl p-6 flex items-center gap-6 hover:border-[#ef745c]/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ef745c]/20 to-[#34073d]/20 flex items-center justify-center">
                  <stat.icon className="text-[#ef745c]" size={24} />
                </div>
                <div>
                  <span className="text-3xl font-bold gradient-text">
                    {stat.value}
                  </span>
                  <p className="text-[#71717a] text-sm">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}