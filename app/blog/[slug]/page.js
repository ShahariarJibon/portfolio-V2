"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Heart, MessageCircle, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";

export default function BlogPost() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reactions, setReactions] = useState({ count: 0, reactors: [], reacted: false });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [showReactors, setShowReactors] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("user_token") : null;

  useEffect(() => {
    fetch(`/api/blogs/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.blog) setBlog(data.blog);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch(`/api/blogs/${slug}/react`)
      .then((r) => r.json())
      .then((data) => setReactions((p) => ({ ...p, count: data.count, reactors: data.reactors || [] })))
      .catch(() => {});

    fetch(`/api/blogs/${slug}/comments`)
      .then((r) => r.json())
      .then((data) => setComments(data.comments || []))
      .catch(() => {});
  }, [slug]);

  const handleReact = async () => {
    if (!user) { setShowAuth(true); return; }
    const res = await fetch(`/api/blogs/${slug}/react`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setReactions((p) => ({
        ...p,
        count: data.reacted ? p.count + 1 : p.count - 1,
        reacted: data.reacted,
      }));
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) { setShowAuth(true); return; }
    if (!newComment.trim()) return;
    const res = await fetch(`/api/blogs/${slug}/comments`, {
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

  if (loading) {
    return (
      <main className="min-h-screen bg-black">
        <div className="max-w-3xl mx-auto px-6 py-24">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-3/4 bg-white/[0.04] rounded" />
            <div className="h-4 w-1/2 bg-white/[0.04] rounded" />
            <div className="h-64 bg-white/[0.04] rounded-2xl" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-white/[0.04] rounded" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-[#555555]">Blog not found</p>
      </main>
    );
  }

  const images = blog.cover_images || [];

  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[#555555] text-xs tracking-[0.15em] uppercase hover:text-white transition-colors mb-12"
        >
          <ArrowLeft size={14} />
          All Posts
        </Link>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Cover carousel */}
          {images.length > 0 && (
            <div className="mb-10 rounded-2xl overflow-hidden">
              {images.length === 1 ? (
                <img src={images[0]} alt={blog.title} className="w-full h-64 md:h-80 object-cover" />
              ) : (
                <div className="grid grid-cols-3 gap-1 h-64 md:h-80">
                  {images.slice(0, 3).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt=""
                      className={`w-full h-full object-cover ${i > 0 ? "hidden md:block" : ""}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] text-white mb-4">
            {blog.title}
          </h1>

          {(blog.tag_lines || []).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tag_lines.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 border border-white/[0.06] text-xs text-[#888888]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="prose prose-invert max-w-none text-[#aaaaaa] leading-relaxed whitespace-pre-wrap mb-12">
            {blog.content}
          </div>

          {/* Reactions & Comments */}
          <div className="border-t border-white/[0.06] pt-8">
            <div className="flex items-center gap-6 mb-8">
              <button
                onClick={handleReact}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                  reactions.reacted
                    ? "border-[#ef745c]/50 text-[#ef745c]"
                    : "border-white/[0.06] text-[#888888] hover:border-white/20"
                }`}
              >
                <Heart size={16} fill={reactions.reacted ? "#ef745c" : "none"} />
                <span className="text-sm">{reactions.count}</span>
              </button>
              <div className="flex items-center gap-2 text-[#888888]">
                <MessageCircle size={16} />
                <span className="text-sm">{comments.length}</span>
              </div>
            </div>

            {reactions.reactors.length > 0 && (
              <button
                onClick={() => setShowReactors(!showReactors)}
                className="text-xs text-[#555555] hover:text-[#888888] transition-colors mb-6 block"
              >
                {showReactors ? "Hide" : "View"} reactors ({reactions.reactors.length})
              </button>
            )}

            {showReactors && reactions.reactors.length > 0 && (
              <div className="mb-6 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <p className="text-xs text-[#888888] mb-2">Liked by:</p>
                <div className="flex flex-wrap gap-2">
                  {reactions.reactors.map((r) => (
                    <span key={r.id} className="text-xs text-[#aaaaaa] bg-white/[0.04] px-2 py-1 rounded">
                      {r.email}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div className="space-y-4 mb-8">
              {comments.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#ef745c]">{c.user?.email || "Anonymous"}</span>
                    <span className="text-[10px] text-[#555555]">
                      {new Date(c.created_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-[#aaaaaa]">{c.content}</p>
                </div>
              ))}
            </div>

            {/* Add comment */}
            <form onSubmit={handleComment} className="flex gap-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={user ? "Write a comment..." : "Sign in to comment"}
                className="flex-1 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-[#555555] text-sm focus:border-[#ef745c]/50 focus:outline-none transition-colors"
              />
              <motion.button
                type="submit"
                className="px-5 py-3 rounded-xl border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-500"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send size={16} />
              </motion.button>
            </form>
          </div>
        </motion.article>
      </div>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </main>
  );
}
