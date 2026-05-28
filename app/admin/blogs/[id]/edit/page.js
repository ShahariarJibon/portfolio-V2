"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";

export default function EditBlog() {
  const router = useRouter();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImages, setCoverImages] = useState([""]);
  const [tagLines, setTagLines] = useState([""]);
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin"); return; }

    fetch(`/api/admin/blogs`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const blog = (data.blogs || []).find((b) => b.id === id);
        if (blog) {
          setTitle(blog.title);
          setContent(blog.content);
          setCoverImages(blog.cover_images?.length ? blog.cover_images : [""]);
          setTagLines(blog.tag_lines?.length ? blog.tag_lines : [""]);
          setPublished(blog.published);
        }
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) { setError("Title and content required"); return; }
    setLoading(true);
    setError("");

    const token = localStorage.getItem("admin_token");
    const res = await fetch(`/api/admin/blogs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: title.trim(),
        content: content.trim(),
        cover_images: coverImages.filter(Boolean),
        tag_lines: tagLines.filter(Boolean),
        published,
      }),
    });

    if (res.ok) {
      router.push("/admin/blogs");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to update");
      setLoading(false);
    }
  };

  const addCoverImage = () => setCoverImages([...coverImages, ""]);
  const removeCoverImage = (i) => setCoverImages(coverImages.filter((_, idx) => idx !== i));
  const updateCoverImage = (i, val) => {
    const next = [...coverImages];
    next[i] = val;
    setCoverImages(next);
  };

  const addTagLine = () => setTagLines([...tagLines, ""]);
  const removeTagLine = (i) => setTagLines(tagLines.filter((_, idx) => idx !== i));
  const updateTagLine = (i, val) => {
    const next = [...tagLines];
    next[i] = val;
    setTagLines(next);
  };

  if (fetching) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-pulse text-[#555555]">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/admin/blogs" className="inline-flex items-center gap-2 text-[#555555] text-xs tracking-[0.15em] uppercase hover:text-white transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Blogs
        </Link>

        <h1 className="text-2xl font-[family-name:var(--font-heading)] text-white mb-10">Edit Post</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm text-[#888888] mb-2">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-lg focus:border-[#ef745c]/50 focus:outline-none transition-colors" placeholder="Blog title" />
          </div>

          <div>
            <label className="block text-sm text-[#888888] mb-2">Cover Images (URLs, max 3)</label>
            <div className="space-y-2">
              {coverImages.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <input type="url" value={url} onChange={(e) => updateCoverImage(i, e.target.value)} className="flex-1 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder:text-[#555555] focus:border-[#ef745c]/50 focus:outline-none transition-colors" placeholder="https://example.com/image.jpg" />
                  {coverImages.length > 1 && <button type="button" onClick={() => removeCoverImage(i)} className="px-3 text-[#555555] hover:text-red-400"><X size={16} /></button>}
                </div>
              ))}
            </div>
            {coverImages.length < 3 && <button type="button" onClick={addCoverImage} className="mt-2 flex items-center gap-1 text-xs text-[#555555] hover:text-white transition-colors"><Plus size={14} /> Add image</button>}
          </div>

          <div>
            <label className="block text-sm text-[#888888] mb-2">Tag Lines (optional)</label>
            <div className="space-y-2">
              {tagLines.map((tag, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={tag} onChange={(e) => updateTagLine(i, e.target.value)} className="flex-1 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder:text-[#555555] focus:border-[#ef745c]/50 focus:outline-none transition-colors" placeholder="e.g. React, Tutorial" />
                  {tagLines.length > 1 && <button type="button" onClick={() => removeTagLine(i)} className="px-3 text-[#555555] hover:text-red-400"><X size={16} /></button>}
                </div>
              ))}
            </div>
            <button type="button" onClick={addTagLine} className="mt-2 flex items-center gap-1 text-xs text-[#555555] hover:text-white transition-colors"><Plus size={14} /> Add another tag</button>
          </div>

          <div>
            <label className="block text-sm text-[#888888] mb-2">Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={20} className="w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm leading-relaxed focus:border-[#ef745c]/50 focus:outline-none transition-colors resize-y font-mono" placeholder="Write your blog content here..." />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="w-4 h-4 accent-[#ef745c]" />
            <span className="text-sm text-[#888888]">Published</span>
          </label>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <motion.button type="submit" disabled={loading} className="w-full py-4 rounded-xl border border-white/20 text-white text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500 disabled:opacity-50" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            {loading ? "Saving..." : "Update Post"}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
