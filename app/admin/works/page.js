"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Edit3, Trash2, Eye, EyeOff } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminWorks() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin");
      return;
    }
    setAuthenticated(true);
    fetchWorks(token);
  }, []);

  const fetchWorks = async (token) => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/works?t=" + Date.now(), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-store",
        },
        cache: "no-store",
      });
      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        router.push("/admin");
        return;
      }
      const data = await res.json();
      setWorks(Array.isArray(data.works) ? data.works : []);
    } catch {
      setWorks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this work?")) return;
    const token = localStorage.getItem("admin_token");
    setDeletingId(id);

    // Optimistically remove from state immediately
    setWorks((prev) => prev.filter((w) => String(w.id).trim() !== String(id).trim()));

    try {
      // Primary: /api/admin/works/[id]
      const res = await fetch(`/api/admin/works/${encodeURIComponent(id)}?t=${Date.now()}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-store",
        },
      });

      // Fallback: /api/admin/works?id=...
      if (!res.ok) {
        await fetch(`/api/admin/works?id=${encodeURIComponent(id)}&t=${Date.now()}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-store",
          },
        });
      }

      await fetchWorks(token);
    } catch (err) {
      console.error("Delete error:", err);
      await fetchWorks(token);
    } finally {
      setDeletingId(null);
    }
  };

  const togglePublish = async (work) => {
    const token = localStorage.getItem("admin_token");
    try {
      await fetch(`/api/admin/works/${encodeURIComponent(work.id)}?t=${Date.now()}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-store",
        },
        body: JSON.stringify({ published: !work.published }),
      });
      await fetchWorks(token);
    } catch (err) {
      console.error("Toggle publish error:", err);
    }
  };

  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-[family-name:var(--font-heading)] text-white mb-10">ADMIN DASHBOARD</h1>
        <AdminNav />
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-[family-name:var(--font-heading)] text-white">Works Management</h2>
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
                  <button
                    onClick={() => togglePublish(work)}
                    className="p-2 rounded-xl text-[#555555] hover:text-white hover:bg-white/[0.04] transition-all"
                    title={work.published ? "Hide from public site" : "Publish on public site"}
                  >
                    {work.published ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <Link
                    href={`/admin/works/${work.id}/edit`}
                    className="p-2 rounded-xl text-[#555555] hover:text-white hover:bg-white/[0.04] transition-all"
                    title="Edit work"
                  >
                    <Edit3 size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(work.id)}
                    disabled={deletingId === work.id}
                    className="p-2 rounded-xl text-[#555555] hover:text-red-400 hover:bg-white/[0.04] transition-all disabled:opacity-30"
                    title="Delete work"
                  >
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
