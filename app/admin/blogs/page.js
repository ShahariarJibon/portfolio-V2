"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Edit3, Trash2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Background3D from "@/components/Background3D";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin"); return; }
    setAuthenticated(true);
    fetchBlogs(token);
  }, []);

  const fetchBlogs = async (token) => {
    try {
      const res = await fetch("/api/admin/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { localStorage.removeItem("admin_token"); router.push("/admin"); return; }
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch {} finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this blog?")) return;
    const token = localStorage.getItem("admin_token");
    const res = await fetch(`/api/admin/blogs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setBlogs((p) => p.filter((b) => b.id !== id));
  };

  const togglePublish = async (blog) => {
    const token = localStorage.getItem("admin_token");
    await fetch(`/api/admin/blogs/${blog.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ published: !blog.published }),
    });
    fetchBlogs(token);
  };

  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-black relative">
      <Background3D variant="wave" />
      <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-[#555555] text-xs tracking-[0.15em] uppercase hover:text-white transition-colors mb-4">
              <ArrowLeft size={14} /> Messages
            </Link>
            <h1 className="text-2xl font-[family-name:var(--font-heading)] text-white">Blogs</h1>
            <p className="text-[#888888] text-sm mt-1">{blogs.length} post{blogs.length !== 1 ? "s" : ""}</p>
          </div>
          <Link
            href="/admin/blogs/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-white text-xs tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-all"
          >
            <Plus size={14} /> New Post
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />)}</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#555555] text-sm">No blog posts yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {blogs.map((blog) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 flex items-center justify-between hover:border-white/[0.1] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-white font-medium truncate">{blog.title}</h3>
                    {!blog.published && (
                      <span className="text-[10px] px-2 py-0.5 rounded border border-yellow-500/30 text-yellow-500">Draft</span>
                    )}
                  </div>
                  <p className="text-xs text-[#555555]">
                    {(blog.tag_lines || []).join(" · ") || "No tags"} &middot;{" "}
                    {new Date(blog.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <button onClick={() => togglePublish(blog)} className="p-2 rounded-xl text-[#555555] hover:text-white hover:bg-white/[0.04] transition-all">
                    {blog.published ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <Link href={`/admin/blogs/${blog.id}/edit`} className="p-2 rounded-xl text-[#555555] hover:text-white hover:bg-white/[0.04] transition-all">
                    <Edit3 size={16} />
                  </Link>
                  <button onClick={() => handleDelete(blog.id)} className="p-2 rounded-xl text-[#555555] hover:text-red-400 hover:bg-white/[0.04] transition-all">
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
