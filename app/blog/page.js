"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function BlogCard({ blog, index }) {
  const images = blog.cover_images || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/blog/${blog.slug}`} className="block group">
        <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.08)] transition-all duration-500">
          {/* Cover */}
          <div className="h-48 md:h-56 relative overflow-hidden bg-black">
            {images.length > 0 ? (
              <img
                src={images[0]}
                alt={blog.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-7xl font-[family-name:var(--font-heading)] text-white/10 font-bold tracking-tight">
                  {blog.title?.charAt(0)?.toUpperCase() || "B"}
                </span>
              </div>
            )}
          </div>

          <div className="p-6">
            {/* Tag lines */}
            {(blog.tag_lines || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {blog.tag_lines.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 border border-white/[0.06] text-[10px] text-[#888888] tracking-wider uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h3 className="text-xl md:text-2xl font-[family-name:var(--font-heading)] text-white group-hover:text-[#cccccc] transition-colors">
              {blog.title}
            </h3>

            <p className="text-[#666666] text-sm mt-3 leading-relaxed line-clamp-3">
              {blog.content?.replace(/<[^>]*>/g, "").slice(0, 200)}
              {(blog.content?.length || 0) > 200 ? "..." : ""}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((data) => setBlogs(data.blogs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#555555] text-xs tracking-[0.15em] uppercase hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Back to Portfolio
          </Link>
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] text-white">
            Blog
          </h1>
          <p className="text-[#888888] text-sm mt-2">Thoughts, notes, and projects</p>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse"
              />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#555555] text-sm">No blog posts yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, i) => (
              <BlogCard key={blog.id} blog={blog} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
