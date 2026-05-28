"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Plus, X, Upload } from "lucide-react";

export default function EditWork() {
  const router = useRouter();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageData, setImageData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tagLines, setTagLines] = useState([""]);
  const [demoUrl, setDemoUrl] = useState("");
  const [codeUrl, setCodeUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin"); return; }
    fetch(`/api/admin/works`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        const work = (data.works || []).find((w) => w.id === id);
        if (work) {
          setTitle(work.title);
          setDescription(work.description || "");
          setImageUrl(work.image_url || "");
          setImageData(work.image_data || null);
          setImagePreview(work.image_data || work.image_url || null);
          setTagLines(work.tag_lines?.length ? work.tag_lines : [""]);
          setDemoUrl(work.demo_url || "");
          setCodeUrl(work.code_url || "");
          setSortOrder(work.sort_order ?? 0);
          setPublished(work.published);
        }
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [id]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageData(ev.target.result);
      setImagePreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError("Title is required"); return; }
    setLoading(true); setError("");

    const token = localStorage.getItem("admin_token");
    const res = await fetch(`/api/admin/works/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim() || null,
        image_url: imageUrl || null,
        image_data: imageData || null,
        tag_lines: tagLines.filter(Boolean),
        demo_url: demoUrl || null,
        code_url: codeUrl || null,
        sort_order: sortOrder,
        published,
      }),
    });

    if (res.ok) {
      router.push("/admin/works");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to update");
      setLoading(false);
    }
  };

  const addTag = () => setTagLines([...tagLines, ""]);
  const removeTag = (i) => setTagLines(tagLines.filter((_, idx) => idx !== i));
  const updateTag = (i, val) => {
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
        <Link href="/admin/works" className="inline-flex items-center gap-2 text-[#555555] text-xs tracking-[0.15em] uppercase hover:text-white transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Works
        </Link>

        <h1 className="text-2xl font-[family-name:var(--font-heading)] text-white mb-10">Edit Work</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm text-[#888888] mb-2">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-lg focus:border-[#ef745c]/50 focus:outline-none transition-colors" placeholder="Project title" />
          </div>

          <div>
            <label className="block text-sm text-[#888888] mb-2">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none transition-colors resize-none" placeholder="Brief project description..." />
          </div>

          <div>
            <label className="block text-sm text-[#888888] mb-2">Cover Image</label>
            {imagePreview && (
              <div className="mb-3 rounded-xl overflow-hidden h-48 border border-white/[0.06]">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex gap-3">
              <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="flex-1 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder:text-[#555555] focus:border-[#ef745c]/50 focus:outline-none transition-colors" placeholder="Or paste image URL..." />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-xs text-[#888888] hover:text-white hover:border-white/30 transition-all">
                <Upload size={14} /> Upload
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#888888] mb-2">Tag Lines (optional)</label>
            <div className="space-y-2">
              {tagLines.map((tag, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={tag} onChange={(e) => updateTag(i, e.target.value)} className="flex-1 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder:text-[#555555] focus:border-[#ef745c]/50 focus:outline-none transition-colors" placeholder="e.g. React, API" />
                  {tagLines.length > 1 && <button type="button" onClick={() => removeTag(i)} className="px-3 text-[#555555] hover:text-red-400"><X size={16} /></button>}
                </div>
              ))}
            </div>
            <button type="button" onClick={addTag} className="mt-2 flex items-center gap-1 text-xs text-[#555555] hover:text-white transition-colors"><Plus size={14} /> Add another tag</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#888888] mb-2">Live Demo URL</label>
              <input type="url" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder:text-[#555555] focus:border-[#ef745c]/50 focus:outline-none transition-colors" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm text-[#888888] mb-2">View Code URL</label>
              <input type="url" value={codeUrl} onChange={(e) => setCodeUrl(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder:text-[#555555] focus:border-[#ef745c]/50 focus:outline-none transition-colors" placeholder="https://..." />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-32">
              <label className="block text-sm text-[#888888] mb-2">Sort Order</label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-[#ef745c]/50 focus:outline-none transition-colors" />
            </div>
            <label className="flex items-center gap-3 cursor-pointer mt-6">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="w-4 h-4 accent-[#ef745c]" />
              <span className="text-sm text-[#888888]">Show on portfolio</span>
            </label>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <motion.button type="submit" disabled={loading} className="w-full py-4 rounded-xl border border-white/20 text-white text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500 disabled:opacity-50" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            {loading ? "Saving..." : "Update Work"}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
