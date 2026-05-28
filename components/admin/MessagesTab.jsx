"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Globe, Monitor, Clock } from "lucide-react";

const SEEN_KEY = "admin_seen_ids";

function getSeenIds() {
  try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || "[]")); }
  catch { return new Set(); }
}
function saveSeenIds(ids) {
  localStorage.setItem(SEEN_KEY, JSON.stringify([...ids]));
}

export default function MessagesTab({ token }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seenIds, setSeenIds] = useState(new Set());
  const intervalRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/messages", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setMessages(d.messages || []); }
    } catch {} finally { setLoading(false); }
  }, [token]);

  useEffect(() => { setSeenIds(getSeenIds()); fetchMessages(); intervalRef.current = setInterval(fetchMessages, 10000); return () => clearInterval(intervalRef.current); }, []);

  const markAsSeen = (id) => {
    const updated = new Set(seenIds); updated.add(id);
    setSeenIds(updated); saveSeenIds(updated);
  };

  return (
    <div>
      <p className="text-[#888888] text-sm mb-6">Total messages received: {messages.length}</p>
      {loading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />)}</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-24"><Mail className="mx-auto text-[#333333] mb-4" size={48} /><p className="text-[#555555] text-sm">No messages yet</p></div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg, i) => {
            const isNew = !seenIds.has(msg.id);
            return (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} onClick={() => markAsSeen(msg.id)}
                className={`rounded-2xl border p-6 transition-colors relative cursor-pointer ${isNew ? "border-[#ef745c]/30 bg-white/[0.03]" : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]"}`}>
                {isNew && <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#ef745c]" />}
                <div className="flex items-start justify-between mb-3">
                  <div><h3 className="text-white font-medium">{msg.name}</h3><a href={`mailto:${msg.email}`} className="text-[#ef745c] text-sm hover:underline">{msg.email}</a></div>
                  <div className="flex items-center gap-1 text-[#555555] text-xs"><Clock size={12} />{new Date(msg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                </div>
                <p className="text-[#aaaaaa] text-sm leading-relaxed mb-4">{msg.message}</p>
                <div className="flex items-center gap-4 text-[#444444] text-[11px]">
                  <span className="flex items-center gap-1"><Globe size={11} /> {msg.ip}</span>
                  <span className="flex items-center gap-1"><Monitor size={11} /> {msg.user_agent?.slice(0, 50)}...</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
