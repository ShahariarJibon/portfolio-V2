"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit3, Trash2, Eye, EyeOff } from "lucide-react";

export default function BlogsTab({ token }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/admin/blogs", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setBlogs(d.blogs || []); }
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this blog?")) return;
    await fetch(`/api/admin/blogs/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setBlogs((p) => p.filter((b) => b.id !== id));
  };

  const togglePublish = async (blog) => {
    await fetch(`/api/admin/blogs/${blog.id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ published: !blog.published }) });
    fetchBlogs();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-[family-name:var(--font-heading)] text-white">Blogs</h2><p className="text-[#888888] text-sm mt-1">{blogs.length} post{blogs.length !== 1 ? "s" : ""}</p></div>
        <a href="/admin/blogs/new" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-white text-xs tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-all"><Plus size={14} /> New Post</a>
      </div>
      {loading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />)}</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-16"><p className="text-[#555555] text-sm">No blog posts yet</p></div>
      ) : (
        <div className="space-y-3">
          {blogs.map((blog) => (
            <motion.div key={blog.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 flex items-center justify-between hover:border-white/[0.1] transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-medium truncate">{blog.title}</h3>
                  {!blog.published && <span className="text-[10px] px-2 py-0.5 rounded border border-yellow-500/30 text-yellow-500">Draft</span>}
                </div>
                <p className="text-xs text-[#555555]">{(blog.tag_lines || []).join(" · ") || "No tags"} &middot; {new Date(blog.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <button onClick={() => togglePublish(blog)} className="p-2 rounded-xl text-[#555555] hover:text-white hover:bg-white/[0.04] transition-all">{blog.published ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                <a href={`/admin/blogs/${blog.id}/edit`} className="p-2 rounded-xl text-[#555555] hover:text-white hover:bg-white/[0.04] transition-all"><Edit3 size={16} /></a>
                <button onClick={() => handleDelete(blog.id)} className="p-2 rounded-xl text-[#555555] hover:text-red-400 hover:bg-white/[0.04] transition-all"><Trash2 size={16} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
