import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateUserToken } from "@/lib/userAuth";

export async function POST(request, { params }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const user = validateUserToken(token);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = getSupabase();
    const { data: blog } = await supabase
      .from("blogs")
      .select("id")
      .eq("slug", params.slug)
      .single();
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    const { data: existing } = await supabase
      .from("blog_reactions")
      .select("id")
      .eq("blog_id", blog.id)
      .eq("user_id", user.id)
      .single();

    if (existing) {
      await supabase.from("blog_reactions").delete().eq("id", existing.id);
      return NextResponse.json({ reacted: false });
    } else {
      await supabase.from("blog_reactions").insert({ blog_id: blog.id, user_id: user.id });
      return NextResponse.json({ reacted: true });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    const supabase = getSupabase();
    const { data: blog } = await supabase
      .from("blogs")
      .select("id")
      .eq("slug", params.slug)
      .single();
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    const { data: users } = await supabase
      .from("blog_reactions")
      .select("user_id, users!inner(email)")
      .eq("blog_id", blog.id);

    const count = users?.length || 0;
    const reactors = users?.map((r) => ({ id: r.user_id, email: r.users?.email })) || [];

    return NextResponse.json({ count, reactors });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
