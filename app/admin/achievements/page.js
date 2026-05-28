"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Edit3, Trash2, ArrowLeft, Save, X, Award } from "lucide-react";

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [editing, setEditing] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin"); return; }
    setAuthenticated(true);
    fetchAchievements(token);
  }, []);

  const fetchAchievements = async (token) => {
    try {
      const res = await fetch("/api/admin/achievements", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { localStorage.removeItem("admin_token"); router.push("/admin"); return; }
      const data = await res.json();
      setAchievements(data.achievements || []);
    } catch {} finally { setLoading(false); }
  };

  const token = () => localStorage.getItem("admin_token");

  const saveAchievement = async (vals) => {
    const t = token();
    if (editing.id === "new") {
      await fetch("/api/admin/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
        body: JSON.stringify(vals),
      });
    } else {
      await fetch(`/api/admin/achievements/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
        body: JSON.stringify(vals),
      });
    }
    setEditing(null);
    fetchAchievements(t);
  };

  const deleteAchievement = async (id) => {
    if (!confirm("Delete this achievement?")) return;
    const t = token();
    await fetch(`/api/admin/achievements/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${t}` },
    });
    fetchAchievements(t);
  };

  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-[#555555] text-xs tracking-[0.15em] uppercase hover:text-white transition-colors mb-4">
              <ArrowLeft size={14} /> Dashboard
            </Link>
            <h1 className="text-2xl font-[family-name:var(--font-heading)] text-white">Achievements</h1>
            <p className="text-[#888888] text-sm mt-1">{achievements.length} item{achievements.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => setEditing({ id: "new", values: { title: "", description: "", sort_order: achievements.length } })} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-white text-xs tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-all">
            <Plus size={14} /> Add
          </button>
        </div>

        {editing && editing.id === "new" && (
          <div className="mb-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <AchievementForm values={editing.values} onSave={saveAchievement} onCancel={() => setEditing(null)} />
          </div>
        )}

        {loading ? (
          <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />)}</div>
        ) : achievements.length === 0 ? (
          <div className="text-center py-24"><p className="text-[#555555] text-sm">No achievements yet</p></div>
        ) : (
          <div className="space-y-3">
            {achievements.map((ach) => (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 flex items-center gap-4 hover:border-white/[0.1] transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ef745c]/20 to-[#34073d]/20 flex items-center justify-center shrink-0">
                  <Award className="text-[#ef745c]" size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-white font-medium truncate">{ach.title}</h3>
                    <span className="text-[10px] text-[#555555]">#{ach.sort_order}</span>
                  </div>
                  <p className="text-xs text-[#555555] truncate">{ach.description || "No description"}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setEditing({ id: ach.id, values: { title: ach.title, description: ach.description || "", sort_order: ach.sort_order } })} className="p-2 rounded-xl text-[#555555] hover:text-white hover:bg-white/[0.04] transition-all">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => deleteAchievement(ach.id)} className="p-2 rounded-xl text-[#555555] hover:text-red-400 hover:bg-white/[0.04] transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Edit form overlay */}
        {editing && editing.id !== "new" && (
          <div className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="text-white font-medium mb-4">Edit Achievement</h3>
            <AchievementForm values={editing.values} onSave={saveAchievement} onCancel={() => setEditing(null)} />
          </div>
        )}
      </div>
    </div>
  );
}

function AchievementForm({ values, onSave, onCancel }) {
  const [title, setTitle] = useState(values.title || "");
  const [description, setDescription] = useState(values.description || "");
  const [sortOrder, setSortOrder] = useState(values.sort_order ?? 0);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[10px] text-[#555555] mb-1 uppercase tracking-wider">Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none" placeholder="e.g. Hackathon Winner" />
      </div>
      <div>
        <label className="block text-[10px] text-[#555555] mb-1 uppercase tracking-wider">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none resize-none" placeholder="e.g. First place at TechHacks 2023" />
      </div>
      <div className="flex items-end gap-4">
        <div className="w-24">
          <label className="block text-[10px] text-[#555555] mb-1 uppercase tracking-wider">Sort Order</label>
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => onSave({ title: title.trim(), description: description.trim() || null, sort_order: sortOrder })} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#ef745c] text-white text-xs hover:bg-[#ef745c]/80 transition-all"><Save size={14} /> Save</button>
          <button onClick={onCancel} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-[#555555] text-xs hover:text-white transition-all"><X size={14} /> Cancel</button>
        </div>
      </div>
    </div>
  );
}
