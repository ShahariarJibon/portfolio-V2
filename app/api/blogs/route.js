import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabase();
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

    return NextResponse.json({ blogs });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
