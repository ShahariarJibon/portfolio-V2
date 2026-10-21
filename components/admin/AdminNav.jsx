"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Code2, Award, Activity, Briefcase, FileText, BarChart3, LogOut } from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin");
  };

  const navItems = [
    { name: "Messages", href: "/admin/dashboard", icon: Mail },
    { name: "Skills", href: "/admin/skills", icon: Code2 },
    { name: "Achievements", href: "/admin/achievements", icon: Award },
    { name: "Activity", href: "/admin/activity", icon: Activity },
    { name: "Works", href: "/admin/works", icon: Briefcase },
    { name: "Blogs", href: "/admin/blogs", icon: FileText },
    { name: "Overview", href: "/admin/overview", icon: BarChart3 },
  ];

  return (
    <div className="-mx-5 mb-10 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs tracking-[0.15em] uppercase transition-all ${
                isActive
                  ? "border-[#ef745c]/50 bg-white/[0.06] text-white"
                  : "border-white/10 text-[#888888] hover:border-white/30 hover:text-white"
              }`}
            >
              <Icon size={14} /> {item.name}
            </Link>
          );
        })}
        <motion.button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-[#888888] text-xs tracking-[0.15em] uppercase hover:border-white/30 hover:text-white transition-all"
          whileHover={{ scale: 1.02 }}
        >
          <LogOut size={14} /> Logout
        </motion.button>
      </div>
    </div>
  );
}
