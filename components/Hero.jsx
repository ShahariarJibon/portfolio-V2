"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const imageOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative z-20 h-screen overflow-hidden bg-black"
    >
      {/* Film grain */}
      <div className="film-grain pointer-events-none absolute inset-0 z-30 opacity-[0.045]" />

      {/* Vignette */}
      <div className="vignette pointer-events-none absolute inset-0 z-20" />

      {/* Dark left-to-right gradient overlay under text */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/80 via-30% to-transparent" />

      {/* B&W hero image with parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: imageScale, opacity: imageOpacity }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/images/hero.jpg)",
            filter: "grayscale(100%) contrast(130%) brightness(55%)",
          }}
        />
      </motion.div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/[0.02]" />
        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/[0.02]" />
        <div className="absolute top-1/3 left-0 right-0 h-px bg-white/[0.02]" />
        <div className="absolute top-2/3 left-0 right-0 h-px bg-white/[0.02]" />
      </div>

      {/* Top-right editorial corner bracket */}
      <div className="absolute top-12 right-12 z-[5] pointer-events-none hidden md:block">
        <div className="w-8 h-px bg-white/10" />
        <div className="w-px h-8 bg-white/10 ml-8 -mt-px" />
      </div>

      {/* Main content */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 md:px-8 flex items-center">
        <motion.div
          className="max-w-2xl"
          style={{ y: textY }}
        >
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-6 md:mb-8"
          >
            <span className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-[#666666] font-[family-name:var(--font-sans)]">
              Full-Stack Developer &amp; Creator
            </span>
          </motion.div>

          {/* IMAGINE */}
          <div className="overflow-hidden mb-1 md:mb-2">
            <motion.h1
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.5,
                ease: [0.25, 0.1, 0.15, 1],
              }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[11rem] font-[family-name:var(--font-serif)] leading-[0.82] tracking-[-0.04em] text-white select-none"
            >
              IMAGINE
            </motion.h1>
          </div>

          {/* MORE */}
          <div className="overflow-hidden mb-1">
            <motion.h2
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.7,
                ease: [0.25, 0.1, 0.15, 1],
              }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[11rem] font-[family-name:var(--font-serif)] leading-[0.82] tracking-[-0.04em] text-white select-none"
            >
              MORE
            </motion.h2>
          </div>

          {/* Editorial divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.25, 0.1, 0.15, 1] }}
            className="h-px bg-white/15 w-20 md:w-24 origin-left mb-5 md:mb-6 mt-4 md:mt-5"
          />

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mb-3"
          >
            <h3 className="text-base md:text-lg font-[family-name:var(--font-sans)] tracking-[0.2em] uppercase text-[#777777] font-light">
              Create Without Limits
            </h3>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="text-sm md:text-base text-[#555555] max-w-md leading-relaxed mb-8 md:mb-10 font-light"
          >
            Crafting premium digital experiences through clean code and
            thoughtful design. Specializing in SaaS, AI tools, and
            immersive web applications.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.a
              href="#projects"
              onClick={(e) => handleNavClick(e, "#projects")}
              className="inline-block px-8 py-3 border border-white/20 text-white text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500"
              whileHover={{ opacity: 0.9 }}
            >
              View Projects
            </motion.a>
            <motion.a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="inline-block px-8 py-3 border border-white/10 text-[#888888] text-xs tracking-[0.2em] uppercase hover:border-white/30 hover:text-white transition-all duration-500"
              whileHover={{ opacity: 0.9 }}
            >
              Get in Touch
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Side "Scroll" indicator - desktop only */}
        <div className="hidden lg:block absolute right-12 xl:right-16 top-1/2 -translate-y-1/2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.5 }}
            className="flex items-center gap-4 -rotate-90 origin-center"
          >
            <div className="w-16 h-px bg-white/10" />
            <span className="text-[9px] tracking-[0.35em] uppercase text-[#444444] font-[family-name:var(--font-sans)]">
              Scroll
            </span>
            <div className="w-16 h-px bg-white/10" />
          </motion.div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[9px] tracking-[0.35em] uppercase text-[#444444] font-[family-name:var(--font-sans)]">
            Explore
          </span>
          <div className="w-px h-6 bg-white/[0.06]" />
        </motion.div>
      </motion.div>
    </section>
  );
}