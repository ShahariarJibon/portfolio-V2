import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const DEFAULT_BLOGS = [
  {
    id: "b-nextjs-react-arch",
    title: "Building Scalable Web Apps with Next.js & React",
    slug: "building-scalable-web-apps-with-nextjs-react",
    content: "Exploring architectural design patterns in modern full-stack web development. From server components to edge middleware, responsive user interfaces, and state management strategies for building high-performance web applications with React and JavaScript.",
    cover_images: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"
    ],
    tag_lines: ["Next.js", "React", "JavaScript", "Architecture"],
    published: true,
    created_at: "2025-01-15T12:00:00.000Z",
    reaction_count: 24,
    comment_count: 3
  },
  {
    id: "b-modern-css-tailwind",
    title: "Modern UI Engineering with Tailwind CSS",
    slug: "modern-ui-engineering-with-tailwind-css",
    content: "A comprehensive breakdown of creating fluid, responsive design systems with Tailwind CSS, custom design tokens, modern micro-interactions, and glassmorphism principles that deliver premium user experiences.",
    cover_images: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80"
    ],
    tag_lines: ["Tailwind CSS", "CSS", "HTML", "UI/UX"],
    published: true,
    created_at: "2025-02-01T14:30:00.000Z",
    reaction_count: 19,
    comment_count: 2
  },
  {
    id: "b-systems-cpp-java",
    title: "Deep Dive: Systems & Algorithms in C, C++, and Java",
    slug: "deep-dive-systems-algorithms-c-cpp-java",
    content: "Understanding low-level memory allocation, pointer mechanics, data structures, and object-oriented architecture across C, C++, and Java to write robust, high-throughput code for complex computational challenges.",
    cover_images: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80"
    ],
    tag_lines: ["C++", "C", "Java", "Algorithms"],
    published: true,
    created_at: "2025-02-18T09:15:00.000Z",
    reaction_count: 31,
    comment_count: 5
  }
];

export async function GET() {
  try {
    const supabase = getSupabase();

    const fetchPromise = (async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      const blogs = data || [];

      if (blogs.length > 0) {
        const ids = blogs.map((b) => b.id);

        const { data: reactions } = await supabase
          .from("blog_reactions")
          .select("blog_id, user_id")
          .in("blog_id", ids);

        const { data: comments } = await supabase
          .from("blog_comments")
          .select("blog_id, id")
          .in("blog_id", ids);

        const reactMap = {};
        (reactions || []).forEach((r) => {
          reactMap[r.blog_id] = (reactMap[r.blog_id] || 0) + 1;
        });

        const commentMap = {};
        (comments || []).forEach((c) => {
          commentMap[c.blog_id] = (commentMap[c.blog_id] || 0) + 1;
        });

        blogs.forEach((b) => {
          b.reaction_count = reactMap[b.id] || 0;
          b.comment_count = commentMap[b.id] || 0;
        });
      }
      return blogs;
    })();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 1500)
    );

    const blogs = await Promise.race([fetchPromise, timeoutPromise]);
    if (blogs && blogs.length > 0) {
      return NextResponse.json({ blogs });
    }
    return NextResponse.json({ blogs: DEFAULT_BLOGS });
  } catch {
    return NextResponse.json({ blogs: DEFAULT_BLOGS });
  }
}
