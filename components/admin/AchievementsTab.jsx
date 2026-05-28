"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit3, Trash2, Save, X, Award } from "lucide-react";

export default function AchievementsTab({ token }) {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const fetchAchievements = async () => {
    try {
      const res = await fetch("/api/admin/achievements", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setAchievements(d.achievements || []); }
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchAchievements(); }, []);

  const saveAchievement = async (vals) => {
    if (editing.id === "new") await fetch("/api/admin/achievements", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(vals) });
    else await fetch(`/api/admin/achievements/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(vals) });
    setEditing(null); fetchAchievements();
  };

  const deleteAchievement = async (id) => {
    if (!confirm("Delete this achievement?")) return;
    await fetch(`/api/admin/achievements/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchAchievements();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-[family-name:var(--font-heading)] text-white">Achievements</h2><p className="text-[#888888] text-sm mt-1">{achievements.length} item{achievements.length !== 1 ? "s" : ""}</p></div>
        <button onClick={() => setEditing({ id: "new", values: { title: "", description: "", sort_order: achievements.length } })} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-white text-xs tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-all"><Plus size={14} /> Add</button>
      </div>
      {editing && editing.id === "new" && <div className="mb-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"><AchievementForm values={editing.values} onSave={saveAchievement} onCancel={() => setEditing(null)} /></div>}
      {loading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />)}</div>
      ) : achievements.length === 0 ? (
        <div className="text-center py-16"><p className="text-[#555555] text-sm">No achievements yet</p></div>
      ) : (
        <div className="space-y-3">
          {achievements.map((ach) => (
            <motion.div key={ach.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 flex items-center gap-4 hover:border-white/[0.1] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ef745c]/20 to-[#34073d]/20 flex items-center justify-center shrink-0"><Award className="text-[#ef745c]" size={20} /></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5"><h3 className="text-white font-medium truncate">{ach.title}</h3><span className="text-[10px] text-[#555555]">#{ach.sort_order}</span></div>
                <p className="text-xs text-[#555555] truncate">{ach.description || "No description"}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setEditing({ id: ach.id, values: { title: ach.title, description: ach.description || "", sort_order: ach.sort_order } })} className="p-2 rounded-xl text-[#555555] hover:text-white hover:bg-white/[0.04]"><Edit3 size={16} /></button>
                <button onClick={() => deleteAchievement(ach.id)} className="p-2 rounded-xl text-[#555555] hover:text-red-400 hover:bg-white/[0.04]"><Trash2 size={16} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {editing && editing.id !== "new" && (
        <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"><h3 className="text-white font-medium mb-4">Edit Achievement</h3><AchievementForm values={editing.values} onSave={saveAchievement} onCancel={() => setEditing(null)} /></div>
      )}
    </div>
  );
}

function AchievementForm({ values, onSave, onCancel }) {
  const [title, setTitle] = useState(values.title || "");
  const [description, setDescription] = useState(values.description || "");
  const [sortOrder, setSortOrder] = useState(values.sort_order ?? 0);
  return (
    <div className="space-y-4">
      <div><label className="block text-[10px] text-[#555555] mb-1 uppercase">Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none" placeholder="e.g. Hackathon Winner" /></div>
      <div><label className="block text-[10px] text-[#555555] mb-1 uppercase">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none resize-none" placeholder="e.g. First place at TechHacks 2023" /></div>
      <div className="flex items-end gap-4">
        <div className="w-24"><label className="block text-[10px] text-[#555555] mb-1 uppercase">Sort Order</label><input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none" /></div>
        <div className="flex gap-2">
          <button onClick={() => onSave({ title: title.trim(), description: description.trim() || null, sort_order: sortOrder })} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#ef745c] text-white text-xs hover:bg-[#ef745c]/80"><Save size={14} /> Save</button>
          <button onClick={onCancel} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-[#555555] text-xs hover:text-white"><X size={14} /> Cancel</button>
        </div>
      </div>
    </div>
  );
}
