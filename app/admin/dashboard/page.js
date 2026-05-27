"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Mail, Globe, Monitor, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin");
      return;
    }
    setAuthenticated(true);
    fetchMessages(token);
  }, []);

  const fetchMessages = async (token) => {
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
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin");
  };

  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-2xl font-[family-name:var(--font-heading)] text-white">
              Messages
            </h1>
            <p className="text-[#888888] text-sm mt-1">
              {messages.length} message{messages.length !== 1 ? "s" : ""} received
            </p>
          </div>
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-[#888888] text-xs tracking-[0.15em] uppercase hover:border-white/30 hover:text-white transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <LogOut size={14} />
            Logout
          </motion.button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse"
              />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-24">
            <Mail className="mx-auto text-[#333333] mb-4" size={48} />
            <p className="text-[#555555] text-sm">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-white/[0.1] transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium">{msg.name}</h3>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-[#ef745c] text-sm hover:underline"
                    >
                      {msg.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-1 text-[#555555] text-xs">
                    <Clock size={12} />
                    {new Date(msg.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <p className="text-[#aaaaaa] text-sm leading-relaxed mb-4">
                  {msg.message}
                </p>

                <div className="flex items-center gap-4 text-[#444444] text-[11px]">
                  <span className="flex items-center gap-1">
                    <Globe size={11} />
                    {msg.ip}
                  </span>
                  <span className="flex items-center gap-1">
                    <Monitor size={11} />
                    {msg.user_agent?.slice(0, 50)}...
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
