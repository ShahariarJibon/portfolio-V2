import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateUserToken } from "@/lib/userAuth";

export async function GET(request, { params }) {
  try {
    const supabase = getSupabase();
    const { data: blog } = await supabase
      .from("blogs")
      .select("id")
      .eq("slug", params.slug)
      .single();
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    const { data, error } = await supabase
      .from("blog_comments")
      .select("id, content, created_at, user_id, users!inner(email)")
      .eq("blog_id", blog.id)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return NextResponse.json({
      comments:
        data?.map((c) => ({
          id: c.id,
          content: c.content,
          user: { id: c.user_id, email: c.users?.email },
          created_at: c.created_at,
        })) || [],
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const user = validateUserToken(token);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { content } = await request.json();
    if (!content?.trim())
      return NextResponse.json({ error: "Comment is required" }, { status: 400 });

    const supabase = getSupabase();
    const { data: blog } = await supabase
      .from("blogs")
      .select("id")
      .eq("slug", params.slug)
      .single();
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    const { data, error } = await supabase
      .from("blog_comments")
      .insert({ blog_id: blog.id, user_id: user.id, content: content.trim() })
      .select("id, content, created_at, user_id")
      .single();

    if (error) throw error;
    return NextResponse.json({
      comment: { ...data, user: { id: user.id, email: user.email } },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
