"use client";

import { useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import GitHubStats from "@/components/GitHubStats";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/lenis/1.1.9/lenis.min.js";
    script.async = true;
    script.onload = () => {
      if (window.Lenis) {
        const lenis = new window.Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main>
        <Hero />
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: "url(/images/othercover.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.5,
            filter: "grayscale(100%) brightness(60%)",
          }}
        />
        <div className="relative z-10">
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Education />
          <GitHubStats />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}