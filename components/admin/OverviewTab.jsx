"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserCheck, UserX, Clock } from "lucide-react";

export default function OverviewTab({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setUsers(d.users || []); }
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleBlock = async (user) => {
    await fetch(`/api/admin/users/${user.id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ is_blocked: !user.is_blocked }) });
    fetchUsers();
  };

  const total = users.length;
  const blocked = users.filter((u) => u.is_blocked).length;
  const active = total - blocked;

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center"><p className="text-3xl font-bold text-white">{total}</p><p className="text-xs text-[#555555] mt-1 uppercase tracking-wider">Total Users</p></div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center"><p className="text-3xl font-bold text-green-400">{active}</p><p className="text-xs text-[#555555] mt-1 uppercase tracking-wider">Active</p></div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center"><p className="text-3xl font-bold text-red-400">{blocked}</p><p className="text-xs text-[#555555] mt-1 uppercase tracking-wider">Blocked</p></div>
      </div>

      {loading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />)}</div>
      ) : users.length === 0 ? (
        <div className="text-center py-16"><p className="text-[#555555] text-sm">No users yet</p></div>
      ) : (
        <div className="space-y-2">
          {users.map((user, i) => (
            <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-center gap-4 hover:border-white/[0.1] transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${user.is_blocked ? "bg-red-400/10 text-red-400" : "bg-green-400/10 text-green-400"}`}>{user.email?.charAt(0)?.toUpperCase() || "?"}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-white text-sm font-medium truncate">{user.email}</span>
                  {user.is_blocked && <span className="text-[10px] px-2 py-0.5 rounded border border-red-500/30 text-red-400">Blocked</span>}
                </div>
                <div className="flex items-center gap-3 text-[10px] text-[#555555]"><span className="flex items-center gap-1"><Clock size={10} />{new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span></div>
              </div>
              <button onClick={() => toggleBlock(user)} disabled={user.email === "shahariarjibon5@gmail.com"}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs tracking-[0.15em] uppercase transition-all ${user.is_blocked ? "border border-green-500/30 text-green-400 hover:bg-green-500/10" : "border border-red-500/30 text-red-400 hover:bg-red-500/10"} disabled:opacity-30 disabled:cursor-not-allowed`}>
                {user.is_blocked ? <UserCheck size={12} /> : <UserX size={12} />}{user.is_blocked ? "Unblock" : "Block"}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
