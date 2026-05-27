"use client";

import { motion } from "framer-motion";
import { GitBranch, Link, Mail, ArrowUp } from "lucide-react";

const FacebookIcon = ({ className, size }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ className, size }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

const socials = [
  { icon: GitBranch, href: "https://github.com/ShahariarJibon", label: "GitHub" },
  { icon: Link, href: "https://www.linkedin.com/in/shahariar-hossain-427a81404/", label: "LinkedIn" },
  { icon: Mail, href: "mailto:shahariarhossain674@gmail.com", label: "Email" },
  { icon: FacebookIcon, href: "https://www.facebook.com/jjibon2005", label: "Facebook" },
  { icon: InstagramIcon, href: "https://instagram.com/j_i_b_o_n_321", label: "Instagram" },
];

export default function Footer() {
  const handleNavClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <motion.a
              href="#home"
              onClick={(e) => handleNavClick(e, "#home")}
              className="text-2xl font-bold font-[family-name:var(--font-heading)] inline-block mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <span className="gradient-text">J</span>
              <span className="text-white">ibon</span>
            </motion.a>
            <p className="text-[#71717a] text-sm leading-relaxed">
              Full-Stack Developer & SaaS Builder. Building premium digital
              experiences with cutting-edge technologies.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-[#71717a] hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              {socials.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-[#71717a] hover:text-[#ef745c] hover:border-[#ef745c]/30 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
          <p className="text-[#71717a] text-sm">
            © {new Date().getFullYear()} Jibon. All rights reserved.
          </p>
          <motion.a
            href="#home"
            onClick={(e) => handleNavClick(e, "#home")}
            className="mt-4 md:mt-0 w-10 h-10 rounded-full glass-card flex items-center justify-center text-[#71717a] hover:text-white transition-colors"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp size={18} />
          </motion.a>
        </div>
      </div>
    </footer>
  );
}