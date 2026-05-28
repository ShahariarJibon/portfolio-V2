"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Edit3, Trash2, ArrowLeft, Eye, EyeOff, GripVertical } from "lucide-react";

export default function AdminWorks() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin"); return; }
    setAuthenticated(true);
    fetchWorks(token);
  }, []);

  const fetchWorks = async (token) => {
    try {
      const res = await fetch("/api/admin/works", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { localStorage.removeItem("admin_token"); router.push("/admin"); return; }
      const data = await res.json();
      setWorks(data.works || []);
    } catch {} finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this work?")) return;
    const token = localStorage.getItem("admin_token");
    const res = await fetch(`/api/admin/works/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setWorks((p) => p.filter((w) => w.id !== id));
  };

  const togglePublish = async (work) => {
    const token = localStorage.getItem("admin_token");
    await fetch(`/api/admin/works/${work.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ published: !work.published }),
    });
    fetchWorks(token);
  };

  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-[#555555] text-xs tracking-[0.15em] uppercase hover:text-white transition-colors mb-4">
              <ArrowLeft size={14} /> Dashboard
            </Link>
            <h1 className="text-2xl font-[family-name:var(--font-heading)] text-white">Works</h1>
            <p className="text-[#888888] text-sm mt-1">{works.length} item{works.length !== 1 ? "s" : ""}</p>
          </div>
          <Link href="/admin/works/new" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-white text-xs tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-all">
            <Plus size={14} /> Add Work
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />)}</div>
        ) : works.length === 0 ? (
          <div className="text-center py-24"><p className="text-[#555555] text-sm">No works yet</p></div>
        ) : (
          <div className="space-y-3">
            {works.map((work) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 flex items-center gap-4 hover:border-white/[0.1] transition-colors"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-black shrink-0 border border-white/[0.06]">
                  {work.image_url ? (
                    <img src={work.image_url} alt={work.title} className="w-full h-full object-cover" />
                  ) : work.image_data ? (
                    <img src={work.image_data} alt={work.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 font-bold text-lg">
                      {work.title?.charAt(0)?.toUpperCase() || "W"}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-white font-medium truncate">{work.title}</h3>
                    <span className="text-[10px] text-[#555555]">#{work.sort_order}</span>
                    {!work.published && (
                      <span className="text-[10px] px-2 py-0.5 rounded border border-yellow-500/30 text-yellow-500">Hidden</span>
                    )}
                  </div>
                  {work.description && <p className="text-xs text-[#555555] truncate mt-0.5">{work.description}</p>}
                  <p className="text-xs text-[#555555]">
                    {(work.tag_lines || []).join(" · ") || "No tags"}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => togglePublish(work)} className="p-2 rounded-xl text-[#555555] hover:text-white hover:bg-white/[0.04] transition-all">
                    {work.published ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <Link href={`/admin/works/${work.id}/edit`} className="p-2 rounded-xl text-[#555555] hover:text-white hover:bg-white/[0.04] transition-all">
                    <Edit3 size={16} />
                  </Link>
                  <button onClick={() => handleDelete(work.id)} className="p-2 rounded-xl text-[#555555] hover:text-red-400 hover:bg-white/[0.04] transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
