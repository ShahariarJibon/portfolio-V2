"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Heart, MessageCircle, Send, X, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import Background3D from "@/components/Background3D";

function CommentSection({ blog, onClose }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("user_token") : null;

  useEffect(() => {
    fetch(`/api/blogs/${blog.slug}/comments`)
      .then((r) => r.json())
      .then((data) => setComments(data.comments || []))
      .catch(() => {});
  }, [blog.slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { setShowAuth(true); return; }
    if (!newComment.trim()) return;
    const res = await fetch(`/api/blogs/${blog.slug}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content: newComment }),
    });
    if (res.ok) {
      const data = await res.json();
      setComments((p) => [...p, data.comment]);
      setNewComment("");
    }
  };

  return (
    <div className="border-t border-white/[0.06] mt-4 pt-4 px-6 pb-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-[#888888] uppercase tracking-wider">
          Comments ({comments.length})
        </span>
        <button onClick={onClose} className="text-[#555555] hover:text-white transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-[#555555] text-xs">No comments yet. Be the first!</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0">
                <span className="text-xs text-[#555555] font-medium">
                  {c.user?.email?.charAt(0)?.toUpperCase() || "?"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="rounded-xl bg-white/[0.03] px-3 py-2.5">
                  <p className="text-xs text-[#ef745c] font-medium">{c.user?.email?.split("@")[0]}</p>
                  <p className="text-sm text-[#aaaaaa] mt-0.5">{c.content}</p>
                </div>
                <p className="text-[10px] text-[#555555] mt-1 px-1">
                  {new Date(c.created_at).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? "Write a comment..." : "Sign in to comment"}
          className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-xs placeholder:text-[#555555] focus:border-[#ef745c]/50 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          className="px-3 py-2 rounded-lg border border-white/10 text-[#888888] hover:text-white hover:border-white/30 transition-all"
        >
          <Send size={14} />
        </button>
      </form>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}

function BlogCard({ blog, index }) {
  const images = blog.cover_images || [];
  const { user } = useAuth();
  const [reacted, setReacted] = useState(false);
  const [reactionCount, setReactionCount] = useState(blog.reaction_count || 0);
  const [commentCount, setCommentCount] = useState(blog.comment_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("user_token") : null;

  useEffect(() => {
    if (user && token) {
      fetch(`/api/blogs/${blog.slug}/react`)
        .then((r) => r.json())
        .then((data) => {
          const found = (data.reactors || []).some((r) => r.email === user.email);
          setReacted(found);
        })
        .catch(() => {});
    }
  }, [user, blog.slug]);

  const toggleReaction = async (e) => {
    e.stopPropagation();
    if (!user) { setShowAuth(true); return; }
    const res = await fetch(`/api/blogs/${blog.slug}/react`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setReacted(data.reacted);
      setReactionCount((c) => (data.reacted ? c + 1 : c - 1));
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        className="rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.08)] transition-all duration-500"
      >
        <Link href={`/blog/${blog.slug}`}>
          <div className="h-48 md:h-56 relative overflow-hidden bg-black">
            {images.length > 0 ? (
              <img src={images[0]} alt={blog.title} className="w-full h-full object-cover transition-all duration-700 hover:scale-105" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-7xl font-[family-name:var(--font-heading)] text-white/10 font-bold">
                  {blog.title?.charAt(0)?.toUpperCase() || "B"}
                </span>
              </div>
            )}
          </div>
        </Link>

        <div className="px-6 pt-5">
          <Link href={`/blog/${blog.slug}`}>
            {(blog.tag_lines || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {blog.tag_lines.slice(0, 3).map((tag, i) => (
                  <span key={i} className="px-2.5 py-0.5 border border-white/[0.06] text-[10px] text-[#888888] tracking-wider uppercase">{tag}</span>
                ))}
              </div>
            )}
            <h3 className="text-xl md:text-2xl font-[family-name:var(--font-heading)] text-white hover:text-[#cccccc] transition-colors">{blog.title}</h3>
            <p className="text-[#666666] text-sm mt-3 leading-relaxed line-clamp-3">
              {blog.content?.replace(/<[^>]*>/g, "").slice(0, 250)}
              {(blog.content?.length || 0) > 250 ? "..." : ""}
            </p>
          </Link>
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-1 px-6 py-3 mt-3 border-t border-white/[0.06]">
          <button
            onClick={toggleReaction}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
              reacted
                ? "text-[#ef745c] bg-[#ef745c]/5"
                : "text-[#555555] hover:text-[#888888] hover:bg-white/[0.03]"
            }`}
          >
            <Heart size={14} fill={reacted ? "#ef745c" : "none"} />
            <span>{reactionCount}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
              showComments
                ? "text-white bg-white/[0.04]"
                : "text-[#555555] hover:text-[#888888] hover:bg-white/[0.03]"
            }`}
          >
            <MessageCircle size={14} />
            <span>{commentCount}</span>
          </button>

          <div className="flex-1" />

          <Link
            href={`/blog/${blog.slug}`}
            className="text-[10px] tracking-[0.15em] uppercase text-[#555555] hover:text-white transition-colors"
          >
            Read More
          </Link>
        </div>

        {/* Inline comment panel */}
        <AnimatePresence initial={false}>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <CommentSection blog={blog} onClose={() => setShowComments(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
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
    <main className="min-h-screen bg-black relative">
      <Background3D variant="particles" />
      <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-[#555555] text-xs tracking-[0.15em] uppercase hover:text-white transition-colors mb-8">
            <ArrowLeft size={14} /> Back to Portfolio
          </Link>
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] text-white">Blog</h1>
          <p className="text-[#888888] text-sm mt-2">Thoughts, notes, and projects</p>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <div key={i} className="h-80 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />)}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-24"><p className="text-[#555555] text-sm">No blog posts yet</p></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, i) => <BlogCard key={blog.id} blog={blog} index={i} />)}
          </div>
        )}
      </div>
    </main>
  );
}
