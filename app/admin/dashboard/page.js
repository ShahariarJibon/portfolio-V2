"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Mail, Globe, Monitor, Clock, FileText, Briefcase, Code2, BarChart3, Award, Activity, Trash2 } from "lucide-react";
import Link from "next/link";

const SEEN_KEY = "admin_seen_ids";

function getSeenIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveSeenIds(ids) {
  localStorage.setItem(SEEN_KEY, JSON.stringify([...ids]));
}

export default function AdminDashboard() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [seenIds, setSeenIds] = useState(new Set());
  const router = useRouter();
  const tokenRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin"); return; }
    tokenRef.current = token;
    setAuthenticated(true);
    setSeenIds(getSeenIds());
    fetchMessages();

    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = useCallback(async () => {
    const token = tokenRef.current;
    if (!token) return;
    try {
      const res = await fetch("/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        router.push("/admin");
        return;
      }
      const data = await res.json();
      setMessages(data.messages || []);
    } catch {
      console.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this message?")) return;
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${tokenRef.current}` },
      });
      if (res.ok) setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch {
      console.error("Failed to delete message");
    }
  };

  const markAsSeen = (id) => {
    const updated = new Set(seenIds);
    updated.add(id);
    setSeenIds(updated);
    saveSeenIds(updated);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin");
  };

  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <h1 className="text-2xl font-[family-name:var(--font-heading)] text-white mb-10">ADMIN DASHBOARD</h1>

        <div className="flex flex-wrap items-center justify-between gap-2 mb-10">
          <Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-[#888888] text-xs tracking-[0.15em] uppercase hover:border-white/30 hover:text-white transition-all">
            <Mail size={14} /> Messages
          </Link>
          <Link href="/admin/skills" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-[#888888] text-xs tracking-[0.15em] uppercase hover:border-white/30 hover:text-white transition-all">
            <Code2 size={14} /> Skills
          </Link>
          <Link href="/admin/achievements" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-[#888888] text-xs tracking-[0.15em] uppercase hover:border-white/30 hover:text-white transition-all">
            <Award size={14} /> Achievements
          </Link>
          <Link href="/admin/activity" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-[#888888] text-xs tracking-[0.15em] uppercase hover:border-white/30 hover:text-white transition-all">
            <Activity size={14} /> Activity
          </Link>
          <Link href="/admin/works" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-[#888888] text-xs tracking-[0.15em] uppercase hover:border-white/30 hover:text-white transition-all">
            <Briefcase size={14} /> Works
          </Link>
          <Link href="/admin/blogs" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-[#888888] text-xs tracking-[0.15em] uppercase hover:border-white/30 hover:text-white transition-all">
            <FileText size={14} /> Blogs
          </Link>
          <Link href="/admin/overview" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-[#888888] text-xs tracking-[0.15em] uppercase hover:border-white/30 hover:text-white transition-all">
            <BarChart3 size={14} /> Overview
          </Link>
          <motion.button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-[#888888] text-xs tracking-[0.15em] uppercase hover:border-white/30 hover:text-white transition-all" whileHover={{ scale: 1.02 }}>
            <LogOut size={14} /> Logout
          </motion.button>
        </div>

        <p className="text-[#888888] text-sm mb-8">
          Total messages received: {messages.length}
        </p>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />)}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-24">
            <Mail className="mx-auto text-[#333333] mb-4" size={48} />
            <p className="text-[#555555] text-sm">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => {
              const isNew = !seenIds.has(msg.id);
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => markAsSeen(msg.id)}
                  className={`rounded-2xl border p-6 transition-colors relative cursor-pointer ${
                    isNew
                      ? "border-[#ef745c]/30 bg-white/[0.03]"
                      : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]"
                  }`}
                >
                  {isNew && (
                    <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#ef745c]" />
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-medium">{msg.name}</h3>
                      <a href={`mailto:${msg.email}`} className="text-[#ef745c] text-sm hover:underline">{msg.email}</a>
                    </div>
                    <div className="flex items-center gap-1 text-[#555555] text-xs">
                      <Clock size={12} />
                      {new Date(msg.created_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <p className="text-[#aaaaaa] text-sm leading-relaxed mb-4">{msg.message}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[#444444] text-[11px]">
                      <span className="flex items-center gap-1"><Globe size={11} /> {msg.ip}</span>
                      <span className="flex items-center gap-1"><Monitor size={11} /> {msg.user_agent?.slice(0, 50)}...</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                      className="text-[#444444] hover:text-red-400 transition-colors p-1"
                      title="Delete message"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
