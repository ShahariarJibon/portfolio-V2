"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Clock, Mail } from "lucide-react";

const LS_KEY = "admin_last_seen_id";

function getLastSeenId() {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(LS_KEY) || "0", 10);
}

function setLastSeenId(id) {
  localStorage.setItem(LS_KEY, String(id));
}

export default function NotificationBell() {
  const [messages, setMessages] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const prevLatestRef = useRef(0);
  const dropdownRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    try {
      const res = await fetch("/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const msgs = data.messages || [];

      const lastSeen = getLastSeenId();
      const latestId = msgs.length > 0 ? msgs[0].id : 0;
      const newUnread = msgs.filter((m) => m.id > lastSeen).length;
      setUnread(newUnread);
      setMessages(msgs);

      if (prevLatestRef.current > 0 && latestId > prevLatestRef.current) {
        const newMsgs = msgs.filter(
          (m) => m.id > prevLatestRef.current
        );
        newMsgs.forEach((msg) => {
          const toastId = Date.now() + Math.random();
          setToasts((prev) => [...prev, { id: toastId, ...msg }]);
          setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== toastId));
          }, 5000);
        });
      }
      prevLatestRef.current = latestId;
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMarkRead = () => {
    const latestId =
      messages.length > 0 ? messages[0].id : getLastSeenId();
    setLastSeenId(latestId);
    setUnread(0);
    setOpen(false);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="relative p-2.5 rounded-xl border border-white/10 text-[#888888] hover:text-white hover:border-white/30 transition-all"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ef745c] text-white text-[10px] flex items-center justify-center font-medium">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-h-96 overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#0a0a0a] shadow-2xl z-50"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <span className="text-sm text-white font-medium">
                  Notifications
                </span>
                {unread > 0 && (
                  <button
                    onClick={handleMarkRead}
                    className="text-[10px] tracking-[0.1em] uppercase text-[#ef745c] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {messages.length === 0 ? (
                <div className="px-4 py-10 text-center text-[#555555] text-sm">
                  <Mail className="mx-auto mb-2" size={24} />
                  No messages yet
                </div>
              ) : (
                messages.slice(0, 20).map((msg) => {
                  const isUnread = msg.id > getLastSeenId();
                  return (
                    <div
                      key={msg.id}
                      className={`px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer ${
                        isUnread ? "bg-white/[0.03]" : ""
                      }`}
                      onClick={() => {
                        if (isUnread) {
                          const lastSeen = getLastSeenId();
                          if (msg.id > lastSeen) {
                            const newLastSeen = Math.max(lastSeen, msg.id);
                            const allRead =
                              messages.every(
                                (m) => m.id <= newLastSeen
                              );
                            setLastSeenId(newLastSeen);
                            if (allRead) {
                              setUnread(0);
                            } else {
                              setUnread(
                                messages.filter(
                                  (m) => m.id > newLastSeen
                                ).length
                              );
                            }
                          }
                        }
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm text-white truncate">
                            {msg.name}
                          </p>
                          <p className="text-xs text-[#888888] truncate mt-0.5">
                            {msg.message}
                          </p>
                        </div>
                        <span className="text-[10px] text-[#555555] whitespace-nowrap">
                          {new Date(msg.created_at).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-72 rounded-2xl border border-white/[0.08] bg-[#0a0a0a] shadow-2xl p-4 cursor-pointer"
              onClick={() => dismissToast(toast.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-[#ef745c] font-medium uppercase tracking-wider">
                    New Message
                  </p>
                  <p className="text-sm text-white font-medium mt-1 truncate">
                    {toast.name}
                  </p>
                  <p className="text-xs text-[#888888] mt-0.5 line-clamp-2">
                    {toast.message}
                  </p>
                </div>
                <button className="text-[#555555] hover:text-white shrink-0">
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
