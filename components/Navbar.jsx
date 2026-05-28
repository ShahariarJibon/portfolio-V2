"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".user-menu-area")) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleNavClick = (e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? "bg-white/[0.02] backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-transparent"
        }`}
        style={
          isScrolled
            ? { backdropFilter: "blur(24px) saturate(1.2)", WebkitBackdropFilter: "blur(24px) saturate(1.2)" }
            : undefined
        }
      >
        {isScrolled && (
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        )}
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <motion.a
            href="#home"
            onClick={(e) => handleNavClick(e, "#home")}
            className="text-lg font-[family-name:var(--font-sans)] tracking-[0.2em] uppercase text-white"
            whileHover={{ opacity: 0.6 }}
          >
            Jibon
          </motion.a>

          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-1.5 text-xs tracking-[0.15em] uppercase text-[#888888] rounded-full border border-transparent hover:border-white/40 hover:bg-white/[0.03] hover:backdrop-blur-xl hover:text-white transition-all duration-500"
                whileHover={{ scale: 1.02 }}
              >
                {link.name}
              </motion.a>
            ))}

            {user ? (
              <div className="relative ml-4 user-menu-area">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-1.5 text-xs tracking-[0.15em] uppercase text-white rounded-full border border-white/20 hover:bg-white hover:text-black transition-all duration-500"
                >
                  <User size={14} />
                  {user.email.split("@")[0]}
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-white/[0.08] bg-[#0a0a0a] shadow-2xl p-2 z-50"
                    >
                      <button
                        onClick={() => { logout(); setShowUserMenu(false); }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-xs text-[#888888] hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="ml-4 px-5 py-1.5 text-xs tracking-[0.15em] uppercase text-white rounded-full border border-white/20 hover:bg-white hover:text-black transition-all duration-500"
              >
                Join
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 md:hidden">
            {user ? (
              <button
                onClick={() => { logout(); }}
                className="text-[#888888] hover:text-white transition-colors p-2"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            ) : (
              <button
                onClick={() => { setShowAuth(true); setIsMobileMenuOpen(false); }}
                className="px-4 py-1 text-xs tracking-[0.15em] uppercase text-white rounded-full border border-white/20 hover:bg-white hover:text-black transition-all"
              >
                Join
              </button>
            )}
            <button
              className="text-white p-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-[#111111] z-50 p-10"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-xs tracking-[0.2em] uppercase text-[#888888]">
                  Menu
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white p-2"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex flex-col gap-8">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-2xl font-light tracking-wide text-[#888888] hover:text-white transition-colors duration-500"
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}