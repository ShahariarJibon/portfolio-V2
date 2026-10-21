import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateUserToken } from "@/lib/userAuth";

function maskEmail(email) {
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return "user";
  }
  const [username, domain] = email.split("@");
  if (username.length <= 2) {
    return `${username[0]}***@${domain}`;
  }
  return `${username.slice(0, 2)}***${username.slice(-1)}@${domain}`;
}

export async function POST(request, segmentData) {
  try {
    const { slug } = await segmentData.params;
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const userPayload = validateUserToken(token);
    if (!userPayload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = getSupabase();

    // Verify user is not blocked
    const { data: userRecord } = await supabase
      .from("users")
      .select("id, is_blocked")
      .eq("id", userPayload.id)
      .single();

    if (!userRecord || userRecord.is_blocked) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data: blog } = await supabase
      .from("blogs")
      .select("id")
      .eq("slug", slug)
      .single();
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    const { data: existing } = await supabase
      .from("blog_reactions")
      .select("id")
      .eq("blog_id", blog.id)
      .eq("user_id", userPayload.id)
      .single();

    if (existing) {
      await supabase.from("blog_reactions").delete().eq("id", existing.id);
      return NextResponse.json({ reacted: false });
    } else {
      await supabase.from("blog_reactions").insert({ blog_id: blog.id, user_id: userPayload.id });
      return NextResponse.json({ reacted: true });
    }
  } catch (error) {
    console.error("Blog reaction POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request, segmentData) {
  try {
    const { slug } = await segmentData.params;
    const supabase = getSupabase();
    const { data: blog } = await supabase
      .from("blogs")
      .select("id")
      .eq("slug", slug)
      .single();
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    const { data: users } = await supabase
      .from("blog_reactions")
      .select("user_id, users!inner(email)")
      .eq("blog_id", blog.id);

    const count = users?.length || 0;
    // Mask emails to prevent harvesting and privacy leaks
    const reactors = users?.map((r) => ({
      id: r.user_id,
      email: maskEmail(r.users?.email),
    })) || [];

    return NextResponse.json({ count, reactors });
  } catch (error) {
    console.error("Blog reaction GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
