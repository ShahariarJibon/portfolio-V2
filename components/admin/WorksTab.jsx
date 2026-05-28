"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit3, Trash2, Eye, EyeOff } from "lucide-react";

export default function WorksTab({ token }) {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorks = async () => {
    try {
      const res = await fetch("/api/admin/works", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setWorks(d.works || []); }
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchWorks(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this work?")) return;
    await fetch(`/api/admin/works/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setWorks((p) => p.filter((w) => w.id !== id));
  };

  const togglePublish = async (work) => {
    await fetch(`/api/admin/works/${work.id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ published: !work.published }) });
    fetchWorks();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-[family-name:var(--font-heading)] text-white">Works</h2><p className="text-[#888888] text-sm mt-1">{works.length} item{works.length !== 1 ? "s" : ""}</p></div>
        <a href="/admin/works/new" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-white text-xs tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-all"><Plus size={14} /> Add Work</a>
      </div>
      {loading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />)}</div>
      ) : works.length === 0 ? (
        <div className="text-center py-16"><p className="text-[#555555] text-sm">No works yet</p></div>
      ) : (
        <div className="space-y-3">
          {works.map((work) => (
            <motion.div key={work.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 flex items-center gap-4 hover:border-white/[0.1] transition-colors">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-black shrink-0 border border-white/[0.06]">
                {work.image_url || work.image_data ? <img src={work.image_data || work.image_url} alt={work.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/20 font-bold text-lg">{work.title?.charAt(0)?.toUpperCase() || "W"}</div>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-medium truncate">{work.title}</h3>
                  <span className="text-[10px] text-[#555555]">#{work.sort_order}</span>
                  {!work.published && <span className="text-[10px] px-2 py-0.5 rounded border border-yellow-500/30 text-yellow-500">Hidden</span>}
                </div>
                {work.description && <p className="text-xs text-[#555555] truncate mt-0.5">{work.description}</p>}
                <p className="text-xs text-[#555555]">{(work.tag_lines || []).join(" · ") || "No tags"}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => togglePublish(work)} className="p-2 rounded-xl text-[#555555] hover:text-white hover:bg-white/[0.04] transition-all">{work.published ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                <a href={`/admin/works/${work.id}/edit`} className="p-2 rounded-xl text-[#555555] hover:text-white hover:bg-white/[0.04] transition-all"><Edit3 size={16} /></a>
                <button onClick={() => handleDelete(work.id)} className="p-2 rounded-xl text-[#555555] hover:text-red-400 hover:bg-white/[0.04] transition-all"><Trash2 size={16} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
